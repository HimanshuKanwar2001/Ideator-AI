// @ts-nocheck
"use client";

import { useState } from "react";
import { z } from "zod";
import { SelectionForm } from "@/components/ideator/SelectionForm";
import { EmailCaptureForm } from "@/components/ideator/EmailCaptureForm";
import { ResultsSection } from "@/components/ideator/ResultsSection";
import { LoadingState } from "@/components/ideator/LoadingState";
import { WhatsappCaptureForm } from "@/components/ideator/WhatsappCaptureForm";
import type { WhatsappFormValues } from "@/components/ideator/WhatsappCaptureForm";
import { generateIdeasAction, captureEmailAndDataAction, upsellBlueprintAction } from "./actions";
import type { GenerateProductIdeasOutput } from "@/ai/flows/generate-product-ideas";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AppState = "idle" | "loadingIdeas" | "emailCapture" | "submittingEmail" | "resultsVisible" | "upselling";

// Define Zod schemas for form values, matching those in child components
const SelectionFormSchema = z.object({
  targetAudience: z.string().min(1, "Target audience is required."),
  contentTheme: z.string().min(1, "Content theme is required."),
});
type SelectionFormValues = z.infer<typeof SelectionFormSchema>;

const EmailFormSchema = z.object({
  email: z.string().email("Invalid email address."),
});
type EmailFormValues = z.infer<typeof EmailFormSchema>;

export default function IdeatorPage() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [generatedIdeas, setGeneratedIdeas] = useState<GenerateProductIdeasOutput | null>(null);
  const [currentSelections, setCurrentSelections] = useState<SelectionFormValues | null>(null);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [showBlueprintDialog, setShowBlueprintDialog] = useState(false);
  const [showWhatsappDialog, setShowWhatsappDialog] = useState(false);
  const { toast } = useToast();

  const handleSelectionSubmit = async (data: SelectionFormValues) => {
    setAppState("loadingIdeas");
    setCurrentSelections(data);
    try {
      const result = await generateIdeasAction(data);
      setGeneratedIdeas(result);
      setAppState("emailCapture");
    } catch (error) {
      toast({ variant: "destructive", title: "Error Generating Ideas", description: (error as Error).message });
      setAppState("idle");
    }
  };

  const handleEmailSubmit = async (data: EmailFormValues) => {
    setAppState("submittingEmail");
    setCurrentEmail(data.email);
    try {
      const result = await captureEmailAndDataAction({
        ...(currentSelections as SelectionFormValues),
        email: data.email,
        ideas: generatedIdeas,
      });
      if (result.success) {
        toast({ title: "Success!", description: "Your ideas are unlocked!" });
        setAppState("resultsVisible");
      } else {
        throw new Error(result.message || "Failed to submit email.");
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error Submitting Email", description: (error as Error).message });
      // Revert to email capture, but keep email in form if possible (handled by form state itself)
      setAppState("emailCapture"); 
    }
  };

  const handleUpsell = async () => {
    setShowWhatsappDialog(true);
  };
  
  const handleWhatsappSubmit = async (data: WhatsappFormValues) => {
    if (!currentSelections || !currentEmail || !generatedIdeas) {
      toast({ variant: "destructive", title: "Error", description: "Missing information for blueprint request." });
      return;
    }
    setAppState("upselling");
    setShowWhatsappDialog(false);
    try {
      const result = await upsellBlueprintAction({
        ...currentSelections,
        email: currentEmail,
        ideas: generatedIdeas,
        whatsappNumber: data.whatsappNumber,
      });
       if (result.success) {
        setShowBlueprintDialog(true);
      } else {
        throw new Error(result.message || "Failed to request blueprint.");
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error Requesting Blueprint", description: (error as Error).message });
    } finally {
      setAppState("resultsVisible");
    }
  };

  const isSubmittingSelection = appState === "loadingIdeas";
  const isSubmittingEmail = appState === "submittingEmail";
  const isUpselling = appState === "upselling";

  return (
    <main className="container mx-auto px-4 py-8 flex flex-col items-center min-h-screen md:justify-center">
      <div className="w-full max-w-2xl space-y-12">

        {appState === "idle" && (
          <section aria-labelledby="selection-form-heading">
            <h2 id="selection-form-heading" className="sr-only">Select your preferences</h2>
            <SelectionForm onSubmit={handleSelectionSubmit} isSubmitting={isSubmittingSelection} />
          </section>
        )}

        {(appState === "loadingIdeas") && (
          <section aria-live="polite">
            <LoadingState />
          </section>
        )}
        
        {appState === "emailCapture" && generatedIdeas && (
          <section aria-labelledby="email-capture-heading">
            <h2 id="email-capture-heading" className="sr-only">Enter your email to view ideas</h2>
             <div className="relative">
                <ResultsSection ideas={generatedIdeas} onUpsell={handleUpsell} isUpselling={isUpselling} isBlurred={true} />
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/50 backdrop-blur-sm">
                   <div className="w-full max-w-md p-4">
                     <EmailCaptureForm onSubmit={handleEmailSubmit} isSubmitting={isSubmittingEmail} />
                   </div>
                </div>
             </div>
          </section>
        )}
        
        {appState === "submittingEmail" && generatedIdeas && (
           <section aria-live="polite">
            <div className="relative">
                <ResultsSection ideas={generatedIdeas} onUpsell={handleUpsell} isUpselling={isUpselling} isBlurred={true} />
                 <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/50 backdrop-blur-sm">
                   <div className="w-full max-w-md p-4">
                     <EmailCaptureForm onSubmit={handleEmailSubmit} isSubmitting={isSubmittingEmail} />
                   </div>
                </div>
             </div>
          </section>
        )}


        {(appState === "resultsVisible" || appState === "upselling") && generatedIdeas && (
          <section aria-labelledby="results-heading">
            <h2 id="results-heading" className="sr-only">Your Generated Ideas</h2>
            <ResultsSection ideas={generatedIdeas} onUpsell={handleUpsell} isUpselling={isUpselling} isBlurred={false} />
          </section>
        )}
      </div>

       <AlertDialog open={showBlueprintDialog} onOpenChange={setShowBlueprintDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Blueprint Request Sent!</AlertDialogTitle>
            <AlertDialogDescription>
              We will send you the blueprint soon on your WhatsApp.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
                window.location.href = 'https://superprofile.bio?referralCode=KLTjEC&referralType=creatorReferral&source=supersellreel';
            }}>
              Start making your Superprofile now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showWhatsappDialog} onOpenChange={setShowWhatsappDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Get Your Blueprint on WhatsApp</DialogTitle>
            <DialogDescription>
              Enter your WhatsApp number below and we'll send the blueprint right over.
            </DialogDescription>
          </DialogHeader>
          <WhatsappCaptureForm 
            onSubmit={handleWhatsappSubmit}
            isSubmitting={isUpselling}
          />
        </DialogContent>
      </Dialog>
    </main>
  );
}
