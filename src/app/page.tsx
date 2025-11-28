
'use client';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const FloatingPetalsBackground = () => {
  const petals = Array.from({ length: 15 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {petals.map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-primary"
          style={{
            left: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 1.5 + 0.5}rem`,
            opacity: Math.random() * 0.3 + 0.1,
          }}
          animate={{
            y: ['-10vh', '110vh'],
            x: [`${Math.random() * 20 - 10}vw`, `${Math.random() * 20 - 10}vw`],
            rotate: [Math.random() * 360, Math.random() * 360],
          }}
          transition={{
            duration: Math.random() * 20 + 15,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
            delay: Math.random() * -20,
          }}
        >
          🌸
        </motion.div>
      ))}
    </div>
  );
};

const FeatureCard = ({ icon, title, text }: { icon: string, title: string, text: string }) => (
    <motion.div 
        className="relative bg-white/60 dark:bg-black/20 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-pink-100/50 dark:border-pink-900/20 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.5 }}
    >
        <div className="relative z-10 flex flex-col items-center text-center">
            <span className="text-4xl mb-4">{icon}</span>
            <h3 className="font-headline text-xl font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground">{text}</p>
        </div>
    </motion.div>
)

export default function WelcomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);


  if (loading || user) {
     return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#FDE7EF] to-white dark:from-black dark:to-fuchsia-950/20">
            <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                <p className="text-lg text-muted-foreground">Loading...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FDE7EF] via-[#F9D9E7]/50 to-white dark:from-black dark:to-fuchsia-950/30 -z-10" />
        <FloatingPetalsBackground />
        
        <main className="relative z-10 flex flex-col items-center justify-center text-center px-4">
            {/* Header */}
            <header className="w-full py-6">
              <Logo />
            </header>

            {/* Hero Section */}
            <motion.section 
                className="w-full max-w-3xl mx-auto pt-24 pb-32"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold text-foreground leading-tight tracking-tight">
                    Welcome to a space where your cycle meets calm, clarity, and care… ✨
                </h1>
                <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
                    A gentle companion for your rhythm, wellbeing, and everyday comfort.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button asChild size="lg" className="w-full sm:w-auto hover:scale-[1.02] transition-transform duration-200 shadow-lg">
                        <Link href="/signup">Sign Up</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="w-full sm:w-auto hover:scale-[1.02] transition-transform duration-200">
                        <Link href="/login">Log In</Link>
                    </Button>
                </div>
            </motion.section>

            {/* Feature Showcase */}
            <section className="w-full max-w-5xl mx-auto py-24">
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <FeatureCard icon="🌸" title="Gentle Cycle Tracking" text="Understand your flow, phases, and patterns with clarity." />
                    <FeatureCard icon="💕" title="Supportive Community" text="Share, learn, and feel understood — without judgment." />
                    <FeatureCard icon="🧘‍♀️" title="AI Comfort & Insights" text="Get soft, personalized guidance based on your rhythm." />
                    <FeatureCard icon="🩺" title="Ask a Doctor" text="Connect with trusted experts when you need help." />
                 </div>
            </section>

             {/* Final CTA Section */}
            <section className="w-full max-w-3xl mx-auto py-32">
                 <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                 >
                    <h2 className="text-3xl font-headline font-semibold text-foreground mb-6">
                        Your body has a story. Woomania helps you understand it.
                    </h2>
                    <div className="flex items-center justify-center gap-4">
                         <Button asChild size="lg" className="hover:scale-[1.02] transition-transform duration-200 shadow-lg">
                            <Link href="/signup">Create an Account</Link>
                        </Button>
                        <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            Already have an account? Log in
                        </Link>
                    </div>
                </motion.div>
            </section>
        </main>
    </div>
  );
}
