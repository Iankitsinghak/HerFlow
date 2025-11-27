
'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, LineChart, PieChart } from 'lucide-react';

export function CycleGraphs() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-primary" />
            Cycle Length Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Chart coming soon!</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-primary" />
            Flow Intensity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Chart coming soon!</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-primary" />
            Mood Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Chart coming soon!</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary" />
            Symptoms Frequency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Chart coming soon!</p>
        </CardContent>
      </Card>
    </div>
  );
}
