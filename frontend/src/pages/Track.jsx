import { useState } from "react";
import { getProblemById } from "../api";

const statusConfig = {
  Submitted: {
    color: "bg-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    icon: "🔵",
    desc: "Your complaint has been received and is awaiting review.",
  },
  "In Progress": {
    color: "bg-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    icon: "🟡",
    desc: "The department is actively working on your complaint.",
  },
  Resolved: {
    color: "bg-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    icon: "🟢",
    desc: "Your complaint has been resolved.",
  },
};

const steps = ["Submitted", "In Progress", "Resolved"];

export default function Track() {
  const [trackingId, setTrackingId] = useState("");
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return setError("Please enter a tracking ID.");
    setError("");
    setLoading(true);
    try {
      const data = await getProblemById(trackingId.trim().toUpperCase());
      setProblem(data);
    } catch {
      setProblem(null);
      setError(`No complaint found with ID "${trackingId.toUpperCase()}".`);
    } finally {
      setLoading(false);
    }
  };

  const cfg = problem ? statusConfig[problem.status] || statusConfig["Submitted"] : null;
  const stepIndex = problem ? steps.indexOf(problem.status) : -1;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-1">Student Portal</p>
        <h1 className="text-4xl font-black text-slate-900">Track Your Complaint</h1>
        <p className="text-slate-500 mt-2">Enter your Tracking ID to see live status.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
          placeholder="Enter Tracking ID (e.g. A720C7C7)"
          maxLength={8}
          className="flex-1 bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-slate-800 font-mono font-bold tracking-widest placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all shadow-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-60 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-md shadow-violet-200"
        >
          {loading ? (
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
          ) : "Search"}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-4 text-sm font-medium mb-5">
          ❌ {error}
        </div>
      )}

      {problem && cfg && (
        <div className="space-y-4">
          {/* Status banner */}
          <div className={`${cfg.bg} border ${cfg.border} rounded-2xl px-5 py-4 flex items-center justify-between`}>
            <div>
              <div className="text-xs font-bold text-slate-500 mb-0.5">CURRENT STATUS</div>
              <div className={`text-lg font-black ${cfg.text}`}>{cfg.icon} {problem.status}</div>
              <div className={`text-sm ${cfg.text} opacity-80 mt-0.5`}>{cfg.desc}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-500 mb-0.5">TRACKING ID</div>
              <div className="font-mono font-black text-slate-800 text-lg">{problem.id}</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="bg-white border border-slate-100 rounded-2xl px-6 py-5 shadow-sm">
            <div className="flex items-center gap-0">
              {steps.map((step, i) => (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      i <= stepIndex
                        ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                        : "bg-slate-100 text-slate-400"
                    }`}>
                      {i < stepIndex ? "✓" : i + 1}
                    </div>
                    <div className={`text-xs font-semibold mt-1.5 ${i <= stepIndex ? "text-violet-700" : "text-slate-400"}`}>
                      {step}
                    </div>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 -mt-4 mx-1 transition-all ${i < stepIndex ? "bg-violet-400" : "bg-slate-100"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Detail cards */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Category", value: problem.category || "Classifying…" },
                { label: "Department", value: problem.department || "Pending" },
                { label: "Submitted", value: problem.submitted_at },
                { label: "Last Updated", value: problem.updated_at },
                problem.confidence && { label: "AI Confidence", value: `${Math.round(problem.confidence * 100)}%` },
              ].filter(Boolean).map((item, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-3.5">
                  <div className="text-xs text-slate-400 font-medium mb-0.5">{item.label.toUpperCase()}</div>
                  <div className="font-semibold text-slate-800 text-sm">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="h-px bg-slate-100" />

            <div>
              <div className="text-xs font-bold text-slate-400 uppercase mb-2">Your Complaint</div>
              <div className="bg-slate-50 rounded-xl px-4 py-3 text-slate-700 text-sm leading-relaxed">{problem.description}</div>
            </div>

            {problem.resolution ? (
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase mb-2">Admin Response</div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-emerald-700 text-sm leading-relaxed">
                  ✅ {problem.resolution}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-2">No admin response yet — check back soon.</p>
            )}
          </div>

          <button
            onClick={() => { setProblem(null); setTrackingId(""); }}
            className="w-full bg-white border border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-slate-600 font-semibold py-3 rounded-xl transition-all text-sm"
          >
            Search Another ID
          </button>
        </div>
      )}

      {/* Empty state hint */}
      {!problem && !error && (
        <div className="text-center py-16 text-slate-300">
          <div className="text-5xl mb-3">🔍</div>
          <div className="text-sm font-medium text-slate-400">Enter your Tracking ID above</div>
        </div>
      )}
    </div>
  );
}