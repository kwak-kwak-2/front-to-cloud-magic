import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  subtitle: string;
  value: string | number;
  Icon: LucideIcon;
  iconColorClass: string;
  valueColorClass: string;
}

const MetricCard = ({
  title,
  subtitle,
  value,
  Icon,
  iconColorClass,
  valueColorClass,
}: MetricCardProps) => {
  return (
    <Card className="border-2">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-xs text-muted-foreground mb-1">{subtitle}</p>
            <p className={`text-2xl font-bold mt-2 ${valueColorClass}`}>
              {value}
            </p>
          </div>
          <Icon className={`h-10 w-10 ${iconColorClass}`} />
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
