'use server';

import { z } from 'zod';
import { generateProductIdeas as aiGenerateProductIdeas, type GenerateProductIdeasOutput, type GenerateProductIdeasInput } from '@/ai/flows/generate-product-ideas';
import { WEBHOOK_URL } from '@/lib/constants';

const GenerateIdeasSchema = z.object({
  targetAudience: z.string().min(1, "Target audience is required."),
  contentTheme: z.string().min(1, "Content theme is required."),
});

export async function generateIdeasAction(
  input: z.infer<typeof GenerateIdeasSchema>
): Promise<GenerateProductIdeasOutput> {
  const validatedInput = GenerateIdeasSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error(validatedInput.error.errors.map(e => e.message).join(', '));
  }

  try {
    const ideas = await aiGenerateProductIdeas(validatedInput.data as GenerateProductIdeasInput);
    return ideas;
  } catch (error) {
    console.error("Error generating ideas:", error);
    throw new Error("Failed to generate ideas. Please try again.");
  }
}

const CaptureEmailDataSchema = z.object({
  targetAudience: z.string(),
  contentTheme: z.string(),
  email: z.string().email(),
  ideas: z.object({
    productIdea: z.string(),
    serviceIdea: z.string(),
    membershipIdea: z.string(),
  }).nullable(),
});

export async function captureEmailAndDataAction(
  input: z.infer<typeof CaptureEmailDataSchema>
): Promise<{ success: boolean; message?: string }> {
  const validatedInput = CaptureEmailDataSchema.safeParse(input);
  if (!validatedInput.success) {
    return { success: false, message: validatedInput.error.errors.map(e => e.message).join(', ') };
  }
  
  if (!WEBHOOK_URL || WEBHOOK_URL === "https://webhook.site/your-unique-id-here") {
    console.warn("Webhook URL is not configured. Data will not be sent.");
    // For this exercise, we'll simulate success even if webhook is not set,
    // but in a real app, you might want to return an error or specific status.
    return { success: true, message: "Data captured (webhook not configured)." };
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'email_capture', ...validatedInput.data }),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed with status ${response.status}`);
    }
    return { success: true };
  } catch (error) {
    console.error("Error sending data to webhook:", error);
    return { success: false, message: "Failed to send data. Please try again." };
  }
}

const UpsellBlueprintSchema = z.object({
  targetAudience: z.string(),
  contentTheme: z.string(),
  email: z.string().email(),
  ideas: z.object({
    productIdea: z.string(),
    serviceIdea: z.string(),
    membershipIdea: z.string(),
  }),
});

export async function upsellBlueprintAction(
  input: z.infer<typeof UpsellBlueprintSchema>
): Promise<{ success: boolean; message?: string }> {
   const validatedInput = UpsellBlueprintSchema.safeParse(input);
  if (!validatedInput.success) {
    return { success: false, message: validatedInput.error.errors.map(e => e.message).join(', ') };
  }

  if (!WEBHOOK_URL || WEBHOOK_URL === "https://webhook.site/your-unique-id-here") {
    console.warn("Webhook URL is not configured. Upsell data will not be sent.");
    return { success: true, message: "Upsell request captured (webhook not configured)." };
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'upsell_blueprint', ...validatedInput.data }),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed with status ${response.status}`);
    }
    return { success: true, message: "Blueprint request sent successfully!" };
  } catch (error) {
    console.error("Error sending upsell data to webhook:", error);
    return { success: false, message: "Failed to send blueprint request. Please try again." };
  }
}
