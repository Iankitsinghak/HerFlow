
'use client';

import { Logo } from '@/components/logo';
import { OnboardingProvider } from './provider';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there's no user, they shouldn't be here.
    // Redirect them to the main page to start over.
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);


  // Show a loading state while we verify the user's auth status
  if (loading) {
     return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                <p className="text-lg text-muted-foreground">Loading...</p>
            </div>
        </div>
    );
  }

  // If there's a user, render the onboarding flow
  return (
    <OnboardingProvider>
        <div className="min-h-screen bg-gradient-to-br from-background to-pink-100 dark:to-fuchsia-950/20 flex flex-col">
            <header className="p-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
                <Logo />
            </header>
            <main className="flex-1 flex items-center justify-center p-4">
                {children}
            </main>
        </div>
    </OnboardingProvider>
  );
}
