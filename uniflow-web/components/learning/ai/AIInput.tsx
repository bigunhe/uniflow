"use client";

import type { FormEvent } from "react";

export type AIInputProps = {
	value: string;
	onChange: (value: string) => void;
	onSubmit: (value: string) => void;
	loading?: boolean;
	placeholder?: string;
	label?: string;
};

export default function AIInput({
	value,
	onChange,
	onSubmit,
	loading = false,
	placeholder = "Ask a question",
	label = "Ask AI",
}: AIInputProps) {
	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		onSubmit(value.trim());
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-slate-700 bg-slate-900/40 p-4">
			<label className="text-sm font-semibold text-slate-100">{label}</label>
			<textarea
				value={value}
				onChange={(event) => onChange(event.target.value)}
				placeholder={placeholder}
				rows={4}
				className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 outline-none placeholder:text-slate-500 focus:border-teal-400"
			/>
			<button
				type="submit"
				disabled={loading}
				className="rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
			>
				{loading ? "Thinking..." : "Send"}
			</button>
		</form>
	);
}
