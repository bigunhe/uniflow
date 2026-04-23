type MessageBubbleProps = {
	role: "user" | "assistant";
	content: string;
	className?: string;
};

export default function MessageBubble({ role, content, className = "" }: MessageBubbleProps) {
	const isUser = role === "user";

	return (
		<article
			className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
				isUser ? "ml-auto bg-teal-600 text-white" : "border border-slate-700 bg-slate-800/50 text-slate-200"
			} ${className}`}
		>
			{content}
		</article>
	);
}
