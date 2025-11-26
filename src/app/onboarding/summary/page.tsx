
"use client";

import { useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useOnboarding } from "../provider";
import { signup } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useUser } from "@/firebase";

export default function SummaryPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { onboardingData, setOnboardingData } = useOnboarding();
    const { user } = useUser();
    const [isPending, startTransition] = useTransition();
    
    // Use existing user's email if available (e.g. from Google Sign-In)
    useEffect(() => {
        if (user && !onboardingData.email) {
            setOnboardingData({ ...onboardingData, email: user.email! });
        }
    }, [user, onboardingData, setOnboardingData]);

    const handleFinish = () => {
        startTransition(async () => {
            try {
                // Ensure email is set before proceeding
                const finalData = { ...onboardingData };
                if (!finalData.email) {
                    // This is a fallback for email/password signups where email might not be in the context yet
                    // But for Google/existing users, it should be there.
                    // If it's a completely new user, we'll auto-generate credentials.
                    if (!finalData.password) {
                        finalData.password = Math.random().toString(36).slice(-8);
                        finalData.email = `user-${Date.now()}@woomania.com`;
                    }
                }

                const result = await signup(finalData);

                if (result?.error) {
                    toast({
                        variant: 'destructive',
                        title: 'Uh oh! Something went wrong.',
                        description: result.error,
                    });
                } else {
                    // Redirect is handled by the server action on success
                }
            } catch (error) {
                console.error(error);
                toast({
                    variant: 'destructive',
                    title: 'Uh oh! An unexpected error occurred.',
                    description: 'Please try again.',
                });
            }
        });
    };

    const getLastPeriodText = () => {
        if (!onboardingData.lastPeriodDate || onboardingData.lastPeriodDate === 'unknown') {
            return "Not specified";
        }
        try {
            return `${formatDistanceToNow(parseISO(onboardingData.lastPeriodDate))} ago`;
        } catch (e) {
            return "Not specified"
        }
    }

    const isNewUserSignup = !user || (user && !user.emailVerified && !user.providerData.length);

    return (
        <Card className="w-full max-w-md bg-white/70 backdrop-blur-lg dark:bg-card/70">
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">You’re all set, {onboardingData.name || 'friend'} 💕</CardTitle>
            </CardHeader>
            <CardContent>
                <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle className="text-lg">Your Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p><strong>Age range:</strong> {onboardingData.ageRange || 'N/A'}</p>
                        <p><strong>Focus:</strong> {onboardingData.focusAreas?.join(', ') || 'N/A'}</p>
                        <p><strong>Cycle:</strong> ~{onboardingData.cycleLength || 'N/A'} days</p>
                        <p><strong>Last period approx:</strong> {getLastPeriodText()}</p>
                        <p><strong>Privacy:</strong> {onboardingData.sharingPreference ? `${onboardingData.sharingPreference.charAt(0).toUpperCase() + onboardingData.sharingPreference.slice(1)} by default` : 'N/A'}</p>
                    </CardContent>
                </Card>
                {isNewUserSignup && (
                    <Alert className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>You're signing up!</AlertTitle>
                        <AlertDescription>
                            By continuing, we'll create an account for you. You can manage your profile later.
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
            <CardFooter>
                <Button onClick={handleFinish} disabled={isPending} className="w-full">
                    {isPending ? 'Setting things up...' : 'Go to my Woomania'}
                </Button>
            </CardFooter>
        </Card>
    );
}
