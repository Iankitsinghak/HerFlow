
'use client';

import { useState, useEffect, useMemo } from 'react';
import { format, startOfWeek, addDays, isToday } from 'date-fns';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
    name: string;
}

const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
};


export default function DashboardHeader({ name }: DashboardHeaderProps) {
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        setGreeting(getGreeting());
    }, []);

    const weekDays = useMemo(() => {
        const start = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
        return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold font-headline">
                {greeting}, {name}!
            </h1>
            <div className="mt-6">
                <div className="grid grid-cols-7 gap-2 text-center">
                    {weekDays.map(day => (
                        <div key={day.toISOString()} className="flex flex-col items-center">
                            <p className="text-sm font-semibold text-muted-foreground">{format(day, 'E')}</p>
                            <div className={cn(
                                "mt-2 flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold transition-colors",
                                isToday(day) 
                                    ? "bg-primary text-primary-foreground" 
                                    : "bg-secondary text-secondary-foreground hover:bg-primary/10"
                            )}>
                                {format(day, 'd')}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
