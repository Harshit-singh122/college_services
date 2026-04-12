import { useState } from "react";
import { submitProblem } from "../api";

export default function Submit() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!description.trim()) return setError("Please describe your problem.");
    if (description.trim().length < 10) return setError("Description is too short.");

    setLoading(true);
    try {
      const data = await submitProblem(description.trim());
      setResult(data);
      setDescription("");
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const confidenceColor = (c) => {
    if (c >= 0.8) return "text-green-400";
    if (c >= 0.5) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">📝 Submit a Problem</h1>
        <p className="text-gray-400 mt-1">Our AI agent will classify and route it automatically.</p>
      </div>

      {!result ? (
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Describe your problem <span className="text-red-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="e.g. Bathroom on 3rd floor has no water since yesterday morning..."
              className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
            <div className="text-right text-xs text-gray-500 mt-1">{description.length} chars</div>
          </div>

          {error && (
            <div className="bg-red-900/40 border border-red-600 text-red-300 rounded-xl px-4 py-3 text-sm">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                AI is analyzing your complaint...
              </>
            ) : (
              "🚀 Submit Problem"
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          {/* Success banner */}
          <div className="bg-green-900/40 border border-green-600 text-green-300 rounded-xl px-4 py-3 text-sm font-medium">
            ✅ Complaint submitted and routed successfully!
          </div>

          {/* Tracking ID */}
          <div className="bg-gray-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Your Tracking ID</span>
              <span className="bg-indigo-600 text-white font-mono font-bold px-4 py-1 rounded-lg text-lg">
                {result.tracking_id}
              </span>
            </div>
            <p className="text-xs text-gray-500">Save this ID to track your complaint status.</p>

            <hr className="border-gray-700" />

            {/* Classification result */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-400 mb-1">Category</div>
                <div className="font-semibold text-white">{result.category}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">AI Confidence</div>
                <div className={`font-semibold ${confidenceColor(result.confidence)}`}>
                  {Math.round(result.confidence * 100)}%
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Routed to</div>
                <div className="font-semibold text-white">{result.department}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Assigned Executive</div>
                <div className="font-semibold text-white">{result.executive?.name}</div>
              </div>
            </div>

            {result.fallback && (
              <div className="bg-yellow-900/40 border border-yellow-600 text-yellow-300 rounded-xl px-4 py-3 text-sm">
                ⚠️ Low confidence — sent to General Administration for manual review.
              </div>
            )}

            <div className="bg-gray-900 rounded-xl px-4 py-3">
              <div className="text-xs text-gray-400 mb-1">AI Reasoning</div>
              <div className="text-sm text-gray-300">{result.reasoning}</div>
            </div>
          </div>

          <button
            onClick={() => setResult(null)}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            + Submit Another Problem
          </button>
        </div>
      )}
    </div>
  );
}