import { BrowserRouter, Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Submit from "./pages/Submit";
import Track from "./pages/Track";
import Admin from "./pages/Admin";
import Login from "./pages/Login";

function Navbar({ isAdmin, onLogout }) {
  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? "bg-indigo-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  return (
    <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <NavLink to="/" className="text-white font-bold text-lg">🏫 Campus Problem Solver</NavLink>
        <div className="flex gap-2 items-center">
          <NavLink to="/submit" className={linkClass}>📝 Submit</NavLink>
          <NavLink to="/track" className={linkClass}>🔍 Track</NavLink>
          <NavLink to="/admin" className={linkClass}>🛠️ Admin</NavLink>
          {isAdmin && (
            <button
              onClick={onLogout}
              className="ml-2 text-xs text-gray-400 hover:text-red-400 transition-colors px-2 py-1"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

function ProtectedAdmin() {
  const [isAdmin, setIsAdmin] = useState(
    () => localStorage.getItem("admin_auth") === "true"
  );

  if (!isAdmin) {
    return <Login onLogin={() => setIsAdmin(true)} />;
  }
  return <Admin />;
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(
    () => localStorage.getItem("admin_auth") === "true"
  );

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setIsAdmin(false);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar isAdmin={isAdmin} onLogout={handleLogout} />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/track" element={<Track />} />
            <Route path="/admin" element={<ProtectedAdmin />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}