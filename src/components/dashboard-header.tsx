
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

interface DashboardHeaderProps {
    name: string;
    nextPeriodDate: Date | null;
}

const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
};


export default function DashboardHeader({ name, nextPeriodDate }: DashboardHeaderProps) {
    const [greeting, setGreeting] = useState('');
    const todayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setGreeting(getGreeting());
    }, []);

    const monthDays = useMemo(() => {
        const today = new Date();
        const start = startOfMonth(today);
        const end = endOfMonth(today);
        return eachDayOfInterval({ start, end });
    }, []);

    useEffect(() => {
        if (todayRef.current) {
            todayRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, [monthDays]);

    return (
        <div>
            <h1 className="text-3xl font-bold font-headline">
                {greeting}, {name}!
            </h1>
            <div className="mt-6">
                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex w-max space-x-2 text-center pb-4">
                        {monthDays.map(day => {
                            const isPredicted = nextPeriodDate && isSameDay(day, nextPeriodDate);
                            return (
                                <div
                                    key={day.toISOString()}
                                    className="flex flex-col items-center"
                                    ref={isToday(day) ? todayRef : null}
                                >
                                    <p className="text-sm font-semibold text-muted-foreground">{format(day, 'E')}</p>
                                    <div className={cn(
                                        "relative mt-2 flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold transition-colors",
                                        isToday(day) 
                                            ? "bg-primary text-primary-foreground" 
                                            : "bg-secondary text-secondary-foreground hover:bg-primary/10",
                                        isPredicted && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                                    )}>
                                        {format(day, 'd')}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                     <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </div>
    )
}
