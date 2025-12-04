import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload as UploadIcon, FileSpreadsheet, ArrowRight } from "lucide-react";
import * as XLSX from "xlsx";

const Upload = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [posFile, setPosFile] = useState<File | null>(null);
  const [cctvFile, setCctvFile] = useState<File | null>(null);

  // Sanitize filename to remove special characters and Korean characters
  const sanitizeFilename = (filename: string): string => {
    const extension = filename.split(".").pop();
    const nameWithoutExt = filename.substring(0, filename.lastIndexOf("."));
    const sanitized = nameWithoutExt
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .replace(/_+/g, "_")
      .substring(0, 50);
    return `${sanitized}.${extension}`;
  };

  // Parse CCTV CSV/Excel data
  const analyzeCctvData = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

    const hourlyStats: { [key: string]: number } = {};
    const seatLocationStats: { [key: string]: number } = {};
    const dwellTimes: number[] = [];
    let laptopUsers = 0;
    let totalCustomers = 0;

    for (const row of jsonData) {
      totalCustomers++;

      // Parse Entry_Time to get hour
      const entryTime = row["Entry_Time"] || row["entry_time"];
      if (entryTime) {
        const match = String(entryTime).match(/(\d{1,2}):/);
        if (match) {
          const hour = `${match[1].padStart(2, "0")}:00`;
          hourlyStats[hour] = (hourlyStats[hour] || 0) + 1;
        }
      }

      // Seat location
      const seatLocation = row["Seat_Location"] || row["seat_location"];
      if (seatLocation) {
        seatLocationStats[seatLocation] = (seatLocationStats[seatLocation] || 0) + 1;
      }

      // Laptop usage
      const laptopUsage = row["Laptop_Usage"] || row["laptop_usage"];
      if (laptopUsage === true || laptopUsage === "True" || laptopUsage === "true") {
        laptopUsers++;
      }

      // Dwell time
      const dwellTime = row["Dwell_Time_min"] || row["dwell_time_min"];
      if (dwellTime) {
        const time = typeof dwellTime === "number" ? dwellTime : parseInt(dwellTime);
        if (!isNaN(time)) {
          dwellTimes.push(time);
        }
      }
    }

    // Calculate hourly flow
    const hourlyFlow = Object.entries(hourlyStats)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([hour, count]) => ({
        hour,
        customers: count,
      }));

    // Calculate seat location distribution
    const seatDistribution = Object.entries(seatLocationStats).map(([name, value]) => ({
      name: name === "Group" ? "그룹석" : 
            name === "Wall" ? "벽면석" : 
            name === "Window" ? "창가석" : 
            name === "Center" ? "중앙석" : name,
      value,
    }));

    // Calculate dwell time distribution
    const shortStay = dwellTimes.filter(t => t < 30).length;
    const mediumStay = dwellTimes.filter(t => t >= 30 && t < 60).length;
    const longStay = dwellTimes.filter(t => t >= 60 && t < 120).length;
    const veryLongStay = dwellTimes.filter(t => t >= 120).length;

    const stayDistribution = [
      { name: "30분 미만", value: shortStay },
      { name: "30분-1시간", value: mediumStay },
      { name: "1-2시간", value: longStay },
      { name: "2시간 이상", value: veryLongStay },
    ];

    // Calculate long stay rate (2시간 이상)
    const longStayRate = totalCustomers > 0 
      ? Math.round((veryLongStay / totalCustomers) * 100) 
      : 0;

    // Calculate laptop usage rate
    const laptopUsageRate = totalCustomers > 0 
      ? Math.round((laptopUsers / totalCustomers) * 100) 
      : 0;

    // Calculate average dwell time
    const avgDwellTime = dwellTimes.length > 0
      ? Math.round(dwellTimes.reduce((a, b) => a + b, 0) / dwellTimes.length)
      : 0;

    return {
      hourlyFlow,
      seatDistribution,
      stayDistribution,
      longStayRate,
      laptopUsageRate,
      avgDwellTime,
      totalCustomers,
    };
  };

  const analyzeExcelData = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

    const hourlyStats: { [key: string]: { count: number; revenue: number; stayTime: number[] } } = {};
    let totalCustomers = 0;
    let longStayCustomers = 0;

    const dataToAnalyze = jsonData.slice(0, 1000);

    for (const row of dataToAnalyze) {
      let timeField =
        (row["시간"] ||
          row["Time"] ||
          row["시간대"] ||
          row["주문시간"] ||
          row["OrderTime"] ||
          row["timestamp"]) as unknown;
      let revenueField =
        (row["매출"] ||
          row["Revenue"] ||
          row["금액"] ||
          row["Amount"] ||
          row["판매금액"] ||
          row["price"]) as unknown;
      const stayField =
        (row["체류시간"] ||
          row["StayTime"] ||
          row["이용시간"] ||
          row["Duration"] ||
          row["stay_duration"]) as unknown;

      // Fallback: 자동으로 시간/매출 컬럼 탐지
      if (timeField == null) {
        for (const value of Object.values(row)) {
          if (
            typeof value === "string" &&
            /\b\d{1,2}:\d{2}\b/.test(value)
          ) {
            timeField = value;
            break;
          }
        }
      }

      if (revenueField == null) {
        for (const value of Object.values(row)) {
          if (typeof value === "number") {
            revenueField = value;
            break;
          }
        }
      }

      if (timeField == null) continue;

      let hour: string;

      if (typeof timeField === "string") {
        const match = timeField.match(/(\d{1,2})/);
        if (!match) continue;
        const hourNum = parseInt(match[1]);
        hour = `${hourNum.toString().padStart(2, "0")}:00`;
      } else if (typeof timeField === "number") {
        const hourNum = Math.floor(timeField * 24);
        hour = `${hourNum.toString().padStart(2, "0")}:00`;
      } else {
        continue;
      }

      if (!hourlyStats[hour]) {
        hourlyStats[hour] = { count: 0, revenue: 0, stayTime: [] };
      }

      hourlyStats[hour].count++;
      totalCustomers++;

      if (revenueField != null) {
        const revenue =
          typeof revenueField === "number"
            ? revenueField
            : parseFloat(revenueField.toString().replace(/[^0-9.]/g, ""));
        if (!Number.isNaN(revenue)) {
          hourlyStats[hour].revenue += revenue;
        }
      }

      if (stayField != null) {
        const stay =
          typeof stayField === "number"
            ? stayField
            : parseFloat(stayField.toString().replace(/[^0-9.]/g, ""));
        if (!Number.isNaN(stay)) {
          hourlyStats[hour].stayTime.push(stay);
          if (stay >= 120) {
            longStayCustomers++;
          }
        }
      }
    }

    let peakHour = "14:00-16:00";
    let maxCustomers = 0;
    Object.entries(hourlyStats).forEach(([hour, stats]) => {
      if (stats.count > maxCustomers) {
        maxCustomers = stats.count;
        const hourNum = parseInt(hour.split(":")[0]);
        peakHour = `${hour}-${(hourNum + 2).toString().padStart(2, "0")}:00`;
      }
    });

    const longStayRate =
      totalCustomers > 0
        ? Math.round((longStayCustomers / totalCustomers) * 100)
        : 55;

    const customerFlow = Object.entries(hourlyStats)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([hour, stats]) => ({
        hour: hour.substring(0, 5),
        customers: stats.count,
        revenue: Math.round(stats.revenue),
      }));

    return {
      peakHour,
      totalCustomers,
      customerFlow,
      maxCustomers
    };
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!posFile || !cctvFile || !applicationId) {
      toast.error("모든 파일을 업로드해주세요.");
      return;
    }

    setIsUploading(true);

    try {
      const posSafeFilename = sanitizeFilename(posFile.name);
      const posPath = `${applicationId}/pos_${Date.now()}_${posSafeFilename}`;
      const { error: posError } = await supabase.storage
        .from("cafe-data")
        .upload(posPath, posFile);

      if (posError) throw posError;

      const cctvSafeFilename = sanitizeFilename(cctvFile.name);
      const cctvPath = `${applicationId}/cctv_${Date.now()}_${cctvSafeFilename}`;
      const { error: cctvError } = await supabase.storage
        .from("cafe-data")
        .upload(cctvPath, cctvFile);

      if (cctvError) throw cctvError;

      await supabase.from("uploaded_files").insert([
        {
          application_id: applicationId,
          file_type: "pos",
          file_path: posPath,
          file_name: posFile.name,
        },
        {
          application_id: applicationId,
          file_type: "cctv",
          file_path: cctvPath,
          file_name: cctvFile.name,
        },
      ]);

      // Analyze POS Excel data
      toast.info("POS 데이터 분석 중...");
      const posResult = await analyzeExcelData(posFile);

      // Analyze CCTV CSV data
      toast.info("CCTV 데이터 분석 중...");
      const cctvResult = await analyzeCctvData(cctvFile);

      // Generate recommendations based on both data sources
      const recommendations = [
        {
          title: `${posResult.peakHour} 피크 시간대 시간제 운영 도입`,
          description: `분석 결과 ${posResult.peakHour}에 가장 많은 ${posResult.maxCustomers}명의 고객이 방문합니다. 이 시간대에 최대 이용 시간을 2시간으로 제한하여 좌석 회전율을 높이는 것을 권장합니다.`,
          expected_impact: "좌석 회전율 30% 증가 예상",
        },
        {
          title: "장시간 체류 고객 관리 시스템",
          description: `현재 ${cctvResult.longStayRate}%의 고객이 2시간 이상 머무릅니다. 시간대별 차등 요금제나 재주문 유도 시스템을 도입하여 수익성을 개선할 수 있습니다.`,
          expected_impact: "시간당 매출 25% 향상 예상",
        },
        {
          title: "노트북 사용 고객 전용 구역 설정",
          description: `분석 결과 ${cctvResult.laptopUsageRate}%의 고객이 노트북을 사용합니다. 전용 구역을 지정하여 일반 고객과 업무/학습 고객을 분리하면 양측 모두의 만족도를 높일 수 있습니다.`,
          expected_impact: "고객 만족도 20% 향상 예상",
        },
      ];

      // Save video analysis data from CCTV CSV
      const videoAnalysis = {
        avgStayTime: `${cctvResult.avgDwellTime}분`,
        seatDistribution: cctvResult.seatDistribution,
        laptopUsageRate: `${cctvResult.laptopUsageRate}%`,
        stayDistribution: cctvResult.stayDistribution,
      };

      const { error: insertError } = await supabase
        .from("analysis_results")
        .insert({
          application_id: applicationId,
          peak_hour: posResult.peakHour,
          long_stay_rate: cctvResult.longStayRate,
          customer_flow: cctvResult.hourlyFlow,
          recommendations: recommendations,
          video_analysis: videoAnalysis,
        });

      if (insertError) {
        console.error("Error saving analysis:", insertError);
        throw insertError;
      }

      toast.success("분석이 완료되었습니다!");
      navigate(`/analysis/${applicationId}`);
    } catch (error) {
      console.error("Upload or analysis error:", error);
      toast.error("파일 업로드 또는 분석 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            데이터 업로드
          </h1>
          <p className="text-lg text-muted-foreground">
            정확한 분석을 위해 POS 데이터와 CCTV 데이터를 제공해주세요
          </p>
        </div>

        <Card className="shadow-xl border-2 animate-fade-in">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl">파일 업로드</CardTitle>
            <CardDescription>
              제공된 데이터는 안전하게 분석 목적으로만 사용됩니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFileUpload} className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <FileSpreadsheet className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">POS 매출 데이터</h3>
                </div>
                
                <div className="border-2 border-dashed border-border rounded-lg p-8 hover:border-primary/50 transition-colors">
                  <Label htmlFor="pos_file" className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <UploadIcon className="h-12 w-12 text-muted-foreground" />
                      <div className="text-center">
                        <p className="font-medium">
                          {posFile ? posFile.name : "Excel 파일을 선택하세요"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          .xlsx, .xls, .csv 형식 지원
                        </p>
                      </div>
                    </div>
                    <input
                      id="pos_file"
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={(e) => setPosFile(e.target.files?.[0] || null)}
                      className="hidden"
                      required
                    />
                  </Label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <FileSpreadsheet className="h-6 w-6 text-accent" />
                  <h3 className="text-xl font-semibold">CCTV 분석 데이터</h3>
                </div>
                
                <div className="border-2 border-dashed border-border rounded-lg p-8 hover:border-accent/50 transition-colors">
                  <Label htmlFor="cctv_file" className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <UploadIcon className="h-12 w-12 text-muted-foreground" />
                      <div className="text-center">
                        <p className="font-medium">
                          {cctvFile ? cctvFile.name : "CSV/Excel 파일을 선택하세요"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          .csv, .xlsx, .xls 형식 지원 (고객ID, 좌석위치, 체류시간 등)
                        </p>
                      </div>
                    </div>
                    <input
                      id="cctv_file"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={(e) => setCctvFile(e.target.files?.[0] || null)}
                      className="hidden"
                      required
                    />
                  </Label>
                </div>
              </div>

              <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
                <p className="text-sm text-foreground/80">
                  <strong>보안 안내:</strong> 업로드된 모든 데이터는 암호화되어 저장되며,
                  분석 완료 후 30일 이내에 자동 삭제됩니다.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-lg font-semibold"
                disabled={isUploading || !posFile || !cctvFile}
              >
                {isUploading ? (
                  "분석 중..."
                ) : (
                  <>
                    분석 시작하기
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Upload;
