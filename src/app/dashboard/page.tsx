
'use client';

import { useMemo, cloneElement } from 'react';
import { useUser, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CalendarDays,
  CircleHelp,
  Heart,
  MessageCircle,
  Newspaper,
  Plus,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import {
    getCurrentCyclePhase,
    estimateNextPeriodDate,
    type CycleLog
} from '@/lib/cycle-service';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

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
    title: 'Chat with Woomania AI',
    description: 'Ask anything about your health',
  },
  {
    href: '/blog',
    icon: <Newspaper />,
    title: 'Read stories & blogs',
    description: 'See real experiences & doctor tips',
  },
  {
    href: '/ask-doctor',
    icon: <CircleHelp />,
    title: 'Ask a doctor',
    description: 'Share your concern privately',
  },
];

const recommendedPosts = [
    { id: 1, title: "Living with PCOS: One girl’s story", image: "https://picsum.photos/seed/pcos1/400/225", imageHint: "woman portrait thoughtful" },
    { id: 2, title: "Period pain vs PCOS pain – what’s the difference?", image: "https://picsum.photos/seed/pcos2/400/225", imageHint: "health infographic" },
    { id: 3, title: "5 small habits to support your hormones", image: "https://picsum.photos/seed/pcos3/400/225", imageHint: "healthy food" },
]

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

  const { currentPhase, nextPeriodDate } = useMemo(() => {
    if (!rawLogs || !hasCompletedOnboarding || rawLogs.length === 0) return { currentPhase: 'Unknown', nextPeriodDate: null };
    
    return {
        currentPhase: getCurrentCyclePhase(rawLogs),
        nextPeriodDate: estimateNextPeriodDate(rawLogs)
    }
  }, [rawLogs, hasCompletedOnboarding]);

  const isLoading = isLoadingProfile || isLoadingLogs;

  if (isLoading) {
    return (
        <div className="space-y-8">
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-40 w-full" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold font-headline">
          Hi {displayName}, welcome to Woomania 💗
        </h1>
        <p className="text-muted-foreground mt-1">
          Based on your info, we’ll help you track your cycle, understand
          symptoms, and explore real stories.
        </p>
      </div>

      {/* Today at a glance / Onboarding CTA */}
      <Card className="bg-secondary/60 relative overflow-hidden animate-background-shine bg-[linear-gradient(110deg,#F8E0E8,45%,#FDF6F8,55%,#F8E0E8)] bg-[length:250%_100%]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {hasCompletedOnboarding ? (
                'Today at a glance'
            ) : (
                <>
                <Heart className="text-primary animate-pulse-heart" />
                <span>Complete your cycle setup</span>
                </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
           {hasCompletedOnboarding ? (
            <>
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
            </>
           ) : (
             <>
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
            </>
           )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Link href={action.href} key={action.title}>
            <Card className="h-full hover:bg-muted/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 text-primary p-2 rounded-lg">
                    {cloneElement(action.icon, { className: 'h-6 w-6' })}
                  </div>
                  <div>
                    <CardTitle className="text-base font-headline">
                      {action.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Your cycle overview */}
        <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-bold font-headline">Your cycle overview</h2>
            <Card>
                <CardContent className="pt-6 space-y-3">
                {!hasCompletedOnboarding ? (
                    <>
                        <p className="text-muted-foreground">
                            You haven’t logged any cycle data yet.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            👉 Start by completing your setup to see patterns here.
                        </p>
                    </>
                ) : (
                    <>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Next Predicted Period</span>
                            <span className="font-semibold">{nextPeriodDate ? format(nextPeriodDate, 'MMM dd, yyyy') : 'N/A'}</span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Current Phase</span>
                            <span className="font-semibold">{currentPhase}</span>
                        </div>
                    </>
                )}
                </CardContent>
            </Card>
        </div>

        {/* Recommended for you */}
        <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold font-headline">Recommended for you 💌</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedPosts.map(post => (
                     <Link href={`/blog/${post.id}`} key={post.id} className="group">
                        <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-xl">
                            <Image src={post.image} alt={post.title} width={400} height={225} className="w-full object-cover aspect-video" data-ai-hint={post.imageHint} />
                            <CardContent className="p-4">
                                <h3 className="font-headline text-sm font-semibold group-hover:text-primary transition-colors">{post.title}</h3>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
      </div>

      {/* Community Teaser */}
      <div className="bg-accent text-accent-foreground rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
            <h3 className="text-xl font-bold font-headline">You’re not alone here. 💬</h3>
            <p>See what other women are talking about in the community.</p>
        </div>
        <Button variant="outline" className="bg-accent text-accent-foreground border-accent-foreground hover:bg-accent-foreground hover:text-accent" asChild>
            <Link href="/community">Go to Community</Link>
        </Button>
      </div>
    </div>
  );
}
