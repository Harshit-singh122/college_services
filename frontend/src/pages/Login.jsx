import { useState } from "react";

const ADMIN_PASSWORD = "admin123";

export default function Login({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem("admin_auth", "true");
        onLogin();
      } else {
        setError("Incorrect password. Please try again.");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
              🔐
            </div>
            <h1 className="text-2xl font-black text-slate-900">Admin Access</h1>
            <p className="text-slate-400 text-sm mt-1">Enter your password to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                autoFocus
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm font-medium">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all"
            >
              {loading ? "Verifying..." : "Login →"}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-slate-400 mt-4">
          UniSync Admin Panel · Restricted Access
        </p>
      </div>
    </div>
  );
}