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
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center space-x-3 pb-3">
        <IconComponent className="h-8 w-8 text-primary" />
        <CardTitle className="font-headline text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
