"use client";

import Link from "next/link";
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
  id: string;
  title: string;
  brief: string;
  modules: string[];
  stack: string[];
  weekendEstimate?: string;
  challengeLevel?: string;
  readinessLevel?: "ready" | "stretch" | "prep-needed";
  progressPercent?: number;
}

export function ProjectCard({
  id,
  title,
  brief,
  modules,
  stack,
  weekendEstimate,
  challengeLevel,
  readinessLevel,
  progressPercent,
}: ProjectCardProps) {
  const readinessLabel =
    readinessLevel === "ready"
      ? "Ready"
      : readinessLevel === "stretch"
        ? "Stretch"
        : readinessLevel === "prep-needed"
          ? "Prep Needed"
          : null;
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <CardTitle className="min-w-0 text-base leading-snug">{title}</CardTitle>
          {typeof progressPercent === "number" && progressPercent > 0 && (
            <span className="shrink-0 self-start rounded-md border border-[#00d2b4]/30 bg-[#00d2b4]/10 px-2 py-0.5 text-[10px] font-semibold text-[#7ae9d8] sm:self-auto">
              {progressPercent}% done
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 pb-4 pt-0 sm:pt-0">
        <p className="text-sm leading-relaxed text-white/50">{brief}</p>

        {(weekendEstimate || challengeLevel) && (
          <div className="flex flex-wrap gap-1.5">
            {weekendEstimate && (
              <Badge variant="outline" className="text-[11px]">
                {weekendEstimate}
              </Badge>
            )}
            {challengeLevel && (
              <Badge variant="default" className="text-[11px]">
                {challengeLevel}
              </Badge>
            )}
            {readinessLabel && (
              <Badge variant="outline" className="text-[11px]">
                {readinessLabel}
              </Badge>
            )}
          </div>
        )}

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
        <Button asChild className="w-full border border-white/10 bg-white/5 text-white/60 hover:border-[#00d2b4]/40 hover:bg-[#00d2b4]/10 hover:text-[#00d2b4]" variant="outline">
          <Link href={`/projects/${id}`}>View Project Brief</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
