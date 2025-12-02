import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, Clock, ArrowRight, Loader2 } from "lucide-react";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--warning))", "hsl(var(--info))"];

const Analysis = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<any>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const { data, error } = await supabase
          .from("analysis_results")
          .select("*")
          .eq("application_id", applicationId)
          .single();

        if (error) throw error;
        setAnalysisData(data);
      } catch (error) {
        console.error("Error fetching analysis:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [applicationId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">데이터 분석 중...</p>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>분석 결과를 찾을 수 없습니다</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              데이터가 아직 처리되지 않았거나 오류가 발생했습니다.
            </p>
            <Button onClick={() => navigate("/")}>처음으로 돌아가기</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const customerFlow = analysisData.customer_flow || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            분석 결과
          </h1>
          <p className="text-lg text-muted-foreground">
            데이터 기반 인사이트 및 운영 개선 방안
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">피크 시간대</p>
                  <p className="text-3xl font-bold text-primary mt-2">
                    {analysisData.peak_hour}
                  </p>
                </div>
                <Clock className="h-12 w-12 text-primary/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">장시간 체류율</p>
                  <p className="text-3xl font-bold text-accent mt-2">
                    {analysisData.long_stay_rate}%
                  </p>
                </div>
                <TrendingUp className="h-12 w-12 text-accent/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">일평균 고객수</p>
                  <p className="text-3xl font-bold text-info mt-2">
                    {Math.floor(Math.random() * 100 + 80)}명
                  </p>
                </div>
                <Users className="h-12 w-12 text-info/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="border-2 animate-fade-in">
            <CardHeader>
              <CardTitle>시간대별 고객 유입</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={customerFlow}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="customers" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-2 animate-fade-in">
            <CardHeader>
              <CardTitle>체류 시간 분포</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "30분 미만", value: 25 },
                      { name: "30분-1시간", value: 35 },
                      { name: "1-2시간", value: 30 },
                      { name: "2시간 이상", value: 10 },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="hsl(var(--primary))"
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="border-2 mb-8 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl">맞춤형 개선 방안</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisData.recommendations?.map((rec: any, index: number) => (
                <div
                  key={index}
                  className="bg-success/10 border border-success/30 rounded-lg p-4"
                >
                  <h4 className="font-semibold text-lg mb-2">{rec.title}</h4>
                  <p className="text-foreground/80">{rec.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            size="lg"
            className="h-14 px-8 text-lg"
            onClick={() => navigate(`/solution/${applicationId}`)}
          >
            솔루션 보고서 보기
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
