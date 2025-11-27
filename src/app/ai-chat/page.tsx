
import Header from "@/components/layout/header";
import { AiChatInterface } from "@/components/ai-chat-interface";

export default function AiChatPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-1 flex flex-col items-center py-6">
                 <div className="w-full max-w-2xl px-4">
                    <div className="text-left mb-6">
                        <h1 className="text-4xl md:text-5xl font-bold font-headline">Aura</h1>
                        <p className="text-lg text-muted-foreground mt-2">Your AI companion for health and well-being.</p>
                    </div>
                    <AiChatInterface />
                </div>
            </div>
        </div>
    )
}
