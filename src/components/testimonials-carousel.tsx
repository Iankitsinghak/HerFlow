
'use client';

import { motion } from 'framer-motion';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const testimonials = [
    {
        quote: "HerFlow helped me finally understand my body. The daily plans are a game-changer for my PMS.",
        author: "Priya S.",
        role: "Member since 2025"
    },
    {
        quote: "I've never felt so seen. The community is so supportive, and the AI chat feels like talking to a kind friend.",
        author: "Ananya K.",
        role: "Member since 2025"
    },
    {
        quote: "The visual graphs made me realize patterns I never knew existed. So empowering!",
        author: "Meera D.",
        role: "Member since 2025"
    },
    {
        quote: "As someone with PCOS, this app has been invaluable. I feel more in control of my health.",
        author: "Aisha P.",
        role: "Member since 2025"
    },
    {
        quote: "Finally, a health app that speaks my language. It's beautiful, intuitive, and so gentle.",
        author: "Ishani M.",
        role: "Member since 2025"
    },
    {
        quote: "The AI wellness plans are surprisingly accurate and helpful. It's like having a personal health coach.",
        author: "Diya R.",
        role: "Member since 2025"
    },
    {
        quote: "I love the community forum. It's a safe space to ask questions and not feel alone.",
        author: "Saanvi B.",
        role: "Member since 2025"
    },
    {
        quote: "Tracking my symptoms has never been easier. The interface is just so simple and calming.",
        author: "Zara V.",
        role: "Member since 2025"
    },
    {
        quote: "This app takes the anxiety out of cycle tracking. The predictions are great and the insights are fascinating.",
        author: "Kavya J.",
        role: "Member since 2025"
    },
    {
        quote: "It's more than just a period tracker; it's a complete wellness companion. Highly recommend!",
        author: "Riya G.",
        role: "Member since 2025"
    },
    {
        quote: "The privacy-first approach made me feel safe to share my data. Thank you for building this.",
        author: "Naina T.",
        role: "Member since 2025"
    },
    {
        quote: "HerFlow is a breath of fresh air in the world of health apps. It truly cares.",
        author: "Advika C.",
        role: "Member since 2025"
    }
];


const TestimonialCard = ({ quote, author, role }: { quote: string, author: string, role: string }) => (
    <div className="bg-white/80 dark:bg-black/30 backdrop-blur-xl rounded-2xl p-6 h-full flex flex-col justify-center shadow-md border border-pink-100/50 dark:border-pink-900/20">
        <p className="text-foreground/80 italic text-sm md:text-base">"{quote}"</p>
        <p className="mt-4 font-semibold text-primary">{author}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
    </div>
);


export function TestimonialsCarousel() {
    return (
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            plugins={[
                Autoplay({
                    delay: 4000,
                    stopOnInteraction: true,
                })
            ]}
            className="w-full"
        >
            <CarouselContent>
                {testimonials.map((testimonial, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1 h-full">
                           <TestimonialCard {...testimonial} />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
        </Carousel>
    );
}
