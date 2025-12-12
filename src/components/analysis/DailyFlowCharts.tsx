import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";

interface DailyFlow {
  date: string;
  hourlyData: { hour: string; customers: number }[];
}

interface DailyFlowChartsProps {
  data: DailyFlow[];
}

const DailyFlowCharts = ({ data }: DailyFlowChartsProps) => {
  const [selectedDate, setSelectedDate] = useState<string>("all");

  // 날짜 포맷팅 함수 (표시용)
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  // 날짜 포맷팅 함수 (짧은 버전)
  const formatDateShort = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
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
              POS 데이터 기반 - {selectedDate === "all" ? `${data.length}일간의` : formatDate(selectedDate)} 시간대별 고객 수 추이
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="날짜 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 보기</SelectItem>
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
          // 전체 보기: 그리드 형태로 작은 차트들
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[800px] overflow-y-auto pr-2">
            {filteredData.map((dailyData) => (
              <div
                key={dailyData.date}
                className="bg-secondary/30 rounded-lg p-3 border border-border/50 cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setSelectedDate(dailyData.date)}
              >
                <p className="text-sm font-medium text-foreground mb-2">
                  {formatDateShort(dailyData.date)}
                </p>
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={dailyData.hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis
                      dataKey="hour"
                      tick={{ fontSize: 9 }}
                      stroke="hsl(var(--muted-foreground))"
                      tickFormatter={(v) => v.replace(":00", "")}
                    />
                    <YAxis
                      tick={{ fontSize: 9 }}
                      stroke="hsl(var(--muted-foreground))"
                      width={25}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [`${value}명`, "고객"]}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="customers"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 2, fill: "hsl(var(--primary))" }}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ))}
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
