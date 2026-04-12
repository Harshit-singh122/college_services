import { useState } from "react";
import { getProblemById } from "../api";

const statusConfig = {
  Submitted: { color: "bg-blue-600", text: "text-blue-300", icon: "🔵" },
  "In Progress": { color: "bg-yellow-600", text: "text-yellow-300", icon: "🟡" },
  Resolved: { color: "bg-green-600", text: "text-green-300", icon: "🟢" },
};

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
    } catch (err) {
      setProblem(null);
      setError(`No complaint found with ID "${trackingId.toUpperCase()}".`);
    } finally {
      setLoading(false);
    }
  };

  const status = problem?.status;
  const cfg = statusConfig[status] || statusConfig["Submitted"];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">🔍 Track My Problem</h1>
        <p className="text-gray-400 mt-1">Enter your Tracking ID to check the current status.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
          placeholder="e.g. A720C7C7"
          maxLength={8}
          className="flex-1 bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white font-mono placeholder-gray-500 focus:outline-none focus:border-indigo-500 uppercase"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          {loading ? "⏳" : "Search"}
        </button>
      </form>

      {error && (
        <div className="bg-red-900/40 border border-red-600 text-red-300 rounded-xl px-4 py-3 text-sm">
          ❌ {error}
        </div>
      )}

      {problem && (
        <div className="bg-gray-800 rounded-2xl p-6 space-y-5">
          {/* Status badge */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Tracking ID: <span className="font-mono text-white">{problem.id}</span></span>
            <span className={`${cfg.color} text-white text-sm font-semibold px-4 py-1 rounded-full`}>
              {cfg.icon} {status}
            </span>
          </div>

          <hr className="border-gray-700" />

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400 mb-1">Category</div>
              <div className="text-white font-medium">{problem.category || "Classifying..."}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Department</div>
              <div className="text-white font-medium">{problem.department || "Pending"}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Submitted</div>
              <div className="text-white font-medium">{problem.submitted_at}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Last Updated</div>
              <div className="text-white font-medium">{problem.updated_at}</div>
            </div>
            {problem.confidence && (
              <div>
                <div className="text-gray-400 mb-1">AI Confidence</div>
                <div className="text-white font-medium">{Math.round(problem.confidence * 100)}%</div>
              </div>
            )}
          </div>

          <hr className="border-gray-700" />

          {/* Complaint text */}
          <div>
            <div className="text-gray-400 text-sm mb-2">Your Complaint</div>
            <div className="bg-gray-900 rounded-xl px-4 py-3 text-gray-300 text-sm">{problem.description}</div>
          </div>

          {/* Resolution */}
          {problem.resolution ? (
            <div>
              <div className="text-gray-400 text-sm mb-2">Admin Response</div>
              <div className="bg-green-900/30 border border-green-700 rounded-xl px-4 py-3 text-green-300 text-sm">
                ✅ {problem.resolution}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No admin response yet. Check back later.</p>
          )}
        </div>
      )}
    </div>
  );
}