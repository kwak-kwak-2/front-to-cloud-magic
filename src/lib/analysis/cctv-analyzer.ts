import * as XLSX from "xlsx";

export interface CctvAnalysisResult {
  hourlyFlow: { hour: string; customers: number }[];
  seatDistribution: { name: string; value: number }[];
  stayDistribution: { name: string; value: number }[];
  longStayRate: number;
  laptopUsageRate: number;
  avgDwellTime: number;
  totalCustomers: number;
}

export const analyzeCctvData = async (file: File): Promise<CctvAnalysisResult> => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

  const hourlyStats: { [key: string]: number } = {};
  const seatLocationStats: { [key: string]: number } = {};
  const dwellTimes: number[] = [];
  let laptopUsers = 0;
  let totalCustomers = 0;

  for (const row of jsonData) {
    totalCustomers++;

    // Parse Entry_Time to get hour
    const entryTime = row["Entry_Time"] || row["entry_time"] || row["입장시간"] || row["시간"];
    if (entryTime != null) {
      let hour: string | null = null;

      if (typeof entryTime === "string") {
        // HH:MM 또는 HH:MM:SS 형식
        const match = String(entryTime).match(/(\d{1,2}):/);
        if (match) {
          hour = `${match[1].padStart(2, "0")}:00`;
        }
      } else if (typeof entryTime === "number") {
        // Excel 시간 형식 (0.0 ~ 1.0 범위의 소수점)
        // 0.5 = 12:00, 0.95833 = 23:00
        const hourNum = Math.floor(entryTime * 24) % 24;
        hour = `${hourNum.toString().padStart(2, "0")}:00`;
      }

      if (hour) {
        hourlyStats[hour] = (hourlyStats[hour] || 0) + 1;
      }
    }

    // Seat location
    const seatLocation = row["Seat_Location"] || row["seat_location"];
    if (seatLocation) {
      seatLocationStats[seatLocation] = (seatLocationStats[seatLocation] || 0) + 1;
    }

    // Laptop usage
    const laptopUsage = row["Laptop_Usage"] || row["laptop_usage"];
    if (laptopUsage === true || laptopUsage === "True" || laptopUsage === "true") {
      laptopUsers++;
    }

    // Dwell time
    const dwellTime = row["Dwell_Time_min"] || row["dwell_time_min"];
    if (dwellTime) {
      const time = typeof dwellTime === "number" ? dwellTime : parseInt(dwellTime);
      if (!isNaN(time)) {
        dwellTimes.push(time);
      }
    }
  }

  // Calculate hourly flow
  const hourlyFlow = Object.entries(hourlyStats)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([hour, count]) => ({
      hour,
      customers: count,
    }));

  // Calculate seat location distribution
  const seatDistribution = Object.entries(seatLocationStats).map(([name, value]) => ({
    name: name === "Group" ? "그룹석" : 
          name === "Wall" ? "벽면석" : 
          name === "Window" ? "창가석" : 
          name === "Center" ? "중앙석" : name,
    value,
  }));

  // Calculate dwell time distribution
  const shortStay = dwellTimes.filter(t => t < 30).length;
  const mediumStay = dwellTimes.filter(t => t >= 30 && t < 60).length;
  const longStay = dwellTimes.filter(t => t >= 60 && t < 120).length;
  const veryLongStay = dwellTimes.filter(t => t >= 120).length;

  const stayDistribution = [
    { name: "30분 미만", value: shortStay },
    { name: "30분-1시간", value: mediumStay },
    { name: "1-2시간", value: longStay },
    { name: "2시간 이상", value: veryLongStay },
  ];

  // Calculate long stay rate (2시간 이상)
  const longStayRate = totalCustomers > 0 
    ? Math.round((veryLongStay / totalCustomers) * 100) 
    : 0;

  // Calculate laptop usage rate
  const laptopUsageRate = totalCustomers > 0 
    ? Math.round((laptopUsers / totalCustomers) * 100) 
    : 0;

  // Calculate average dwell time
  const avgDwellTime = dwellTimes.length > 0
    ? Math.round(dwellTimes.reduce((a, b) => a + b, 0) / dwellTimes.length)
    : 0;

  return {
    hourlyFlow,
    seatDistribution,
    stayDistribution,
    longStayRate,
    laptopUsageRate,
    avgDwellTime,
    totalCustomers,
  };
};
