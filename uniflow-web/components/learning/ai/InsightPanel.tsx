import CoreModelCard from "./CoreModelCard";

export type InsightPanelProps = {
	title?: string;
	subtitle?: string;
	coreModels?: Array<{ headline: string; analogy: string }>;
	searchVectors?: string[];
	knowledgeGaps?: string[];
	lectureFileSummaries?: Array<{ fileName: string; summary: string; isDense?: boolean }>;
	className?: string;
};

export default function InsightPanel({
	title = "Insight Panel",
	subtitle = "A compact study guide for the current module.",
	coreModels = [],
	searchVectors = [],
	knowledgeGaps = [],
	lectureFileSummaries = [],
	className = "",
}: InsightPanelProps) {
	return (
		<section className={`rounded-3xl border border-slate-700 bg-slate-900/40 p-5 shadow-sm ${className}`}>
			<div className="border-b border-slate-700 pb-4">
				<p className="text-xs font-semibold uppercase tracking-wide text-teal-400">Insight</p>
				<h2 className="mt-1 text-xl font-bold text-slate-50">{title}</h2>
				<p className="mt-1 text-sm text-slate-400">{subtitle}</p>
			</div>

			{coreModels.length > 0 ? (
				<div className="mt-4 grid gap-3 md:grid-cols-2">
					{coreModels.map((model) => (
						<CoreModelCard key={model.headline} headline={model.headline} analogy={model.analogy} />
					))}
				</div>
			) : null}

			<div className="mt-4 grid gap-4 md:grid-cols-3">
				<div>
					<h3 className="text-sm font-semibold text-slate-100">Search vectors</h3>
					<ul className="mt-2 space-y-1 text-sm text-slate-300">
						{searchVectors.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</div>
				<div>
					<h3 className="text-sm font-semibold text-slate-100">Knowledge gaps</h3>
					<ul className="mt-2 space-y-1 text-sm text-slate-300">
						{knowledgeGaps.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</div>
				<div>
					<h3 className="text-sm font-semibold text-slate-100">Lecture files</h3>
					<ul className="mt-2 space-y-2 text-sm text-slate-300">
						{lectureFileSummaries.map((file) => (
							<li key={file.fileName}>
								<p className="font-medium text-slate-100">{file.fileName}</p>
								<p>{file.summary}</p>
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
}
