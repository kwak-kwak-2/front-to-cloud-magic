import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface CustomerFlowChartProps {
  data: { hour: string; customers: number }[];
}

const CustomerFlowChart = ({ data }: CustomerFlowChartProps) => {
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <Card className="border-2 animate-fade-in">
      <CardHeader>
        <CardTitle>시간대별 고객 유입</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          CCTV 데이터 기반 (입장 시간)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="customers" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm text-center">
            업로드된 데이터에서 시간 정보를 찾지 못해
            <br />
            시간대별 고객 유입 그래프를 표시할 수 없습니다.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerFlowChart;
