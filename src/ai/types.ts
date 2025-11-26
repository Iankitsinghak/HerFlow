
import { z } from 'genkit';

// Define the structure for a single message in the chat history
export const MessageSchema = z.object({
  role: z.enum(['user', 'model', 'system']),
  content: z.string(),
});
export type Message = z.infer<typeof MessageSchema>;


// Define the input schema for the chat flow
export const ChatRequestSchema = z.object({
  history: z.array(MessageSchema),
  message: z.string(),
});
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
