
import { PeriodProductsGuide } from "@/components/info/PeriodProductsGuide";
import { CyclePhasesGuide } from "@/components/info/CyclePhasesGuide";
import Header from "@/components/layout/header";
import { HeartHandshake } from "lucide-react";

export default function ProductsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-1 bg-gradient-to-b from-background to-pink-50 dark:from-black dark:to-fuchsia-950/10">
                <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <div className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full p-3 mb-4">
                            <HeartHandshake className="h-8 w-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground">
                            Your Gentle Health Guide
                        </h1>
                        <p className="text-lg text-muted-foreground mt-3">
                            A supportive space to learn about your body. Explore cycle phases, common products, and gentle health topics with clarity and confidence.
                        </p>
                    </div>

                    <div className="space-y-24">
                        <CyclePhasesGuide />
                        <PeriodProductsGuide />
                    </div>
                </div>
            </div>
        </div>
    )
}
