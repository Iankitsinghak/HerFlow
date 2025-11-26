
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
import { MoreHorizontal, PlusCircle, CalendarDays, Droplets, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, FirestoreError, doc, getDocs, where, limit, writeBatch } from "firebase/firestore";
import { useCollection, WithId } from "@/firebase/firestore/use-collection";
import { useDoc } from "@/firebase/firestore/use-doc";
import { format, isSameDay, parseISO, startOfDay } from 'date-fns';
import {
    calculateAverageCycleLength,
    estimateNextPeriodDate,
    getCurrentCyclePhase,
    groupLogsIntoCycles,
    type CycleLog
} from '@/lib/cycle-service';
import { useToast } from "@/hooks/use-toast";
import { FirestorePermissionError } from "@/firebase/errors";
import { errorEmitter } from "@/firebase/error-emitter";
import { SymptomsForm } from "@/components/symptoms-form";

type CycleLogWithId = WithId<CycleLog>;

export default function CycleLogPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSymptomsDialogOpen, setIsSymptomsDialogOpen] = useState(false);

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

    const groupedCycles = useMemo(() => {
        return rawLogs ? groupLogsIntoCycles(rawLogs, userProfile) : [];
    }, [rawLogs, userProfile]);

    const averageCycleLength = useMemo(() => {
        return rawLogs ? calculateAverageCycleLength(rawLogs) : 28;
    }, [rawLogs]);

    const nextPeriodDate = useMemo(() => {
        return rawLogs ? estimateNextPeriodDate(rawLogs) : null;
    }, [rawLogs]);

    const currentPhase = useMemo(() => {
        return rawLogs ? getCurrentCyclePhase(rawLogs) : 'Unknown';
    }, [rawLogs]);

    const handleAddPeriodDay = async () => {
        if (!logsCollectionRef || !user) return;
        setIsSubmitting(true);
        
        const newLog = {
            userId: user.uid,
            date: new Date().toISOString(),
            isPeriodDay: true,
            symptoms: [],
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
        <h1 className="text-3xl font-bold font-headline">Cycle Log</h1>
        <p className="text-muted-foreground">
          Track and manage your menstrual cycle history.
        </p>
      </div>

      <Card className="bg-secondary/50 border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Today at a glance</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 bg-background rounded-lg">
                <div className="bg-accent/10 text-accent p-3 rounded-full">
                    <Activity className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Current Phase</p>
                    <p className="font-bold text-lg">{currentPhase}</p>
                </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-background rounded-lg">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <CalendarDays className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Next Period</p>
                    <p className="font-bold text-lg">{nextPeriodDate ? format(nextPeriodDate, 'MMM dd') : 'Not enough data'}</p>
                </div>
            </div>
             <div className="flex items-center gap-4 p-4 bg-background rounded-lg">
                <div className="bg-fuchsia-500/10 text-fuchsia-500 p-3 rounded-full">
                    <Droplets className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Avg. Cycle</p>
                    <p className="font-bold text-lg">{averageCycleLength} days</p>
                </div>
            </div>
        </CardContent>
        <CardContent className="flex gap-4">
             <Dialog open={isSymptomsDialogOpen} onOpenChange={setIsSymptomsDialogOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Log Today's Symptoms
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>How are you feeling today?</DialogTitle>
                        <DialogDescription>
                            Select any symptoms you&apos;re experiencing. This will be saved for today&apos;s log.
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
                <PlusCircle className="mr-2 h-4 w-4" />
                 {isSubmitting ? 'Adding...' : 'Add a Period Day'}
            </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Log History</CardTitle>
          <CardDescription>A record of your past period cycles.</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <p>Loading cycle history...</p>
            ) : groupedCycles.length === 0 ? (
                 <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">No period logs found.</p>
                    <p className="text-sm text-muted-foreground mt-2">Use the buttons above to start tracking your cycle.</p>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Symptoms</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {groupedCycles.map((cycle, index) => (
                        <TableRow key={index}>
                        <TableCell className="font-medium">{format(cycle.startDate, 'MMM dd, yyyy')}</TableCell>
                        <TableCell>{format(cycle.endDate, 'MMM dd, yyyy')}</TableCell>
                        <TableCell>{typeof cycle.duration === 'string' ? cycle.duration : `${cycle.duration} days`}</TableCell>
                        <TableCell>
                            <div className="flex flex-wrap gap-1">
                            {cycle.symptoms.length > 0 ? cycle.symptoms.map(symptom => <Badge key={symptom} variant="secondary">{symptom}</Badge>) : <span className="text-xs text-muted-foreground">None</span>}
                            </div>
                        </TableCell>
                        <TableCell>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

