
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
import { Switch } from "@/components/ui/switch";
import { useOnboarding } from "../provider";

export default function PrivacyPage() {
  const router = useRouter();
  const { onboardingData, setOnboardingData } = useOnboarding();

  const [doctorComfort, setDoctorComfort] = useState(onboardingData.doctorComfort || "");
  const [sharingPreference, setSharingPreference] = useState(onboardingData.sharingPreference || "");
  const [showReminders, setShowReminders] = useState(onboardingData.showReminders === undefined ? true : onboardingData.showReminders);
  
  const handleNext = () => {
    setOnboardingData({
      ...onboardingData,
      doctorComfort,
      sharingPreference,
      showReminders
    });
    router.push("/onboarding/summary");
  };

  const isFormValid = doctorComfort && sharingPreference;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Your comfort matters most 🤍</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-3">
          <Label>How comfortable are you with talking to doctors online?</Label>
          <RadioGroup value={doctorComfort} onValueChange={setDoctorComfort}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="open" id="d1" />
              <Label htmlFor="d1">I’m open to it</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="maybe" id="d2" />
              <Label htmlFor="d2">Maybe later</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="d3" />
              <Label htmlFor="d3">Not right now</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>When you share stories or questions, what do you prefer?</Label>
          <RadioGroup value={sharingPreference} onValueChange={setSharingPreference}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="anonymous" id="s1" />
              <Label htmlFor="s1">Default to Anonymous</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="firstname" id="s2" />
              <Label htmlFor="s2">Default to Show my first name</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="choose" id="s3" />
              <Label htmlFor="s3">I’ll choose each time</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label htmlFor="reminders-switch">Gentle Reminders</Label>
                <p className="text-xs text-muted-foreground">
                    Show me gentle reminders & tips based on my cycle.
                </p>
            </div>
            <Switch
                id="reminders-switch"
                checked={showReminders}
                onCheckedChange={setShowReminders}
            />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleNext} disabled={!isFormValid} className="w-full">Next</Button>
      </CardFooter>
    </Card>
  );
}
