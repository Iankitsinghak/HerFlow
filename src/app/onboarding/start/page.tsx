
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOnboarding } from "../provider";
import { useUser } from "@/firebase";

export default function AboutYouPage() {
  const router = useRouter();
  const { user } = useUser();
  const { onboardingData, setOnboardingData } = useOnboarding();

  // Pre-fill name from Google Auth if available
  const [name, setName] = useState(onboardingData.name || user?.displayName || "");
  const [ageRange, setAgeRange] = useState(onboardingData.ageRange || "");
  const [country, setCountry] = useState(onboardingData.country || "");
  
  const handleNext = () => {
    setOnboardingData({ ...onboardingData, name, ageRange, country });
    router.push("/onboarding/cycle-status");
  };

  const isFormValid = name && ageRange;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">First, a little about you</CardTitle>
        <CardDescription>
          This helps us personalize your journey.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">What should we call you?</Label>
          <Input
            id="name"
            placeholder="Your name or nickname"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age-range">How old are you?</Label>
          <Select value={ageRange} onValueChange={setAgeRange}>
            <SelectTrigger id="age-range">
              <SelectValue placeholder="Select your age range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Under 18">Under 18</SelectItem>
              <SelectItem value="18-24">18–24</SelectItem>
              <SelectItem value="25-34">25–34</SelectItem>
              <SelectItem value="35-44">35–44</SelectItem>
              <SelectItem value="45+">45+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Which country/region are you in? (optional)</Label>
          <Input
            id="country"
            placeholder="e.g. India"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <Button onClick={handleNext} disabled={!isFormValid} className="w-full">Next</Button>
        <p className="text-xs text-muted-foreground">
          You can always change this later in your profile. 💫
        </p>
      </CardFooter>
    </Card>
  );
}
