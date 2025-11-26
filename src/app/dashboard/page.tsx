
'use client';

import { useUser } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CalendarDays,
  CircleHelp,
  MessageCircle,
  Newspaper,
  Plus,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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
  const displayName = user?.displayName?.split(' ')[0] || 'there';

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

      {/* Today at a glance */}
      <Card className="bg-secondary">
        <CardHeader>
          <CardTitle>Today at a glance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">🌸 You’re likely in your follicular phase.</p>
          <div className="mt-4 flex gap-4">
            <Button>
              <Plus className="mr-2" /> Log today’s symptoms
            </Button>
            <Button variant="outline">Add a period day</Button>
          </div>
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
                    {React.cloneElement(action.icon, { className: 'h-6 w-6' })}
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
                <CardContent className="pt-6">
                <p className="text-muted-foreground">
                    You haven’t logged any cycle data yet.
                </p>
                <p className="text-muted-foreground mt-2">
                    👉 Start with “Add your last period” or “Log today” to see patterns here.
                </p>
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
