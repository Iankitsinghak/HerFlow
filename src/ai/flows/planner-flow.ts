
'use server';
/**
 * @fileOverview A flow to generate a daily wellness plan based on cycle symptoms.
 * 
 * - generatePlanner - Generates a wellness plan.
 */

import { ai } from '@/ai/genkit';
import { PlannerRequest, PlannerRequestSchema, PlannerResponse, PlannerResponseSchema } from './planner-types';

const plannerPrompt = ai.definePrompt({
    name: 'wellnessPlannerPrompt',
    input: { schema: PlannerRequestSchema },
    output: { schema: PlannerResponseSchema },
    prompt: `You are Woomania AI, a caring and knowledgeable women's health companion.
    A user is reporting the following symptoms: {{{symptoms}}}.

    Your task is to create a supportive, simple, and actionable daily wellness plan to help them manage these symptoms. The plan should be gentle and focus on self-care.

    1.  **Generate a Daily Plan**: Create a simple 3-part plan for their day (Morning, Afternoon, Evening). For each part, suggest one concrete activity and a brief, empathetic reason why it helps.
    2.  **Provide General Advice**: Write a short paragraph of general, encouraging advice for managing their symptoms. Keep it warm and supportive.
    3.  **Doctor Recommendation**: Based on the severity and nature of the symptoms, provide a recommendation:
        - 'normal': For common and mild symptoms like light cramps, minor bloating, or mild fatigue.
        - 'monitor': For moderate or persistent symptoms. Advise the user to keep an eye on them.
        - 'seek_advice': For severe symptoms (e.g., 'severe pain', 'heavy bleeding'), unusual combinations, or anything potentially serious. Strongly but gently recommend they speak to a doctor.

    Example for input ['Cramps', 'Fatigue']:
    - Plan: Morning - Gentle stretching, Afternoon - Herbal tea break, Evening - Warm bath.
    - Advice: It's okay to slow down. Listen to your body and give it the rest it needs.
    - Recommendation: 'normal'.

    Example for input ['Severe headache', 'Dizziness']:
    - Plan: Morning - Rest in a quiet, dark room, Afternoon - Hydrate with water, Evening - Avoid screens.
    - Advice: These symptoms sound really challenging. Please prioritize your comfort and don't push yourself.
    - Recommendation: 'seek_advice'.

    Generate the plan for the user now.`,
});

const plannerFlow = ai.defineFlow(
  {
    name: 'plannerFlow',
    inputSchema: PlannerRequestSchema,
    outputSchema: PlannerResponseSchema,
  },
  async (request) => {
    const { output } = await plannerPrompt(request);
    return output!;
  }
);


export async function generatePlanner(request: PlannerRequest): Promise<PlannerResponse> {
    return await plannerFlow(request);
}

