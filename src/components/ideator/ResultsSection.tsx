// @ts-nocheck
"use client";

import type { GenerateProductIdeasOutput } from "@/ai/flows/generate-product-ideas";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IdeaCard } from "./IdeaCard";
import { Package, Briefcase, Users, Sparkles, Loader2 } from "lucide-react";

interface ResultsSectionProps {
  ideas: GenerateProductIdeasOutput;
  onUpsell: () => Promise<void>;
  isUpselling: boolean;
  isBlurred: boolean;
}

export function ResultsSection({ ideas, onUpsell, isUpselling, isBlurred }: ResultsSectionProps) {
  return (
    <div className={cn("space-y-8 transition-all duration-500 ease-in-out", isBlurred && "filter blur-sm pointer-events-none opacity-50")}>
      <div className="grid md:grid-cols-3 gap-6">
        <IdeaCard title="Product Idea" description={ideas.productIdea} IconComponent={Package} />
        <IdeaCard title="Service Idea" description={ideas.serviceIdea} IconComponent={Briefcase} />
        <IdeaCard title="Membership Idea" description={ideas.membershipIdea} IconComponent={Users} />
      </div>
      {!isBlurred && (
        <div className="text-center mt-8 p-6 border rounded-lg shadow-lg bg-card">
          <h3 className="text-2xl font-bold font-headline mb-3 text-primary">Ready to Launch?</h3>
          <p className="text-muted-foreground mb-6">
            Get a complete, step-by-step blueprint to bring these ideas to life! Our AI can generate a detailed plan including market research, feature lists, marketing strategies, and more.
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
                Generating Blueprint...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Get Your AI Blueprint
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
