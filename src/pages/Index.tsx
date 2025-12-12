import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Coffee, 
  ArrowRight, 
  BookOpen, 
  MessageCircle, 
  Smartphone, 
  MapPin, 
  Clock, 
  CreditCard,
  Wifi,
  Zap,
  Users,
  Sparkles
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
              <Sparkles className="h-4 w-4" />
              Next-Generation Cafe Solution
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground leading-tight">
              공부와 휴식이
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                공존하는 스마트 공간
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              할리스, 스타벅스의 성공 전략을 벤치마킹하여
              <br className="hidden md:block" />
              좌석 효율성과 고객 만족도를 극대화합니다
            </p>
            
            <Button
              size="lg"
              className="h-14 px-8 text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
              onClick={() => navigate("/application")}
            >
              공간 기능 살펴보기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Smart Zoning Strategy Section */}
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Space Innovation
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              할리스 벤치마킹 - 목적에 맞는 스마트 공간 분리 전략
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Focus Zone */}
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-xl group animate-fade-in">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Focus Zone</CardTitle>
                <CardDescription className="text-base">집중을 위한 조용한 공간</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  도서관 스타일의 파티션 좌석과 개별 콘센트를 갖춘 
                  딥워크를 위한 전용 공간입니다.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                    <Zap className="h-3 w-3" /> 개별 콘센트
                  </span>
                  <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                    <Wifi className="h-3 w-3" /> 고속 WiFi
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Community Zone */}
            <Card className="border-2 border-accent/20 hover:border-accent/40 transition-all hover:shadow-xl group animate-fade-in">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <MessageCircle className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-2xl">Community Zone</CardTitle>
                <CardDescription className="text-base">소통을 위한 열린 공간</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  대화와 캐주얼한 미팅을 위한 오픈 테이블 공간으로
                  자유로운 소통이 가능합니다.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 bg-accent/10 text-accent text-sm px-3 py-1 rounded-full">
                    <Users className="h-3 w-3" /> 그룹 테이블
                  </span>
                  <span className="inline-flex items-center gap-1 bg-accent/10 text-accent text-sm px-3 py-1 rounded-full">
                    <Coffee className="h-3 w-3" /> 편안한 분위기
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Digital Convenience Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Seamless Digital Experience
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              스타벅스 벤치마킹 - 디지털 편의 기능으로 완벽한 경험
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Mobile Mockup */}
              <div className="relative animate-fade-in order-2 lg:order-1">
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8">
                  <div className="bg-card rounded-2xl shadow-2xl overflow-hidden border">
                    {/* Phone Header */}
                    <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
                      <span className="font-semibold">CafeSpace</span>
                      <Smartphone className="h-5 w-5" />
                    </div>
                    
                    {/* App Content */}
                    <div className="p-4 space-y-4">
                      <div className="bg-secondary/50 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                            <Coffee className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">테이블 오더</p>
                            <p className="text-xs text-muted-foreground">좌석에서 바로 주문</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-secondary/50 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">실시간 좌석 현황</p>
                            <p className="text-xs text-muted-foreground">콘센트 좌석 5개 이용 가능</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-6 gap-1 mt-3">
                          {[...Array(12)].map((_, i) => (
                            <div 
                              key={i} 
                              className={`h-6 rounded ${
                                i < 5 ? 'bg-success/30' : i < 9 ? 'bg-destructive/30' : 'bg-muted'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-8 animate-fade-in order-1 lg:order-2">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Coffee className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Table Ordering</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      짐을 두고 자리를 비우지 않아도 됩니다. 
                      좌석에서 바로 주문하고 받아보세요.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Real-time Seat Map</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      콘센트 좌석 여부와 좌석 점유 현황을 실시간으로 확인하세요.
                      원하는 자리를 미리 파악할 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hybrid Revenue Model Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary/5 via-secondary/50 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Hybrid Revenue Model
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              스터디카페 벤치마킹 - 유연한 이용권과 멤버십 시스템
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Time-based Pass */}
            <Card className="border-2 hover:border-primary/40 transition-all hover:shadow-xl animate-fade-in overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <Clock className="h-5 w-5" />
                  Time-based Pass
                </div>
              </div>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold mb-2 text-foreground">4시간 Focus Pass</div>
                <p className="text-muted-foreground mb-6">
                  + 아메리카노 1잔 무료 제공
                </p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-5 h-5 bg-success/20 rounded-full flex items-center justify-center">
                      <span className="text-success text-xs">✓</span>
                    </div>
                    Focus Zone 좌석 이용
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-5 h-5 bg-success/20 rounded-full flex items-center justify-center">
                      <span className="text-success text-xs">✓</span>
                    </div>
                    고속 WiFi & 콘센트
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-5 h-5 bg-success/20 rounded-full flex items-center justify-center">
                      <span className="text-success text-xs">✓</span>
                    </div>
                    음료 1잔 포함
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Subscription */}
            <Card className="border-2 border-accent/30 hover:border-accent/50 transition-all hover:shadow-xl animate-fade-in overflow-hidden relative">
              <div className="absolute top-4 right-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                BEST
              </div>
              <div className="bg-gradient-to-r from-accent/10 to-accent/5 px-6 py-4">
                <div className="flex items-center gap-2 text-accent font-semibold">
                  <CreditCard className="h-5 w-5" />
                  Subscription
                </div>
              </div>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold mb-2 text-foreground">월간 무제한</div>
                <p className="text-muted-foreground mb-6">
                  커피 & 공간 무제한 이용
                </p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-5 h-5 bg-success/20 rounded-full flex items-center justify-center">
                      <span className="text-success text-xs">✓</span>
                    </div>
                    모든 Zone 무제한 이용
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-5 h-5 bg-success/20 rounded-full flex items-center justify-center">
                      <span className="text-success text-xs">✓</span>
                    </div>
                    매일 음료 1잔 무료
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-5 h-5 bg-success/20 rounded-full flex items-center justify-center">
                      <span className="text-success text-xs">✓</span>
                    </div>
                    우선 좌석 예약권
                  </li>
                </ul>
              </CardContent>
            </Card>
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
                  당신의 카페도 혁신할 준비가 되셨나요?
                </h2>
                <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                  데이터 기반 분석으로 카공족 문제를 해결하고
                  새로운 수익 모델을 발견하세요
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
          <p>© 2024 CafeSpace. Inspired by Hollys & Starbucks success strategies.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
