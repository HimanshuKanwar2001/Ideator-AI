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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TARGET_AUDIENCES, CONTENT_THEMES } from "@/lib/constants";
import { Loader2 } from "lucide-react";

const SelectionFormSchema = z.object({
  targetAudience: z.string().min(1, "Target audience is required."),
  contentTheme: z.string().min(1, "Content theme is required."),
});

type SelectionFormValues = z.infer<typeof SelectionFormSchema>;

interface SelectionFormProps {
  onSubmit: (data: SelectionFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function SelectionForm({ onSubmit, isSubmitting }: SelectionFormProps) {
  const form = useForm<SelectionFormValues>({
    resolver: zodResolver(SelectionFormSchema),
    defaultValues: {
      targetAudience: "",
      contentTheme: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="targetAudience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Whom you wish to sell products to?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your target audience" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TARGET_AUDIENCES.map((audience) => (
                    <SelectItem key={audience} value={audience}>
                      {audience}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contentTheme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Which type of products you want to sell?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your content theme" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CONTENT_THEMES.map((theme) => (
                    <SelectItem key={theme} value={theme}>
                      {theme}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Ideas...
            </>
          ) : (
            "Generate Ideas"
          )}
        </Button>
      </form>
    </Form>
  );
}
