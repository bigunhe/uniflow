type MusicEmbedProps = {
	title: string;
	href: string;
	description?: string;
	className?: string;
};

export default function MusicEmbed({ title, href, description, className = "" }: MusicEmbedProps) {
	return (
		<a
			href={href}
			target="_blank"
			rel="noreferrer"
			className={`block rounded-2xl border border-slate-700 bg-slate-900/50 p-4 text-left shadow-sm transition hover:border-teal-400/40 hover:bg-slate-900/70 ${className}`}
		>
			<p className="text-sm font-semibold text-slate-50">{title}</p>
			{description ? <p className="mt-1 text-sm text-slate-400">{description}</p> : null}
			<p className="mt-3 text-xs font-medium text-teal-400">Open music player</p>
		</a>
	);
}
