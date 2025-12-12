import { SolutionItem } from "@/data/solution-data";
import { IconRenderer } from "./IconRenderer";

interface AdditionalSolutionCardProps {
  solution: SolutionItem;
}

export const AdditionalSolutionCard = ({ solution }: AdditionalSolutionCardProps) => {
  return (
    <div className="border rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center text-accent shrink-0">
          <IconRenderer name={solution.iconName} />
        </div>
        <div>
          <h4 className="font-semibold text-foreground">{solution.title}</h4>
          <p className="text-xs text-accent mt-1">
            📍 {solution.benchmarkCafe} 벤치마킹
          </p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2">
        {solution.description}
      </p>
    </div>
  );
};
