
'use client';

import { useState } from 'react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, WandSparkles } from 'lucide-react';
import { useDoc } from '@/firebase/firestore/use-doc';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface ChecklistItem {
    id: string;
    label: string;
    completed: boolean;
}

const suggestions = [
    'Pads or menstrual products in your bag 🩸',
    'A dark-colored outfit or backup bottom wear 👖',
    'Pain relief patch / hot water bag for cramps 🧣',
    'Small pouch for used pads or tampons 🎒',
    'Water bottle to stay hydrated 💧',
    'Tissue or wipes for emergencies 🧻',
    'Extra underwear just in case 🌸'
];

export function CustomChecklist() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [newItemLabel, setNewItemLabel] = useState('');
    
    const userProfileRef = useMemoFirebase(
      () => (user ? doc(firestore, `users/${user.uid}/userProfiles`, user.uid) : null),
      [user, firestore]
    );

    const { data: userProfile } = useDoc<any>(userProfileRef);
    const checklistItems = userProfile?.checklist || [];

    const updateChecklist = async (newChecklist: ChecklistItem[]) => {
        if (!userProfileRef) return;
        await updateDoc(userProfileRef, { checklist: newChecklist });
    };

    const handleAddItem = () => {
        if (!newItemLabel.trim()) return;
        const newItem: ChecklistItem = {
            id: new Date().toISOString(),
            label: newItemLabel.trim(),
            completed: false,
        };
        updateChecklist([...checklistItems, newItem]);
        setNewItemLabel('');
    };
    
    const handleAddSuggestion = (suggestion: string) => {
        if (checklistItems.some((item: ChecklistItem) => item.label === suggestion)) return;
        const newItem: ChecklistItem = {
            id: new Date().toISOString(),
            label: suggestion,
            completed: false,
        };
        updateChecklist([...checklistItems, newItem]);
    };

    const handleToggleItem = (id: string) => {
        const updatedList = checklistItems.map((item: ChecklistItem) =>
            item.id === id ? { ...item, completed: !item.completed } : item
        );
        updateChecklist(updatedList);
    };

    const handleRemoveItem = (id: string) => {
        const updatedList = checklistItems.filter((item: ChecklistItem) => item.id !== id);
        updateChecklist(updatedList);
    };


    return (
        <Card className="w-full h-full bg-white/80 dark:bg-card/80 backdrop-blur-lg rounded-xl shadow-lg border border-pink-100/80">
            <CardHeader>
                <CardTitle className="font-headline text-lg">My Period-Ready Kit</CardTitle>
                <CardDescription className="text-xs">Create a personalized checklist of essentials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-h-60 overflow-y-auto pr-2">
                 {checklistItems.length === 0 ? (
                    <p className="text-sm text-center text-muted-foreground py-4">Your kit is empty. Add items below!</p>
                ) : (
                    checklistItems.map((item: ChecklistItem) => (
                        <div key={item.id} className="group flex items-center p-2.5 bg-background/70 rounded-lg border border-transparent transition-all has-[:checked]:bg-primary/10 has-[:checked]:border-primary/20">
                            <Checkbox
                                id={item.id}
                                checked={item.completed}
                                onCheckedChange={() => handleToggleItem(item.id)}
                                className="h-5 w-5 rounded-full"
                            />
                            <label
                                htmlFor={item.id}
                                className={`flex-1 ml-3 text-sm font-medium transition-colors cursor-pointer ${item.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                            >
                                {item.label}
                            </label>
                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleRemoveItem(item.id)}>
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    ))
                )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2 pt-4 border-t">
                <div className="flex w-full gap-2">
                    <Input
                        value={newItemLabel}
                        onChange={(e) => setNewItemLabel(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                        placeholder="Add a custom item..."
                        className="h-9"
                    />
                    <Button size="icon" className="h-9 w-9 shrink-0" onClick={handleAddItem} disabled={!newItemLabel.trim()}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full h-8 text-xs">
                            <WandSparkles className="mr-2 h-3 w-3"/>
                            Add from Suggestions
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="space-y-2">
                            <p className="font-medium text-sm">Suggestions</p>
                            {suggestions.map(suggestion => (
                                <Button
                                    key={suggestion}
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start h-auto py-1.5 px-2 text-left"
                                    onClick={() => handleAddSuggestion(suggestion)}
                                    disabled={checklistItems.some((item: ChecklistItem) => item.label === suggestion)}
                                >
                                    {suggestion}
                                </Button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </CardFooter>
        </Card>
    );
}
