import * as XLSX from "xlsx";

export interface DailyCustomerFlow {
  date: string;
  hourlyData: { hour: string; customers: number }[];
}

export interface DailyRevenue {
  date: string;
  revenue: number;
  customers: number;
}

export interface PosAnalysisResult {
  peakHour: string;
  totalCustomers: number;
  customerFlow: { hour: string; customers: number; revenue: number }[];
  maxCustomers: number;
  dailyFlows: DailyCustomerFlow[];
  dailyRevenues: DailyRevenue[];
}

export const analyzePosData = async (file: File): Promise<PosAnalysisResult> => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

  const hourlyStats: { [key: string]: { count: number; revenue: number; stayTime: number[] } } = {};
  // 날짜별 + 시간대별 통계
  const dailyHourlyStats: { [date: string]: { [hour: string]: number } } = {};
  // 날짜별 매출 및 고객 수 통계
  const dailyRevenueStats: { [date: string]: { revenue: number; customers: number } } = {};
  let totalCustomers = 0;

  const dataToAnalyze = jsonData.slice(0, 5000); // 더 많은 데이터 처리 (5000행)

  // 첫 번째 행의 컬럼명 확인을 위한 디버깅
  if (jsonData.length > 0) {
    console.log("POS Data - First row keys:", Object.keys(jsonData[0]));
    console.log("POS Data - First row sample:", jsonData[0]);
  }

  for (const row of dataToAnalyze) {
    // Transaction_Time 및 다양한 시간 컬럼 지원 (공백 포함 버전 추가)
    let timeField =
      (row["Transaction_Time"] ||
        row["transaction_time"] ||
        row["transaction time"] ||
        row["Transaction Time"] ||
        row["거래시간"] ||
        row["시간"] ||
        row["Time"] ||
        row["time"] ||
        row["시간대"] ||
        row["주문시간"] ||
        row["OrderTime"] ||
        row["timestamp"]) as unknown;
    
    // 매출/금액 컬럼 (cost, Unit Price 추가)
    let revenueField =
      (row["cost"] ||
        row["Cost"] ||
        row["매출"] ||
        row["Revenue"] ||
        row["revenue"] ||
        row["금액"] ||
        row["Amount"] ||
        row["amount"] ||
        row["판매금액"] ||
        row["price"] ||
        row["Price"] ||
        row["Unit Price"] ||
        row["unit price"]) as unknown;
    
    const stayField =
      (row["체류시간"] ||
        row["StayTime"] ||
        row["이용시간"] ||
        row["Duration"] ||
        row["stay_duration"]) as unknown;
    
    // 날짜 필드 탐지 (공백 포함 버전 추가)
    let dateField =
      (row["transaction date"] ||
        row["Transaction Date"] ||
        row["Transaction_Date"] ||
        row["transaction_date"] ||
        row["날짜"] ||
        row["Date"] ||
        row["date"] ||
        row["일자"]) as unknown;

    // Fallback: 자동으로 시간/매출 컬럼 탐지
    if (timeField == null) {
      for (const value of Object.values(row)) {
        if (
          typeof value === "string" &&
          /\b\d{1,2}:\d{2}\b/.test(value)
        ) {
          timeField = value;
          break;
        }
      }
    }

    if (revenueField == null) {
      for (const value of Object.values(row)) {
        if (typeof value === "number") {
          revenueField = value;
          break;
        }
      }
    }

    // 날짜 필드 자동 탐지 (더 다양한 형식 지원)
    if (dateField == null) {
      for (const value of Object.values(row)) {
        if (typeof value === "string") {
          // YYYY-MM-DD 형식
          if (/\d{4}-\d{2}-\d{2}/.test(value)) {
            dateField = value;
            break;
          }
          // YYYY/MM/DD 형식
          if (/\d{4}\/\d{1,2}\/\d{1,2}/.test(value)) {
            dateField = value;
            break;
          }
          // MM/DD/YYYY 또는 DD/MM/YYYY 형식
          if (/\d{1,2}\/\d{1,2}\/\d{4}/.test(value)) {
            dateField = value;
            break;
          }
          // YYYY.MM.DD 형식
          if (/\d{4}\.\d{1,2}\.\d{1,2}/.test(value)) {
            dateField = value;
            break;
          }
          // YYYYMMDD 형식 (8자리 숫자)
          if (/^\d{8}$/.test(value)) {
            dateField = value;
            break;
          }
        }
        if (typeof value === "number" && value > 40000 && value < 50000) {
          // Excel 날짜 시리얼 번호
          dateField = value;
          break;
        }
      }
    }

    if (timeField == null) continue;

    let hour: string;

    if (typeof timeField === "string") {
      const match = timeField.match(/(\d{1,2})/);
      if (!match) continue;
      const hourNum = parseInt(match[1]);
      hour = `${hourNum.toString().padStart(2, "0")}:00`;
    } else if (typeof timeField === "number") {
      const hourNum = Math.floor(timeField * 24);
      hour = `${hourNum.toString().padStart(2, "0")}:00`;
    } else {
      continue;
    }

    // 날짜 파싱 (다양한 형식 지원)
    let dateStr: string = "unknown";
    if (dateField != null) {
      if (typeof dateField === "string") {
        // YYYY-MM-DD 형식
        let match = dateField.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
        if (match) {
          const [, y, m, d] = match;
          dateStr = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
        } else {
          // YYYY/MM/DD 형식
          match = dateField.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/);
          if (match) {
            const [, y, m, d] = match;
            dateStr = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
          } else {
            // MM/DD/YYYY 형식
            match = dateField.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            if (match) {
              const [, m, d, y] = match;
              dateStr = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
            } else {
              // YYYY.MM.DD 형식
              match = dateField.match(/(\d{4})\.(\d{1,2})\.(\d{1,2})/);
              if (match) {
                const [, y, m, d] = match;
                dateStr = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
              } else {
                // YYYYMMDD 형식 (8자리 숫자)
                match = dateField.match(/^(\d{4})(\d{2})(\d{2})$/);
                if (match) {
                  const [, y, m, d] = match;
                  dateStr = `${y}-${m}-${d}`;
                }
              }
            }
          }
        }
      } else if (typeof dateField === "number") {
        // Excel 시리얼 날짜를 변환
        const excelEpoch = new Date(1899, 11, 30);
        const date = new Date(excelEpoch.getTime() + dateField * 86400000);
        dateStr = date.toISOString().split("T")[0];
      }
    }

    // 디버깅: 날짜 파싱 결과 로깅 (첫 10개만)
    if (totalCustomers < 10) {
      console.log(`POS Row parsing - dateField: ${dateField}, parsed dateStr: ${dateStr}, hour: ${hour}`);
    }

    if (!hourlyStats[hour]) {
      hourlyStats[hour] = { count: 0, revenue: 0, stayTime: [] };
    }

    hourlyStats[hour].count++;
    totalCustomers++;

    // 일별 시간대별 집계
    if (dateStr !== "unknown") {
      if (!dailyHourlyStats[dateStr]) {
        dailyHourlyStats[dateStr] = {};
      }
      if (!dailyHourlyStats[dateStr][hour]) {
        dailyHourlyStats[dateStr][hour] = 0;
      }
      dailyHourlyStats[dateStr][hour]++;

      // 일별 매출 및 고객 수 집계
      if (!dailyRevenueStats[dateStr]) {
        dailyRevenueStats[dateStr] = { revenue: 0, customers: 0 };
      }
      dailyRevenueStats[dateStr].customers++;
    }

    if (revenueField != null) {
      const revenue =
        typeof revenueField === "number"
          ? revenueField
          : parseFloat(revenueField.toString().replace(/[^0-9.]/g, ""));
      if (!Number.isNaN(revenue)) {
        hourlyStats[hour].revenue += revenue;
        // 일별 매출 집계
        if (dateStr !== "unknown" && dailyRevenueStats[dateStr]) {
          dailyRevenueStats[dateStr].revenue += revenue;
        }
      }
    }

    if (stayField != null) {
      const stay =
        typeof stayField === "number"
          ? stayField
          : parseFloat(stayField.toString().replace(/[^0-9.]/g, ""));
      if (!Number.isNaN(stay)) {
        hourlyStats[hour].stayTime.push(stay);
      }
    }
  }

  let peakHour = "14:00-16:00";
  let maxCustomers = 0;
  Object.entries(hourlyStats).forEach(([hour, stats]) => {
    if (stats.count > maxCustomers) {
      maxCustomers = stats.count;
      const hourNum = parseInt(hour.split(":")[0]);
      peakHour = `${hour}-${(hourNum + 2).toString().padStart(2, "0")}:00`;
    }
  });

  const customerFlow = Object.entries(hourlyStats)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([hour, stats]) => ({
      hour: hour.substring(0, 5),
      customers: stats.count,
      revenue: Math.round(stats.revenue),
    }));

  // 일별 데이터 생성 (최대 31일)
  const dailyFlows: DailyCustomerFlow[] = Object.entries(dailyHourlyStats)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 31)
    .map(([date, hours]) => ({
      date,
      hourlyData: Object.entries(hours)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([hour, customers]) => ({ hour, customers })),
    }));

  // 일별 매출 데이터 생성 (최대 31일)
  const dailyRevenues: DailyRevenue[] = Object.entries(dailyRevenueStats)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 31)
    .map(([date, stats]) => ({
      date,
      revenue: Math.round(stats.revenue),
      customers: stats.customers,
    }));

  return {
    peakHour,
    totalCustomers,
    customerFlow,
    maxCustomers,
    dailyFlows,
    dailyRevenues,
  };
};
