import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  CheckCircle2, 
  ArrowLeft, 
  Download, 
  AlertTriangle, 
  BookOpen, 
  MessageCircle, 
  Smartphone, 
  MapPin, 
  Clock, 
  CreditCard,
  TrendingUp,
  Users,
  Laptop,
  Coffee,
  Building2,
  Lightbulb
} from "lucide-react";

interface Problem {
  id: string;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  metric?: string;
  metricValue?: string;
}

interface SolutionItem {
  id: string;
  problemId: string;
  title: string;
  description: string;
  benchmarkCafe: string;
  benchmarkDescription: string;
  icon: React.ReactNode;
  expectedImpact: string;
}

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">분석 결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const videoAnalysis = analysisData.video_analysis || {};
  const longStayRate = analysisData.long_stay_rate || 0;
  const laptopUsageRate = parseInt(videoAnalysis.laptopUsageRate) || 0;

  // 분석 데이터 기반 문제점 진단
  const problems: Problem[] = [];

  if (longStayRate > 30) {
    problems.push({
      id: "long-stay",
      title: "높은 장시간 체류율",
      description: `2시간 이상 체류 고객이 ${longStayRate}%로, 좌석 회전율이 낮아 신규 고객 유치에 어려움이 있습니다.`,
      severity: longStayRate > 50 ? "high" : "medium",
      metric: "장시간 체류율",
      metricValue: `${longStayRate}%`,
    });
  }

  if (laptopUsageRate > 40) {
    problems.push({
      id: "laptop-usage",
      title: "높은 노트북 사용률",
      description: `노트북 사용 고객이 ${laptopUsageRate}%로, 콘센트 좌석 경쟁이 치열하고 일반 고객 불만이 발생할 수 있습니다.`,
      severity: laptopUsageRate > 60 ? "high" : "medium",
      metric: "노트북 사용률",
      metricValue: `${laptopUsageRate}%`,
    });
  }

  if (analysisData.peak_hour) {
    problems.push({
      id: "peak-concentration",
      title: "특정 시간대 고객 집중",
      description: `${analysisData.peak_hour} 시간대에 고객이 집중되어 대기 시간 증가와 서비스 품질 저하가 우려됩니다.`,
      severity: "medium",
      metric: "피크 시간대",
      metricValue: analysisData.peak_hour,
    });
  }

  // 문제별 솔루션 매핑
  const solutions: SolutionItem[] = [
    {
      id: "zoning",
      problemId: "long-stay",
      title: "스마트 공간 분리 전략",
      description: "Focus Zone(집중 공간)과 Community Zone(소통 공간)으로 공간을 분리하여 목적별 이용을 유도합니다. 파티션과 개별 콘센트가 있는 집중석과 오픈형 소통 테이블을 구분 배치합니다.",
      benchmarkCafe: "할리스커피",
      benchmarkDescription: "할리스는 '스터디존'과 '카페존'을 분리 운영하여 카공족과 일반 고객의 공존을 성공적으로 구현했습니다.",
      icon: <BookOpen className="h-6 w-6" />,
      expectedImpact: "좌석 회전율 25% 향상, 고객 만족도 증가",
    },
    {
      id: "digital-ordering",
      problemId: "peak-concentration",
      title: "테이블 오더 시스템",
      description: "좌석에서 바로 주문 가능한 모바일 오더 시스템을 도입하여 피크 시간대 카운터 혼잡을 해소하고 고객 편의성을 높입니다.",
      benchmarkCafe: "스타벅스",
      benchmarkDescription: "스타벅스의 '사이렌 오더'는 피크 시간대 주문 대기 시간을 60% 단축시키며 전체 주문의 30% 이상을 처리합니다.",
      icon: <Smartphone className="h-6 w-6" />,
      expectedImpact: "주문 대기 시간 50% 감소, 피크 시간 처리량 증가",
    },
    {
      id: "seat-map",
      problemId: "laptop-usage",
      title: "실시간 좌석 현황 시스템",
      description: "콘센트 좌석, 그룹석 등 좌석 유형별 점유 현황을 실시간으로 제공하여 고객이 원하는 좌석을 미리 파악하고 방문할 수 있습니다.",
      benchmarkCafe: "스타벅스 리저브",
      benchmarkDescription: "스타벅스 리저브 매장에서는 앱을 통해 매장 내 좌석 현황을 확인할 수 있어 불필요한 방문을 줄이고 고객 경험을 개선했습니다.",
      icon: <MapPin className="h-6 w-6" />,
      expectedImpact: "콘센트석 분쟁 감소, 고객 이탈률 15% 감소",
    },
    {
      id: "time-pass",
      problemId: "long-stay",
      title: "시간제 이용권 도입",
      description: "4시간 Focus Pass와 같은 시간제 이용권을 판매하여 적정 체류 시간을 유도하고 음료 판매와 연계한 부가 수익을 창출합니다.",
      benchmarkCafe: "스터디카페 (토즈, 작심)",
      benchmarkDescription: "스터디카페들은 시간제 요금제로 좌석 회전율을 극대화하며, 이 모델을 카페에 적용하면 카공족 문제를 수익으로 전환할 수 있습니다.",
      icon: <Clock className="h-6 w-6" />,
      expectedImpact: "신규 수익원 창출, 좌석 회전율 40% 향상",
    },
    {
      id: "subscription",
      problemId: "laptop-usage",
      title: "월간 멤버십 프로그램",
      description: "월 정액제로 무제한 공간 이용과 매일 음료 1잔을 제공하여 충성 고객을 확보하고 안정적인 수익을 보장합니다.",
      benchmarkCafe: "블루보틀, 커피빈",
      benchmarkDescription: "블루보틀의 멤버십 프로그램은 고정 고객층을 확보하고 월간 예측 가능한 수익을 창출하는 데 성공했습니다.",
      icon: <CreditCard className="h-6 w-6" />,
      expectedImpact: "고정 수익 확보, 고객 재방문율 70% 증가",
    },
  ];

  // 문제점과 연관된 솔루션 필터링
  const relevantSolutions = solutions.filter((sol) =>
    problems.some((prob) => prob.id === sol.problemId)
  );

  // 추가 솔루션 (문제와 무관하게 항상 제안)
  const additionalSolutions = solutions.filter(
    (sol) => !relevantSolutions.includes(sol)
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-destructive/10 border-destructive/30 text-destructive";
      case "medium":
        return "bg-warning/10 border-warning/30 text-warning";
      default:
        return "bg-info/10 border-info/30 text-info";
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "high":
        return "심각";
      case "medium":
        return "주의";
      default:
        return "참고";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 text-center relative">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/20 px-4 py-2 rounded-full text-sm mb-6">
            <CheckCircle2 className="h-4 w-4" />
            데이터 기반 분석 완료
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            맞춤형 솔루션 보고서
          </h1>
          <p className="text-xl opacity-90">
            {cafeData.cafe_name}을 위한 스마트 카페 혁신 방안
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* 분석 요약 */}
        <Card className="border-2 shadow-xl mb-8 animate-fade-in">
          <CardHeader className="bg-secondary/50">
            <CardTitle className="text-2xl flex items-center gap-3">
              <TrendingUp className="h-7 w-7 text-primary" />
              분석 결과 요약
            </CardTitle>
            <CardDescription>
              업로드하신 POS 및 CCTV 데이터를 기반으로 분석한 결과입니다
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-card border rounded-xl p-5 text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">피크 시간대</p>
                <p className="text-2xl font-bold text-primary">{analysisData.peak_hour || "N/A"}</p>
              </div>
              <div className="bg-card border rounded-xl p-5 text-center">
                <Users className="h-8 w-8 text-accent mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">장시간 체류율</p>
                <p className="text-2xl font-bold text-accent">{longStayRate}%</p>
              </div>
              <div className="bg-card border rounded-xl p-5 text-center">
                <Laptop className="h-8 w-8 text-info mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">노트북 사용률</p>
                <p className="text-2xl font-bold text-info">{videoAnalysis.laptopUsageRate || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 진단된 문제점 */}
        {problems.length > 0 && (
          <Card className="border-2 shadow-xl mb-8 animate-fade-in">
            <CardHeader className="bg-destructive/5">
              <CardTitle className="text-2xl flex items-center gap-3">
                <AlertTriangle className="h-7 w-7 text-destructive" />
                진단된 문제점
              </CardTitle>
              <CardDescription>
                데이터 분석을 통해 발견된 개선이 필요한 영역입니다
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {problems.map((problem, index) => (
                  <div
                    key={problem.id}
                    className={`border rounded-xl p-5 ${getSeverityColor(problem.severity)}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-xs font-bold px-2 py-1 rounded ${getSeverityColor(problem.severity)}`}>
                            {getSeverityLabel(problem.severity)}
                          </span>
                          <h3 className="text-lg font-semibold text-foreground">{problem.title}</h3>
                        </div>
                        <p className="text-muted-foreground">{problem.description}</p>
                      </div>
                      {problem.metricValue && (
                        <div className="text-right shrink-0">
                          <p className="text-2xl font-bold text-foreground">{problem.metricValue}</p>
                          <p className="text-xs text-muted-foreground">{problem.metric}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 맞춤 솔루션 제안 */}
        <Card className="border-2 shadow-xl mb-8 animate-fade-in">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-2xl flex items-center gap-3">
              <Lightbulb className="h-7 w-7 text-primary" />
              맞춤 솔루션 제안
            </CardTitle>
            <CardDescription>
              진단된 문제점을 해결하기 위한 검증된 솔루션입니다
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {relevantSolutions.map((solution, index) => (
                <div
                  key={solution.id}
                  className="border-2 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary shrink-0">
                        {solution.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2">
                          {index + 1}. {solution.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {solution.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* 벤치마킹 사례 */}
                  <div className="bg-secondary/30 p-5 border-t">
                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-accent mb-1">
                          {solution.benchmarkCafe}에서 이미 적용 중
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {solution.benchmarkDescription}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 예상 효과 */}
                  <div className="bg-success/5 p-4 border-t flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                    <p className="text-sm">
                      <span className="font-semibold text-success">예상 효과:</span>{" "}
                      <span className="text-foreground">{solution.expectedImpact}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 추가 권장 솔루션 */}
        {additionalSolutions.length > 0 && (
          <Card className="border-2 shadow-xl mb-8 animate-fade-in">
            <CardHeader className="bg-accent/5">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Coffee className="h-7 w-7 text-accent" />
                추가 권장 솔루션
              </CardTitle>
              <CardDescription>
                경쟁력 강화를 위해 함께 도입을 권장하는 솔루션입니다
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                {additionalSolutions.slice(0, 4).map((solution) => (
                  <div
                    key={solution.id}
                    className="border rounded-xl p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center text-accent shrink-0">
                        {solution.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{solution.title}</h4>
                        <p className="text-xs text-accent mt-1">
                          📍 {solution.benchmarkCafe} 벤치마킹
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {solution.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* CTA */}
        <Card className="border-2 shadow-xl bg-gradient-to-br from-primary/5 via-secondary to-accent/5 animate-fade-in">
          <CardContent className="py-12 text-center">
            <h3 className="text-2xl font-bold mb-3">솔루션 도입을 원하시나요?</h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              본 솔루션의 구체적인 도입 방법과 비용 견적은 별도 상담을 통해 안내드립니다.
              검증된 벤치마킹 사례를 바탕으로 최적의 방안을 제안해드립니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-12">
                <Download className="mr-2 h-5 w-5" />
                보고서 다운로드
              </Button>
              <Button size="lg" variant="outline" className="h-12" onClick={() => navigate(`/analysis/${applicationId}`)}>
                <ArrowLeft className="mr-2 h-5 w-5" />
                분석 결과로 돌아가기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t bg-secondary/20">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>벤치마킹 사례: 할리스커피, 스타벅스, 블루보틀, 토즈, 작심 스터디카페</p>
        </div>
      </footer>
    </div>
  );
};

export default Solution;
