type StressTipsProps = {
	tips?: string[];
	className?: string;
};

export default function StressTips({
	tips = [
		"Pause for one slow breath before you continue.",
		"Split the task into the next smallest step.",
		"If you are stuck, write the exact blocker down.",
	],
	className = "",
}: StressTipsProps) {
	return (
		<section className={`rounded-2xl border border-rose-900/30 bg-rose-950/20 p-4 ${className}`}>
			<p className="text-xs font-semibold uppercase tracking-wide text-rose-300">Stress reset</p>
			<ul className="mt-3 space-y-2 text-sm text-rose-100/90">
				{tips.map((tip) => (
					<li key={tip} className="rounded-lg border border-rose-900/20 bg-black/10 px-3 py-2">
						{tip}
					</li>
				))}
			</ul>
		</section>
	);
}
