
'use client';

import { useDailyInsight } from "@/lib/fem-insights";
import { Sparkles } from "lucide-react";

export function DailyFemInsight() {
    const insight = useDailyInsight();

    return (
        <div className="w-full bg-accent/10 text-accent-foreground/90 p-4 rounded-xl border border-accent/20 flex items-center gap-4">
            <div className="shrink-0">
                <Sparkles className="h-6 w-6 text-accent" />
            </div>
            <p className="text-sm md:text-base font-medium">
                <span className="font-bold text-accent mr-1">Today's Insight:</span>
                {insight}
            </p>
        </div>
    );
}
