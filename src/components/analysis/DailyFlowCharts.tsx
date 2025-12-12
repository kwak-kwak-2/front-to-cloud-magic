import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DailyFlow {
  date: string;
  hourlyData: { hour: string; customers: number }[];
}

interface DailyFlowChartsProps {
  data: DailyFlow[];
}

const DailyFlowCharts = ({ data }: DailyFlowChartsProps) => {
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

  // 날짜 포맷팅 함수
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <Card className="border-2 animate-fade-in">
      <CardHeader>
        <CardTitle>일별 시간대 고객 흐름</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          POS 데이터 기반 - {data.length}일간의 시간대별 고객 수 추이
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[800px] overflow-y-auto pr-2">
          {data.map((dailyData) => (
            <div
              key={dailyData.date}
              className="bg-secondary/30 rounded-lg p-3 border border-border/50"
            >
              <p className="text-sm font-medium text-foreground mb-2">
                {formatDate(dailyData.date)}
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
      </CardContent>
    </Card>
  );
};

export default DailyFlowCharts;
