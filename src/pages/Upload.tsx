import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload as UploadIcon, FileSpreadsheet, Video, ArrowRight } from "lucide-react";

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
      const posPath = `${applicationId}/pos_${Date.now()}_${posFile.name}`;
      const { error: posError } = await supabase.storage
        .from("cafe-data")
        .upload(posPath, posFile);

      if (posError) throw posError;

      // Upload CCTV file
      const cctvPath = `${applicationId}/cctv_${Date.now()}_${cctvFile.name}`;
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

      // Call edge function to process files
      const { error: functionError } = await supabase.functions.invoke(
        "process-cafe-data",
        {
          body: { applicationId, posPath, cctvPath },
        }
      );

      if (functionError) throw functionError;

      toast.success("파일이 성공적으로 업로드되었습니다!");
      navigate(`/analysis/${applicationId}`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("파일 업로드 중 오류가 발생했습니다.");
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
            정확한 분석을 위해 POS 데이터와 CCTV 영상을 제공해주세요
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
                          .xlsx, .xls 형식 지원
                        </p>
                      </div>
                    </div>
                    <input
                      id="pos_file"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={(e) => setPosFile(e.target.files?.[0] || null)}
                      className="hidden"
                      required
                    />
                  </Label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Video className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">CCTV 영상 데이터</h3>
                </div>
                
                <div className="border-2 border-dashed border-border rounded-lg p-8 hover:border-primary/50 transition-colors">
                  <Label htmlFor="cctv_file" className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <UploadIcon className="h-12 w-12 text-muted-foreground" />
                      <div className="text-center">
                        <p className="font-medium">
                          {cctvFile ? cctvFile.name : "영상 파일을 선택하세요"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          .mp4, .avi 형식 지원
                        </p>
                      </div>
                    </div>
                    <input
                      id="cctv_file"
                      type="file"
                      accept=".mp4,.avi"
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
