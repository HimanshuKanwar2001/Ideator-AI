// @ts-nocheck
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const EmailFormSchema = z.object({
  email: z.string().email("Invalid email address."),
});

type EmailFormValues = z.infer<typeof EmailFormSchema>;

interface EmailCaptureFormProps {
  onSubmit: (data: EmailFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function EmailCaptureForm({ onSubmit, isSubmitting }: EmailCaptureFormProps) {
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(EmailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 md:p-6 border rounded-lg shadow-lg bg-card">
        <h3 className="text-base md:text-lg font-semibold font-headline text-center">Unlock Your AI-Generated Ideas!</h3>
        <p className="text-sm text-muted-foreground text-center">Enter your email to reveal the product, service, and membership ideas tailored for you.</p>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Reveal Ideas"
          )}
        </Button>
      </form>
    </Form>
  );
}
