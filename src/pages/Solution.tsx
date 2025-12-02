import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, ArrowLeft, Download } from "lucide-react";

const Solution = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [cafeData, setCafeData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: analysis } = await supabase
        .from("analysis_results")
        .select("*")
        .eq("application_id", applicationId)
        .single();

      const { data: cafe } = await supabase
        .from("cafe_applications")
        .select("*")
        .eq("id", applicationId)
        .single();

      setAnalysisData(analysis);
      setCafeData(cafe);
    };

    fetchData();
  }, [applicationId]);

  if (!analysisData || !cafeData) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="bg-primary/90 text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ✅ 맞춤형 솔루션 보고서
          </h1>
          <p className="text-xl opacity-90">
            {cafeData.cafe_name}을 위한 데이터 기반 경영 개선 방안
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <Card className="border-2 shadow-xl mb-8 animate-fade-in">
          <CardHeader className="bg-success/5">
            <CardTitle className="text-2xl flex items-center gap-3">
              <CheckCircle2 className="h-7 w-7 text-success" />
              현황 분석 요약
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-primary">피크 시간대</h4>
                <p className="text-2xl font-bold">{analysisData.peak_hour}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  이 시간대에 가장 많은 고객이 방문합니다
                </p>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-accent">장시간 체류율</h4>
                <p className="text-2xl font-bold">{analysisData.long_stay_rate}%</p>
                <p className="text-sm text-muted-foreground mt-1">
                  2시간 이상 머무는 고객의 비율
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-xl mb-8 animate-fade-in">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-2xl">핵심 개선 방안</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {analysisData.recommendations?.map((rec: any, index: number) => (
                <div
                  key={index}
                  className="border-l-4 border-primary pl-6 py-3"
                >
                  <h3 className="text-xl font-semibold text-primary mb-2">
                    {index + 1}. {rec.title}
                  </h3>
                  <p className="text-foreground/80 leading-relaxed">
                    {rec.description}
                  </p>
                  {rec.expected_impact && (
                    <div className="mt-3 bg-success/10 border border-success/30 rounded p-3">
                      <p className="text-sm font-medium">
                        <strong>예상 효과:</strong> {rec.expected_impact}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-xl mb-8 animate-fade-in">
          <CardHeader className="bg-accent/5">
            <CardTitle className="text-2xl">기술 솔루션 제안</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-4">
              <li className="flex items-start gap-3 bg-card border rounded-lg p-4">
                <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">AI 기반 고객 행동 분석 시스템</h4>
                  <p className="text-sm text-muted-foreground">
                    실시간 CCTV 분석을 통한 좌석 이용 패턴 모니터링
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 bg-card border rounded-lg p-4">
                <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">스마트 좌석 예약 시스템</h4>
                  <p className="text-sm text-muted-foreground">
                    시간 단위 좌석 예약 및 자동 회전율 관리
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 bg-card border rounded-lg p-4">
                <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">멤버십 & 리워드 프로그램</h4>
                  <p className="text-sm text-muted-foreground">
                    적정 이용 시간 준수 고객 대상 혜택 제공
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-xl bg-warning/5 border-warning/30 animate-fade-in">
          <CardContent className="pt-6 text-center">
            <h3 className="text-2xl font-bold mb-3">다음 단계</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              본 솔루션의 구체적인 도입 방법과 비용 견적은 별도 상담을 통해 안내드립니다.
              지금 바로 전문 컨설턴트와 상담을 예약하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-12">
                <Download className="mr-2 h-5 w-5" />
                보고서 다운로드
              </Button>
              <Button size="lg" variant="outline" className="h-12" onClick={() => navigate("/")}>
                <ArrowLeft className="mr-2 h-5 w-5" />
                처음으로
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Solution;
