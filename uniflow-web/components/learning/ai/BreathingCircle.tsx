type BreathingCircleProps = {
	label?: string;
	className?: string;
};

export default function BreathingCircle({
	label = "Breathe in, breathe out",
	className = "",
}: BreathingCircleProps) {
	return (
		<div className={`flex items-center justify-center rounded-3xl border border-teal-400/20 bg-teal-500/10 p-6 ${className}`}>
			<div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-teal-300/30 bg-teal-400/20">
				<div className="absolute inset-0 rounded-full border border-teal-200/30 animate-ping" />
				<div className="h-14 w-14 rounded-full bg-teal-300/70 shadow-[0_0_40px_rgba(45,212,191,0.35)]" />
			</div>
			<span className="ml-4 text-sm font-medium text-slate-100">{label}</span>
		</div>
	);
}
