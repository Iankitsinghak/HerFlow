
'use client';

import { useMemo } from 'react';

// A curated list of gentle, daily insights for women.
const insights = [
    // Period Phase
    "Your body is working hard. It's okay to slow down and rest today.",
    "Cramps are a sign to be gentle with yourself. A warm pack can be a good friend.",
    "Listen to your body's cravings. A little dark chocolate is full of magnesium!",
    "Your skin may be extra sensitive today; moisturize gently.",
    "Energy dipping? Totally normal for this phase. Prioritize rest.",
    "Hydration is extra important during your period. Keep that water bottle close.",

    // Follicular Phase
    "As your energy returns, it's a great time to start something new.",
    "Your creativity might be higher now. A perfect time to journal or brainstorm.",
    "Feeling more social? That's your hormones giving you a little nudge to connect.",
    "Your body is preparing for ovulation. Light exercise can feel amazing right now.",
    
    // Ovulation Phase
    "You might be feeling a peak in energy and confidence. Enjoy it!",
    "This is your most fertile time. Be mindful of what your body needs.",
    "Communication can feel easier right now. A good day for important conversations.",

    // Luteal Phase
    "It's normal for your mood to shift. Be patient and kind with your feelings.",
    "You may crave sweet or salty things—no guilt, just listen to your body's signals.",
    "Feeling a bit bloated? It's a common guest in this phase. Comfy clothes are a must.",
    "Slow down today. Your hormones want softness and self-care.",
    "If you're feeling more inward, that's okay. It's a time for reflection.",
    "A gentle walk can do wonders for pre-menstrual tension.",
    "Your sleep is extra precious now. Try to wind down a little earlier.",
];

/**
 * A hook to get a deterministic "daily" insight from the list.
 * It uses the day of the year to pick an insight, ensuring it's the same
 * for the entire day but changes the next day.
 */
export function useDailyInsight() {
    const dailyInsight = useMemo(() => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now.getTime() - start.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        
        const insightIndex = dayOfYear % insights.length;
        return insights[insightIndex];
    }, []);

    return dailyInsight;
}
