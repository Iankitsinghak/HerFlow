
"use client";

import { useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useOnboarding } from "../provider";
import { completeOnboarding } from "@/lib/auth-client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useUser } from "@/firebase";

export default function SummaryPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { onboardingData } = useOnboarding();
    const { user, isUserLoading } = useUser();
    const [isPending, startTransition] = useTransition();
    
    const handleFinish = () => {
        if (!user) {
            toast({
                variant: 'destructive',
                title: 'Authentication Error',
                description: 'You are not logged in. Please sign up or log in again.',
            });
            router.push('/signup');
            return;
        }

        startTransition(async () => {
            try {
                const result = await completeOnboarding(user, onboardingData);

                if (result?.error) {
                    toast({
                        variant: 'destructive',
                        title: 'Uh oh! Something went wrong.',
                        description: result.error,
                    });
                } else {
                    toast({
                        title: 'Welcome to Woomania!',
                        description: 'Your profile has been set up successfully.',
                    });
                    router.push('/dashboard');
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
                        <p><strong>Period lasts:</strong> ~{onboardingData.periodDuration || 'N/A'} days</p>
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
                <Button onClick={handleFinish} disabled={isPending || isUserLoading} className="w-full">
                    {isPending ? 'Setting things up...' : 'Go to my Woomania'}
                </Button>
            </CardFooter>
        </Card>
    );
}
