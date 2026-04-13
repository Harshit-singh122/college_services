import { useState, useEffect } from "react";
import { getAllProblems, getStats, updateProblemStatus, deleteProblem, getImageUrl } from "../api";

const statusConfig = {
  Submitted: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  "In Progress": { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  Resolved: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
};

function StatCard({ label, value, color, icon }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${color}`}>{label}</span>
      </div>
      <div className="text-3xl font-black text-slate-900">{value}</div>
    </div>
  );
}

function ProblemCard({ problem, onUpdate }) {
  const [status, setStatus] = useState(problem.status);
  const [resolution, setResolution] = useState(problem.resolution || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const cfg = statusConfig[problem.status] || statusConfig["Submitted"];

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProblemStatus(problem.id, status, resolution);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onUpdate();
    } catch {
      alert("Failed to update. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete complaint ${problem.id}? This is permanent.`)) return;
    setDeleting(true);
    try {
      await deleteProblem(problem.id);
      onUpdate();
    } catch {
      alert("Failed to delete.");
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden hover:border-slate-200 transition-all">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={`flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${cfg.bg} ${cfg.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {problem.status}
          </span>
          <span className="font-mono text-sm font-bold text-slate-500">{problem.id}</span>
          <span className="text-sm text-slate-700 truncate hidden md:block">{problem.description?.substring(0, 60)}…</span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-xs text-slate-400 hidden md:block">{problem.submitted_at?.slice(0, 10)}</span>
          <span className="text-slate-400 text-xs">{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-100 px-5 py-5 grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase mb-1.5">Complaint</div>
              <div className="bg-slate-50 rounded-xl px-4 py-3 text-slate-700 text-sm leading-relaxed">{problem.description}</div>
            </div>

            {problem.image_path && (
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase mb-1.5">Photo</div>
                <img src={getImageUrl(problem.image_path)} alt="complaint" className="w-full max-h-40 object-cover rounded-xl border border-slate-100" />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Category", value: problem.category || "—" },
                { label: "Confidence", value: problem.confidence ? `${Math.round(problem.confidence * 100)}%` : "—" },
                { label: "Department", value: problem.department || "—" },
                { label: "Submitted", value: problem.submitted_at?.slice(0, 10) || "—" },
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-3">
                  <div className="text-xs text-slate-400 font-medium mb-0.5">{item.label}</div>
                  <div className="text-sm font-semibold text-slate-700">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block">Update Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
              >
                <option>Submitted</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block">Resolution / Response</label>
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={4}
                placeholder="Describe what action was taken…"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none transition-all text-sm"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl transition-all text-sm"
            >
              {saved ? "✓ Saved!" : saving ? "Saving…" : "Save Update"}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-full bg-white border border-red-200 hover:bg-red-50 text-red-500 font-semibold py-2.5 rounded-xl transition-all text-sm"
            >
              {deleting ? "Deleting…" : "Delete Complaint"}
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

  const statCards = stats ? [
    { label: "Total", value: stats.total, color: "bg-slate-100 text-slate-600", icon: "📋" },
    { label: "Submitted", value: stats.submitted, color: "bg-blue-100 text-blue-600", icon: "📥" },
    { label: "In Progress", value: stats.in_progress, color: "bg-amber-100 text-amber-600", icon: "⚙️" },
    { label: "Resolved", value: stats.resolved, color: "bg-emerald-100 text-emerald-600", icon: "✅" },
  ] : [];

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-1">Admin Panel</p>
          <h1 className="text-4xl font-black text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage and resolve student complaints.</p>
        </div>
        <button
          onClick={fetchData}
          className="bg-white border border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-slate-600 font-semibold px-4 py-2 rounded-xl text-sm transition-all flex items-center gap-2"
        >
          <span className="text-base">🔄</span> Refresh
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((s, i) => <StatCard key={i} {...s} />)}
        </div>
      )}

      <div className="flex gap-3 flex-wrap items-center">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-700 focus:outline-none focus:border-violet-400 text-sm font-medium"
        >
          {["All", "Submitted", "In Progress", "Resolved"].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-700 focus:outline-none focus:border-violet-400 text-sm font-medium"
        >
          {["All", "Maintenance Department", "Dean of Students Office", "Hostel & Mess Committee", "Academic Office", "General Administration"].map((d) => <option key={d}>{d}</option>)}
        </select>
        <span className="text-sm text-slate-400 font-medium">{problems.length} complaint{problems.length !== 1 ? "s" : ""}</span>
      </div>

      {loading ? (
        <div className="text-center text-slate-400 py-16">
          <div className="animate-spin text-3xl mb-3">⏳</div>
          Loading complaints…
        </div>
      ) : problems.length === 0 ? (
        <div className="text-center text-slate-400 py-16 bg-white rounded-2xl border border-slate-100">
          <div className="text-4xl mb-3">📭</div>
          <div className="font-semibold text-slate-500">No complaints found</div>
          <div className="text-sm mt-1">Try changing your filters</div>
        </div>
      ) : (
        <div className="space-y-3">
          {problems.map((p) => <ProblemCard key={p.id} problem={p} onUpdate={fetchData} />)}
        </div>
      )}
    </div>
  );
}