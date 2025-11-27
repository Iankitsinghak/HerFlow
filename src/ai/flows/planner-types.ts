
import { z } from 'genkit';

export const PlannerRequestSchema = z.object({
  symptoms: z.array(z.string()).describe("A list of symptoms the user is experiencing, e.g., ['Cramps', 'Bloating', 'Fatigue']"),
});
export type PlannerRequest = z.infer<typeof PlannerRequestSchema>;

export const PlannerResponseSchema = z.object({
  plan: z.array(z.object({
    time: z.string().describe("A specific time of day for the activity, e.g., 'Morning (8 AM)'."),
    activity: z.string().describe("A concise activity suggestion, e.g., 'Gentle Stretching'."),
    reason: z.string().describe("A brief explanation of why this activity is helpful for the given symptoms."),
  })).describe("A schedule of activities for the day."),
  advice: z.string().describe("General wellness advice and encouragement based on the symptoms."),
  doctorRecommendation: z.enum(['normal', 'monitor', 'seek_advice']).describe("A recommendation on whether to see a doctor. 'normal' for common, manageable symptoms. 'monitor' for symptoms that should be watched. 'seek_advice' for severe or concerning symptoms."),
});
export type PlannerResponse = z.infer<typeof PlannerResponseSchema>;
