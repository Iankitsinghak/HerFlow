
import Header from "@/components/layout/header";

export default function AiChatPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="container mx-auto px-4 md:px-6 py-12">
                 <div className="text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline">AI Chat</h1>
                    <p className="text-lg text-muted-foreground mt-2">Ask anything about your health. Coming soon!</p>
                </div>
            </div>
        </div>
    )
}
