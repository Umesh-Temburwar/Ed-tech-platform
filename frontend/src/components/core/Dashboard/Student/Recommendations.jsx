import React from "react";

const recos = [
	{ title: "Data Structures Revision Sheet", type: "Resource", reason: "You slowed on arrays" },
	{ title: "Live Doubt Session Tonight", type: "Live", reason: "High engagement cohort" },
	{ title: "Graph Algorithms Module", type: "Course", reason: "Prepares for upcoming test" },
	{ title: "Peer Mock Interview Slot", type: "Practice", reason: "Improve communication" },
];

export default function Recommendations() {
	return (
		<div className="space-y-4">
			<h2 className="text-xl font-semibold text-richblack-5">Smart Recommendations</h2>
			<ul className="space-y-3">
				{recos.map((r, i) => (
					<li key={i} className="rounded-md border border-richblack-700 p-4 flex items-start gap-4 bg-richblack-800">
						<div className="text-xs px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-medium self-start">
							{r.type}
						</div>
						<div className="flex-1">
							<div className="font-medium text-richblack-50">{r.title}</div>
							<div className="text-xs text-richblack-300 mt-1">Reason: {r.reason}</div>
						</div>
						<button className="text-xs px-3 py-1 rounded bg-yellow-50 text-richblack-900 font-semibold hover:shadow">
							View
						</button>
					</li>
				))}
			</ul>
			<p className="text-xs text-richblack-400">Recommendations are tailored based on your active course milestones and topics.</p>
		</div>
	);
}

