
'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { generateProductIdeas as aiGenerateProductIdeas, type GenerateProductIdeasOutput, type GenerateProductIdeasInput } from '@/ai/flows/generate-product-ideas';
import { WEBHOOK_URL, WEBHOOK_URL_TEST } from '@/lib/constants';

const GenerateIdeasSchema = z.object({
  targetAudience: z.string().min(1, "Target audience is required."),
  contentTheme: z.string().min(1, "Content theme is required."),
});

// Rate limiting configuration
const RATE_LIMIT_COUNT = 5; // Max requests
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const rateLimitStore = new Map<string, number[]>();

export async function generateIdeasAction(
  input: z.infer<typeof GenerateIdeasSchema>
): Promise<GenerateProductIdeasOutput> {
  const ip = headers().get('x-forwarded-for') ?? '127.0.0.1';
  
  const now = Date.now();
  const userRequests = rateLimitStore.get(ip) ?? [];
  
  const recentRequests = userRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

  if (recentRequests.length >= RATE_LIMIT_COUNT) {
    rateLimitStore.set(ip, recentRequests);
    throw new Error("You have reached the request limit. Please try again in an hour.");
  }
  
  const validatedInput = GenerateIdeasSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error(validatedInput.error.errors.map(e => e.message).join(', '));
  }

  try {
    const ideas = await aiGenerateProductIdeas(validatedInput.data as GenerateProductIdeasInput);
    rateLimitStore.set(ip, [...recentRequests, now]);
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
  
  const payload = { type: 'email_capture', blueprint: 'no', ...validatedInput.data };
  const webhooks = [WEBHOOK_URL, WEBHOOK_URL_TEST].filter(Boolean);

  if (webhooks.length === 0) {
    console.warn("No webhook URLs are configured. Data will not be sent.");
    console.log('Data that would be sent (no webhooks configured):', payload);
    return { success: true, message: "Data captured (webhooks not configured)." };
  }

  const results = await Promise.allSettled(webhooks.map(url => {
    console.log(`Attempting to send data to webhook: ${url}`);
    console.log('Payload for email_capture:', JSON.stringify(payload, null, 2));
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    }).finally(() => clearTimeout(timeoutId));
  }));
  
  const failures: string[] = [];
  let successes = 0;

  for (const [index, result] of results.entries()) {
    const url = webhooks[index];
    if (result.status === 'fulfilled') {
      const response = result.value;
      if (!response.ok) {
        const errorBody = await response.text().catch(() => "Could not read error body from webhook response.");
        const errorMessage = `Webhook request to ${url} failed with status ${response.status} ${response.statusText}. Response body: ${errorBody}`;
        console.error(errorMessage);
        failures.push(errorMessage);
      } else {
        console.log(`Data successfully sent to webhook: ${url}. Status:`, response.status);
        successes++;
      }
    } else {
      let errorMessage = `Failed to send data to webhook ${url}.`;
      if (result.reason instanceof Error) {
        if(result.reason.name === 'AbortError') {
             errorMessage = `The request to the webhook ${url} timed out.`;
        } else if (result.reason.message.includes("Webhook request failed")) {
            errorMessage = result.reason.message;
        }
      }
      console.error(errorMessage, result.reason);
      failures.push(errorMessage);
    }
  }

  if (successes > 0) {
    if (failures.length > 0) {
        console.warn(`Partially succeeded in sending webhook data. Failures: ${failures.join('; ')}`);
    }
    return { success: true };
  } else {
    return { success: false, message: `All webhook requests failed. Errors: ${failures.join('; ')}` };
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

  const payload = { type: 'upsell_blueprint', blueprint: 'yes', ...validatedInput.data };
  const webhooks = [WEBHOOK_URL, WEBHOOK_URL_TEST].filter(Boolean);

  if (webhooks.length === 0) {
    console.warn("No webhook URLs configured. Upsell data will not be sent.");
    console.log('Upsell data that would be sent (no webhooks configured):', payload);
    return { success: true, message: "Upsell request captured (webhooks not configured)." };
  }

  const results = await Promise.allSettled(webhooks.map(url => {
    console.log(`Attempting to send upsell data to webhook: ${url}`);
    console.log('Payload for upsell_blueprint:', JSON.stringify(payload, null, 2));
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));
  }));
  
  const failures: string[] = [];
  let successes = 0;

  for (const [index, result] of results.entries()) {
    const url = webhooks[index];
    if (result.status === 'fulfilled') {
      const response = result.value;
      if (!response.ok) {
        const errorBody = await response.text().catch(() => "Could not read error body from webhook response.");
        const errorMessage = `Upsell webhook request to ${url} failed with status ${response.status} ${response.statusText}. Response body: ${errorBody}`;
        console.error(errorMessage);
        failures.push(errorMessage);
      } else {
        console.log(`Upsell data successfully sent to webhook: ${url}. Status:`, response.status);
        successes++;
      }
    } else {
      let errorMessage = `Failed to send upsell data to webhook ${url}.`;
      if (result.reason instanceof Error) {
        if(result.reason.name === 'AbortError') {
             errorMessage = `The request to the upsell webhook ${url} timed out.`;
        } else if (result.reason.message.includes("Webhook request failed")) {
            errorMessage = result.reason.message;
        }
      }
      console.error(errorMessage, result.reason);
      failures.push(errorMessage);
    }
  }

  if (successes > 0) {
    const message = "Your blueprint has been sent to your email! Check your inbox for the details.";
    if (failures.length > 0) {
        console.warn(`Partially succeeded in sending upsell webhook data. Failures: ${failures.join('; ')}`);
    }
    return { success: true, message };
  } else {
    return { success: false, message: `All upsell webhook requests failed. Errors: ${failures.join('; ')}` };
  }
}
