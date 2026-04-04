import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { mockProjectsById } from "@/lib/mockData";
import {
  createFallbackExecutionPacket,
  parseExecutionPacketJson,
  type ProjectExecutionPacket,
} from "@/lib/projects/executionPacket";

type RequestBody = {
  projectId?: string;
  studentFocus?: string;
  syncedModuleNames?: string[];
};

type LimitState = {
  dayKey: string;
  count: number;
  lastRequestAt: number;
};

const requestLimits = new Map<string, LimitState>();
let quotaBlockedUntilMs = 0;

function asInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
}

function cooldownMs() {
  return asInt(process.env.PROJECTS_AI_COOLDOWN_MS, 60_000);
}

function dailyLimit() {
  return asInt(process.env.PROJECTS_AI_DAILY_LIMIT, 10);
}

function isMockMode() {
  const raw = (process.env.PROJECTS_AI_MOCK ?? "").toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes";
}

function pickProvider(): "gemini" | "heuristic" {
  const provider = (process.env.PROJECTS_AI_PROVIDER ?? "").toLowerCase();
  if (provider === "gemini") return "gemini";
  if (provider === "heuristic") return "heuristic";
  return process.env.GEMINI_API_KEY ? "gemini" : "heuristic";
}

function clientKey(request: NextRequest, projectId: string): string {
  const fromIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const fallback = request.headers.get("user-agent") ?? "anon";
  return `${fromIp || fallback}:${projectId}`;
}

function dayKeyNow(): string {
  return new Date().toISOString().slice(0, 10);
}

function parseRetryDelayMs(message: string): number {
  const match = message.match(/retry in\s+([0-9.]+)s/i);
  if (!match) return 60_000;
  const seconds = Number(match[1]);
  if (!Number.isFinite(seconds) || seconds <= 0) return 60_000;
  return Math.ceil(seconds * 1000);
}

function isQuotaErrorMessage(message: string): boolean {
  const lowered = message.toLowerCase();
  return (
    lowered.includes("429") ||
    lowered.includes("quota exceeded") ||
    lowered.includes("too many requests")
  );
}

function enforceRateLimit(key: string): { ok: true } | { ok: false; status: number; message: string } {
  const now = Date.now();
  if (now < quotaBlockedUntilMs) {
    const waitSec = Math.max(1, Math.ceil((quotaBlockedUntilMs - now) / 1000));
    return {
      ok: false,
      status: 429,
      message: `AI generation is temporarily paused due to quota limits. Retry in ${waitSec}s.`,
    };
  }

  const dayKey = dayKeyNow();
  const current = requestLimits.get(key);
  const state: LimitState =
    !current || current.dayKey !== dayKey
      ? { dayKey, count: 0, lastRequestAt: 0 }
      : current;

  const sinceLast = now - state.lastRequestAt;
  if (state.lastRequestAt > 0 && sinceLast < cooldownMs()) {
    const wait = Math.max(1, Math.ceil((cooldownMs() - sinceLast) / 1000));
    return {
      ok: false,
      status: 429,
      message: `Please wait ${wait}s before generating another packet.`,
    };
  }

  if (state.count >= dailyLimit()) {
    return {
      ok: false,
      status: 429,
      message: "Daily AI generation limit reached for this project context.",
    };
  }

  state.count += 1;
  state.lastRequestAt = now;
  requestLimits.set(key, state);
  return { ok: true };
}

function buildGeminiPrompt(args: {
  title: string;
  brief: string;
  modules: string[];
  stack: string[];
  focus?: string;
  syncedModuleNames?: string[];
  instructions: string[];
}): string {
  const instructionBlock =
    args.instructions.length > 0
      ? `Canonical project instructions (reference and extend these with concrete milestones; do not replace them with vaguer steps):\n${args.instructions
          .map((step, idx) => `${idx + 1}. ${step}`)
          .join("\n")}\n`
      : "";

  return `You are a practical engineering mentor.
Return ONLY valid JSON with keys:
{
  "mvp": string[],
  "better": string[],
  "excellent": string[],
  "timeline": string[],
  "risks": string[],
  "deliverables": string[]
}

Project title: ${args.title}
Project brief: ${args.brief}
Project modules: ${args.modules.join(", ")}
Tech stack: ${args.stack.join(", ")}
Student synced modules: ${(args.syncedModuleNames ?? []).join(", ") || "none"}
Student focus: ${args.focus?.trim() || "none"}

${instructionBlock}
Constraints:
- Keep each list between 3 and 6 concise items.
- Prioritize execution in 2-3 days.
- Keep suggestions realistic for a student project.
- Ground MVP/better/excellent paths in the canonical instructions above when present.
- No markdown or commentary outside JSON.`;
}

async function generateWithGemini(prompt: string): Promise<ProjectExecutionPacket> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY");
  const modelName = process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash";
  const ai = new GoogleGenerativeAI(apiKey);
  const model = ai.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.35,
      responseMimeType: "application/json",
    },
  });
  const result = await model.generateContent([{ text: prompt }]);
  const text = result.response.text();
  const parsed = parseExecutionPacketJson(text);
  if (!parsed) {
    throw new Error("Gemini returned invalid packet JSON.");
  }
  return parsed;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestBody;
    const projectId = body.projectId?.trim() ?? "";
    const project = mockProjectsById[projectId];
    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const limit = enforceRateLimit(clientKey(request, projectId));
    if (!limit.ok) {
      return NextResponse.json({ error: limit.message }, { status: limit.status });
    }

    const prompt = buildGeminiPrompt({
      title: project.title,
      brief: project.brief,
      modules: project.modules,
      stack: project.stack,
      focus: body.studentFocus,
      syncedModuleNames: body.syncedModuleNames ?? [],
      instructions: project.instructions,
    });

    if (isMockMode()) {
      return NextResponse.json({
        provider: "mock",
        packet: createFallbackExecutionPacket(project, body.studentFocus),
      });
    }

    const provider = pickProvider();
    if (provider === "heuristic") {
      return NextResponse.json({
        provider: "heuristic",
        packet: createFallbackExecutionPacket(project, body.studentFocus),
      });
    }

    try {
      const packet = await generateWithGemini(prompt);
      return NextResponse.json({
        provider: "gemini",
        packet,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown AI error";
      if (isQuotaErrorMessage(message)) {
        quotaBlockedUntilMs = Date.now() + parseRetryDelayMs(message);
        return NextResponse.json(
          {
            error:
              "Project AI quota is exhausted right now. Please retry later or enable PROJECTS_AI_MOCK=true for demo mode.",
          },
          { status: 429 }
        );
      }
      return NextResponse.json({
        provider: "heuristic-fallback",
        packet: createFallbackExecutionPacket(project, body.studentFocus),
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
