import { Problem, getSeverityColor, getSeverityLabel } from "@/data/solution-data";

interface ProblemCardProps {
  problem: Problem;
}

export const ProblemCard = ({ problem }: ProblemCardProps) => {
  return (
    <div className={`border rounded-xl p-5 ${getSeverityColor(problem.severity)}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`text-xs font-bold px-2 py-1 rounded ${getSeverityColor(
                problem.severity
              )}`}
            >
              {getSeverityLabel(problem.severity)}
            </span>
            <h3 className="text-lg font-semibold text-foreground">
              {problem.title}
            </h3>
          </div>
          <p className="text-muted-foreground">{problem.description}</p>
        </div>
        {problem.metricValue && (
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold text-foreground">
              {problem.metricValue}
            </p>
            <p className="text-xs text-muted-foreground">{problem.metric}</p>
          </div>
        )}
      </div>
    </div>
  );
};
