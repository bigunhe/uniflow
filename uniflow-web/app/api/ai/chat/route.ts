import { NextRequest, NextResponse } from "next/server";
import { chatWithOpenAI, suggestMentorsFromTopics } from "@/services/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawMessages = (body.messages || []) as Array<{ role: "system" | "user" | "assistant"; content: string }>;

    if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
      return NextResponse.json({ error: "messages are required" }, { status: 400 });
    }

    const systemPrompt = {
      role: "system" as const,
      content:
        "You are a tutoring assistant. Give concise educational help, then suggest when a live mentor may help.",
    };

    const aiReply = await chatWithOpenAI([systemPrompt, ...rawMessages]);

    const userMessageText = rawMessages
      .filter((message) => message.role === "user")
      .map((message) => message.content)
      .join(" ");

    const extractedTopics = userMessageText
      .split(/[,\n]/)
      .map((topic) => topic.trim())
      .filter((topic) => topic.length > 2)
      .slice(0, 4);

    const suggestedMentors = extractedTopics.length > 0 ? await suggestMentorsFromTopics(extractedTopics) : [];

    return NextResponse.json({
      reply: aiReply,
      suggestions: suggestedMentors.slice(0, 3),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
