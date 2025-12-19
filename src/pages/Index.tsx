import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Coffee, 
  ArrowRight, 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users,
  Target,
  FileSpreadsheet,
  Video,
  Lightbulb,
  CheckCircle2,
  PieChart
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary to-background" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
              <BarChart3 className="h-4 w-4" />
              데이터 기반 카페 솔루션
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground leading-tight">
              카공족 문제,
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                데이터로 해결합니다
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              POS 데이터와 CCTV 영상 분석으로 
              <br className="hidden md:block" />
              카페의 숨겨진 문제점을 찾고 맞춤형 솔루션을 제안합니다
            </p>
            
            <Button
              size="lg"
              className="h-14 px-8 text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
              onClick={() => navigate("/application")}
            >
              무료 분석 신청하기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Discovery Section */}
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              이런 문제, 겪고 계신가요?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              많은 카페 사장님들이 공통적으로 겪는 문제입니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-2 border-destructive/20 bg-destructive/5 hover:border-destructive/40 transition-all animate-fade-in">
              <CardHeader>
                <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle className="text-xl">장시간 체류</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  커피 한 잔으로 4시간 이상 자리를 차지하는 고객들로 인해 회전율이 떨어지고 있나요?
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-warning/20 bg-warning/5 hover:border-warning/40 transition-all animate-fade-in">
              <CardHeader>
                <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-warning" />
                </div>
                <CardTitle className="text-xl">피크타임 혼잡</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  특정 시간대에만 손님이 몰려 자리가 없어 돌아가는 고객이 많나요?
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-info/20 bg-info/5 hover:border-info/40 transition-all animate-fade-in">
              <CardHeader>
                <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-info" />
                </div>
                <CardTitle className="text-xl">낮은 객단가</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  좌석을 오래 쓰는 고객일수록 추가 주문이 적어 수익성이 떨어지나요?
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Data Analysis Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              데이터로 문제의 원인을 찾습니다
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              POS 데이터와 CCTV 영상을 분석하여 정확한 현황을 파악합니다
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Data Visualization Mock */}
              <div className="relative animate-fade-in">
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8">
                  <div className="bg-card rounded-2xl shadow-2xl overflow-hidden border">
                    <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
                      <span className="font-semibold">분석 리포트</span>
                      <PieChart className="h-5 w-5" />
                    </div>
                    
                    <div className="p-4 space-y-4">
                      <div className="bg-secondary/50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium text-sm">시간대별 고객 흐름</span>
                          <BarChart3 className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex items-end gap-1 h-16">
                          {[30, 45, 70, 95, 85, 60, 40, 55, 75, 90, 80, 50].map((h, i) => (
                            <div 
                              key={i} 
                              className="flex-1 bg-primary/60 rounded-t"
                              style={{ height: `${h}%` }}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-destructive/10 rounded-xl p-3">
                          <p className="text-xs text-muted-foreground">장기체류율</p>
                          <p className="text-xl font-bold text-destructive">42%</p>
                        </div>
                        <div className="bg-warning/10 rounded-xl p-3">
                          <p className="text-xs text-muted-foreground">피크타임</p>
                          <p className="text-xl font-bold text-warning">14:00</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Features */}
              <div className="space-y-8 animate-fade-in">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">POS 데이터 분석</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      시간대별 매출, 객단가, 메뉴별 판매량을 분석하여
                      수익 패턴과 문제점을 파악합니다.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
                    <Video className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">CCTV 영상 분석</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      AI가 고객 체류 시간, 좌석 점유율, 노트북 사용률 등을 
                      자동으로 분석합니다.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center shrink-0">
                    <Target className="h-6 w-6 text-info" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">문제 진단</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      수집된 데이터를 바탕으로 카페가 가진 핵심 문제점을
                      정확하게 진단합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary/5 via-secondary/50 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              맞춤형 솔루션을 제안합니다
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              분석 결과를 바탕으로 카페에 딱 맞는 해결책을 알려드립니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-2 hover:border-primary/40 transition-all hover:shadow-xl animate-fade-in">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">공간 재배치</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  집중 공간과 대화 공간을 분리하여 다양한 고객 니즈를 충족하는 공간 설계를 제안합니다.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/40 transition-all hover:shadow-xl animate-fade-in">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-lg">시간제 요금</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  피크타임 좌석 효율을 높이기 위한 시간제 이용권 시스템을 도입합니다.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/40 transition-all hover:shadow-xl animate-fade-in">
              <CardHeader>
                <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center mb-4">
                  <Coffee className="h-6 w-6 text-info" />
                </div>
                <CardTitle className="text-lg">추가 주문 유도</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  장기 체류 고객의 추가 소비를 유도하는 메뉴 구성과 프로모션을 제안합니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              어떻게 진행되나요?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              간단한 3단계로 카페 분석을 받으실 수 있습니다
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center animate-fade-in">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3">신청서 작성</h3>
                <p className="text-muted-foreground">
                  카페 정보와 고민하시는 문제를 간단히 알려주세요
                </p>
              </div>

              <div className="text-center animate-fade-in">
                <div className="w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3">데이터 업로드</h3>
                <p className="text-muted-foreground">
                  POS 데이터와 CCTV 영상을 업로드하시면 AI가 분석합니다
                </p>
              </div>

              <div className="text-center animate-fade-in">
                <div className="w-16 h-16 bg-info text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3">솔루션 확인</h3>
                <p className="text-muted-foreground">
                  분석 결과와 맞춤형 해결책을 상세한 리포트로 받아보세요
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary to-primary/80 border-0 overflow-hidden animate-fade-in">
            <CardContent className="py-16 px-8 text-center relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground/10 rounded-full blur-3xl" />
              
              <div className="relative">
                <div className="flex justify-center gap-2 mb-6">
                  <CheckCircle2 className="h-8 w-8 text-primary-foreground/80" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
                  지금 무료로 분석받아 보세요
                </h2>
                <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                  데이터가 말해주는 카페의 진짜 문제점과 
                  해결책을 확인하세요
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-14 px-8 text-lg font-semibold"
                  onClick={() => navigate("/application")}
                >
                  무료 분석 신청하기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t bg-secondary/20">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2024 CafeSpace. 데이터 기반 카페 문제 해결 솔루션</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
