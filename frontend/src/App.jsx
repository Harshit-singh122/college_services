import { BrowserRouter, Routes, Route, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
  RedirectToSignIn,
} from "@clerk/clerk-react";

import Home from "./pages/Home";
import Submit from "./pages/Submit";
import Track from "./pages/Track";
import Admin from "./pages/Admin";
import Canteen from "./pages/Canteen";
import Laundry from "./pages/Laundry";
import LostFound from "./pages/LostFound";
import DoubtPortal from "./pages/DoubtPortal";
import Marketplace from "./pages/Marketplace";

// ── Protect any route: must be signed in ──────────────────────────
function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

// ── Protect admin route: must be signed in + have admin role ──────
function AdminRoute() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin text-3xl">⏳</div>
      </div>
    );
  }

  const isAdmin = user?.publicMetadata?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="text-5xl">🔒</div>
        <h2 className="text-2xl font-black text-slate-900">Access Denied</h2>
        <p className="text-slate-500 max-w-sm">
          You don't have admin privileges. Contact your system administrator to get access.
        </p>
      </div>
    );
  }

  return <Admin />;
}

// ── Navbar ────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100"
          : "bg-white border-b border-slate-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-violet-200 transition-shadow">
            <span className="text-white text-sm font-black">U</span>
          </div>
          <span className="font-black text-xl tracking-tight text-slate-900">
            Uni<span className="text-violet-600">Sync</span>
          </span>
        </NavLink>

        {/* Links */}
        <div className="flex items-center gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isActive ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            Home
          </NavLink>

          <SignedIn>
            <NavLink
              to="/submit"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              Submit
            </NavLink>
            <NavLink
              to="/track"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              Track
            </NavLink>
          </SignedIn>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          {/* Admin link (only for admins) */}
          <SignedIn>
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                Dashboard
              </NavLink>
            )}
          </SignedIn>

          {/* Auth button */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="ml-1 px-4 py-1.5 bg-slate-900 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div className="ml-2">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </div>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}

// ── App ───────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-10">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />

            {/* Protected — must be signed in */}
            <Route path="/submit" element={<ProtectedRoute><Submit /></ProtectedRoute>} />
            <Route path="/track" element={<ProtectedRoute><Track /></ProtectedRoute>} />
            <Route path="/canteen" element={<ProtectedRoute><Canteen /></ProtectedRoute>} />
            <Route path="/laundry" element={<ProtectedRoute><Laundry /></ProtectedRoute>} />
            <Route path="/lost-found" element={<ProtectedRoute><LostFound /></ProtectedRoute>} />
            <Route path="/doubts" element={<ProtectedRoute><DoubtPortal /></ProtectedRoute>} />
            <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />

            {/* Admin — must be signed in + admin role */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminRoute />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}