
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart2, CalendarDays, Sparkles, Table } from 'lucide-react';
import { Badge } from './ui/badge';

const features = [
  {
    id: 'tracking',
    title: 'Visual Cycle Tracking',
    icon: <CalendarDays />,
    description: 'Log your period, symptoms, and mood. See your history at a glance in a clear, simple table.',
    content: (
        <Card className="w-full h-full bg-white/50 dark:bg-zinc-900/50 p-4">
            <div className="flex justify-between items-center mb-2">
                <p className="font-bold text-sm text-foreground">Log History</p>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
                    <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
                    <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
                </div>
            </div>
            <div className="space-y-2">
                <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-muted-foreground px-2">
                    <span>Cycle</span>
                    <span>Duration</span>
                    <span>Length</span>
                    <span>Symptoms</span>
                </div>
                <div className="space-y-2">
                    <div className="grid grid-cols-4 gap-2 items-center p-2 rounded-lg bg-background/70">
                        <span className="text-xs font-medium">May 15, 2024</span>
                        <span className="text-xs">5 days</span>
                        <span className="text-xs">29 days</span>
                        <div className="flex gap-1">
                            <Badge variant="secondary" className="text-xs">Cramps</Badge>
                            <Badge variant="secondary" className="text-xs">Fatigue</Badge>
                        </div>
                    </div>
                     <div className="grid grid-cols-4 gap-2 items-center p-2 rounded-lg bg-background/70">
                        <span className="text-xs font-medium">Apr 16, 2024</span>
                        <span className="text-xs">5 days</span>
                        <span className="text-xs">28 days</span>
                        <div className="flex gap-1">
                            <Badge variant="secondary" className="text-xs">Bloating</Badge>
                        </div>
                    </div>
                     <div className="grid grid-cols-4 gap-2 items-center p-2 rounded-lg bg-background/70">
                        <span className="text-xs font-medium">Mar 19, 2024</span>
                        <span className="text-xs">6 days</span>
                        <span className="text-xs">28 days</span>
                        <div className="flex gap-1">
                            <Badge variant="secondary" className="text-xs">Cramps</Badge>
                             <Badge variant="secondary" className="text-xs">Headache</Badge>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    ),
  },
  {
    id: 'insights',
    title: 'Visual Health Insights',
    icon: <BarChart2 />,
    description: 'Transform your logs into beautiful, easy-to-read charts that reveal patterns in your cycle length, mood, and symptoms.',
    content: (
        <Card className="w-full h-full bg-white/50 dark:bg-zinc-900/50 p-4">
             <div className="flex justify-between items-center mb-2">
                <p className="font-bold text-sm text-foreground">Cycle Length Trend</p>
            </div>
            <div className="w-full h-40">
                {/* Simplified SVG Chart */}
                <svg width="100%" height="100%" viewBox="0 0 100 50">
                    <path d="M 10 40 C 25 10, 40 10, 55 25 S 85 45, 90 35" fill="none" stroke="hsl(var(--primary))" strokeWidth="2"/>
                    <circle cx="10" cy="40" r="1.5" fill="hsl(var(--primary))" />
                    <circle cx="55" cy="25" r="1.5" fill="hsl(var(--primary))" />
                    <circle cx="90" cy="35" r="1.5" fill="hsl(var(--primary))" />
                    <text x="8" y="48" fontSize="4" fill="hsl(var(--muted-foreground))">Jan</text>
                    <text x="53" y="48" fontSize="4" fill="hsl(var(--muted-foreground))">Feb</text>
                    <text x="88" y="48" fontSize="4" fill="hsl(var(--muted-foreground))">Mar</text>
                </svg>
            </div>
        </Card>
    ),
  },
  {
    id: 'ai-planner',
    title: 'AI Wellness Planner',
    icon: <Sparkles />,
    description: 'Based on your symptoms, our AI companion generates a personalized daily plan to help you feel your best.',
    content: (
         <Card className="w-full h-full bg-white/50 dark:bg-zinc-900/50 p-4">
             <div className="flex justify-between items-center mb-3">
                <p className="font-bold text-sm text-foreground">Your Daily Wellness Plan</p>
            </div>
            <div className="space-y-3 text-left">
                <div className="flex gap-3">
                    <div className="bg-primary/10 text-primary p-2 rounded-full h-fit"><Sparkles className="h-4 w-4" /></div>
                    <div>
                        <p className="font-semibold text-xs text-primary">Morning</p>
                        <p className="text-sm">Start with gentle stretching to ease cramps and boost your mood.</p>
                    </div>
                </div>
                 <div className="flex gap-3">
                    <div className="bg-primary/10 text-primary p-2 rounded-full h-fit"><Sparkles className="h-4 w-4" /></div>
                    <div>
                        <p className="font-semibold text-xs text-primary">Afternoon</p>
                        <p className="text-sm">Enjoy a warm cup of ginger tea to help with bloating and digestion.</p>
                    </div>
                </div>
                 <div className="flex gap-3">
                    <div className="bg-primary/10 text-primary p-2 rounded-full h-fit"><Sparkles className="h-4 w-4" /></div>
                    <div>
                        <p className="font-semibold text-xs text-primary">Evening</p>
                        <p className="text-sm">A warm bath with Epsom salts can help relax your muscles and mind.</p>
                    </div>
                </div>
            </div>
        </Card>
    ),
  },
];

export function TabbedFeatures() {
  const [activeTab, setActiveTab] = useState(features[0].id);

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-4 text-left">
        {features.map((feature) => (
          <motion.div
            key={feature.id}
            onClick={() => setActiveTab(feature.id)}
            className="p-6 rounded-2xl cursor-pointer relative transition-all duration-300"
            animate={{ scale: activeTab === feature.id ? 1 : 0.95 }}
          >
            {activeTab === feature.id && (
              <motion.div
                layoutId="activeFeature"
                className="absolute inset-0 bg-white/70 dark:bg-white/10 rounded-2xl shadow-lg border border-primary/20"
              />
            )}
            <div className="relative z-10 flex gap-4 items-center">
              <div className="bg-primary/10 text-primary p-3 rounded-xl">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-headline font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="relative h-[450px]">
        <AnimatePresence mode="wait">
          {features.map(
            (feature) =>
              activeTab === feature.id && (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <div className="w-full h-full p-2 bg-gradient-to-br from-white/80 to-transparent rounded-3xl shadow-2xl border">
                    {feature.content}
                  </div>
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
