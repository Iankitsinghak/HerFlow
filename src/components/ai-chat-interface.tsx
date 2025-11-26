
'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, User, Bot, Loader } from 'lucide-react';
import { streamChat } from '@/ai/flows/chat-flow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface Message {
  role: 'user' | 'model';
  content: string;
}

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
      try {
        const stream = await streamChat({
            history: messages,
            message: input,
        });

        // Add a placeholder for the model's response
        setMessages(prev => [...prev, { role: 'model', content: '' }]);

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
              updatedMessages[updatedMessages.length - 1] = { role: 'model', content: streamedContent };
              return updatedMessages;
          });
        }
      } catch (error) {
        console.error('Error streaming chat:', error);
        setMessages(prev => [...prev, { role: 'model', content: 'Sorry, something went wrong. Please try again.' }]);
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
    <Card className="h-[70vh] flex flex-col">
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.length === 0 ? (
                <div className="text-center text-muted-foreground">
                    <Bot className="mx-auto h-12 w-12 mb-2" />
                    <p>Start a conversation by typing a message below.</p>
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
                     <AvatarFallback className='bg-primary text-primary-foreground'><Bot className='h-5 w-5' /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`p-3 rounded-lg max-w-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && (
                   <Avatar className="w-8 h-8">
                     <AvatarFallback><User className='h-5 w-5' /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
            )}
             {isPending && (
                <div className="flex items-start gap-3">
                     <Avatar className="w-8 h-8">
                        <AvatarFallback className='bg-primary text-primary-foreground'><Bot className='h-5 w-5' /></AvatarFallback>
                    </Avatar>
                    <div className="p-3 rounded-lg bg-muted flex items-center">
                        <Loader className="h-5 w-5 animate-spin" />
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about PCOS, periods, or anything else..."
              autoComplete="off"
              disabled={isPending}
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
