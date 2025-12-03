
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { dailyGoals } from '@/lib/daily-goals';
import { Check, Flame, X } from 'lucide-react';
import { Button } from './ui/button';
import { useUser, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';

export function GentleDailyGoal() {
  const { user } = useUser();
  const firestore = useFirestore();

  const [goal, setGoal] = useState<{ id: number; text: string } | null>(null);
  const [isDoneToday, setIsDoneToday] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBreathing, setIsBreathing] = useState(false);

  // --- Data References ---
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  
  const checkInRef = useMemoFirebase(
    () => (user ? doc(firestore, `users/${user.uid}/dailyCheckins`, todayStr) : null),
    [user, firestore, todayStr]
  );
  
  const streakRef = useMemoFirebase(
    () => (user ? doc(firestore, `users/${user.uid}/streaks`, 'current') : null),
    [user, firestore]
  );

  const { data: checkInData, isLoading: isCheckinLoading } = useDoc<any>(checkInRef);
  const { data: streakData, isLoading: isStreakLoading } = useDoc<any>(streakRef);

  const currentStreak = streakData?.currentStreak || 0;

  // --- Effects ---

  // Set the daily goal based on the day of the year
  useEffect(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const goalIndex = dayOfYear % dailyGoals.length;
    setGoal(dailyGoals[goalIndex]);
  }, []);

  // Check if the goal is already done for today
  useEffect(() => {
    if (checkInData) {
      setIsDoneToday(true);
    } else {
      setIsDoneToday(false);
    }
  }, [checkInData]);
  
  // Handle the breathing animation timeout
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBreathing) {
        timer = setTimeout(() => setIsBreathing(false), 60000); // 1 minute
    }
    return () => clearTimeout(timer);
  }, [isBreathing]);


  // --- Handlers ---

  const handleComplete = async () => {
    if (!user || !firestore || !streakRef || !checkInRef) return;

    setIsSubmitting(true);
    try {
        // 1. Mark today as done
        await setDoc(checkInRef, { date: todayStr, doneAt: serverTimestamp() });

        // 2. Client-side streak calculation
        const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');
        const lastCheckinDate = streakData?.lastCheckinDate;

        let newStreak = 1;
        if (lastCheckinDate === yesterdayStr) {
            newStreak = (streakData?.currentStreak || 0) + 1;
        } else if (lastCheckinDate === todayStr) {
            newStreak = streakData?.currentStreak || 1;
        }

        const newBest = Math.max(streakData?.bestStreak || 0, newStreak);

        // 3. Update streak document
        await setDoc(streakRef, {
            currentStreak: newStreak,
            bestStreak: newBest,
            lastCheckinDate: todayStr,
            updatedAt: serverTimestamp()
        }, { merge: true });

        setIsDoneToday(true);

    } catch (error) {
        console.error("Error completing goal:", error);
    } finally {
        setIsSubmitting(false);
    }
  };


  if (!goal || isStreakLoading) {
    return (
        <Card className="h-full">
            <CardContent className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Loading your goal...
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="w-full h-full flex flex-col justify-between">
        <CardHeader>
            <CardTitle className="text-base font-headline flex justify-between items-center">
                Your Gentle Goal Today
            </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col items-center justify-center text-center space-y-4">
            <p className="text-sm text-muted-foreground italic max-w-xs">
              "{goal.text}"
            </p>
            <div className="flex items-center gap-4 pt-2">
                <Button
                    size="sm"
                    onClick={handleComplete}
                    disabled={isDoneToday || isSubmitting}
                    variant={isDoneToday ? 'secondary' : 'default'}
                    className="w-28"
                >
                    {isDoneToday ? (
                        <>
                            <Check className="mr-2 h-4 w-4" /> Done!
                        </>
                    ) : isSubmitting ? "Saving..." : (
                        'Mark as Done'
                    )}
                </Button>
                
                <div className="relative flex items-center justify-center w-28 h-12">
                    {isBreathing && (
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="h-8 w-8 bg-pink-200 rounded-full animate-[breath_8s_ease-in-out_infinite]"></div>
                        </div>
                    )}
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsBreathing(true)}
                        disabled={isBreathing}
                        className={cn("transition-opacity", isBreathing ? 'opacity-0' : 'opacity-100')}
                    >
                       Start 1-min Breath
                    </Button>
                    {isBreathing && (
                        <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-6 w-6" onClick={() => setIsBreathing(false)}>
                            <X className="h-3 w-3"/>
                        </Button>
                    )}
                </div>

                <style jsx>{`
                    @keyframes breath {
                        0% { transform: scale(0.6); opacity: 0.7; }
                        50% { transform: scale(1); opacity: 1; }
                        100% { transform: scale(0.6); opacity: 0.7; }
                    }
                    .animate-breath {
                        animation: breath 8s ease-in-out infinite;
                    }
                `}</style>
            </div>
        </CardContent>
        <CardContent>
            <div className="flex justify-center">
                 <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-900/50 px-3 py-1 text-xs font-medium text-amber-800 dark:text-amber-300">
                    <Flame className="h-4 w-4"/>
                    <span>
                        {currentStreak > 0 ? `${currentStreak}-day gentle streak` : "Start your gentle streak"}
                    </span>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
