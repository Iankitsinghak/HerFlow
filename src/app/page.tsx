import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { default as PlaceHolderImagesData } from '@/lib/placeholder-images.json';
import { Calendar, Heart, MessageCircle, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/header';

const PlaceHolderImages = PlaceHolderImagesData.placeholderImages;

const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-1');

const featureCards = [
  {
    icon: <Heart className="w-8 h-8 text-primary" />,
    title: 'Cycle Logging',
    description: 'Track your menstrual cycle with ease and gain insights into your health patterns.',
    image: PlaceHolderImages.find((img) => img.id === 'feature-1'),
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: 'Community Support',
    description: 'Connect with a supportive community, share experiences, and grow together.',
    image: PlaceHolderImages.find((img) => img.id === 'feature-2'),
  },
  {
    icon: <MessageCircle className="w-8 h-8 text-primary" />,
    title: 'Expert Advice',
    description: "Ask questions and get reliable information from healthcare professionals.",
    image: PlaceHolderImages.find((img) => img.id === 'feature-3'),
  },
];


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-card">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            {heroImage && (
              <Image
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                data-ai-hint={heroImage.imageHint}
                height={600}
                src={heroImage.imageUrl}
                width={600}
              />
            )}
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                  Understand Your Body, Empower Your Life
                </h1>
                <p className="max-w-[600px] text-foreground/80 md:text-xl">
                  Woomania is your personal guide to women's health, offering cycle tracking, community support, and expert advice, all in one place.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/signup">Join for Free</Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">A Holistic Approach to Your Health</h2>
              <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We provide the tools and support you need to navigate every stage of your health journey with confidence.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 pt-12">
            {featureCards.map((feature) => (
              <Card key={feature.title} className="h-full transform hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-2xl">
                <CardHeader className="flex flex-col items-center text-center space-y-2">
                    {feature.image && (
                        <Image
                            alt={feature.title}
                            className="rounded-t-lg object-cover w-full aspect-video"
                            data-ai-hint={feature.image.imageHint}
                            height={225}
                            src={feature.image.imageUrl}
                            width={400}
                        />
                    )}
                  <div className="p-4 flex flex-col items-center text-center">
                    {feature.icon}
                    <CardTitle className="mt-4 font-headline">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-foreground/80">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Ready to Take Control of Your Health?</h2>
            <p className="mx-auto max-w-[600px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join our community today and start your journey towards a healthier, more informed you.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
            <Button asChild size="lg" className="w-full">
              <Link href="/signup">Sign Up Now</Link>
            </Button>
            <p className="text-xs text-foreground/60">It's free to get started.</p>
          </div>
        </div>
      </section>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-foreground/80">&copy; 2024 Woomania. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
