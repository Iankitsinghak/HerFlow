'use server';
/**
 * @fileOverview A flow to generate community post content based on a title.
 * 
 * - generatePostContent - Generates post content from a title.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input and Output Schemas
const PostWriterRequestSchema = z.object({
  title: z.string().describe("The title of the community post."),
});
export type PostWriterRequest = z.infer<typeof PostWriterRequestSchema>;

const PostWriterResponseSchema = z.object({
  content: z.string().describe("The generated body content for the community post."),
});
export type PostWriterResponse = z.infer<typeof PostWriterResponseSchema>;


// Prompt Definition
const postWriterPrompt = ai.definePrompt({
    name: 'postWriterPrompt',
    input: { schema: PostWriterRequestSchema },
    output: { schema: PostWriterResponseSchema },
    prompt: `You are Woomania, a caring and empathetic writing assistant for a women's health community forum. Your voice is warm, supportive, and gentle.

    A user has provided the following title for their post:
    "{{{title}}}"

    Your task is to write a short, engaging, and supportive post body (2-4 sentences) that encourages discussion and makes the user feel heard. Start by acknowledging the topic and then ask an open-ended question to the community.

    Example for title "Feeling so tired during my periods":
    "It can be so draining when fatigue hits hard during our cycles. I completely understand that feeling of wanting to do nothing but rest. How do you all cope with low energy and find moments of comfort during your period? Sharing any small tips would be wonderful. 💖"

    Example for title "Anxious about first gynecology visit":
    "Taking that first step to see a gynecologist can bring up so many feelings of anxiety, and that's completely okay. It's a big step for your health journey. For those who have been, what helped you feel more comfortable and prepared for your first appointment? Your advice could really help someone feel less alone. 🙏"

    Now, generate the content for the user's post.`,
});

// Flow Definition
const postWriterFlow = ai.defineFlow(
  {
    name: 'postWriterFlow',
    inputSchema: PostWriterRequestSchema,
    outputSchema: PostWriterResponseSchema,
  },
  async (request) => {
    const { output } = await postWriterPrompt(request);
    return output!;
  }
);

// Exported Function
export async function generatePostContent(request: PostWriterRequest): Promise<PostWriterResponse> {
    return await postWriterFlow(request);
}
