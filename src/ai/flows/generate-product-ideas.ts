'use server';

/**
 * @fileOverview AI-powered flow for generating product, service, and membership ideas based on target audience and content theme.
 *
 * - generateProductIdeas - A function that generates product, service, and membership ideas.
 * - GenerateProductIdeasInput - The input type for the generateProductIdeas function.
 * - GenerateProductIdeasOutput - The return type for the generateProductIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductIdeasInputSchema = z.object({
  targetAudience: z.string().describe('The target audience for the ideas.'),
  contentTheme: z.string().describe('The content theme for the ideas.'),
});
export type GenerateProductIdeasInput = z.infer<typeof GenerateProductIdeasInputSchema>;

const GenerateProductIdeasOutputSchema = z.object({
  productIdea: z.string().describe('A scalable digital product idea like an ebook, digital planner, or template pack, suitable for selling via online ads.'),
  serviceIdea: z.string().describe('An online service idea that can be delivered one-to-many, such as a paid webinar, an online workshop, or group consultation.'),
  membershipIdea: z.string().describe('An online membership idea for recurring revenue, which must be a private Telegram or Discord community, or an exclusive content subscription.'),
});
export type GenerateProductIdeasOutput = z.infer<typeof GenerateProductIdeasOutputSchema>;

export async function generateProductIdeas(
  input: GenerateProductIdeasInput
): Promise<GenerateProductIdeasOutput> {
  return generateProductIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductIdeasPrompt',
  input: {schema: GenerateProductIdeasInputSchema},
  output: {schema: GenerateProductIdeasOutputSchema},
  prompt: `You are an expert product strategist specializing in scalable, digital-first business models. Based on the provided target audience and content theme, generate three distinct ideas:

1.  **Digital Product Idea:** Conceive a digital product that is highly scalable and ideal for selling through online advertising. Examples include an ebook, a comprehensive digital planner, a set of premium templates, or a niche software tool.
2.  **Online Service Idea:** Devise an online service that can be delivered in a one-to-many format. Examples include a paid webinar series, an interactive online workshop, or group consultation sessions.
3.  **Online Membership Idea:** Create an idea for a recurring subscription business. This idea must be for a private community on a platform like Telegram or Discord, or a subscription that provides exclusive content.

Target Audience: {{{targetAudience}}}
Content Theme: {{{contentTheme}}}`,
});

const generateProductIdeasFlow = ai.defineFlow(
  {
    name: 'generateProductIdeasFlow',
    inputSchema: GenerateProductIdeasInputSchema,
    outputSchema: GenerateProductIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
