import { useState, useEffect } from "react";
import { getAllProblems, getStats, updateProblemStatus } from "../api";

const statusConfig = {
  Submitted: "bg-blue-600",
  "In Progress": "bg-yellow-600",
  Resolved: "bg-green-600",
};

function StatCard({ label, value, color }) {
  return (
    <div className={`${color} bg-opacity-20 border border-opacity-30 ${color.replace("bg-", "border-")} rounded-2xl p-5 text-center`}>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-sm text-gray-300 mt-1">{label}</div>
    </div>
  );
}

function ProblemCard({ problem, onUpdate }) {
  const [status, setStatus] = useState(problem.status);
  const [resolution, setResolution] = useState(problem.resolution || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProblemStatus(problem.id, status, resolution);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onUpdate();
    } catch (e) {
      alert("Failed to update. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const cfg = statusConfig[problem.status] || "bg-gray-600";

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-750 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className={`${cfg} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
            {problem.status}
          </span>
          <span className="font-mono text-gray-300 text-sm">{problem.id}</span>
          <span className="text-gray-400 text-sm hidden md:block">
            {problem.category || "Unclassified"}
          </span>
        </div>
        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <span className="hidden md:block">{problem.submitted_at}</span>
          <span>{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {/* Expanded body */}
      {open && (
        <div className="border-t border-gray-700 px-5 py-4 grid md:grid-cols-2 gap-6">
          {/* Left: complaint info */}
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-400 mb-1">Complaint</div>
              <div className="bg-gray-900 rounded-xl px-4 py-3 text-gray-300 text-sm">{problem.description}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-gray-400 mb-1">Category</div>
                <div className="text-white">{problem.category || "—"}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Confidence</div>
                <div className="text-white">{problem.confidence ? `${Math.round(problem.confidence * 100)}%` : "—"}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Department</div>
                <div className="text-white">{problem.department || "—"}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Submitted</div>
                <div className="text-white">{problem.submitted_at}</div>
              </div>
            </div>
          </div>

          {/* Right: update panel */}
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Update Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                <option>Submitted</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Resolution / Response</label>
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={3}
                placeholder="Describe what action was taken..."
                className="w-full bg-gray-900 border border-gray-600 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none text-sm"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold py-2 rounded-xl transition-colors text-sm"
            >
              {saved ? "✅ Saved!" : saving ? "Saving..." : "💾 Save Update"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Admin() {
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDept, setFilterDept] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [p, s] = await Promise.all([
        getAllProblems(
          filterStatus !== "All" ? filterStatus : undefined,
          filterDept !== "All" ? filterDept : undefined
        ),
        getStats(),
      ]);
      setProblems(p);
      setStats(s);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filterStatus, filterDept]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">🛠️ Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Manage and resolve student complaints.</p>
        </div>
        <button onClick={fetchData} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl text-sm transition-colors">
          🔄 Refresh
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total" value={stats.total} color="bg-gray-500" />
          <StatCard label="Submitted" value={stats.submitted} color="bg-blue-500" />
          <StatCard label="In Progress" value={stats.in_progress} color="bg-yellow-500" />
          <StatCard label="Resolved" value={stats.resolved} color="bg-green-500" />
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-gray-800 border border-gray-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
        >
          {["All", "Submitted", "In Progress", "Resolved"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          className="bg-gray-800 border border-gray-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
        >
          {["All", "Maintenance Department", "Dean of Students Office", "Hostel & Mess Committee", "Academic Office", "General Administration"].map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <span className="text-gray-400 text-sm self-center">{problems.length} problem(s)</span>
      </div>

      {/* Problem list */}
      {loading ? (
        <div className="text-center text-gray-400 py-12">Loading...</div>
      ) : problems.length === 0 ? (
        <div className="text-center text-gray-400 py-12 bg-gray-800 rounded-2xl">No problems found.</div>
      ) : (
        <div className="space-y-3">
          {problems.map((p) => (
            <ProblemCard key={p.id} problem={p} onUpdate={fetchData} />
          ))}
        </div>
      )}
    </div>
  );
}