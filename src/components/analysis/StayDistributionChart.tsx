import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--warning))", "hsl(var(--info))"];

interface StayDistributionChartProps {
  data: { name: string; value: number }[];
}

const StayDistributionChart = ({ data }: StayDistributionChartProps) => {
  return (
    <Card className="border-2 animate-fade-in">
      <CardHeader>
        <CardTitle>체류 시간 분포</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          CCTV 데이터 기반 (Dwell_Time_min)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="hsl(var(--primary))"
              dataKey="value"
            >
              {data.map((_: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default StayDistributionChart;
