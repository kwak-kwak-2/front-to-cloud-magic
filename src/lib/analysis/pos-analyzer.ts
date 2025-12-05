import * as XLSX from "xlsx";

export interface PosAnalysisResult {
  peakHour: string;
  totalCustomers: number;
  customerFlow: { hour: string; customers: number; revenue: number }[];
  maxCustomers: number;
}

export const analyzePosData = async (file: File): Promise<PosAnalysisResult> => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

  const hourlyStats: { [key: string]: { count: number; revenue: number; stayTime: number[] } } = {};
  let totalCustomers = 0;

  const dataToAnalyze = jsonData.slice(0, 1000);

  for (const row of dataToAnalyze) {
    let timeField =
      (row["시간"] ||
        row["Time"] ||
        row["시간대"] ||
        row["주문시간"] ||
        row["OrderTime"] ||
        row["timestamp"]) as unknown;
    let revenueField =
      (row["매출"] ||
        row["Revenue"] ||
        row["금액"] ||
        row["Amount"] ||
        row["판매금액"] ||
        row["price"]) as unknown;
    const stayField =
      (row["체류시간"] ||
        row["StayTime"] ||
        row["이용시간"] ||
        row["Duration"] ||
        row["stay_duration"]) as unknown;

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

    if (!hourlyStats[hour]) {
      hourlyStats[hour] = { count: 0, revenue: 0, stayTime: [] };
    }

    hourlyStats[hour].count++;
    totalCustomers++;

    if (revenueField != null) {
      const revenue =
        typeof revenueField === "number"
          ? revenueField
          : parseFloat(revenueField.toString().replace(/[^0-9.]/g, ""));
      if (!Number.isNaN(revenue)) {
        hourlyStats[hour].revenue += revenue;
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

  return {
    peakHour,
    totalCustomers,
    customerFlow,
    maxCustomers,
  };
};
