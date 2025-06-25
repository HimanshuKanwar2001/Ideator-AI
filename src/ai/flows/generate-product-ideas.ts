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
  productIdea: z.string().describe('An idea for a digital product (e.g., an ebook, a template, a software tool).'),
  serviceIdea: z.string().describe('An idea for an online service (e.g., coaching, consulting, a workshop).'),
  membershipIdea: z.string().describe('An idea for an online membership (e.g., a private community on Telegram, exclusive content subscription).'),
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
  prompt: `You are a creative product idea generator specializing in digital-first concepts. Based on the provided target audience and content theme, generate three ideas:
1. A Digital Product Idea (e.g., an ebook, software tool, or template).
2. An Online Service Idea (e.g., coaching, consulting, or a workshop).
3. An Online Membership Idea (e.g., a private community on a platform like Telegram or Discord, or an exclusive content subscription).

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
