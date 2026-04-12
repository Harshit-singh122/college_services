import { useNavigate } from "react-router-dom";

const categories = [
  { icon: "🚿", name: "Bathroom & Hygiene", dept: "Maintenance Department" },
  { icon: "🛡️", name: "Anti-Ragging & Safety", dept: "Dean of Students Office" },
  { icon: "🍱", name: "Mess & Food Quality", dept: "Hostel & Mess Committee" },
  { icon: "📚", name: "Academic Issues", dept: "Academic Office" },
  { icon: "🔧", name: "Infrastructure/Maintenance", dept: "Maintenance Department" },
  { icon: "📌", name: "Other", dept: "General Administration" },
];

const steps = [
  { icon: "📝", title: "Submit", desc: "Describe your problem in the form" },
  { icon: "🤖", title: "AI Classifies", desc: "Gemini agent identifies the category" },
  { icon: "📨", title: "Auto-Routed", desc: "Assigned to the right department" },
  { icon: "🔍", title: "Track", desc: "Check live status with your Tracking ID" },
  { icon: "✅", title: "Resolved", desc: "Admin updates status and adds resolution" },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-5xl font-bold text-white">Campus Problem Solver</h1>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto">
          AI-powered complaint management. Submit a problem, let Gemini classify it,
          and get it routed to the right department automatically.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={() => navigate("/submit")}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            📝 Submit a Problem
          </button>
          <button
            onClick={() => navigate("/track")}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            🔍 Track My Problem
          </button>
        </div>
      </div>

      {/* How it works */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">How it works</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {steps.map((s, i) => (
            <div key={i} className="bg-gray-800 rounded-xl p-4 text-center space-y-2">
              <div className="text-3xl">{s.icon}</div>
              <div className="text-sm font-semibold text-white">{s.title}</div>
              <div className="text-xs text-gray-400">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Categories handled</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((c, i) => (
            <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center gap-4">
              <span className="text-3xl">{c.icon}</span>
              <div>
                <div className="font-semibold text-white">{c.name}</div>
                <div className="text-xs text-gray-400">{c.dept}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}