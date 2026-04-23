import { NextRequest, NextResponse } from "next/server";
import { chatWithOpenAI, suggestMentorsFromTopics } from "@/services/ai";

type IncomingAttachment = {
	name?: string;
	type?: string;
	size?: number;
	textPreview?: string;
};

type IncomingMessage = {
	role: "system" | "user" | "assistant";
	content: string;
	attachments?: IncomingAttachment[];
};

function normalizeMessage(message: IncomingMessage) {
	const attachments = Array.isArray(message.attachments) ? message.attachments : [];

	if (attachments.length === 0) {
		return {
			role: message.role,
			content: message.content,
		};
	}

	const attachmentContext = attachments
		.slice(0, 5)
		.map((attachment, index) => {
			const name = attachment.name || `attachment-${index + 1}`;
			const type = attachment.type || "unknown";
			const size = typeof attachment.size === "number" ? `${attachment.size} bytes` : "size unknown";
			const preview = attachment.textPreview ? `\nPreview:\n${attachment.textPreview.slice(0, 1500)}` : "";
			return `Attachment ${index + 1}: ${name} (${type}, ${size})${preview}`;
		})
		.join("\n\n");

	return {
		role: message.role,
		content: `${message.content}\n\nAdditional context from attachments:\n${attachmentContext}`,
	};
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const rawMessages = (body.messages || []) as IncomingMessage[];

		if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
			return NextResponse.json({ error: "messages are required" }, { status: 400 });
		}

		const systemPrompt = {
			role: "system" as const,
			content:
				"You are a tutoring assistant for university students. Provide concise study guidance, practical learning strategies, and when needed include supportive motivation and stress-relief tips (breathing, short breaks, healthy study pacing). If the user appears overwhelmed, respond calmly and suggest one immediate grounding action before continuing the academic help. End with when a live mentor may help for deeper support.",
		};

		const normalizedMessages = rawMessages.map(normalizeMessage);
		const aiReply = await chatWithOpenAI([systemPrompt, ...normalizedMessages]);

		const userMessageText = normalizedMessages
			.filter((message) => message.role === "user")
			.map((message) => message.content)
			.join(" ");

		const extractedTopics = userMessageText
			.split(/[,\n]/)
			.map((topic) => topic.trim())
			.filter((topic) => topic.length > 2)
			.slice(0, 4);

		let suggestedMentors: Awaited<ReturnType<typeof suggestMentorsFromTopics>> = [];
		if (extractedTopics.length > 0) {
			try {
				suggestedMentors = await suggestMentorsFromTopics(extractedTopics);
			} catch {
				// Suggestions are optional and should never block the core AI reply.
				suggestedMentors = [];
			}
		}

		return NextResponse.json({
			reply: aiReply,
			suggestions: suggestedMentors.slice(0, 3),
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
