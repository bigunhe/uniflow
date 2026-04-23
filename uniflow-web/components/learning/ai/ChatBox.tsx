"use client";

import MessageBubble from "./MessageBubble";

export type ChatBoxMessage = {
	id?: string;
	role: "user" | "assistant";
	content: string;
};

export type ChatBoxProps = {
	messages: ChatBoxMessage[];
	emptyState?: string;
	className?: string;
};

export default function ChatBox({
	messages,
	emptyState = "Ask a question to start the conversation.",
	className = "",
}: ChatBoxProps) {
	return (
		<div className={`space-y-3 rounded-2xl border border-slate-700 bg-slate-950/50 p-4 ${className}`}>
			{messages.length === 0 ? (
				<p className="text-sm text-slate-400">{emptyState}</p>
			) : null}
			{messages.map((message, index) => (
				<MessageBubble key={message.id ?? `${message.role}-${index}`} role={message.role} content={message.content} />
			))}
		</div>
	);
}
