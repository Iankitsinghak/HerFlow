
'use client';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Image from 'next/image';
import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center text-center max-w-lg mx-auto">
        <Image
          src="https://picsum.photos/seed/welcome-girl/300/300"
          alt="A relaxed and chill girl"
          width={250}
          height={250}
          className="rounded-full mb-8 shadow-lg"
          data-ai-hint="cartoon girl relaxed"
        />
        <Logo />
        <h1 className="text-3xl sm:text-4xl font-bold font-headline mt-6">
          Welcome to Woomania 💗
        </h1>
        <p className="text-lg text-muted-foreground mt-2 mb-8">
          Your safe space for periods, hormones, health &amp; honest stories.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
          <Button asChild size="lg" className="w-full">
            <Link href="/onboarding/start">Get Started</Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="w-full">
            <Link href="/login">I already have an account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
