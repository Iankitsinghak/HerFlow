
'use client';

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, CalendarDays, Droplets, Waves, MoreHorizontal, WandSparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, FirestoreError, doc } from "firebase/firestore";
import { useCollection, WithId } from "@/firebase/firestore/use-collection";
import { useDoc } from "@/firebase/firestore/use-doc";
import { format } from 'date-fns';
import {
    calculateAverageCycleLength,
    estimateNextPeriodDate,
    getCurrentCyclePhase,
    groupLogsIntoCyclesLegacy,
    type CycleLog,
    type GroupedCycle,
    getCurrentCycleDay,
    getPhaseInfo,
} from '@/lib/cycle-service';
import { groupLogsIntoCycles } from '@/lib/cycle-analytics';
import { useToast } from "@/hooks/use-toast";
import { FirestorePermissionError } from "@/firebase/errors";
import { errorEmitter } from "@/firebase/error-emitter";
import { SymptomsForm } from "@/components/symptoms-form";
import { DailyPlanner } from "@/components/daily-planner";
import { CycleInsights } from "@/components/cycle-insights";
import { CycleGraphs } from "@/components/cycle-graphs";

export default function CycleLogPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSymptomsDialogOpen, setIsSymptomsDialogOpen] = useState(false);
    const [selectedCycle, setSelectedCycle] = useState<GroupedCycle | null>(null);

    const userProfileRef = useMemoFirebase(
      () => (user ? doc(firestore, `users/${user.uid}/userProfiles`, user.uid) : null),
      [user, firestore]
    );
    const { data: userProfile } = useDoc<any>(userProfileRef);

    const logsCollectionRef = useMemoFirebase(
        () => (user && firestore ? collection(firestore, `users/${user.uid}/cycleLogs`) : null),
        [user, firestore]
    );

    const logsQuery = useMemoFirebase(
        () => (logsCollectionRef ? query(logsCollectionRef, orderBy('date', 'asc')) : null),
        [logsCollectionRef]
    )

    const { data: rawLogs, isLoading } = useCollection<CycleLog>(logsQuery);
    
    // Use the legacy function which now handles onboarding data for initial estimates
    const cycles = useMemo(() => {
        return rawLogs ? groupLogsIntoCyclesLegacy(rawLogs, userProfile) : [];
    }, [rawLogs, userProfile]);
    
    const averageCycleLength = useMemo(() => {
        return rawLogs ? calculateAverageCycleLength(rawLogs) : (userProfile?.cycleLength ? parseInt(userProfile.cycleLength.split('-')[0]) : 28);
    }, [rawLogs, userProfile]);

    const nextPeriodDate = useMemo(() => {
        return rawLogs ? estimateNextPeriodDate(rawLogs) : null;
    }, [rawLogs]);

    const currentPhase = useMemo(() => {
        return rawLogs ? getCurrentCyclePhase(rawLogs) : 'Unknown';
    }, [rawLogs]);

    const cycleDay = useMemo(() => {
        return rawLogs ? getCurrentCycleDay(rawLogs) : null;
    }, [rawLogs]);

    const phaseInfo = useMemo(() => {
        return getPhaseInfo(currentPhase);
    }, [currentPhase]);


    const handleAddPeriodDay = async () => {
        if (!logsCollectionRef || !user) return;
        setIsSubmitting(true);
        
        const newLog = {
            userId: user.uid,
            date: new Date().toISOString(),
            isPeriodDay: true,
            symptoms: [],
            mood: null,
            flow: 'light', // Default flow
            createdAt: serverTimestamp()
        };

        addDoc(logsCollectionRef, newLog)
            .then(() => {
                 toast({
                    title: "Log Added!",
                    description: "Today has been marked as a period day.",
                });
            })
            .catch((serverError: FirestoreError) => {
                const permissionError = new FirestorePermissionError({
                    path: logsCollectionRef.path,
                    operation: 'create',
                    requestResourceData: newLog,
                });
                errorEmitter.emit('permission-error', permissionError);
                toast({
                    variant: 'destructive',
                    title: "Error",
                    description: "Could not add period day. Check permissions.",
                });
            })
            .finally(() => {
                 setIsSubmitting(false);
            });
    }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Cycle Log 🌸</h1>
        <p className="text-muted-foreground">
          Track and manage your menstrual cycle history.
        </p>
      </div>

      <Card className="bg-secondary/60 border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Today at a glance ✨</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex items-center gap-4 p-4 bg-background rounded-lg shadow-sm cursor-help">
                            <div className="bg-accent/10 text-accent p-3 rounded-full">
                                <Waves className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Current Phase</p>
                                <p className="font-bold text-lg">{currentPhase}</p>
                            </div>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{phaseInfo}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Popover>
                <PopoverTrigger asChild>
                    <div className="flex items-center gap-4 p-4 bg-background rounded-lg shadow-sm cursor-pointer">
                        <div className="bg-primary/10 text-primary p-3 rounded-full">
                            <CalendarDays className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Next Period</p>
                            <p className="font-bold text-lg">{nextPeriodDate ? format(nextPeriodDate, 'MMM dd') : 'Not enough data'}</p>
                        </div>
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={nextPeriodDate || undefined}
                        month={nextPeriodDate || new Date()}
                        modifiers={{ predicted: nextPeriodDate ? [nextPeriodDate] : [] }}
                        modifiersStyles={{ predicted: { fontWeight: 'bold', color: 'hsl(var(--primary))' } }}
                    />
                </PopoverContent>
            </Popover>

             <div className="flex items-center gap-4 p-4 bg-background rounded-lg shadow-sm">
                <div className="bg-fuchsia-500/10 text-fuchsia-500 p-3 rounded-full">
                    <Droplets className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Avg. Cycle</p>
                    <p className="font-bold text-lg">{averageCycleLength} days</p>
                </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-background rounded-lg shadow-sm">
                <div className="bg-teal-500/10 text-teal-500 p-3 rounded-full">
                    <MoreHorizontal className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Cycle Day</p>
                    <p className="font-bold text-lg">{cycleDay ?? 'N/A'}</p>
                </div>
            </div>
        </CardContent>
        <CardContent className="flex flex-wrap gap-4">
             <Dialog open={isSymptomsDialogOpen} onOpenChange={setIsSymptomsDialogOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <span className="mr-2">➕💗</span>
                        Log Today's Details
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>How are you feeling today?</DialogTitle>
                        <DialogDescription>
                            Log your symptoms, flow, mood, and any notes for today.
                        </DialogDescription>
                    </DialogHeader>
                    <SymptomsForm 
                        onSave={() => setIsSymptomsDialogOpen(false)} 
                        onCancel={() => setIsSymptomsDialogOpen(false)}
                        currentLogs={rawLogs || []}
                    />
                </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleAddPeriodDay} disabled={isSubmitting}>
                <span className="mr-2">➕🩸</span>
                 {isSubmitting ? 'Adding...' : 'Add a Period Day'}
            </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="graphs">Graph View</TabsTrigger>
            <TabsTrigger value="insights">Insights View</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
            <Card>
                <CardHeader>
                <CardTitle>Log History</CardTitle>
                <CardDescription>A record of your past period cycles.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <p>Loading cycle history...</p>
                    ) : cycles.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">No period logs found.</p>
                            <p className="text-sm text-muted-foreground mt-2">Use the buttons above to start tracking your cycle.</p>
                        </div>
                    ) : (
                        <Dialog onOpenChange={(open) => !open && setSelectedCycle(null)}>
                            <Table>
                                <TableHeader>
                                <TableRow>
                                    <TableHead>Cycle</TableHead>
                                    <TableHead>Period Duration</TableHead>
                                    <TableHead>Cycle Length</TableHead>
                                    <TableHead>Symptoms</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                                </TableHeader>
                                <TableBody>
                                {cycles.map((cycle) => (
                                    <TableRow key={cycle.cycleIndex}>
                                    <TableCell className="font-medium">{format(cycle.startDate, 'MMM dd, yyyy')}</TableCell>
                                    <TableCell>{`${cycle.duration} days`}</TableCell>
                                    <TableCell>{cycle.cycleLength ? `${cycle.cycleLength} days` : 'In Progress'}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1 max-w-xs">
                                        {cycle.symptoms.length > 0 ? cycle.symptoms.slice(0,3).map(symptom => <Badge key={symptom} variant="secondary">{symptom}</Badge>) : <span className="text-xs text-muted-foreground">None</span>}
                                        {cycle.symptoms.length > 3 && <Badge variant="outline">+{cycle.symptoms.length - 3} more</Badge>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" onClick={() => setSelectedCycle(cycle)}>
                                                <WandSparkles className="mr-2 h-4 w-4" />
                                                Get Plan
                                            </Button>
                                        </DialogTrigger>
                                    </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                            {selectedCycle && (
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="font-headline text-2xl">Your Daily Wellness Plan</DialogTitle>
                                        <DialogDescription>
                                            Based on your symptoms for the cycle starting {format(selectedCycle.startDate, 'MMM dd')}.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DailyPlanner cycle={selectedCycle} />
                                </DialogContent>
                            )}
                        </Dialog>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="graphs">
            <CycleGraphs cycles={cycles} />
        </TabsContent>
        <TabsContent value="insights">
            <CycleInsights cycles={cycles} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
