
'use client';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { FloatingPetalsBackground } from '@/components/floating-petals-background';
import { CheckCircle, Heart, Users, Bot, Microscope, HeartHandshake, Lock } from 'lucide-react';
import Image from 'next/image';
import { TabbedFeatures } from '@/components/tabbed-features';
import { TestimonialsCarousel } from '@/components/testimonials-carousel';
import { useTranslation } from '@/context/language-provider';


const StepCard = ({ step, title, description }: { step: string, title: string, description: string }) => (
    <motion.div
        className="flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: parseFloat(step) * 0.1 }}
        viewport={{ once: true, amount: 0.5 }}
    >
        <div className="flex items-center justify-center h-16 w-16 bg-primary/10 text-primary rounded-full font-bold text-2xl font-headline mb-4">
            {step}
        </div>
        <h3 className="font-headline text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground mt-1">{description}</p>
    </motion.div>
);

const ValueCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
     <motion.div
        className="flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.5 }}
    >
        <div className="flex items-center justify-center h-20 w-20 bg-primary/10 text-primary rounded-full mb-4">
            {icon}
        </div>
        <h3 className="font-headline text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground mt-1 max-w-xs">{description}</p>
    </motion.div>
)


export default function WelcomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

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
                <p className="text-lg text-muted-foreground">{t('loading')}</p>
            </div>
        </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
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
                    {t('heroTitle')}
                </h1>
                <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
                    {t('heroSubtitle')}
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button asChild size="lg" className="w-full sm:w-auto hover:scale-[1.02] transition-transform duration-200 shadow-lg">
                        <Link href="/signup">{t('createFreeAccount')}</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="w-full sm:w-auto hover:scale-[1.02] transition-transform duration-200">
                        <Link href="/login">{t('logIn')}</Link>
                    </Button>
                </div>
            </motion.section>

            {/* How It Works Section */}
            <section className="w-full max-w-5xl mx-auto py-24">
                <h2 className="text-3xl font-headline font-semibold text-foreground mb-4">{t('howItWorksTitle')}</h2>
                <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">{t('howItWorksSubtitle')}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
                    <div className="absolute top-8 left-0 w-full h-0.5 bg-border -z-10 hidden md:block"></div>
                    <StepCard step="1" title={t('step1Title')} description={t('step1Description')} />
                    <StepCard step="2" title={t('step2Title')} description={t('step2Description')} />
                    <StepCard step="3" title={t('step3Title')} description={t('step3Description')} />
                </div>
            </section>
            
            {/* New Detailed Feature Showcase */}
            <section className="w-full max-w-7xl mx-auto py-24">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-headline font-bold text-foreground">{t('discoverRhythmTitle')}</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                        {t('discoverRhythmSubtitle')}
                    </p>
                </div>
                <TabbedFeatures />
            </section>

             {/* Detailed Feature Section 2: AI & Community */}
             <section className="w-full max-w-6xl mx-auto py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                 <motion.div
                    className="lg:order-2 text-left"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, amount: 0.5 }}
                >
                    <h2 className="text-3xl sm:text-4xl font-headline font-bold text-foreground">{t('companionTitle')}</h2>
                    <p className="mt-4 text-lg text-muted-foreground">{t('companionSubtitle')}</p>
                    <div className="mt-6 space-y-6">
                        <div className="flex gap-4">
                            <Bot className="h-8 w-8 text-primary shrink-0 mt-1" />
                            <div>
                                <h4 className="font-semibold text-foreground">{t('aiGuideTitle')}</h4>
                                <p className="text-muted-foreground">{t('aiGuideDescription')}</p>
                            </div>
                        </div>
                         <div className="flex gap-4">
                            <Users className="h-8 w-8 text-primary shrink-0 mt-1" />
                            <div>
                                <h4 className="font-semibold text-foreground">{t('communityTitle')}</h4>
                                <p className="text-muted-foreground">{t('communityDescription')}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
                 <motion.div
                    className="lg:order-1"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, amount: 0.5 }}
                >
                     <Image src="https://picsum.photos/seed/women-supporting/600/500" alt="Two women supporting each other" width={600} height={500} className="rounded-2xl shadow-xl border-8 border-white/50" data-ai-hint="women supporting" />
                </motion.div>
            </section>
            
            {/* Trust & Values Section */}
            <section className="w-full max-w-5xl mx-auto py-24">
                 <h2 className="text-3xl font-headline font-semibold text-foreground mb-12">{t('trustTitle')}</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <ValueCard 
                        icon={<Microscope className="h-8 w-8" />}
                        title={t('valueScienceTitle')}
                        description={t('valueScienceDescription')}
                     />
                     <ValueCard 
                        icon={<HeartHandshake className="h-8 w-8" />}
                        title={t('valueEmpathyTitle')}
                        description={t('valueEmpathyDescription')}
                     />
                     <ValueCard 
                        icon={<Lock className="h-8 w-8" />}
                        title={t('valuePrivacyTitle')}
                        description={t('valuePrivacyDescription')}
                     />
                 </div>
            </section>


            {/* Testimonials Section */}
            <section className="w-full max-w-6xl mx-auto py-24 overflow-hidden">
                <h2 className="text-3xl font-headline font-semibold text-foreground mb-12">{t('testimonialsTitle')}</h2>
                <TestimonialsCarousel />
            </section>

             {/* Final CTA Section */}
            <section className="w-full max-w-3xl mx-auto py-32">
                 <motion.div
                    className="bg-white/50 dark:bg-black/20 backdrop-blur-lg border border-pink-100/50 dark:border-pink-900/20 rounded-2xl p-8 sm:p-12 shadow-lg"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                 >
                    <h2 className="text-3xl font-headline font-semibold text-foreground mb-6">
                        {t('finalCtaTitle')}
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                         <Button asChild size="lg" className="w-full sm:w-auto hover:scale-[1.02] transition-transform duration-200 shadow-lg">
                            <Link href="/signup">{t('joinForFree')}</Link>
                        </Button>
                    </div>
                     <Link href="/login" className="mt-4 inline-block text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            {t('alreadyHaveAccount')}
                    </Link>
                </motion.div>
            </section>

            <footer className="py-8 text-center text-muted-foreground text-sm">
                <p>&copy; {new Date().getFullYear()} HerFlow. {t('allRightsReserved')}</p>
            </footer>
        </main>
    </div>
  );
}
