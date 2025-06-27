
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
import { Loader2, Send } from "lucide-react";
import { useEffect } from "react";

const WhatsappFormSchema = z.object({
  whatsappNumber: z.string().min(10, "Please enter a valid phone number with country code."),
});

export type WhatsappFormValues = z.infer<typeof WhatsappFormSchema>;

interface WhatsappCaptureFormProps {
  onSubmit: (data: WhatsappFormValues) => Promise<void>;
  isSubmitting: boolean;
  countryCode: string | null;
}

export function WhatsappCaptureForm({ onSubmit, isSubmitting, countryCode }: WhatsappCaptureFormProps) {
  const form = useForm<WhatsappFormValues>({
    resolver: zodResolver(WhatsappFormSchema),
    defaultValues: {
      whatsappNumber: "",
    },
  });

  useEffect(() => {
    if (countryCode && !form.getValues().whatsappNumber) {
      form.setValue("whatsappNumber", countryCode);
    }
  }, [countryCode, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="whatsappNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp Number</FormLabel>
              <FormControl>
                <Input placeholder="+1234567890" {...field} disabled={isSubmitting} type="tel" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Blueprint
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
