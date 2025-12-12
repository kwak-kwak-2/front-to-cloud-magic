import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";

interface DailyFlow {
  date: string;
  hourlyData: { hour: string; customers: number }[];
}

interface DailyFlowChartsProps {
  data: DailyFlow[];
}

// 색상 팔레트 생성 (31일치)
const generateColors = (count: number) => {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    const hue = (i * 360) / count;
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }
  return colors;
};

const COLORS = generateColors(31);

const DailyFlowCharts = ({ data }: DailyFlowChartsProps) => {
  const [selectedDate, setSelectedDate] = useState<string>("all");

  // 날짜 포맷팅 함수 (표시용)
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  // 날짜에서 일자만 추출
  const getDayNumber = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.getDate();
  };

  // 선택된 날짜에 따라 필터링된 데이터
  const filteredData = useMemo(() => {
    if (selectedDate === "all") {
      return data;
    }
    return data.filter((d) => d.date === selectedDate);
  }, [data, selectedDate]);

  // 정렬된 날짜 목록 (선택 옵션용)
  const sortedDates = useMemo(() => {
    return [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  // 전체 보기용 통합 데이터 생성 (모든 날짜를 하나의 차트에)
  const combinedChartData = useMemo(() => {
    // 모든 시간대 수집
    const allHours = new Set<string>();
    data.forEach(d => {
      d.hourlyData.forEach(h => allHours.add(h.hour));
    });
    
    const sortedHours = Array.from(allHours).sort();
    
    // 각 시간대별로 모든 날짜의 데이터를 포함하는 객체 생성
    return sortedHours.map(hour => {
      const hourData: { [key: string]: number | string } = { hour };
      data.forEach((dailyData, index) => {
        const dayNum = getDayNumber(dailyData.date);
        const hourEntry = dailyData.hourlyData.find(h => h.hour === hour);
        hourData[`day${dayNum}`] = hourEntry?.customers || 0;
      });
      return hourData;
    });
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <Card className="border-2 animate-fade-in">
        <CardHeader>
          <CardTitle>일별 시간대 고객 흐름</CardTitle>
          <CardDescription>POS 데이터의 날짜 정보가 필요합니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
            날짜별 데이터를 찾을 수 없습니다.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 animate-fade-in">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>일별 시간대 고객 흐름</CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              POS 데이터 기반 - {selectedDate === "all" ? `${data.length}일간 비교` : formatDate(selectedDate)} 시간대별 고객 수 추이
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="날짜 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 보기 (비교)</SelectItem>
                {sortedDates.map((dailyData) => (
                  <SelectItem key={dailyData.date} value={dailyData.date}>
                    {formatDate(dailyData.date)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {selectedDate === "all" ? (
          // 전체 보기: 모든 날짜를 하나의 차트에 오버레이
          <div className="bg-secondary/30 rounded-lg p-6 border border-border/50">
            <p className="text-sm font-medium text-muted-foreground mb-4">
              한 달간 일별 시간대 고객 흐름 비교 (총 {data.length}일)
            </p>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={combinedChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(v) => v.replace(":00", "시")}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                  width={40}
                  label={{ value: '고객 수', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' } }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                    maxHeight: "300px",
                    overflowY: "auto",
                  }}
                  formatter={(value: number, name: string) => {
                    const dayNum = name.replace("day", "");
                    return [`${value}명`, `${dayNum}일`];
                  }}
                  labelFormatter={(label) => `${label}`}
                />
                <Legend 
                  wrapperStyle={{ fontSize: "10px", maxHeight: "60px", overflowY: "auto" }}
                  formatter={(value: string) => {
                    const dayNum = value.replace("day", "");
                    return `${dayNum}일`;
                  }}
                />
                {sortedDates.map((dailyData, index) => {
                  const dayNum = getDayNumber(dailyData.date);
                  return (
                    <Line
                      key={dailyData.date}
                      type="monotone"
                      dataKey={`day${dayNum}`}
                      stroke={COLORS[dayNum - 1] || COLORS[index % COLORS.length]}
                      strokeWidth={1.5}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              특정 날짜를 자세히 보려면 위 드롭다운에서 날짜를 선택하세요
            </p>
          </div>
        ) : (
          // 특정 날짜 선택: 큰 차트 하나
          <div className="bg-secondary/30 rounded-lg p-6 border border-border/50">
            <p className="text-lg font-semibold text-foreground mb-4">
              {formatDate(selectedDate)} 시간대별 고객 흐름
            </p>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={filteredData[0]?.hourlyData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(v) => v.replace(":00", "시")}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                  width={40}
                  label={{ value: '고객 수', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: 'hsl(var(--muted-foreground))' } }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "14px",
                    padding: "12px",
                  }}
                  formatter={(value: number) => [`${value}명`, "고객 수"]}
                  labelFormatter={(label) => `${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="customers"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "hsl(var(--primary))" }}
                  activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2, fill: "hsl(var(--background))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyFlowCharts;
