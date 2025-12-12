import { CheckCircle2, Building2 } from "lucide-react";
import { SolutionItem } from "@/data/solution-data";
import { IconRenderer } from "./IconRenderer";

interface SolutionCardProps {
  solution: SolutionItem;
  index: number;
}

export const SolutionCard = ({ solution, index }: SolutionCardProps) => {
  return (
    <div className="border-2 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary shrink-0">
            <IconRenderer name={solution.iconName} className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-2">
              {index + 1}. {solution.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {solution.description}
            </p>
          </div>
        </div>
      </div>

      {/* 벤치마킹 사례 */}
      <div className="bg-secondary/30 p-5 border-t">
        <div className="flex items-start gap-3">
          <Building2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-accent mb-1">
              {solution.benchmarkCafe}에서 이미 적용 중
            </p>
            <p className="text-sm text-muted-foreground">
              {solution.benchmarkDescription}
            </p>
          </div>
        </div>
      </div>

      {/* 예상 효과 */}
      <div className="bg-success/5 p-4 border-t flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
        <p className="text-sm">
          <span className="font-semibold text-success">예상 효과:</span>{" "}
          <span className="text-foreground">{solution.expectedImpact}</span>
        </p>
      </div>
    </div>
  );
};
