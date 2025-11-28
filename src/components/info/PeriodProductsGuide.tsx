
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { HeartHandshake, Moon, Sparkles, Droplet, Info } from "lucide-react";

const productsData = [
    {
        emoji: '🩸',
        title: 'Sanitary Pads',
        description: 'Pads are the most widely used and easily available option in Indian stores. They come in various sizes and absorbencies for different flow levels.',
        brands: ['Stayfree', 'Whisper', 'Sofy', 'Nua', 'Niine']
    },
    {
        emoji: '💧',
        title: 'Menstrual Cups',
        description: 'A reusable, bell-shaped cup made of medical-grade silicone. It\'s an eco-friendly and cost-effective option once you get the hang of it.',
        brands: ['Sirona', 'PeeSafe', 'Boondh', 'Sanfe']
    },
    {
        emoji: '✨',
        title: 'Tampons',
        description: 'Tampons are inserted into the vagina to absorb menstrual fluid before it leaves the body. They are discreet and great for physical activities like swimming.',
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
        <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
                {productsData.map(product => (
                    <Card key={product.title} className="shadow-md hover:shadow-lg transition-shadow duration-300 border-primary/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-xl font-headline">
                                <span className="text-4xl">{product.emoji}</span>
                                {product.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">{product.description}</p>
                            <h4 className="font-semibold mb-2 text-primary/90">Example Brands in India:</h4>
                            <div className="flex flex-wrap gap-2">
                                {product.brands.map(brand => <div key={brand} className="text-sm bg-secondary text-secondary-foreground/80 px-2 py-1 rounded-md">{brand}</div>)}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="lg:col-span-1 space-y-6">
                <h2 className="text-2xl font-bold font-headline text-center lg:text-left">Gentle Awareness</h2>
                {awarenessData.map(item => (
                     <Card key={item.title} className="bg-secondary/30 border-primary/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 font-headline text-base">
                                <div className="bg-background p-2 rounded-full shadow-sm">
                                    {item.icon}
                                </div>
                                {item.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{item.text}</p>
                        </CardContent>
                        <CardFooter>
                            <Alert variant="default" className="border-l-4 border-primary/50 text-xs bg-transparent">
                                <AlertDescription>{item.disclaimer}</AlertDescription>
                            </Alert>
                        </CardFooter>
                    </Card>
                ))}
                 <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Disclaimer</AlertTitle>
                    <AlertDescription>
                    The brands and topics listed are for informational purposes only and do not represent an endorsement. For personal medical advice, please talk to a healthcare professional.
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    )
}
