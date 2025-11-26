
'use server';
/**
 * @fileOverview A conversational AI flow for the Woomania app.
 *
 * - streamChat - A streaming function that takes conversation history and returns an AI response stream.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { ChatRequest, ChatRequestSchema } from '@/ai/types';

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

    const llmResponse = await ai.generate({
        prompt: message,
        history: history,
        model: 'googleai/gemini-2.5-flash',
        config: {
            // You can add safety settings or other configurations here
        },
        system: systemPrompt,
    });

    return llmResponse.text;
  }
);


export async function streamChat(request: ChatRequest) {
    const systemInstruction = `You are Woomania AI, a friendly and empathetic women's health assistant. Your goal is to provide helpful, safe, and informative answers related to women's health, menstrual cycles, and well-being.
    
IMPORTANT: You are not a doctor and must not provide medical advice. Always preface advice-seeking questions with a disclaimer like: "While I'm not a medical professional, I can share some general information. It's always best to consult with a doctor for personal medical advice."

Keep your answers concise, easy to understand, and supportive.`;

    const { stream, response } = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        prompt: request.message,
        history: request.history,
        system: systemInstruction,
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
            if (value?.text) {
                text += value.text;
                controller.enqueue(textEncoder.encode(value.text));
            }
        },
    });

    return readableStream;
}
