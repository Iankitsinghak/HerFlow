
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useOnboarding } from "../provider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

export default function CycleStatusPage() {
  const router = useRouter();
  const { onboardingData, setOnboardingData } = useOnboarding();

  const [periodStatus, setPeriodStatus] = useState(onboardingData.periodStatus || "");
  const [cycleLength, setCycleLength] = useState(onboardingData.cycleLength || "");
  const [lastPeriodDate, setLastPeriodDate] = useState<Date | undefined>(
    onboardingData.lastPeriodDate ? new Date(onboardingData.lastPeriodDate) : undefined
  );
  const [dontRemember, setDontRemember] = useState(false);

  const handleNext = () => {
    setOnboardingData({ 
        ...onboardingData, 
        periodStatus, 
        cycleLength, 
        lastPeriodDate: dontRemember ? 'unknown' : lastPeriodDate?.toISOString() 
    });
    router.push("/onboarding/focus");
  };

  const isFormValid = periodStatus && cycleLength && (lastPeriodDate || dontRemember);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Let’s talk about your cycle 🩸</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-3">
          <Label>Do you currently get periods?</Label>
          <RadioGroup value={periodStatus} onValueChange={setPeriodStatus}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="regular" id="r1" />
              <Label htmlFor="r1">Yes, regularly</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="irregular" id="r2" />
              <Label htmlFor="r2">Yes, but irregular</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="notsure" id="r3" />
              <Label htmlFor="r3">I’m not sure / it’s different every time</Label>
            </div>
             <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="r4" />
              <Label htmlFor="r4">I don’t get periods / other</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Roughly, how long is your cycle usually? <span className="text-muted-foreground text-xs">(From one period start to the next)</span></Label>
           <RadioGroup value={cycleLength} onValueChange={setCycleLength}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="21-24" id="c1" />
              <Label htmlFor="c1">21–24 days</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="25-30" id="c2" />
              <Label htmlFor="c2">25–30 days</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="31-35" id="c3" />
              <Label htmlFor="c3">31–35 days</Label>
            </div>
             <div className="flex items-center space-x-2">
              <RadioGroupItem value="variable" id="c4" />
              <Label htmlFor="c4">It changes a lot / I don’t know</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
            <Label>When did your last period start?</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !lastPeriodDate && "text-muted-foreground"
                    )}
                    disabled={dontRemember}
                    >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {lastPeriodDate ? format(lastPeriodDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                    mode="single"
                    selected={lastPeriodDate}
                    onSelect={setLastPeriodDate}
                    disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                    initialFocus
                    />
                </PopoverContent>
            </Popover>
            <div className="flex items-center space-x-2">
                <input type="checkbox" id="dont-remember" checked={dontRemember} onChange={(e) => setDontRemember(e.target.checked)} />
                <Label htmlFor="dont-remember" className="text-sm font-normal">I don’t remember</Label>
            </div>
        </div>
      </CardContent>
       <CardFooter>
        <Button onClick={handleNext} disabled={!isFormValid} className="w-full">Next</Button>
      </CardFooter>
    </Card>
  );
}
