
'use client';

import React, { useMemo } from 'react';
import { useUser, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CalendarDays,
  CircleHelp,
  Heart,
  MessageCircle,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import {
    getCurrentCyclePhase,
    estimateNextPeriodDate,
    getCurrentCycleDay,
    type CycleLog
} from '@/lib/cycle-service';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { DailyFemInsight } from '@/components/info/DailyFemInsight';
import DashboardHeader from '@/components/dashboard-header';
import { CustomChecklist } from '@/components/info/CustomChecklist';
import { GlowTracker } from '@/components/glow-tracker';


const quickActions = [
  {
    href: '/dashboard/cycle-log',
    icon: <CalendarDays />,
    title: 'Track my cycle',
    description: 'Log flow, mood & symptoms',
  },
  {
    href: '/ai-chat',
    icon: <MessageCircle />,
    title: 'Chat with Woomania',
    description: 'Ask anything about your health',
  },
  {
    href: '/ask-doctor',
    icon: <CircleHelp />,
    title: 'Ask a doctor',
    description: 'Share your concern privately',
  },
];

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(
    () => (user ? doc(firestore, `users/${user.uid}/userProfiles`, user.uid) : null),
    [user, firestore]
  );
  const { data: userProfile, isLoading: isLoadingProfile } = useDoc<any>(userProfileRef);

  const displayName = userProfile?.displayName?.split(' ')[0] || 'there';
  const hasCompletedOnboarding = userProfile && userProfile.periodStatus;

  const logsCollectionRef = useMemoFirebase(
      () => (user && firestore ? collection(firestore, `users/${user.uid}/cycleLogs`) : null),
      [user, firestore]
  );
  
  const logsQuery = useMemoFirebase(
      () => (logsCollectionRef ? query(logsCollectionRef, orderBy('date', 'asc')) : null),
      [logsCollectionRef]
  );

  const { data: rawLogs, isLoading: isLoadingLogs } = useCollection<CycleLog>(logsQuery);

  const { currentPhase, nextPeriodDate, cycleDay } = useMemo(() => {
    if (!rawLogs || !hasCompletedOnboarding || rawLogs.length === 0) {
      return { currentPhase: 'Unknown', nextPeriodDate: null, cycleDay: null };
    }
    
    return {
        currentPhase: getCurrentCyclePhase(rawLogs),
        nextPeriodDate: estimateNextPeriodDate(rawLogs),
        cycleDay: getCurrentCycleDay(rawLogs),
    }
  }, [rawLogs, hasCompletedOnboarding]);
  
  const isLoading = isLoadingProfile || isLoadingLogs;

  if (isLoading) {
    return (
        <div className="space-y-8">
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
             <div className="grid gap-8 lg:grid-cols-3">
                <Skeleton className="lg:col-span-2 h-64" />
                <Skeleton className="lg:col-span-1 h-64" />
            </div>
        </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <DashboardHeader name={displayName} nextPeriodDate={nextPeriodDate} />

      <DailyFemInsight />

      {/* Onboarding CTA or Glance */}
      {hasCompletedOnboarding ? (
         <Card className="bg-secondary/60 relative overflow-hidden border-primary/20">
            <CardHeader>
               <CardTitle className="flex items-center gap-2">Today at a glance</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-lg">🌸 You’re likely in your {currentPhase} phase.</p>
                <div className="mt-4 flex flex-col sm:flex-row gap-4">
                    <Button asChild>
                        <Link href="/dashboard/cycle-log">
                            <Plus className="mr-2" /> Log today’s symptoms
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/cycle-log">
                            Add a period day
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
      ) : (
        <Card className="bg-secondary/60 relative overflow-hidden border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                  <Heart className="text-primary animate-pulse-heart" />
                  <span>Complete your cycle setup</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-lg text-muted-foreground">
                    Tell us about your last period and cycle pattern to unlock predictions and personalized insights.
                </p>
                <div className="mt-4">
                    <Button asChild>
                        <Link href="/onboarding/start">
                            Complete Setup
                        </Link>
                    </Button>
                </div>
            </CardContent>
            <Heart className="absolute -right-4 -bottom-8 h-32 w-32 text-primary/10 -rotate-12" />
        </Card>
      )}


      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((action) => (
            <Card key={action.title} className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/80 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <Link href={action.href} className="flex h-full flex-col p-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {React.cloneElement(action.icon, { className: 'h-6 w-6' })}
                    </div>
                    <CardTitle className="text-base font-headline mb-1">
                      {action.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                </Link>
            </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
         <div className="lg:col-span-2">
            <GlowTracker />
        </div>
         <div className="lg:col-span-1">
             <CustomChecklist />
        </div>
      </div>

      {/* Community Teaser */}
      <div className="bg-accent text-accent-foreground rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="text-center md:text-left">
            <h3 className="text-xl font-bold font-headline">You’re not alone here. 💬</h3>
            <p className="opacity-90 mt-1">See what other women are talking about in the community.</p>
        </div>
        <Button variant="outline" className="bg-accent text-accent-foreground border-accent-foreground/50 hover:bg-accent-foreground hover:text-accent" asChild>
            <Link href="/community">Go to Community</Link>
        </Button>
      </div>
    </div>
  );
}
