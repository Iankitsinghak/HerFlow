
import { PeriodProductsGuide } from "@/components/info/PeriodProductsGuide";
import Header from "@/components/layout/header";

export default function ProductsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="container mx-auto px-4 md:px-6 py-12">
                 <div className="text-center md:text-left mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline">Period Products Guide</h1>
                    <p className="text-lg text-muted-foreground mt-2">An informational guide to common products available in India.</p>
                </div>
                <PeriodProductsGuide />
            </div>
        </div>
    )
}
