import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Coffee, ArrowRight } from "lucide-react";

const Application = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    cafe_name: "",
    owner_name: "",
    cafe_address: "",
    phone: "",
    email: "",
    business_hours: "",
    customer_issues: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("cafe_applications")
        .insert([formData])
        .select()
        .single();

      if (error) throw error;

      toast.success("신청서가 제출되었습니다!");
      navigate(`/upload/${data.id}`);
    } catch (error) {
      console.error("Error:", error);
      toast.error("신청서 제출 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <Coffee className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            카공족 문제 해결 솔루션
          </h1>
          <p className="text-lg text-muted-foreground">
            데이터 기반 카페 운영 최적화 서비스
          </p>
        </div>

        <Card className="shadow-xl border-2 animate-fade-in">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl">카페 정보 입력</CardTitle>
            <CardDescription>
              운영 중이신 카페의 기본 정보를 입력해주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cafe_name">카페 이름 *</Label>
                <Input
                  id="cafe_name"
                  placeholder="예: 스터디 앤 커피"
                  value={formData.cafe_name}
                  onChange={(e) =>
                    setFormData({ ...formData, cafe_name: e.target.value })
                  }
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner_name">신청자/대표자 이름 *</Label>
                <Input
                  id="owner_name"
                  placeholder="이름을 입력하세요"
                  value={formData.owner_name}
                  onChange={(e) =>
                    setFormData({ ...formData, owner_name: e.target.value })
                  }
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cafe_address">카페 주소 *</Label>
                <Input
                  id="cafe_address"
                  placeholder="예: 서울특별시 강남구 테헤란로 123"
                  value={formData.cafe_address}
                  onChange={(e) =>
                    setFormData({ ...formData, cafe_address: e.target.value })
                  }
                  required
                  className="h-12"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">연락처 *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="010-1234-5678"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">이메일 *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="cafe@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_hours">영업시간</Label>
                <Input
                  id="business_hours"
                  placeholder="예: 평일 09:00-22:00, 주말 10:00-20:00"
                  value={formData.business_hours}
                  onChange={(e) =>
                    setFormData({ ...formData, business_hours: e.target.value })
                  }
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer_issues">
                  현재 겪고 있는 고객 관리 문제
                </Label>
                <Textarea
                  id="customer_issues"
                  placeholder="예: 장시간 자리를 차지하는 고객, 음료 주문 없이 오래 머무르는 문제 등"
                  value={formData.customer_issues}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_issues: e.target.value })
                  }
                  className="min-h-[120px] resize-y"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-lg font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "제출 중..."
                ) : (
                  <>
                    다음 단계로
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

export default Application;
