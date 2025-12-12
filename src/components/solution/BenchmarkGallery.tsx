import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";
import { benchmarkCases, categoryLabels, categories } from "@/data/solution-data";
import { BenchmarkCard } from "./BenchmarkCard";

export const BenchmarkGallery = () => {
  return (
    <Card className="border-2 shadow-xl mb-8 animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardTitle className="text-2xl flex items-center gap-3">
          <ShoppingBag className="h-7 w-7 text-primary" />
          벤치마킹 갤러리
        </CardTitle>
        <CardDescription>
          국내외 성공 카페들의 검증된 전략 사례를 확인하세요
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {categories.map((category) => {
          const cases = benchmarkCases.filter((c) => c.category === category);
          const categoryInfo = categoryLabels[category];

          return (
            <div key={category} className="mb-8 last:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className={categoryInfo.color}>
                  {categoryInfo.label}
                </Badge>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cases.map((caseItem) => (
                  <BenchmarkCard key={caseItem.id} caseItem={caseItem} />
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
