import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

const services = [
  {
    icon: "🍽️",
    title: "Canteen",
    desc: "Hot meals delivered to your block.",
    path: "/canteen",
    accent: "#f97316",
    glow: "rgba(249,115,22,0.15)",
    tag: "Food & Drinks",
  },
  {
    icon: "👕",
    title: "Laundry",
    desc: "Schedule a pickup in seconds.",
    path: "/laundry",
    accent: "#0ea5e9",
    glow: "rgba(14,165,233,0.15)",
    tag: "Room Service",
  },
  {
    icon: "🔍",
    title: "Lost & Found",
    desc: "AI auto-matches lost items.",
    path: "/lost-found",
    accent: "#8b5cf6",
    glow: "rgba(139,92,246,0.15)",
    tag: "AI-Powered",
  },
  {
    icon: "📚",
    title: "Doubt Portal",
    desc: "Get routed to the right senior.",
    path: "/doubts",
    accent: "#10b981",
    glow: "rgba(16,185,129,0.15)",
    tag: "Peer Learning",
  },
  {
    icon: "🛒",
    title: "Marketplace",
    desc: "Buy and sell campus items.",
    path: "/marketplace",
    accent: "#f43f5e",
    glow: "rgba(244,63,94,0.15)",
    tag: "Buy & Sell",
  },
  {
    icon: "📝",
    title: "Complaints",
    desc: "AI routes it to the right team.",
    path: "/submit",
    accent: "#6366f1",
    glow: "rgba(99,102,241,0.15)",
    tag: "Instant Routing",
  },
];

const steps = [
  { icon: "📝", label: "Describe", sub: "Tell us what's wrong" },
  { icon: "🤖", label: "AI Reads", sub: "Gemini classifies instantly" },
  { icon: "📨", label: "Routed", sub: "Right dept, right exec" },
  { icon: "🔍", label: "Track", sub: "Live status updates" },
  { icon: "✅", label: "Resolved", sub: "Admin closes the loop" },
];

// Animated counter
function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 1200;
          const step = (target / duration) * 16;
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <div className="space-y-0 -mt-10 overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden px-6 py-20">

        {/* Animated mesh background */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 20% 60%, rgba(16,185,129,0.08) 0%, transparent 60%)",
            }}
          />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          {/* Floating orbs */}
          <div
            className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl opacity-20 animate-pulse"
            style={{ background: "radial-gradient(circle, #7c3aed, transparent)", animationDuration: "4s" }}
          />
          <div
            className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 animate-pulse"
            style={{ background: "radial-gradient(circle, #6366f1, transparent)", animationDuration: "6s", animationDelay: "2s" }}
          />
        </div>

        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 bg-white border border-violet-200 shadow-lg shadow-violet-100 text-violet-700 text-xs font-bold px-5 py-2 rounded-full mb-8 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "0ms" }}
        >
          <span className="w-2 h-2 bg-violet-500 rounded-full animate-ping" style={{ animationDuration: "2s" }} />
          AI-Powered Campus Platform
          <span className="bg-violet-100 text-violet-600 text-[10px] font-black px-2 py-0.5 rounded-full">LIVE</span>
        </div>

        {/* Headline */}
        <h1
          className={`text-6xl md:text-8xl font-black tracking-tight text-slate-900 leading-[1.0] mb-6 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          Your campus,
          <br />
          <span
            className="relative inline-block"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #6366f1 40%, #0ea5e9 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            reimagined.
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className={`text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          One platform for complaints, canteen orders, laundry, lost & found, and more —{" "}
          <span className="text-slate-700 font-semibold">all routed by AI instantly.</span>
        </p>

        {/* CTAs */}
        <div
          className={`flex flex-col sm:flex-row justify-center gap-3 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <SignedIn>
            <button
              onClick={() => navigate("/submit")}
              className="group relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-2xl shadow-violet-300 hover:shadow-violet-400 hover:-translate-y-1 text-lg"
            >
              <span className="relative z-10">File a Complaint →</span>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={() => navigate("/track")}
              className="bg-white border-2 border-slate-200 hover:border-violet-300 text-slate-700 font-bold px-8 py-4 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-1 text-lg"
            >
              Track Status
            </button>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="group relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-2xl shadow-violet-300 hover:shadow-violet-400 hover:-translate-y-1 text-lg">
                Get Started →
              </button>
            </SignInButton>
            <button
              onClick={() => navigate("/track")}
              className="bg-white border-2 border-slate-200 hover:border-violet-300 text-slate-700 font-bold px-8 py-4 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-1 text-lg"
            >
              Track a Complaint
            </button>
          </SignedOut>
        </div>

        {/* Floating stat pills */}
        <div
          className={`flex flex-wrap justify-center gap-3 mt-14 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          {[
            { label: "AI Accuracy", value: "~90%", color: "bg-violet-50 border-violet-200 text-violet-700" },
            { label: "Services", value: "6 live", color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
            { label: "Powered by", value: "Gemini AI", color: "bg-sky-50 border-sky-200 text-sky-700" },
            { label: "Departments", value: "5 covered", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
          ].map((pill, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 border rounded-full px-4 py-2 text-sm font-semibold ${pill.color} shadow-sm`}
            >
              <span className="text-xs font-normal opacity-70">{pill.label}</span>
              <span className="font-black">{pill.value}</span>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30 animate-bounce">
          <div className="w-px h-8 bg-slate-400" />
          <span className="text-xs text-slate-500 font-medium">scroll</span>
        </div>
      </section>

      {/* ── SERVICES GRID ────────────────────────────────────────────── */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-black text-violet-600 uppercase tracking-[0.3em] mb-3">Student Portal</p>
            <h2 className="text-5xl font-black text-slate-900 leading-tight">
              Everything you need,
              <br />
              <span className="text-slate-400">right here.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <button
                key={i}
                onClick={() => navigate(s.path)}
                className="group relative bg-white border border-slate-100 rounded-3xl p-7 text-left overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                style={{
                  transitionDelay: `${i * 40}ms`,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 20px 60px ${s.glow}, 0 4px 20px rgba(0,0,0,0.08)`;
                  e.currentTarget.style.borderColor = s.accent + "40";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)";
                  e.currentTarget.style.borderColor = "#f1f5f9";
                }}
              >
                {/* Glow blob */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2"
                  style={{ background: s.glow }}
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                      style={{ background: s.glow, border: `1px solid ${s.accent}30` }}
                    >
                      {s.icon}
                    </div>
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{ background: s.glow, color: s.accent }}
                    >
                      {s.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>

                  <div
                    className="mt-5 flex items-center gap-1 text-xs font-black opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1"
                    style={{ color: s.accent }}
                  >
                    Open {s.title} →
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAND ───────────────────────────────────────────────── */}
      <section className="py-16 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)",
          }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0 -z-10 opacity-10"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: 90, suffix: "%", label: "AI Classification Accuracy" },
            { value: 6, suffix: "+", label: "Campus Services" },
            { value: 5, suffix: "", label: "Departments Connected" },
            { value: 30, suffix: "s", label: "Avg. Routing Time" },
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <div className="text-4xl md:text-5xl font-black text-white">
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-indigo-300 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-black text-violet-600 uppercase tracking-[0.3em] mb-3">How It Works</p>
            <h2 className="text-5xl font-black text-slate-900">
              Complaint in{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #6366f1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                30 seconds.
              </span>
            </h2>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Connector line */}
            <div className="absolute top-8 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent hidden md:block" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {steps.map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-4 group">
                  <div className="relative">
                    <div className="w-16 h-16 bg-white border-2 border-slate-100 group-hover:border-violet-300 rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:shadow-lg group-hover:shadow-violet-100 transition-all duration-300 group-hover:-translate-y-1">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-violet-600 text-white text-xs font-black rounded-full flex items-center justify-center shadow-md">
                      {i + 1}
                    </div>
                  </div>
                  <div>
                    <div className="font-black text-slate-900 text-sm">{step.label}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{step.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <SignedIn>
              <button
                onClick={() => navigate("/submit")}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold px-10 py-4 rounded-2xl shadow-xl shadow-violet-200 hover:shadow-violet-300 hover:-translate-y-1 transition-all text-lg"
              >
                Try It Now →
              </button>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold px-10 py-4 rounded-2xl shadow-xl shadow-violet-200 hover:shadow-violet-300 hover:-translate-y-1 transition-all text-lg">
                  Get Started Free →
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 py-10 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-7 h-7 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-black">U</span>
          </div>
          <span className="font-black text-slate-900">
            Uni<span className="text-violet-600">Sync</span>
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Built for the AI/ML Hackathon · Powered by Gemini AI & Clerk
        </p>
      </footer>
    </div>
  );
}