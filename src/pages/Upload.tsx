import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import FileUploadCard from "@/components/upload/FileUploadCard";
import { analyzeCctvData, analyzePosData, generateRecommendations, createVideoAnalysis } from "@/lib/analysis";

const sanitizeFilename = (filename: string): string => {
  const extension = filename.split(".").pop();
  const nameWithoutExt = filename.substring(0, filename.lastIndexOf("."));
  const sanitized = nameWithoutExt
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .substring(0, 50);
  return `${sanitized}.${extension}`;
};

const Upload = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [posFile, setPosFile] = useState<File | null>(null);
  const [cctvFile, setCctvFile] = useState<File | null>(null);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!posFile || !cctvFile || !applicationId) {
      toast.error("모든 파일을 업로드해주세요.");
      return;
    }

    setIsUploading(true);

    try {
      // Upload POS file
      const posSafeFilename = sanitizeFilename(posFile.name);
      const posPath = `${applicationId}/pos_${Date.now()}_${posSafeFilename}`;
      const { error: posError } = await supabase.storage
        .from("cafe-data")
        .upload(posPath, posFile);

      if (posError) throw posError;

      // Upload CCTV file
      const cctvSafeFilename = sanitizeFilename(cctvFile.name);
      const cctvPath = `${applicationId}/cctv_${Date.now()}_${cctvSafeFilename}`;
      const { error: cctvError } = await supabase.storage
        .from("cafe-data")
        .upload(cctvPath, cctvFile);

      if (cctvError) throw cctvError;

      // Save file records
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

      // Analyze data
      toast.info("POS 데이터 분석 중...");
      const posResult = await analyzePosData(posFile);

      toast.info("CCTV 데이터 분석 중...");
      const cctvResult = await analyzeCctvData(cctvFile);

      // Generate recommendations
      const recommendations = generateRecommendations(posResult, cctvResult);
      const videoAnalysis = {
        ...createVideoAnalysis(cctvResult),
        dailyFlows: posResult.dailyFlows,
      };

      // Save analysis results
      const { error: insertError } = await supabase
        .from("analysis_results")
        .insert([{
          application_id: applicationId,
          peak_hour: posResult.peakHour,
          long_stay_rate: cctvResult.longStayRate,
          customer_flow: JSON.parse(JSON.stringify(cctvResult.hourlyFlow)),
          recommendations: JSON.parse(JSON.stringify(recommendations)),
          video_analysis: JSON.parse(JSON.stringify(videoAnalysis)),
        }]);

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
              <FileUploadCard
                id="pos_file"
                title="POS 매출 데이터"
                file={posFile}
                onFileChange={setPosFile}
                accept=".xlsx,.xls,.csv"
                description=".xlsx, .xls, .csv 형식 지원"
                iconColor="text-primary"
                borderHoverColor="hover:border-primary/50"
              />

              <FileUploadCard
                id="cctv_file"
                title="CCTV 분석 데이터"
                file={cctvFile}
                onFileChange={setCctvFile}
                accept=".csv,.xlsx,.xls"
                description=".csv, .xlsx, .xls 형식 지원 (고객ID, 좌석위치, 체류시간 등)"
                iconColor="text-accent"
                borderHoverColor="hover:border-accent/50"
              />

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
