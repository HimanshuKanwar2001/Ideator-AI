"use client";

import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { Bot } from "lucide-react";

const loadingMessages = [
  "Connecting to the AI Oracle...",
  "Analyzing your brilliant choices...",
  "Consulting the muses of innovation...",
  "Crafting unique product concepts...",
  "Polishing service blueprints...",
  "Designing exclusive membership perks...",
  "Almost there, preparing your ideas!",
];

export function LoadingState() {
  const [progress, setProgress] = useState(10);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressTimer);
          return 95;
        }
        return prev + 5;
      });
    }, 400);

    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => {
      clearInterval(progressTimer);
      clearInterval(messageTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8 border rounded-lg shadow-lg bg-card">
      <Bot className="h-16 w-16 text-primary animate-bounce" />
      <h2 className="text-2xl font-semibold font-headline text-center">
        AI is Working Its Magic!
      </h2>
      <p 
        className="text-muted-foreground text-center min-h-[2em]" 
        aria-live="polite"
        aria-atomic="true"
      >
        {loadingMessages[messageIndex]}
      </p>
      <Progress value={progress} className="w-full max-w-md" />
      <p className="text-sm text-muted-foreground">{progress}% Complete</p>
    </div>
  );
}
