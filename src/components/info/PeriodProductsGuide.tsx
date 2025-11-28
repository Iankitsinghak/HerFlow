
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HeartHandshake, Moon, Sparkles } from "lucide-react";

const productsData = [
    {
        emoji: '🩸',
        title: 'Sanitary Pads',
        description: 'Pads are the most widely used and easily available option in Indian stores. They come in various sizes and absorbencies.',
        brands: ['Stayfree', 'Whisper', 'Sofy', 'Nua', 'Niine']
    },
    {
        emoji: '💧',
        title: 'Menstrual Cups',
        description: 'A reusable, bell-shaped cup made of medical-grade silicone. It\'s an eco-friendly and cost-effective option once you get used to it.',
        brands: ['Sirona', 'PeeSafe', 'Boondh', 'Sanfe']
    },
    {
        emoji: '✨',
        title: 'Tampons',
        description: 'Tampons are inserted into the vagina to absorb menstrual fluid. They are discreet and good for physical activities like swimming.',
        brands: ['Sirona', 'OB Tampons', 'Tampax']
    }
];

const awarenessData = [
    {
        emoji: '🌸',
        icon: <Sparkles className="h-6 w-6 text-pink-500" />,
        title: 'PCOS basics',
        text: 'Irregular periods, acne, hair growth, or weight changes can be signs of PCOS for some women. Many Indian women experience this.',
        disclaimer: 'If you notice these patterns often, consider talking to a gynecologist or endocrinologist.'
    },
    {
        emoji: '🌙',
        icon: <Moon className="h-6 w-6 text-purple-500" />,
        title: 'Thyroid & your cycle',
        text: 'Low or high thyroid levels can sometimes affect your energy, mood, and cycle regularity.',
        disclaimer: 'Only a doctor and a blood test can confirm thyroid issues. If you’re worried, please consult a healthcare professional.'
    },
    {
        emoji: '💗',
        icon: <HeartHandshake className="h-6 w-6 text-red-500" />,
        title: 'Listen to your body',
        text: 'Woomania can help you notice patterns, but it cannot diagnose or treat any condition.',
        disclaimer: 'When in doubt, always talk to a doctor you trust.'
    }
]

export function PeriodProductsGuide() {
    return (
        <div className="space-y-12">
            <div className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {productsData.map(product => (
                        <Card key={product.title} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-xl font-headline">
                                    <span className="text-3xl">{product.emoji}</span>
                                    {product.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-muted-foreground mb-4">{product.description}</p>
                                <h4 className="font-semibold mb-2">Example Brands in India:</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground">
                                    {product.brands.map(brand => <li key={brand}>{brand}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                 <Alert>
                    <AlertDescription>
                    Disclaimer: The brands listed are for informational purposes only and do not represent an endorsement. For personal medical advice or help choosing a product, please talk to a healthcare professional.
                    </AlertDescription>
                </Alert>
            </div>
            
            <div className="space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold font-headline">PCOS & Thyroid — Gentle Awareness</h2>
                    <p className="text-muted-foreground mt-2">A quick guide to common conditions affecting women's health in India.</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {awarenessData.map(item => (
                        <Card key={item.title} className="bg-secondary/30 border-primary/10">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 font-headline">
                                    <div className="bg-background p-2 rounded-full">
                                        {item.icon}
                                    </div>
                                    {item.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{item.text}</p>
                            </CardContent>
                            <CardFooter>
                                <Alert variant="default" className="border-l-4 border-primary/50 text-xs">
                                    <AlertDescription>{item.disclaimer}</AlertDescription>
                                </Alert>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
