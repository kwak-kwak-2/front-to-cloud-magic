import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Recommendation {
  title: string;
  description: string;
  expected_impact?: string;
}

interface RecommendationsListProps {
  recommendations: Recommendation[];
}

const RecommendationsList = ({ recommendations }: RecommendationsListProps) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <Card className="border-2 mb-8 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl">맞춤형 개선 방안</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="bg-success/10 border border-success/30 rounded-lg p-4"
            >
              <h4 className="font-semibold text-lg mb-2">{rec.title}</h4>
              <p className="text-foreground/80">{rec.description}</p>
              {rec.expected_impact && (
                <p className="text-sm text-success mt-2 font-medium">
                  예상 효과: {rec.expected_impact}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationsList;
