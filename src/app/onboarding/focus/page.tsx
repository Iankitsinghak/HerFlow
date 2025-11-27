
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useOnboarding } from "../provider";
import { Toggle } from "@/components/ui/toggle";

const focusOptions = [
  "Tracking my periods & mood",
  "Understanding my symptoms",
  "PCOS / hormonal issues",
  "Fertility & trying to conceive",
  "Pregnancy support",
  "Mental health & mood",
  "Just learning about my body",
];

export default function FocusPage() {
  const router = useRouter();
  const { onboardingData, setOnboardingData } = useOnboarding();
  const [selectedFocus, setSelectedFocus] = useState<string[]>(onboardingData.focusAreas || []);

  const handleToggle = (option: string) => {
    setSelectedFocus((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleNext = () => {
    setOnboardingData({ ...onboardingData, focusAreas: selectedFocus });
    router.push("/onboarding/privacy");
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">What do you want HerFlow to focus on for you? 💡</CardTitle>
        <CardDescription>
            This helps us show you the most relevant tips, blogs and tools. Select as many as you like.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {focusOptions.map((option) => (
          <Toggle
            key={option}
            pressed={selectedFocus.includes(option)}
            onPressedChange={() => handleToggle(option)}
            variant="outline"
            className="data-[state=on]:bg-primary/20 data-[state=on]:text-primary-foreground"
          >
            {option}
          </Toggle>
        ))}
      </CardContent>
      <CardFooter>
        <Button onClick={handleNext} className="w-full">Next</Button>
      </CardFooter>
    </Card>
  );
}
