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
  productIdea: z.string().describe('An idea for a product.'),
  serviceIdea: z.string().describe('An idea for a service.'),
  membershipIdea: z.string().describe('An idea for a membership.'),
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
  prompt: `You are a creative product idea generator. Given a target audience and a content theme, you will generate a product idea, a service idea and a membership idea.

Target Audience: {{{targetAudience}}}
Content Theme: {{{contentTheme}}}

Product Idea: 
Service Idea:
Membership Idea:`,
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
