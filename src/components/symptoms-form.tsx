
'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { startOfDay, isSameDay, parseISO } from 'date-fns';
import { type CycleLog } from '@/lib/cycle-service';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find existing log for today
  const today = startOfDay(new Date());
  const existingLogForToday = currentLogs.find(log => isSameDay(parseISO(log.date), today));

  // Initialize state from existing log or defaults
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(existingLogForToday?.symptoms || []);
  const [flow, setFlow] = useState<'light' | 'medium' | 'heavy' | undefined>(existingLogForToday?.flow as any);
  const [mood, setMood] = useState<number>(existingLogForToday?.mood || 3);
  const [notes, setNotes] = useState<string>(existingLogForToday?.notes || '');
  const [isPeriodDay, setIsPeriodDay] = useState<boolean>(existingLogForToday?.isPeriodDay || false);

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
    
    const newLogData = {
        userId: user.uid,
        date: today.toISOString(),
        isPeriodDay,
        symptoms: selectedSymptoms,
        flow: isPeriodDay ? flow : null,
        mood,
        notes,
        updatedAt: serverTimestamp()
    };

    try {
      if (existingLogForToday && existingLogForToday.id) {
        const logDocRef = doc(logsCollectionRef, existingLogForToday.id);
        await updateDoc(logDocRef, newLogData);
        toast({ title: "Log Updated", description: "Your details for today have been updated." });
      } else {
        await addDoc(logsCollectionRef, { ...newLogData, createdAt: serverTimestamp() });
        toast({ title: "Log Saved", description: "Your details for today have been saved." });
      }
      onSave();
    } catch (error) {
      console.error("Error saving log:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save your log. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 py-4">
      
      <div className="space-y-3">
        <Label>Are you on your period today?</Label>
        <RadioGroup value={isPeriodDay ? 'yes' : 'no'} onValueChange={(val) => setIsPeriodDay(val === 'yes')}>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="p-yes" />
                <Label htmlFor="p-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="p-no" />
                <Label htmlFor="p-no">No</Label>
            </div>
        </RadioGroup>
      </div>
      
      {isPeriodDay && (
        <div className="space-y-3">
          <Label>How is your flow?</Label>
          <RadioGroup value={flow} onValueChange={(val) => setFlow(val as any)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="f-light" />
              <Label htmlFor="f-light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="f-medium" />
              <Label htmlFor="f-medium">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="heavy" id="f-heavy" />
              <Label htmlFor="f-heavy">Heavy</Label>
            </div>
          </RadioGroup>
        </div>
      )}

      <div className="space-y-3">
          <Label>What symptoms are you experiencing?</Label>
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
      </div>

       <div className="space-y-4">
            <Label>How would you rate your mood?</Label>
            <div className='flex items-center gap-4'>
                <span className='text-2xl'>😭</span>
                <Slider
                    value={[mood]}
                    onValueChange={(val) => setMood(val[0])}
                    min={1}
                    max={5}
                    step={1}
                />
                <span className='text-2xl'>😄</span>
            </div>
        </div>

      <div className="space-y-2">
        <Label htmlFor='notes'>Any additional notes?</Label>
        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g., Felt great after a morning walk..."/>
      </div>


      <div className="flex justify-end gap-2 pt-4">
        <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Details'}
        </Button>
      </div>
    </div>
  );
}
