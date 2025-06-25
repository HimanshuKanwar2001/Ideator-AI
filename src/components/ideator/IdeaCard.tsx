"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface IdeaCardProps {
  title: string;
  description: string;
  IconComponent: LucideIcon;
}

export function IdeaCard({ title, description, IconComponent }: IdeaCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-row items-center">
      <CardHeader className="flex flex-row items-center space-x-3 p-4">
        <IconComponent className="h-6 w-6 md:h-8 md:w-8 text-primary" />
        <CardTitle className="font-headline text-lg md:text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <p className="text-foreground text-sm md:text-base">{description}</p>
      </CardContent>
    </Card>
  );
}
