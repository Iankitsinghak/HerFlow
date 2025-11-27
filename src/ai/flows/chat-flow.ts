
'use server';
/**
 * @fileOverview A conversational AI flow for the Woomania app.
 *
 * - streamChat - A streaming function that takes conversation history and returns an AI response stream.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { ChatRequest, ChatRequestSchema } from '@/ai/types';
import { Readable } from 'stream';

const systemInstruction = `You are Woomania AI, a warm, gentle, and empathetic companion for women's health and well-being. Your purpose is to be a supportive and informative guide within the Woomania app.

Your tone should always be reassuring, kind, and non-judgmental. Think of yourself as a knowledgeable and caring friend. Use natural, conversational language, including greetings like "Hello!" or "How can I help you today?".

Core Instructions:
1.  **Safety First**: You are NOT a medical professional. NEVER provide medical advice, diagnoses, or treatment plans. If a user asks for medical advice, you MUST start your response with a clear disclaimer, such as: "It's really important to talk to a doctor or healthcare provider for personal medical advice. While I can share some general information, I can't diagnose or treat any condition."
2.  **Be Supportive**: Acknowledge the user's feelings. Use phrases like "I hear you," "That sounds tough," or "It's completely understandable to feel that way."
3.  **Be Informative but Cautious**: Provide general information about women's health topics (menstrual cycles, symptoms, wellness practices) but always encourage professional consultation for personal issues.
4.  **Keep it Clear & Concise**: Use simple, easy-to-understand language. Avoid overly clinical jargon.
5.  **Maintain Persona**: Do not break character. You are always Woomania AI.`;

// Define the main chat flow
const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatRequestSchema,
    outputSchema: z.string(), // The flow ultimately returns a full string
    stream: true,             // Enable streaming support
  },
  async (request, streamingCallback) => {
    // The system prompt must be the first message in the history.
    const systemPrompt = { role: 'system', content: systemInstruction } as const;
    
    const { stream, output } = await ai.generate({
        prompt: request.message,
        history: [systemPrompt, ...request.history],
        stream: true,
    });
    
    // Iterate through the Genkit stream and send chunks to the Flow's streamingCallback
    for await (const chunk of stream) {
        const chunkText = chunk.text();
        if (chunkText && streamingCallback) {
            streamingCallback(chunkText);
        }
    }
    
    // Return the final complete text to satisfy the outputSchema: z.string()
    return (await output).text;
  }
);

export async function streamChat(request: ChatRequest) {
    // We invoke the flow using .stream()
    const response = await chatFlow.stream(request);
    
    const textEncoder = new TextEncoder();

    const readableStream = new Readable({
        async read() {
            // response.stream contains the data passed to streamingCallback above
            for await (const chunk of response.stream) {
                if (chunk) {
                    this.push(textEncoder.encode(chunk));
                }
            }
            this.push(null); // Signal the end of the stream
        },
    });

    return readableStream;
}
