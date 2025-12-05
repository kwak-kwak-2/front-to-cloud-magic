import type { PosAnalysisResult } from "./pos-analyzer";
import type { CctvAnalysisResult } from "./cctv-analyzer";

export interface Recommendation {
  title: string;
  description: string;
  expected_impact: string;
}

export const generateRecommendations = (
  posResult: PosAnalysisResult,
  cctvResult: CctvAnalysisResult
): Recommendation[] => {
  return [
    {
      title: `${posResult.peakHour} 피크 시간대 시간제 운영 도입`,
      description: `분석 결과 ${posResult.peakHour}에 가장 많은 ${posResult.maxCustomers}명의 고객이 방문합니다. 이 시간대에 최대 이용 시간을 2시간으로 제한하여 좌석 회전율을 높이는 것을 권장합니다.`,
      expected_impact: "좌석 회전율 30% 증가 예상",
    },
    {
      title: "장시간 체류 고객 관리 시스템",
      description: `현재 ${cctvResult.longStayRate}%의 고객이 2시간 이상 머무릅니다. 시간대별 차등 요금제나 재주문 유도 시스템을 도입하여 수익성을 개선할 수 있습니다.`,
      expected_impact: "시간당 매출 25% 향상 예상",
    },
    {
      title: "노트북 사용 고객 전용 구역 설정",
      description: `분석 결과 ${cctvResult.laptopUsageRate}%의 고객이 노트북을 사용합니다. 전용 구역을 지정하여 일반 고객과 업무/학습 고객을 분리하면 양측 모두의 만족도를 높일 수 있습니다.`,
      expected_impact: "고객 만족도 20% 향상 예상",
    },
  ];
};

export const createVideoAnalysis = (cctvResult: CctvAnalysisResult) => ({
  avgStayTime: `${cctvResult.avgDwellTime}분`,
  seatDistribution: cctvResult.seatDistribution,
  laptopUsageRate: `${cctvResult.laptopUsageRate}%`,
  stayDistribution: cctvResult.stayDistribution,
});
