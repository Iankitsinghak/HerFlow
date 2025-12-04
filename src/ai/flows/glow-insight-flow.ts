
'use server';
/**
 * @fileOverview A flow to generate a personalized insight based on daily glow logs.
 * 
 * - generateGlowInsight - Generates a wellness insight.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { GlowLogInput } from '@/components/glow-tracker';

// Define Zod schemas for stricter type validation
const GlowLogInputSchema = z.object({
    skinGlow: z.string().optional(),
    bloating: z.string().optional(),
    hairFrizz: z.string().optional(),
    cravings: z.string().optional(),
    energy: z.string().optional(),
    mood: z.string().optional(),
}).describe("A user's daily wellness log data.");

const GlowInsightRequestSchema = z.object({
  cyclePhase: z.string().describe("The user's current menstrual cycle phase (e.g., 'Follicular', 'Luteal')."),
  logData: GlowLogInputSchema,
});
export type GlowInsightRequest = z.infer<typeof GlowInsightRequestSchema>;

const GlowInsightResponseSchema = z.object({
  insight: z.string().describe("A short, gentle, and actionable insight (1-2 sentences) based on the user's logs and cycle phase. The tone should be like a caring friend."),
});
export type GlowInsightResponse = z.infer<typeof GlowInsightResponseSchema>;


const prompt = ai.definePrompt({
    name: 'glowInsightPrompt',
    input: { schema: GlowInsightRequestSchema },
    output: { schema: GlowInsightResponseSchema },
    prompt: `You are Woomania, a warm and caring women's health companion. Your voice is gentle and supportive.

    A user is in their {{{cyclePhase}}} phase and has logged the following for today:
    {{#if logData.skinGlow}} - Skin: {{{logData.skinGlow}}}{{/if}}
    {{#if logData.energy}} - Energy: {{{logData.energy}}}{{/if}}
    {{#if logData.mood}} - Mood: {{{logData.mood}}}{{/if}}
    {{#if logData.bloating}} - Bloating: {{{logData.bloating}}}{{/if}}
    {{#if logData.cravings}} - Cravings: {{{logData.cravings}}}{{/if}}
    
    Based ONLY on this information, provide one short, kind, and actionable insight. The insight should connect one of the logs to the cycle phase. Be empathetic. Add a relevant emoji at the end.

    Example for Luteal phase with "Low" energy:
    "It's completely normal to feel lower energy during the luteal phase. A warm cup of herbal tea could be a lovely way to find a moment of calm. ☕"

    Example for Follicular phase with "Glowy" skin:
    "That 'glowy' skin feeling is one of the lovely parts of the follicular phase as your hormones shift. Enjoy this radiant moment! ✨"
    
    Example for Luteal phase with "Sad" mood:
    "Feeling sad is okay, especially in the luteal phase. Be extra gentle with yourself today; maybe watch a comforting movie. 💖"
    
    Generate an insight now for the user.`,
});

const glowInsightFlow = ai.defineFlow(
  {
    name: 'glowInsightFlow',
    inputSchema: GlowInsightRequestSchema,
    outputSchema: GlowInsightResponseSchema,
  },
  async (request) => {
    // If no logs are provided, return a default message without calling the AI
    if (Object.keys(request.logData).length === 0) {
        return { insight: "Log how you're feeling today to get a personalized insight. 🌸" };
    }
    
    const { output } = await prompt(request);
    return output!;
  }
);

export async function generateGlowInsight(request: GlowInsightRequest): Promise<GlowInsightResponse> {
    return await glowInsightFlow(request);
}
