
'use server';
/**
 * @fileOverview A conversational AI flow for the Woomania app.
 *
 * - streamChat - A streaming function that takes conversation history and returns an AI response stream.
 * - ChatRequest - The input type for the streamChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define the structure for a single message in the chat history
const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

// Define the input schema for the chat flow
export const ChatRequestSchema = z.object({
  history: z.array(MessageSchema),
  message: z.string(),
});
export type ChatRequest = z.infer<typeof ChatRequestSchema>;

// Define the main chat flow
const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatRequestSchema,
    outputSchema: z.string(),
  },
  async (request) => {
    const systemPrompt = `You are Woomania AI, a friendly and empathetic women's health assistant. Your goal is to provide helpful, safe, and informative answers related to women's health, menstrual cycles, and well-being.
    
    IMPORTANT: You are not a doctor and must not provide medical advice. Always preface advice-seeking questions with a disclaimer like: "While I'm not a medical professional, I can share some general information. It's always best to consult with a doctor for personal medical advice."
    
    Keep your answers concise, easy to understand, and supportive.`;

    const { history, message } = request;

    // Construct the full prompt for the model
    const fullPrompt = {
        system: systemPrompt,
        history: history,
        prompt: message,
    };

    const llmResponse = await ai.generate({
        prompt: fullPrompt.prompt,
        history: fullPrompt.history,
        config: {
            // You can add safety settings or other configurations here
        },
        model: 'googleai/gemini-2.5-flash'
    });

    return llmResponse.text;
  }
);


export async function streamChat(request: ChatRequest) {
    const systemInstruction = `You are Woomania AI, a friendly and empathetic women's health assistant. Your goal is to provide helpful, safe, and informative answers related to women's health, menstrual cycles, and well-being.
    
IMPORTANT: You are not a doctor and must not provide medical advice. Always preface advice-seeking questions with a disclaimer like: "While I'm not a medical professional, I can share some general information. It's always best to consult with a doctor for personal medical advice."

Keep your answers concise, easy to understand, and supportive.`;

    const model = ai.getModel('googleai/gemini-2.5-flash');

    const { stream, response } = await ai.generate({
        model,
        prompt: [
            { role: 'system', content: systemInstruction },
            ...request.history,
            { role: 'user', content: request.message },
        ],
        stream: true,
    });
    
    let text = '';
    const streamReader = stream.getReader();
    const textEncoder = new TextEncoder();

    const readableStream = new ReadableStream({
        async pull(controller) {
            const { done, value } = await streamReader.read();
            if (done) {
                controller.close();
                await response; // Wait for the full response to be processed by Genkit
                return;
            }
            text += value.text;
            controller.enqueue(textEncoder.encode(value.text));
        },
    });

    return readableStream;
}
