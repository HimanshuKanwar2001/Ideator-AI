"use client";

import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface IdeaCardProps {
  title: string;
  description: string;
  IconComponent: LucideIcon;
}

export function IdeaCard({ title, description, IconComponent }: IdeaCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 w-full">
      <div className="flex flex-row items-start gap-4 p-4 md:p-6">
        <div className="flex-shrink-0 pt-1">
          <IconComponent className="h-6 w-6 md:h-8 md:w-8 text-primary" />
        </div>
        <div className="flex-grow">
          <h3 className="font-headline text-lg md:text-xl font-semibold leading-tight">{title}</h3>
          <p className="text-foreground text-sm md:text-base mt-2">{description}</p>
        </div>
      </div>
    </Card>
  );
}
