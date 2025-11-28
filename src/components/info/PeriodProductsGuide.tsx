
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { HeartHandshake, Moon, Sparkles, Droplet, Info, BookOpen } from "lucide-react";

const productsData = [
    {
        icon: <Droplet className="h-8 w-8 text-pink-500" />,
        title: 'Sanitary Pads',
        description: 'Pads are the most widely used and easily available option in Indian stores. They come in various sizes and absorbencies for different flow levels, making them a reliable choice for many.',
        brands: ['Stayfree', 'Whisper', 'Sofy', 'Nua', 'Niine']
    },
    {
        icon: <Sparkles className="h-8 w-8 text-purple-500" />,
        title: 'Menstrual Cups',
        description: 'A reusable, bell-shaped cup made of medical-grade silicone. It\'s an eco-friendly and cost-effective option that can be worn for up to 12 hours once you get the hang of it.',
        brands: ['Sirona', 'PeeSafe', 'Boondh', 'Sanfe']
    },
    {
        icon: <Moon className="h-8 w-8 text-indigo-500" />,
        title: 'Tampons',
        description: 'Tampons are inserted into the vagina to absorb menstrual fluid before it leaves the body. They are discreet and great for physical activities like swimming or sports.',
        brands: ['Sirona', 'OB Tampons', 'Tampax']
    }
];

const awarenessData = [
    {
        icon: <Sparkles className="h-6 w-6 text-pink-500" />,
        title: 'PCOS Basics',
        text: 'Irregular periods, acne, excess hair growth, or weight changes can be signs of PCOS for some women. Many Indian women experience this.',
        disclaimer: 'If you notice these patterns often, consider talking to a gynecologist or endocrinologist.'
    },
    {
        icon: <Moon className="h-6 w-6 text-purple-500" />,
        title: 'Thyroid & Your Cycle',
        text: 'Low or high thyroid levels can sometimes affect your energy, mood, and the regularity of your menstrual cycle.',
        disclaimer: 'Only a doctor and a blood test can confirm thyroid issues. If you’re worried, please consult a healthcare professional.'
    },
    {
        icon: <HeartHandshake className="h-6 w-6 text-red-500" />,
        title: 'Listen to Your Body',
        text: 'HerFlow can help you notice patterns, but it cannot diagnose or treat any condition. Your well-being is the priority.',
        disclaimer: 'When in doubt, always talk to a doctor or a trusted healthcare provider.'
    }
]

export function PeriodProductsGuide() {
    return (
        <div className="space-y-16">
            {/* Products Section */}
            <section>
                 <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold font-headline">Period Products in India</h2>
                    <p className="text-muted-foreground mt-2">Understanding your options for managing your flow.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {productsData.map(product => (
                        <Card key={product.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-primary/10 bg-white/50 dark:bg-card/50 backdrop-blur-lg rounded-2xl overflow-hidden">
                            <CardHeader className="bg-primary/5 p-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white p-3 rounded-full shadow-inner-soft">
                                        {product.icon}
                                    </div>
                                    <CardTitle className="text-xl font-headline">{product.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{product.description}</p>
                                <h4 className="font-semibold mb-2 text-primary/90 text-xs uppercase tracking-wider">Common Brands:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {product.brands.map(brand => <div key={brand} className="text-xs bg-secondary text-secondary-foreground/80 px-2 py-1 rounded-md">{brand}</div>)}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Awareness Section */}
            <section>
                 <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold font-headline">Gentle Health Awareness</h2>
                    <p className="text-muted-foreground mt-2">A few common topics that can affect your cycle.</p>
                </div>
                <div className="grid lg:grid-cols-3 gap-6">
                     {awarenessData.map(item => (
                     <Card key={item.title} className="bg-secondary/20 dark:bg-card/70 border-primary/10 rounded-2xl shadow-md flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 font-headline text-base">
                                <div className="bg-white dark:bg-card p-2 rounded-full shadow-sm">
                                    {item.icon}
                                </div>
                                {item.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-sm text-muted-foreground">{item.text}</p>
                        </CardContent>
                        <CardFooter>
                            <Alert variant="default" className="border-l-4 border-primary/50 text-xs bg-transparent p-3">
                                <AlertDescription>{item.disclaimer}</AlertDescription>
                            </Alert>
                        </CardFooter>
                    </Card>
                ))}
                </div>
            </section>
            
            <Alert className="max-w-3xl mx-auto bg-card/60 border-border shadow-sm">
                <Info className="h-4 w-4" />
                <AlertTitle>Disclaimer</AlertTitle>
                <AlertDescription>
                The brands and topics listed are for informational purposes only and do not represent an endorsement. For personal medical advice, please talk to a healthcare professional.
                </AlertDescription>
            </Alert>
        </div>
    )
}
