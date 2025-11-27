
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { GroupedCycle } from "@/lib/cycle-service";
import { getInsightsFromCycles } from "@/lib/cycle-analytics";
import { useMemo } from "react";

interface CycleInsightsProps {
    cycles: GroupedCycle[];
}

export function CycleInsights({ cycles }: CycleInsightsProps) {
  const insights = useMemo(() => getInsightsFromCycles(cycles), [cycles]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {insights.map((insight, index) => (
        <Card key={index} className="bg-secondary/40 border-primary/10 hover:shadow-md transition-shadow hover:scale-[1.01] duration-200">
          <CardContent className="p-4">
            <p className="text-foreground/90">{insight}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
