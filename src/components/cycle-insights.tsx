
'use client';

import { Card, CardContent } from "@/components/ui/card";

const insights = [
  "✨ Your last 3 cycles were stable between 27–29 days.",
  "🌙 You seem to feel more tired in the luteal phase.",
  "🩸 Heavy flow occurred on Day 2 in 4 of your recent cycles.",
  "🌸 Ovulation usually happens for you around Day 14.",
  "😮‍💨 Bloating is a frequent guest around Day 12–14.",
  "😭 Cramps make an appearance in 70% of your logged cycles.",
];

export function CycleInsights() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {insights.map((insight, index) => (
        <Card key={index} className="bg-secondary/40 border-primary/10 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <p className="text-foreground/90">{insight}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
