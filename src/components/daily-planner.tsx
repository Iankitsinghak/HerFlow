
'use client';

import { useState, useEffect } from 'react';
import { generatePlanner, type PlannerResponse, type PlannerRequest } from '@/ai/flows/planner-flow';
import { GroupedCycle } from '@/lib/cycle-service';
import { AlertCircle, CheckCircle, Clock, Loader, TriangleAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';

interface DailyPlannerProps {
  cycle: GroupedCycle;
}

export function DailyPlanner({ cycle }: DailyPlannerProps) {
  const [plan, setPlan] = useState<PlannerResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!cycle.symptoms || cycle.symptoms.length === 0) {
        setPlan({
            plan: [
                { time: 'All Day', activity: 'Listen to your body', reason: 'You haven\'t logged any symptoms, which is great! Enjoy your day and remember to be kind to yourself.' },
            ],
            advice: 'It looks like you\'re feeling good! Continue to tune into your body\'s needs and rest when you need to. Hydration is always a great idea.',
            doctorRecommendation: 'normal',
        });
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      try {
        const request: PlannerRequest = { symptoms: cycle.symptoms };
        const response = await generatePlanner(request);
        setPlan(response);
      } catch (err) {
        console.error("Error generating plan:", err);
        setError('Sorry, I couldn\'t generate a plan right now. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlan();
  }, [cycle]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Generating your personal plan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!plan) {
    return null;
  }
  
  const getRecommendation = () => {
    switch (plan.doctorRecommendation) {
        case 'normal':
            return (
                <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Symptoms Status: Normal</AlertTitle>
                    <AlertDescription>
                        Your logged symptoms appear to be common and manageable. Continue to monitor how you feel.
                    </AlertDescription>
                </Alert>
            );
        case 'monitor':
             return (
                <Alert variant="default" className="bg-yellow-50 border-yellow-300 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-700 dark:text-yellow-300">
                    <TriangleAlert className="h-4 w-4 text-yellow-500" />
                    <AlertTitle>Symptoms Status: Monitor</AlertTitle>
                    <AlertDescription>
                        It's a good idea to keep an eye on these symptoms. If they worsen or don't improve, consider seeking medical advice.
                    </AlertDescription>
                </Alert>
            );
        case 'seek_advice':
            return (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Symptoms Status: Seek Advice</AlertTitle>
                    <AlertDescription>
                        Based on your logged symptoms, it would be wise to consult with a healthcare professional for guidance.
                    </AlertDescription>
                </Alert>
            );
    }
  }

  return (
    <div className="space-y-6">
        <div className="space-y-4">
            {plan.plan.map((item, index) => (
                <div key={index} className="flex gap-4 items-start">
                    <div className="flex flex-col items-center">
                        <div className="bg-primary/10 text-primary rounded-full p-2">
                             <Clock className="h-5 w-5" />
                        </div>
                        {index < plan.plan.length - 1 && <div className="w-px h-8 bg-border mt-1"></div>}
                    </div>
                    <div>
                        <p className="font-semibold">{item.time} - <span className="font-bold text-primary">{item.activity}</span></p>
                        <p className="text-sm text-muted-foreground">{item.reason}</p>
                    </div>
                </div>
            ))}
        </div>
      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-sm italic text-foreground/80">{plan.advice}</p>
      </div>
      {getRecommendation()}
    </div>
  );
}
