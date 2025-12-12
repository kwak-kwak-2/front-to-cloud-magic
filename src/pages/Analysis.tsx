import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Clock, ArrowRight, Loader2, Laptop } from "lucide-react";
import { useAnalysisData } from "@/hooks/useAnalysisData";
import MetricCard from "@/components/analysis/MetricCard";
import CustomerFlowChart from "@/components/analysis/CustomerFlowChart";
import StayDistributionChart from "@/components/analysis/StayDistributionChart";
import SeatDistributionChart from "@/components/analysis/SeatDistributionChart";
import RecommendationsList from "@/components/analysis/RecommendationsList";
import DailyFlowCharts from "@/components/analysis/DailyFlowCharts";
import DailyRevenueChart from "@/components/analysis/DailyRevenueChart";

const DEFAULT_STAY_DISTRIBUTION = [
  { name: "30분 미만", value: 25 },
  { name: "30분-1시간", value: 35 },
  { name: "1-2시간", value: 30 },
  { name: "2시간 이상", value: 10 },
];

const Analysis = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { loading, analysisData } = useAnalysisData(applicationId);

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
  const videoAnalysis = analysisData.video_analysis || {};
  const stayDistribution = videoAnalysis.stayDistribution || DEFAULT_STAY_DISTRIBUTION;
  const seatDistribution = videoAnalysis.seatDistribution || [];
  const dailyFlows = videoAnalysis.dailyFlows || [];
  const dailyRevenues = videoAnalysis.dailyRevenues || [];

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-in">
          <MetricCard
            title="피크 시간대"
            subtitle="POS 데이터 기반"
            value={analysisData.peak_hour}
            Icon={Clock}
            iconColorClass="text-primary/20"
            valueColorClass="text-primary"
          />
          <MetricCard
            title="장시간 체류율"
            subtitle="CCTV 데이터 기반"
            value={`${analysisData.long_stay_rate}%`}
            Icon={TrendingUp}
            iconColorClass="text-accent/20"
            valueColorClass="text-accent"
          />
          <MetricCard
            title="평균 체류시간"
            subtitle="CCTV 데이터 기반"
            value={videoAnalysis.avgStayTime || "N/A"}
            Icon={Users}
            iconColorClass="text-info/20"
            valueColorClass="text-info"
          />
          <MetricCard
            title="노트북 사용률"
            subtitle="CCTV 데이터 기반"
            value={videoAnalysis.laptopUsageRate || "N/A"}
            Icon={Laptop}
            iconColorClass="text-warning/20"
            valueColorClass="text-warning"
          />
        </div>

        {/* Daily Flow Charts - 일별 시간대 그래프 */}
        {dailyFlows.length > 0 && (
          <div className="mb-12">
            <DailyFlowCharts data={dailyFlows} />
          </div>
        )}

        {/* Daily Revenue Chart - 일별 매출 차트 */}
        {dailyRevenues.length > 0 && (
          <div className="mb-12">
            <DailyRevenueChart data={dailyRevenues} />
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <CustomerFlowChart data={customerFlow} />
          <StayDistributionChart data={stayDistribution} />
        </div>

        {/* Seat Distribution Chart */}
        {seatDistribution.length > 0 && (
          <div className="grid grid-cols-1 gap-8 mb-12">
            <SeatDistributionChart data={seatDistribution} />
          </div>
        )}

        {/* Recommendations */}
        <RecommendationsList recommendations={analysisData.recommendations} />

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
