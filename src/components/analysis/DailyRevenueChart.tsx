import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp } from "lucide-react";

interface DailyRevenue {
  date: string;
  revenue: number;
  customers: number;
}

interface DailyRevenueChartProps {
  data: DailyRevenue[];
}

const DailyRevenueChart = ({ data }: DailyRevenueChartProps) => {
  const [viewMode, setViewMode] = useState<string>("bar");

  // 날짜 포맷팅 함수
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 정렬된 데이터
  const sortedData = useMemo(() => {
    return [...data]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(d => ({
        ...d,
        displayDate: formatDate(d.date),
        formattedRevenue: d.revenue.toLocaleString(),
      }));
  }, [data]);

  // 통계 계산
  const stats = useMemo(() => {
    if (data.length === 0) return { total: 0, avg: 0, max: 0, maxDate: "", min: 0, minDate: "" };
    
    const total = data.reduce((sum, d) => sum + d.revenue, 0);
    const avg = Math.round(total / data.length);
    
    let maxRevenue = data[0];
    let minRevenue = data[0];
    data.forEach(d => {
      if (d.revenue > maxRevenue.revenue) maxRevenue = d;
      if (d.revenue < minRevenue.revenue) minRevenue = d;
    });

    return {
      total,
      avg,
      max: maxRevenue.revenue,
      maxDate: formatDate(maxRevenue.date),
      min: minRevenue.revenue,
      minDate: formatDate(minRevenue.date),
    };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <Card className="border-2 animate-fade-in">
        <CardHeader>
          <CardTitle>일별 매출 현황</CardTitle>
          <CardDescription>POS 데이터의 매출 정보가 필요합니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
            매출 데이터를 찾을 수 없습니다.
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
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              일별 매출 현황
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              POS 데이터 기반 - {data.length}일간 매출 추이
            </CardDescription>
          </div>
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">막대 그래프</SelectItem>
              <SelectItem value="stats">통계 보기</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "bar" ? (
          <div className="bg-secondary/30 rounded-lg p-6 border border-border/50">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={sortedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                  width={70}
                  tickFormatter={(value) => `${(value / 10000).toFixed(0)}만`}
                  label={{ value: '매출 (원)', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' } }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "13px",
                    padding: "12px",
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()}원`, "매출"]}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                  {sortedData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.revenue === stats.max 
                        ? "hsl(var(--primary))" 
                        : entry.revenue === stats.min 
                          ? "hsl(var(--destructive))" 
                          : "hsl(var(--accent))"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-primary"></span> 최고 매출
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-destructive"></span> 최저 매출
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-accent"></span> 일반
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-secondary/30 rounded-lg p-4 border border-border/50 text-center">
              <p className="text-xs text-muted-foreground mb-1">총 매출</p>
              <p className="text-2xl font-bold text-primary">{stats.total.toLocaleString()}원</p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-4 border border-border/50 text-center">
              <p className="text-xs text-muted-foreground mb-1">일평균 매출</p>
              <p className="text-2xl font-bold text-foreground">{stats.avg.toLocaleString()}원</p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-4 border border-border/50 text-center">
              <p className="text-xs text-muted-foreground mb-1">최고 매출 ({stats.maxDate})</p>
              <p className="text-2xl font-bold text-primary">{stats.max.toLocaleString()}원</p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-4 border border-border/50 text-center">
              <p className="text-xs text-muted-foreground mb-1">최저 매출 ({stats.minDate})</p>
              <p className="text-2xl font-bold text-destructive">{stats.min.toLocaleString()}원</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyRevenueChart;
