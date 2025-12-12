import { CheckCircle2 } from "lucide-react";
import { BenchmarkCase } from "@/data/solution-data";
import { IconRenderer } from "./IconRenderer";

interface BenchmarkCardProps {
  caseItem: BenchmarkCase;
}

export const BenchmarkCard = ({ caseItem }: BenchmarkCardProps) => {
  return (
    <div className="group border rounded-xl p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 bg-card">
      {/* 헤더 */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <IconRenderer name={caseItem.iconName} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground mb-0.5">
            {caseItem.brand}
          </p>
          <h4 className="font-bold text-foreground leading-tight">
            {caseItem.strategy}
          </h4>
        </div>
      </div>

      {/* 해결한 문제 */}
      <div className="bg-destructive/5 border border-destructive/10 rounded-lg px-3 py-2 mb-3">
        <p className="text-xs text-destructive font-medium">해결한 문제</p>
        <p className="text-sm text-foreground">{caseItem.problem}</p>
      </div>

      {/* 설명 */}
      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
        {caseItem.description}
      </p>

      {/* 효과 */}
      <div className="flex items-start gap-2 mb-3 bg-success/5 border border-success/10 rounded-lg px-3 py-2">
        <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
        <p className="text-sm text-foreground">{caseItem.effect}</p>
      </div>

      {/* 태그 */}
      <div className="flex flex-wrap gap-1.5">
        {caseItem.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};
