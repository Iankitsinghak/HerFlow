
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { dailyGoals } from '@/lib/daily-goals';
import { Check, Goal } from 'lucide-react';
import { Button } from './ui/button';

export function GentleDailyGoal() {
  const [goal, setGoal] = useState<{ id: number; text: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // This logic ensures the goal is chosen only on the client-side
    // and stays the same for the entire day.
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const goalIndex = dayOfYear % dailyGoals.length;
    setGoal(dailyGoals[goalIndex]);
  }, []);

  const handleComplete = () => {
    setIsCompleted(true);
    // You could optionally add a little celebration animation here!
  };

  if (!goal) {
    return (
        <Card>
            <CardContent className="flex items-center justify-center h-full">
                <p>Loading your goal...</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle className="text-base font-headline flex justify-between items-center">
                Your Gentle Goal Today
                <Goal className="h-5 w-5 text-primary" />
            </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
            <p className="text-sm text-muted-foreground italic">
              "{goal.text}"
            </p>
            <Button
                size="sm"
                onClick={handleComplete}
                disabled={isCompleted}
                variant={isCompleted ? 'secondary' : 'default'}
            >
                {isCompleted ? (
                    <>
                        <Check className="mr-2 h-4 w-4" /> Done!
                    </>
                ) : (
                    'Mark as Done'
                )}
            </Button>
        </CardContent>
    </Card>
  );
}

    