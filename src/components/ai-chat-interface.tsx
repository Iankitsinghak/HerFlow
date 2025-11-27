
'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, User, Sparkles, Loader } from 'lucide-react';
import { streamChat } from '@/ai/flows/chat-flow';
import type { ChatRequest, Message } from '@/ai/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';


export function AiChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    startTransition(async () => {
      // Add a placeholder for the model's response immediately
      const placeholderMessage: Message = { role: 'model', content: '' };
      setMessages(prev => [...prev, placeholderMessage]);

      try {
        const stream = await streamChat({
            history: newMessages, // Pass the most up-to-date history
            message: input,
        });

        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let streamedContent = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }
          streamedContent += decoder.decode(value);
          
          setMessages(prev => {
              const updatedMessages = [...prev];
              // Always update the last message in the array, which is our placeholder
              if (updatedMessages.length > 0) {
                 updatedMessages[updatedMessages.length - 1] = { role: 'model', content: streamedContent };
              }
              return updatedMessages;
          });
        }
      } catch (error) {
        console.error('Error streaming chat:', error);
        const errorMessage: Message = { role: 'model', content: 'Sorry, something went wrong. Please try again.' };
        setMessages(prev => {
           const updatedMessages = [...prev];
           if (updatedMessages.length > 0) {
             updatedMessages[updatedMessages.length - 1] = errorMessage;
           }
           return updatedMessages;
        });
      }
    });
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  return (
    <Card className="h-[70vh] flex flex-col shadow-lg border-primary/10">
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4 sm:p-6" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.length === 0 ? (
                <div className="text-center text-muted-foreground pt-10">
                    <Sparkles className="mx-auto h-12 w-12 text-primary/50 mb-4" />
                    <h2 className="text-xl font-headline">Hello!</h2>
                    <p className='mt-1'>How can I support you today?</p>
                </div>
            ) : (
                messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'justify-end' : ''
                }`}
              >
                {message.role === 'model' && (
                  <Avatar className="w-8 h-8">
                     <AvatarFallback className='bg-primary/10 text-primary'><Sparkles className='h-5 w-5' /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`p-3 rounded-lg max-w-xl prose-p:my-0 prose-p:leading-normal prose dark:prose-invert ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content === '' && isPending ? <Loader className="h-5 w-5 animate-spin text-muted-foreground" /> : message.content}</p>
                </div>
                {message.role === 'user' && (
                   <Avatar className="w-8 h-8">
                     <AvatarFallback className="bg-secondary"><User className='h-5 w-5' /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t bg-background/80">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about PCOS, periods, or anything else..."
              autoComplete="off"
              disabled={isPending}
              className="text-base"
            />
            <Button type="submit" size="icon" disabled={!input.trim() || isPending}>
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
