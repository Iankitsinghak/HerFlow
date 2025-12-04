
'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Droplets, Leaf, Sparkles, Moon } from "lucide-react";

const phasesData = [
    {
        icon: <Droplets className="h-8 w-8 text-red-500" />,
        title: 'Menstrual Phase (Day 1-5)',
        body: "This is when you get your period. The lining of your uterus sheds because pregnancy didn't happen.",
        expect: "It's normal to feel tired, have cramps, and experience lower back pain. Rest is your best friend."
    },
    {
        icon: <Leaf className="h-8 w-8 text-green-500" />,
        title: 'Follicular Phase (Day 1-13)',
        body: "After your period ends, your body prepares to release an egg. Estrogen levels rise, which can boost your mood and energy.",
        expect: "You might feel more energetic, confident, and sociable. It's a great time to be active and start new projects."
    },
    {
        icon: <Sparkles className="h-8 w-8 text-yellow-500" />,
        title: 'Ovulation Phase (Day 14)',
        body: "Your ovary releases a mature egg. This is your most fertile time. You might notice a peak in energy and libido.",
        expect: "This is often when you feel your best, both physically and emotionally. Some women experience mild ovulation pain."
    },
    {
        icon: <Moon className="h-8 w-8 text-indigo-500" />,
        title: 'Luteal Phase (Day 15-28)',
        body: "If the egg isn't fertilized, hormone levels (like progesterone) rise and then fall, preparing for your next period.",
        expect: "This is when PMS (premenstrual syndrome) can occur. You might feel moody, bloated, or have cravings. It's a time for self-care."
    }
];

export function CyclePhasesGuide() {
    return (
        <section>
             <div className="text-center mb-10">
                <h2 className="text-3xl font-bold font-headline">Understanding Your Cycle Phases</h2>
                <p className="text-muted-foreground mt-2">Your body has a natural rhythm. Here’s what’s happening at each stage.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {phasesData.map(phase => (
                    <Card key={phase.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-primary/10 bg-white/50 dark:bg-card/50 backdrop-blur-lg rounded-2xl overflow-hidden flex flex-col">
                        <CardHeader className="bg-primary/5 p-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-white p-3 rounded-full shadow-inner-soft">
                                    {phase.icon}
                                </div>
                                <CardTitle className="text-lg font-headline">{phase.title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 flex-grow flex flex-col justify-between">
                            <p className="text-muted-foreground text-sm leading-relaxed">{phase.body}</p>
                            <div className="mt-4 pt-4 border-t border-dashed">
                                <p className="text-sm font-semibold text-primary/90">What to expect:</p>
                                <p className="text-sm text-muted-foreground">{phase.expect}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    )
}
