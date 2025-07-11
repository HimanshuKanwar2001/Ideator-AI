// @ts-nocheck
"use client";

import type { GenerateProductIdeasOutput } from "@/ai/flows/generate-product-ideas";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IdeaCard } from "./IdeaCard";
import { Package, Briefcase, Users, Send, Loader2 } from "lucide-react";

interface ResultsSectionProps {
  ideas: GenerateProductIdeasOutput;
  onUpsell: () => Promise<void>;
  isUpselling: boolean;
  isBlurred: boolean;
}

export function ResultsSection({ ideas, onUpsell, isUpselling, isBlurred }: ResultsSectionProps) {
  return (
    <div className={cn("space-y-8 transition-all duration-500 ease-in-out", isBlurred && "filter blur-sm pointer-events-none opacity-50")}>
      <div className="flex flex-col gap-6">
        <IdeaCard title="Product Idea" description={ideas.productIdea} IconComponent={Package} />
        <IdeaCard title="Service Idea" description={ideas.serviceIdea} IconComponent={Briefcase} />
        <IdeaCard title="Membership Idea" description={ideas.membershipIdea} IconComponent={Users} />
      </div>
      {!isBlurred && (
        <div className="text-center mt-8 p-4 md:p-6 border rounded-lg shadow-lg bg-card">
          <h3 className="text-xl md:text-2xl font-bold font-headline mb-3 text-primary">Ready to Launch?</h3>
          <p className="text-muted-foreground mb-6 text-sm md:text-base">
            Get a complete, step-by-step blueprint to bring these ideas to life! We'll send it directly to your WhatsApp.
          </p>
          <Button 
            onClick={onUpsell} 
            disabled={isUpselling} 
            size="lg" 
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {isUpselling ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Please wait...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Get Blueprint on WhatsApp
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
