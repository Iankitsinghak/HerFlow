
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

export function PeriodProductsGuide() {
    return (
        <div className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsData.map(product => (
                    <Card key={product.title}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-xl font-headline">
                                <span className="text-3xl">{product.emoji}</span>
                                {product.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
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
    )
}
