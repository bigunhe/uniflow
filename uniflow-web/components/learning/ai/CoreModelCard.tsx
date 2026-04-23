type CoreModelCardProps = {
	headline: string;
	analogy: string;
	className?: string;
};

export default function CoreModelCard({ headline, analogy, className = "" }: CoreModelCardProps) {
	return (
		<article className={`rounded-2xl border border-slate-700 bg-slate-900/50 p-4 shadow-sm ${className}`}>
			<p className="text-xs font-semibold uppercase tracking-wide text-teal-400">Core model</p>
			<h3 className="mt-1 text-sm font-bold text-slate-50">{headline}</h3>
			<p className="mt-2 text-sm leading-6 text-slate-300">{analogy}</p>
		</article>
	);
}
