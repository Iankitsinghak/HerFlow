
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from 'framer-motion';

const checklistItems = [
    { id: 'item-1', emoji: '🩸', label: 'Pads or menstrual products in your bag' },
    { id: 'item-2', emoji: '👖', label: 'A dark-colored outfit or backup bottom wear' },
    { id: 'item-3', emoji: '🧣', label: 'Pain relief patch / hot water bag for cramps' },
    { id: 'item-4', emoji: '🎒', label: 'Small pouch for used pads or tampons' },
    { id: 'item-5', emoji: '💧', label: 'Water bottle to stay hydrated' },
    { id: 'item-6', emoji: '🧻', label: 'Tissue or wipes for emergencies' },
    { id: 'item-7', emoji: '🌸', label: 'Extra underwear just in case' },
];

export function PeriodReadyChecklist() {
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    const handleCheckChange = (id: string, checked: boolean) => {
        setCheckedItems(prev => ({ ...prev, [id]: checked }));
    };

    const handleReset = () => {
        setCheckedItems({});
    };
    
    const allChecked = Object.keys(checkedItems).length === checklistItems.length && Object.values(checkedItems).every(Boolean);

    return (
        <Card className="w-full max-w-md bg-white/80 dark:bg-card/80 backdrop-blur-lg rounded-3xl shadow-lg border border-pink-100/80">
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">Period-Ready Checklist</CardTitle>
                <CardDescription>A few small things to keep you comfortable and confident.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {checklistItems.map(item => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0.8, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center p-3 bg-background/70 rounded-xl border border-transparent transition-all has-[:checked]:bg-primary/10 has-[:checked]:border-primary/20"
                    >
                        <Checkbox
                            id={item.id}
                            checked={checkedItems[item.id] || false}
                            onCheckedChange={(checked) => handleCheckChange(item.id, !!checked)}
                            className="h-5 w-5 rounded-full"
                        />
                        <label
                            htmlFor={item.id}
                            className={`flex-1 ml-4 text-sm font-medium transition-colors cursor-pointer ${checkedItems[item.id] ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                        >
                           <span className="mr-3">{item.emoji}</span> {item.label}
                        </label>
                    </motion.div>
                ))}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
                 <AnimatePresence>
                    {allChecked && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="text-center p-3 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-sm font-medium"
                        >
                            🎉 You're all set! Ready to take on the day.
                        </motion.div>
                    )}
                </AnimatePresence>
                <Button variant="ghost" onClick={handleReset} className="text-muted-foreground">
                    Reset Checklist
                </Button>
            </CardFooter>
        </Card>
    );
}
