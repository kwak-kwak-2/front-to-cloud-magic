import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coffee, TrendingUp, Users, Clock, ArrowRight, BarChart3, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 rounded-full p-6">
              <Coffee className="h-20 w-20 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            카공족 문제,
            <br />
            데이터로 해결합니다
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            AI 기반 분석으로 카페 운영을 최적화하고
            <br />
            수익성을 극대화하세요
          </p>
          <Button
            size="lg"
            className="h-16 px-10 text-lg font-semibold"
            onClick={() => navigate("/application")}
          >
            분석 신청하기
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl animate-fade-in">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">실시간 데이터 분석</h3>
              <p className="text-muted-foreground">
                POS 데이터와 CCTV 영상을 분석하여
                고객 행동 패턴을 실시간으로 파악합니다
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-accent/50 transition-all hover:shadow-xl animate-fade-in">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">맞춤형 솔루션</h3>
              <p className="text-muted-foreground">
                카페의 특성에 맞는
                최적화된 운영 전략과 개선 방안을 제시합니다
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-success/50 transition-all hover:shadow-xl animate-fade-in">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="bg-success/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-bold mb-3">안전한 데이터 관리</h3>
              <p className="text-muted-foreground">
                업로드된 모든 데이터는 암호화되어
                안전하게 보호되며 자동 삭제됩니다
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-card border-2 rounded-2xl p-12 mb-20 shadow-xl animate-fade-in">
          <h2 className="text-3xl font-bold text-center mb-12">
            우리의 솔루션이 만든 변화
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold text-primary mb-2">85%</div>
              <p className="text-muted-foreground">좌석 회전율 개선</p>
            </div>
            <div className="text-center">
              <Clock className="h-12 w-12 text-accent mx-auto mb-4" />
              <div className="text-4xl font-bold text-accent mb-2">40%</div>
              <p className="text-muted-foreground">평균 체류시간 감소</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-success mx-auto mb-4" />
              <div className="text-4xl font-bold text-success mb-2">60%</div>
              <p className="text-muted-foreground">매출 증가율</p>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            간단한 4단계 프로세스
          </h2>
          <div className="space-y-6">
            {[
              { step: 1, title: "카페 정보 입력", desc: "기본 정보와 현재 겪고 있는 문제를 알려주세요" },
              { step: 2, title: "데이터 업로드", desc: "POS 매출 데이터와 CCTV 영상을 제공해주세요" },
              { step: 3, title: "AI 분석", desc: "인공지능이 데이터를 분석하고 인사이트를 도출합니다" },
              { step: 4, title: "솔루션 제공", desc: "맞춤형 개선 방안과 기술 솔루션을 제안받으세요" },
            ].map((item) => (
              <Card key={item.step} className="border-l-4 border-l-primary">
                <CardContent className="py-6">
                  <div className="flex items-center gap-6">
                    <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20 animate-fade-in">
          <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-2">
            <CardContent className="py-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                지금 바로 시작하세요
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                무료 분석으로 카페의 잠재력을 발견하세요
              </p>
              <Button
                size="lg"
                className="h-16 px-10 text-lg font-semibold"
                onClick={() => navigate("/application")}
              >
                무료 분석 신청하기
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
