import * as XLSX from "xlsx";

export interface FakeCctvRow {
  date: string;
  person_id: string;
  entry_time: string;
  exit_time: string;
  dwell_min: number;
  laptop: boolean;
}

// Seeded random number generator for reproducibility
class SeededRandom {
  private seed: number;

  constructor(seed: number = 42) {
    this.seed = seed;
  }

  // Simple LCG random number generator
  random(): number {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }

  randInt(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  // Box-Muller transform for normal distribution
  normalRandom(mean: number, stdDev: number): number {
    const u1 = this.random();
    const u2 = this.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stdDev + mean;
  }
}

// Parse time string "HH:MM" or "HH:MM:SS" to minutes from midnight
const parseTimeToMinutes = (timeStr: string): number => {
  const match = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (match) {
    return parseInt(match[1]) * 60 + parseInt(match[2]);
  }
  return 0;
};

// Convert minutes from midnight to "HH:MM:SS" string
const minutesToTimeStr = (minutes: number): string => {
  // Handle negative or overflow
  while (minutes < 0) minutes += 24 * 60;
  minutes = minutes % (24 * 60);
  
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:00`;
};

export interface PosDateTimeEntry {
  date: string;
  time: string;
  datetime: Date;
}

// Extract pos_datetime from POS file
export const extractPosDateTimes = async (file: File): Promise<PosDateTimeEntry[]> => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

  const entries: PosDateTimeEntry[] = [];

  for (const row of jsonData) {
    // Date field detection
    let dateField =
      row["transaction date"] ||
      row["Transaction Date"] ||
      row["Transaction_Date"] ||
      row["transaction_date"] ||
      row["날짜"] ||
      row["Date"] ||
      row["date"] ||
      row["일자"];

    // Time field detection
    let timeField =
      row["Transaction_Time"] ||
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
      row["timestamp"];

    // Auto-detect date field
    if (dateField == null) {
      for (const value of Object.values(row)) {
        if (typeof value === "string") {
          if (/\d{4}-\d{2}-\d{2}/.test(value) ||
              /\d{4}\/\d{1,2}\/\d{1,2}/.test(value) ||
              /\d{1,2}\/\d{1,2}\/\d{4}/.test(value) ||
              /\d{4}\.\d{1,2}\.\d{1,2}/.test(value) ||
              /^\d{8}$/.test(value)) {
            dateField = value;
            break;
          }
        }
        if (typeof value === "number" && value > 40000 && value < 50000) {
          dateField = value;
          break;
        }
      }
    }

    // Auto-detect time field
    if (timeField == null) {
      for (const value of Object.values(row)) {
        if (typeof value === "string" && /\b\d{1,2}:\d{2}\b/.test(value)) {
          timeField = value;
          break;
        }
      }
    }

    if (dateField == null || timeField == null) continue;

    // Parse date
    let dateStr: string = "";
    if (typeof dateField === "string") {
      let match = dateField.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
      if (match) {
        const [, y, m, d] = match;
        dateStr = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
      } else {
        match = dateField.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/);
        if (match) {
          const [, y, m, d] = match;
          dateStr = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
        } else {
          match = dateField.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
          if (match) {
            const [, m, d, y] = match;
            dateStr = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
          } else {
            match = dateField.match(/(\d{4})\.(\d{1,2})\.(\d{1,2})/);
            if (match) {
              const [, y, m, d] = match;
              dateStr = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
            } else {
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
      const excelEpoch = new Date(1899, 11, 30);
      const date = new Date(excelEpoch.getTime() + dateField * 86400000);
      dateStr = date.toISOString().split("T")[0];
    }

    if (!dateStr) continue;

    // Parse time
    let timeStr: string = "";
    if (typeof timeField === "string") {
      const match = timeField.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
      if (match) {
        const hours = match[1].padStart(2, "0");
        const mins = match[2].padStart(2, "0");
        const secs = match[3] ? match[3].padStart(2, "0") : "00";
        timeStr = `${hours}:${mins}:${secs}`;
      }
    } else if (typeof timeField === "number") {
      const totalMinutes = Math.floor(timeField * 24 * 60);
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      timeStr = `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:00`;
    }

    if (!timeStr) continue;

    const datetime = new Date(`${dateStr}T${timeStr}`);
    if (!isNaN(datetime.getTime())) {
      entries.push({ date: dateStr, time: timeStr, datetime });
    }
  }

  // Sort by datetime
  entries.sort((a, b) => a.datetime.getTime() - b.datetime.getTime());
  
  return entries;
};

// Generate fake CCTV data from POS datetime entries
export const generateFakeCctvData = (
  posEntries: PosDateTimeEntry[],
  seed: number = 42,
  entryMin: number = 1,
  entryMax: number = 7,
  pLaptop: number = 0.45
): FakeCctvRow[] => {
  const rng = new SeededRandom(seed);
  const rows: FakeCctvRow[] = [];

  for (let i = 0; i < posEntries.length; i++) {
    const entry = posEntries[i];
    
    // Calculate entry delay (random 1-7 minutes before transaction)
    const entryDelay = rng.randInt(entryMin, entryMax);
    const entryTimeMinutes = parseTimeToMinutes(entry.time) - entryDelay;
    
    // Determine laptop usage (45% chance)
    const isLaptop = rng.random() < pLaptop;
    
    // Calculate dwell time based on laptop usage
    let dwellTime: number;
    if (isLaptop) {
      // Laptop users stay longer: normal(120, 40), min 30
      dwellTime = Math.max(30, Math.round(rng.normalRandom(120, 40)));
    } else {
      // Non-laptop users: normal(40, 15), min 10
      dwellTime = Math.max(10, Math.round(rng.normalRandom(40, 15)));
    }
    
    const exitTimeMinutes = entryTimeMinutes + dwellTime;
    
    rows.push({
      date: entry.date,
      person_id: `P_${i.toString().padStart(6, "0")}`,
      entry_time: minutesToTimeStr(entryTimeMinutes),
      exit_time: minutesToTimeStr(exitTimeMinutes),
      dwell_min: dwellTime,
      laptop: isLaptop,
    });
  }

  return rows;
};

// Analyze fake CCTV data (same format as CctvAnalysisResult)
export const analyzeFakeCctvData = (rows: FakeCctvRow[]) => {
  const hourlyStats: { [key: string]: number } = {};
  const dwellTimes: number[] = [];
  let laptopUsers = 0;
  const totalCustomers = rows.length;

  // Seat location distribution (randomly assigned for visual)
  const seatTypes = ["Window", "Wall", "Center", "Group"];
  const seatDistributionStats: { [key: string]: number } = {};
  const rng = new SeededRandom(12345);

  for (const row of rows) {
    // Parse entry time for hourly flow
    const match = row.entry_time.match(/(\d{2}):/);
    if (match) {
      const hour = `${match[1]}:00`;
      hourlyStats[hour] = (hourlyStats[hour] || 0) + 1;
    }

    // Dwell time
    dwellTimes.push(row.dwell_min);

    // Laptop usage
    if (row.laptop) {
      laptopUsers++;
    }

    // Random seat assignment for distribution chart
    const seatType = seatTypes[rng.randInt(0, 3)];
    seatDistributionStats[seatType] = (seatDistributionStats[seatType] || 0) + 1;
  }

  // Calculate hourly flow
  const hourlyFlow = Object.entries(hourlyStats)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([hour, count]) => ({
      hour,
      customers: count,
    }));

  // Calculate seat distribution
  const seatDistribution = Object.entries(seatDistributionStats).map(([name, value]) => ({
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

  // Calculate rates
  const longStayRate = totalCustomers > 0 
    ? Math.round((veryLongStay / totalCustomers) * 100) 
    : 0;

  const laptopUsageRate = totalCustomers > 0 
    ? Math.round((laptopUsers / totalCustomers) * 100) 
    : 0;

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
