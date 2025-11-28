
import Header from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mockQuestions = [
    {
        id: 1,
        question: "Is it normal to have irregular periods after stopping birth control?",
        answer: "Yes, it's quite common. It can take a few months for your body's natural hormone cycle to regulate after stopping hormonal birth control. If it persists for more than 3-6 months, it's a good idea to check in with your doctor.",
        doctor: "Dr. Emily Carter",
        specialty: "Gynecologist"
    },
    {
        id: 2,
        question: "What are the early signs of perimenopause?",
        answer: "Early signs can be subtle and varied. They often include changes in your menstrual cycle (irregularity, heavier or lighter flow), sleep problems, mood swings, and hot flashes. Every woman's experience is different.",
        doctor: "Dr. Jane Doe",
        specialty: "Endocrinologist"
    }
]

export default function AskDoctorPage() {
  return (
    <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-bold font-headline">Ask Our Experts</h1>
                        <p className="text-lg text-muted-foreground mt-2">Get answers to your health questions from qualified professionals.</p>
                    </div>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Submit Your Question</CardTitle>
                            <CardDescription>Your question will be reviewed and answered by a medical expert. It may be posted anonymously to help others.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea placeholder="Type your question here..." className="min-h-[120px]" />
                            <Button>Submit Question</Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold font-headline">Recently Answered</h2>
                    <Accordion type="single" collapsible className="w-full">
                        {mockQuestions.map(item => (
                             <AccordionItem value={`item-${item.id}`} key={item.id}>
                                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                                <AccordionContent className="space-y-4">
                                    <p>{item.answer}</p>
                                    <div className="flex items-center gap-2 pt-2 border-t">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage />
                                            <AvatarFallback>{item.doctor.charAt(3)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">{item.doctor}</p>
                                            <p className="text-xs text-muted-foreground">{item.specialty}</p>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </div>
    </div>
  )
}
