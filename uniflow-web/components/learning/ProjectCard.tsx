"use client";

import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  title: string;
  brief: string;
  modules: string[];
  stack: string[];
}

export function ProjectCard({ title, brief, modules, stack }: ProjectCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base leading-snug">{title}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 pb-4">
        <p className="text-sm leading-relaxed text-white/50">{brief}</p>

        {/* Module crossover badges */}
        <div className="flex flex-wrap gap-1.5">
          {modules.map((mod) => (
            <Badge key={mod} variant="default" className="text-[11px]">
              {mod}
            </Badge>
          ))}
        </div>

        {/* Tech stack badges */}
        <div className="flex flex-wrap gap-1.5">
          {stack.map((tech) => (
            <Badge key={tech} variant="outline" className="text-[11px]">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full border border-white/10 bg-white/5 text-white/60 hover:border-[#00d2b4]/40 hover:bg-[#00d2b4]/10 hover:text-[#00d2b4]"
          variant="outline"
          onClick={() =>
            toast.info("Full briefs dropping next sprint.", { duration: 3000 })
          }
        >
          View Project Brief
        </Button>
      </CardFooter>
    </Card>
  );
}
