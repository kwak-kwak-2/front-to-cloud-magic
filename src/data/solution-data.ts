import { ReactNode } from "react";

// ===== 타입 정의 =====
export interface Problem {
  id: string;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  metric?: string;
  metricValue?: string;
}

export interface SolutionItem {
  id: string;
  problemId: string;
  title: string;
  description: string;
  benchmarkCafe: string;
  benchmarkDescription: string;
  iconName: string;
  expectedImpact: string;
}

export type BenchmarkCategory = "space" | "menu" | "operation" | "hybrid";

export interface BenchmarkCase {
  id: string;
  brand: string;
  strategy: string;
  problem: string;
  description: string;
  effect: string;
  tags: string[];
  category: BenchmarkCategory;
  iconName: string;
}

// ===== 카테고리 라벨 =====
export const categoryLabels: Record<BenchmarkCategory, { label: string; color: string }> = {
  space: { label: "공간 전략", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  menu: { label: "메뉴/객단가", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  operation: { label: "운영/IT", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  hybrid: { label: "하이브리드", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
};

export const categories: BenchmarkCategory[] = ["space", "menu", "operation", "hybrid"];

// ===== 벤치마킹 사례 데이터 =====
export const benchmarkCases: BenchmarkCase[] = [
  // 공간 전략
  {
    id: "hollys-zoning",
    brand: "할리스(Hollys)",
    strategy: "스마트 조닝(Zoning)",
    problem: "카공족과 대화 손님 간의 소음 갈등",
    description: "카공족을 위한 '스터디존'과 대화 손님을 위한 '일반존'을 물리적으로 분리함.",
    effect: "소음 갈등 해결 및 좌석 효율 극대화",
    tags: ["회전율", "인테리어", "고객만족"],
    category: "space",
    iconName: "Layout",
  },
  {
    id: "bluebottle-standing",
    brand: "블루보틀(Blue Bottle)",
    strategy: "스탠딩 바 & 높은 테이블",
    problem: "낮은 좌석 회전율",
    description: "회전율이 필요한 곳에 의자가 불편하거나 서서 마시는 테이블 배치.",
    effect: "빠른 섭취 유도로 회전율 증가",
    tags: ["회전율", "인테리어"],
    category: "space",
    iconName: "Armchair",
  },
  {
    id: "starbucks-community",
    brand: "스타벅스(Starbucks)",
    strategy: "커뮤니티 테이블",
    problem: "1인 손님이 4인석 차지",
    description: "1인 손님들을 모으기 위한 대형 공용 테이블 설치.",
    effect: "1인이 4인석을 차지하는 비효율 제거",
    tags: ["회전율", "좌석효율"],
    category: "space",
    iconName: "Users",
  },
  // 메뉴 및 객단가 전략
  {
    id: "paulbassett-option",
    brand: "폴바셋(Paul Bassett)",
    strategy: "옵션 다양화 전략",
    problem: "제한된 메뉴로 인한 틈새 고객 이탈",
    description: "소화가 잘되는 우유, 두유 등 커스텀 옵션 제공.",
    effect: "틈새 고객 확보 및 추가 금액으로 객단가 상승",
    tags: ["객단가", "메뉴"],
    category: "menu",
    iconName: "UtensilsCrossed",
  },
  {
    id: "knotted-display",
    brand: "노티드(Knotted)",
    strategy: "비주얼 진열 효과",
    problem: "음료만 주문하는 고객",
    description: "디저트가 꽉 차 보이고 먹음직스럽게 쌓아두는 진열 방식.",
    effect: "음료만 시키려던 고객의 디저트 추가 구매 유도 (충동구매)",
    tags: ["객단가", "인테리어", "디저트"],
    category: "menu",
    iconName: "Eye",
  },
  {
    id: "ediya-sizeup",
    brand: "이디야(Ediya)",
    strategy: "사이즈업 전략",
    problem: "장시간 체류 대비 낮은 객단가",
    description: "오래 머무는 고객을 위해 엑스트라 사이즈 옵션 적극 홍보.",
    effect: "체류 시간 대비 객단가 방어",
    tags: ["객단가", "메뉴"],
    category: "menu",
    iconName: "ArrowUpRight",
  },
  // 운영 및 IT 전략
  {
    id: "compose-window",
    brand: "컴포즈/메가커피",
    strategy: "테이크아웃 전용 윈도우",
    problem: "매장 내 혼잡 및 배달 기사 동선 혼재",
    description: "매장에 들어오지 않고 밖에서 바로 주문/픽업하는 창구 운영.",
    effect: "매장 내 혼잡도 감소 및 배달 기사 동선 분리",
    tags: ["운영효율", "테이크아웃"],
    category: "operation",
    iconName: "Store",
  },
  {
    id: "starbucks-siren",
    brand: "스타벅스(Starbucks)",
    strategy: "사이렌 오더",
    problem: "피크 시간대 긴 대기 줄",
    description: "자리에 앉아서 모바일로 주문 결제.",
    effect: "주문 대기 줄 삭제 및 심리적 부담 감소로 주문 빈도 증가",
    tags: ["운영효율", "IT", "모바일"],
    category: "operation",
    iconName: "Smartphone",
  },
  // 하이브리드 모델
  {
    id: "studycafe-timepass",
    brand: "랑스터디카페",
    strategy: "시간제 이용권",
    problem: "음료 미주문 장시간 체류 고객",
    description: "음료 값이 아닌 '공간 이용 시간'을 판매.",
    effect: "음료를 안 시켜도 수익 발생, 장시간 체류 고객 수익화",
    tags: ["수익모델", "회전율"],
    category: "hybrid",
    iconName: "Timer",
  },
];

// ===== 솔루션 데이터 =====
export const solutionItems: SolutionItem[] = [
  {
    id: "zoning",
    problemId: "long-stay",
    title: "스마트 공간 분리 전략",
    description: "Focus Zone(집중 공간)과 Community Zone(소통 공간)으로 공간을 분리하여 목적별 이용을 유도합니다. 파티션과 개별 콘센트가 있는 집중석과 오픈형 소통 테이블을 구분 배치합니다.",
    benchmarkCafe: "할리스커피",
    benchmarkDescription: "할리스는 '스터디존'과 '카페존'을 분리 운영하여 카공족과 일반 고객의 공존을 성공적으로 구현했습니다.",
    iconName: "BookOpen",
    expectedImpact: "좌석 회전율 25% 향상, 고객 만족도 증가",
  },
  {
    id: "digital-ordering",
    problemId: "peak-concentration",
    title: "테이블 오더 시스템",
    description: "좌석에서 바로 주문 가능한 모바일 오더 시스템을 도입하여 피크 시간대 카운터 혼잡을 해소하고 고객 편의성을 높입니다.",
    benchmarkCafe: "스타벅스",
    benchmarkDescription: "스타벅스의 '사이렌 오더'는 피크 시간대 주문 대기 시간을 60% 단축시키며 전체 주문의 30% 이상을 처리합니다.",
    iconName: "Smartphone",
    expectedImpact: "주문 대기 시간 50% 감소, 피크 시간 처리량 증가",
  },
  {
    id: "seat-map",
    problemId: "laptop-usage",
    title: "실시간 좌석 현황 시스템",
    description: "콘센트 좌석, 그룹석 등 좌석 유형별 점유 현황을 실시간으로 제공하여 고객이 원하는 좌석을 미리 파악하고 방문할 수 있습니다.",
    benchmarkCafe: "스타벅스 리저브",
    benchmarkDescription: "스타벅스 리저브 매장에서는 앱을 통해 매장 내 좌석 현황을 확인할 수 있어 불필요한 방문을 줄이고 고객 경험을 개선했습니다.",
    iconName: "MapPin",
    expectedImpact: "콘센트석 분쟁 감소, 고객 이탈률 15% 감소",
  },
  {
    id: "time-pass",
    problemId: "long-stay",
    title: "시간제 이용권 도입",
    description: "4시간 Focus Pass와 같은 시간제 이용권을 판매하여 적정 체류 시간을 유도하고 음료 판매와 연계한 부가 수익을 창출합니다.",
    benchmarkCafe: "스터디카페 (토즈, 작심)",
    benchmarkDescription: "스터디카페들은 시간제 요금제로 좌석 회전율을 극대화하며, 이 모델을 카페에 적용하면 카공족 문제를 수익으로 전환할 수 있습니다.",
    iconName: "Clock",
    expectedImpact: "신규 수익원 창출, 좌석 회전율 40% 향상",
  },
  {
    id: "subscription",
    problemId: "laptop-usage",
    title: "월간 멤버십 프로그램",
    description: "월 정액제로 무제한 공간 이용과 매일 음료 1잔을 제공하여 충성 고객을 확보하고 안정적인 수익을 보장합니다.",
    benchmarkCafe: "블루보틀, 커피빈",
    benchmarkDescription: "블루보틀의 멤버십 프로그램은 고정 고객층을 확보하고 월간 예측 가능한 수익을 창출하는 데 성공했습니다.",
    iconName: "CreditCard",
    expectedImpact: "고정 수익 확보, 고객 재방문율 70% 증가",
  },
];

// ===== 유틸리티 함수 =====
export const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case "high":
      return "bg-destructive/10 border-destructive/30 text-destructive";
    case "medium":
      return "bg-warning/10 border-warning/30 text-warning";
    default:
      return "bg-info/10 border-info/30 text-info";
  }
};

export const getSeverityLabel = (severity: string): string => {
  switch (severity) {
    case "high":
      return "심각";
    case "medium":
      return "주의";
    default:
      return "참고";
  }
};

// 분석 데이터 기반 문제점 진단
export const diagnoseProblems = (
  longStayRate: number,
  laptopUsageRate: number,
  peakHour: string | null
): Problem[] => {
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

  if (peakHour) {
    problems.push({
      id: "peak-concentration",
      title: "특정 시간대 고객 집중",
      description: `${peakHour} 시간대에 고객이 집중되어 대기 시간 증가와 서비스 품질 저하가 우려됩니다.`,
      severity: "medium",
      metric: "피크 시간대",
      metricValue: peakHour,
    });
  }

  return problems;
};

// 문제점 기반 솔루션 필터링
export const filterSolutions = (problems: Problem[]) => {
  const relevantSolutions = solutionItems.filter((sol) =>
    problems.some((prob) => prob.id === sol.problemId)
  );

  const additionalSolutions = solutionItems.filter(
    (sol) => !relevantSolutions.includes(sol)
  );

  return { relevantSolutions, additionalSolutions };
};
