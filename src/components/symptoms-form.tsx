
'use client';

import { useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { startOfDay, isSameDay, parseISO } from 'date-fns';
import { type CycleLog } from '@/lib/cycle-service';

const allSymptoms = [
  "Cramps", "Bloating", "Headache", "Fatigue", "Mood swings", 
  "Acne", "Tender breasts", "Nausea", "Back pain", "Cravings"
];

interface SymptomsFormProps {
  onSave: () => void;
  onCancel: () => void;
  currentLogs: CycleLog[];
}

export function SymptomsForm({ onSave, onCancel, currentLogs }: SymptomsFormProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggle = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((item) => item !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = async () => {
    if (!user || !firestore) return;
    setIsSubmitting(true);

    const logsCollectionRef = collection(firestore, `users/${user.uid}/cycleLogs`);
    const today = startOfDay(new Date());

    try {
      // Check if a log for today already exists
      const existingLogForToday = currentLogs.find(log => isSameDay(parseISO(log.date), today));

      if (existingLogForToday && existingLogForToday.id) {
        // Update existing log for today
        const logDocRef = doc(logsCollectionRef, existingLogForToday.id);
        await updateDoc(logDocRef, {
          symptoms: Array.from(new Set([...(existingLogForToday.symptoms || []), ...selectedSymptoms]))
        });
        toast({ title: "Symptoms Updated", description: "Your symptoms for today have been updated." });
      } else {
        // Create a new log for today
        await addDoc(logsCollectionRef, {
          userId: user.uid,
          date: today.toISOString(),
          isPeriodDay: false, // Default to false, can be overwritten by another action
          symptoms: selectedSymptoms,
          createdAt: serverTimestamp()
        });
        toast({ title: "Symptoms Logged", description: "Your symptoms for today have been saved." });
      }
      onSave();
    } catch (error) {
      console.error("Error saving symptoms:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save symptoms. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {allSymptoms.map((symptom) => (
          <Toggle
            key={symptom}
            pressed={selectedSymptoms.includes(symptom)}
            onPressedChange={() => handleToggle(symptom)}
            variant="outline"
            className="data-[state=on]:bg-primary/20 data-[state=on]:text-primary-foreground"
          >
            {symptom}
          </Toggle>
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={isSubmitting || selectedSymptoms.length === 0}>
          {isSubmitting ? 'Saving...' : 'Save Symptoms'}
        </Button>
      </div>
    </div>
  );
}
