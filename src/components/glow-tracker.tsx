
'use client';

import { useState, useEffect, useTransition, useCallback, useMemo } from 'react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { startOfDay, format } from 'date-fns';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Loader, Sparkles, ChevronDown } from 'lucide-react';
import { getCurrentCyclePhase, type CycleLog } from '@/lib/cycle-service';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy } from 'firebase/firestore';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { generateGlowInsight } from '@/ai/flows/glow-insight-flow';

// --- Types ---
type GlowLog = {
  date: string;
  updatedAt: any;
  skinGlow?: string;
  bloating?: string;
  hairFrizz?: string;
  cravings?: string;
  energy?: string;
  mood?: string;
  aiInsight?: string;
};

export type GlowLogInput = Partial<Omit<GlowLog, 'date' | 'updatedAt' | 'aiInsight'>>;

type Option = { label: string; value: string };
type Category = {
  key: keyof Omit<GlowLog, 'date' | 'updatedAt' | 'aiInsight'>;
  label: string;
  emoji: string;
  options: Option[];
};

// --- Constants ---
const categories: Category[] = [
  {
    key: 'skinGlow',
    label: 'Skin Glow',
    emoji: '🌸',
    options: [
      { label: 'Dull', value: 'dull' },
      { label: 'Normal', value: 'normal' },
      { label: 'Glowy', value: 'glowy' },
    ],
  },
  {
    key: 'energy',
    label: 'Energy',
    emoji: '⚡',
    options: [
      { label: 'Low', value: 'low' },
      { label: 'Okay', value: 'okay' },
      { label: 'High', value: 'high' },
    ],
  },
  {
    key: 'mood',
    label: 'Mood',
    emoji: '💖',
    options: [
      { label: 'Sad', value: 'sad' },
      { label: 'Neutral', value: 'neutral' },
      { label: 'Happy', value: 'happy' },
      { label: 'Anxious', value: 'anxious' },
      { label: 'Irritated', value: 'irritated' },
    ],
  },
  {
    key: 'bloating',
    label: 'Bloating',
    emoji: '💨',
    options: [
      { label: 'None', value: 'none' },
      { label: 'Mild', value: 'mild' },
      { label: 'High', value: 'high' },
    ],
  },
   {
    key: 'cravings',
    label: 'Cravings',
    emoji: '🍫',
    options: [
      { label: 'None', value: 'none' },
      { label: 'Sweet', value: 'sweet' },
      { label: 'Salty', value: 'salty' },
      { label: 'Mixed', value: 'mixed' },
    ],
  },
  {
    key: 'hairFrizz',
    label: 'Hair Frizz',
    emoji: '✨',
    options: [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' },
    ],
  },
];


// --- Pill Component ---
const GlowPill = ({ label, isSelected, onClick }: { label: string; isSelected: boolean; onClick: () => void }) => {
    return (
        <motion.button
            onClick={onClick}
            className={cn(
                "px-4 py-2 text-sm font-medium rounded-full border border-pink-200/80 bg-white/60 dark:bg-fuchsia-950/20 dark:border-fuchsia-800/50 shadow-sm transition-all duration-300",
                isSelected
                ? "text-white bg-gradient-to-br from-pink-500 to-fuchsia-500 border-transparent shadow-lg"
                : "text-pink-800/80 dark:text-pink-200/80 hover:bg-white"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
        >
            {label}
        </motion.button>
    )
};


// --- Main Component ---
export function GlowTracker() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [logData, setLogData] = useState<Partial<GlowLog>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const todayStr = format(startOfDay(new Date()), 'yyyy-MM-dd');
  const glowLogRef = useMemoFirebase(
    () => (user ? doc(firestore, `users/${user.uid}/glowLogs`, todayStr) : null),
    [user, firestore, todayStr]
  );
  
  const logsCollectionRef = useMemoFirebase(
      () => (user && firestore ? collection(firestore, `users/${user.uid}/cycleLogs`) : null),
      [user, firestore]
  );
  
  const logsQuery = useMemoFirebase(
      () => (logsCollectionRef ? query(logsCollectionRef, orderBy('date', 'asc')) : null),
      [logsCollectionRef]
  );

  const { data: rawLogs } = useCollection<CycleLog>(logsQuery);

  const cyclePhase = useMemo(() => rawLogs ? getCurrentCyclePhase(rawLogs) : 'Unknown', [rawLogs]);


  useEffect(() => {
    const fetchLog = async () => {
      if (!glowLogRef) {
          setIsLoading(false);
          return;
      }
      setIsLoading(true);
      try {
        const docSnap = await getDoc(glowLogRef);
        if (docSnap.exists()) {
          setLogData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching glow log:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLog();
  }, [glowLogRef]);

  const handleSelect = useCallback(async (key: string, value: string) => {
    if (!glowLogRef || !user) return;
    
    setIsUpdating(key);
    
    const newLogData = { ...logData, [key]: value };
    setLogData(newLogData);

    try {
        await setDoc(glowLogRef, {
            ...newLogData,
            date: todayStr,
            updatedAt: new Date(),
        }, { merge: true });
        
        // After saving, trigger AI generation
        setIsAiGenerating(true);
        
        // Create a plain object for the server action
        const { date, updatedAt, aiInsight, ...plainLogData } = newLogData;

        const insightResponse = await generateGlowInsight({
            cyclePhase: cyclePhase,
            logData: plainLogData as GlowLogInput
        });

        if (insightResponse.insight) {
            const finalData = { ...newLogData, aiInsight: insightResponse.insight };
            setLogData(finalData);
            await setDoc(glowLogRef, finalData, { merge: true });
        }

    } catch (error) {
        console.error("Error updating glow log:", error);
    } finally {
        setIsUpdating(null);
        setIsAiGenerating(false);
    }

  }, [logData, glowLogRef, user, cyclePhase, todayStr]);

  if (isLoading) {
    return (
      <Card className="bg-rose-50/50 dark:bg-fuchsia-950/10 border-pink-200/50 p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
            <Loader className="h-5 w-5 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading Glow Tracker...</p>
        </div>
      </Card>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className="bg-gradient-to-br from-rose-50/80 to-purple-50/60 dark:from-fuchsia-950/20 dark:to-black/20 p-6 md:p-8 rounded-2xl shadow-md border border-pink-100/50 dark:border-fuchsia-900/30">
            <CollapsibleTrigger className="flex justify-between items-center w-full">
                <div>
                    <CardTitle className="flex items-center gap-3 text-pink-900/80 dark:text-pink-200/90 font-headline text-2xl">
                         <span className="text-2xl">✨</span>
                         Glow Tracker
                    </CardTitle>
                    <CardDescription className="text-left mt-1">How are you feeling in your body today?</CardDescription>
                </div>
                <ChevronDown className={cn("h-6 w-6 text-pink-900/80 dark:text-pink-200/90 transition-transform", isOpen && "rotate-180")} />
            </CollapsibleTrigger>
            
            <CollapsibleContent>
                <div className="space-y-8 mt-8">
                    {categories.map(({ key, label, emoji, options }) => (
                        <div key={key}>
                        <h3 className="flex items-center gap-2 font-semibold text-foreground/90 mb-3">
                            <span>{emoji}</span>
                            <span>{label}</span>
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {options.map((option) => (
                            <GlowPill
                                key={option.value}
                                label={option.label}
                                isSelected={logData[key as keyof GlowLog] === option.value}
                                onClick={() => handleSelect(key, option.value)}
                            />
                            ))}
                        </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 pt-6 border-t border-pink-200/40 dark:border-fuchsia-800/30">
                    <div className="bg-white/80 dark:bg-fuchsia-950/30 border border-pink-100/70 dark:border-fuchsia-800/40 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <Sparkles className="h-5 w-5 text-pink-500 mt-0.5 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-pink-900/90 dark:text-pink-200/90">Today's Glow Insight</h4>
                                <p className="text-sm text-muted-foreground mt-1 min-h-[20px]">
                                    {isAiGenerating 
                                        ? <span className="flex items-center gap-2"><Loader className="h-4 w-4 animate-spin"/> Generating...</span> 
                                        : (logData?.aiInsight || 'Your insight will appear here as you log.')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </CollapsibleContent>
        </Card>
    </Collapsible>
  );
}
