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
        setError("Incorrect password. Try again.");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="text-4xl mb-3">🔐</div>
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-gray-400 text-sm mt-1">Enter the admin password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-900/40 border border-red-600 text-red-300 rounded-xl px-4 py-3 text-sm">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? "Checking..." : "🔓 Login"}
          </button>
        </form>
      </div>
    </div>
  );
}