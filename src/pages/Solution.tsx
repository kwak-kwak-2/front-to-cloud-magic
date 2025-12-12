import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  ArrowLeft, 
  Download, 
  AlertTriangle, 
  TrendingUp,
  Users,
  Laptop,
  Coffee,
  Lightbulb,
  Clock
} from "lucide-react";

import { useSolutionData } from "@/hooks/useSolutionData";
import { diagnoseProblems, filterSolutions } from "@/data/solution-data";
import { BenchmarkGallery } from "@/components/solution/BenchmarkGallery";
import { SolutionCard } from "@/components/solution/SolutionCard";
import { ProblemCard } from "@/components/solution/ProblemCard";
import { AdditionalSolutionCard } from "@/components/solution/AdditionalSolutionCard";

const Solution = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { analysisData, cafeData, loading } = useSolutionData(applicationId);

  if (loading || !analysisData || !cafeData) {
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
  const laptopUsageRate = parseInt(String(videoAnalysis.laptopUsageRate || "0")) || 0;

  // 분석 데이터 기반 문제점 진단
  const problems = diagnoseProblems(longStayRate, laptopUsageRate, analysisData.peak_hour);
  const { relevantSolutions, additionalSolutions } = filterSolutions(problems);

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
                <p className="text-2xl font-bold text-info">{String(videoAnalysis.laptopUsageRate || "N/A")}</p>
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
                {problems.map((problem) => (
                  <ProblemCard key={problem.id} problem={problem} />
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
                <SolutionCard key={solution.id} solution={solution} index={index} />
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
                  <AdditionalSolutionCard key={solution.id} solution={solution} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 벤치마킹 갤러리 */}
        <BenchmarkGallery />

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
          <p>벤치마킹 사례: 할리스, 블루보틀, 스타벅스, 폴바셋, 노티드, 이디야, 컴포즈, 메가커피, 랑스터디카페</p>
        </div>
      </footer>
    </div>
  );
};

export default Solution;
