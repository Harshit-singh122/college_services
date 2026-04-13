import { useState } from "react";

const mockDoubts = [
  { id: 1, question: "Can someone explain semaphores vs mutex in OS? I have an exam tomorrow.", subject: "Operating Systems", year: "2nd Year", expert: "Arjun Mehta (3rd Year)", status: "Answered", answers: 3, emoji: "💻" },
  { id: 2, question: "What's the difference between malloc and calloc in C?", subject: "C Programming", year: "1st Year", expert: "Priya Sharma (2nd Year)", status: "Answered", answers: 2, emoji: "📟" },
  { id: 3, question: "How to solve recurrence relations using Master Theorem?", subject: "Data Structures", year: "2nd Year", expert: null, status: "Open", answers: 0, emoji: "📊" },
  { id: 4, question: "I'm confused about Laplace transforms — when do we use them?", subject: "Mathematics", year: "1st Year", expert: "Rohan Verma (3rd Year)", status: "In Progress", answers: 1, emoji: "📐" },
];

const subjects = ["Operating Systems", "C Programming", "Data Structures", "Mathematics", "Physics", "DBMS", "Computer Networks", "Other"];

const statusConfig = {
  Open: { bg: "bg-amber-100", text: "text-amber-700" },
  "In Progress": { bg: "bg-blue-100", text: "text-blue-700" },
  Answered: { bg: "bg-emerald-100", text: "text-emerald-700" },
};

export default function DoubtPortal() {
  const [activeTab, setActiveTab] = useState("browse");
  const [question, setQuestion] = useState("");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [submitted, setSubmitted] = useState(null);
  const [routing, setRouting] = useState(false);

  const handleSubmit = () => {
    if (!question.trim() || !subject || !year) return alert("Please fill in all fields.");
    setRouting(true);
    setTimeout(() => {
      setRouting(false);
      setSubmitted({ subject, expert: "Arjun Mehta (3rd Year CS)", eta: "~15 minutes" });
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Campus Service</p>
        <h1 className="text-4xl font-black text-slate-900">📚 Doubt Portal</h1>
        <p className="text-slate-500 mt-2">Post your academic doubts — AI routes them to the right senior student expert.</p>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 mb-6 flex items-center gap-3">
        <span className="text-2xl">🚧</span>
        <div>
          <div className="font-bold text-emerald-800">Feature Preview</div>
          <div className="text-sm text-emerald-600">Real-time routing to seniors is coming soon. Explore the interface below.</div>
        </div>
      </div>

      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit">
        {["browse", "ask"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}>
            {tab === "browse" ? "💬 Browse Doubts" : "🙋 Ask a Doubt"}
          </button>
        ))}
      </div>

      {activeTab === "browse" && (
        <div className="space-y-3">
          {mockDoubts.map((d) => {
            const cfg = statusConfig[d.status];
            return (
              <div key={d.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:border-slate-200 transition-all">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{d.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>{d.status}</span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">{d.subject}</span>
                      <span className="text-xs text-slate-400">{d.year}</span>
                    </div>
                    <p className="font-semibold text-slate-800 text-sm leading-relaxed mb-2">{d.question}</p>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      {d.expert ? <span>🎓 Routed to {d.expert}</span> : <span>⏳ Awaiting expert assignment</span>}
                      <span>{d.answers} answer{d.answers !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "ask" && !submitted && (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">Your Question</label>
            <textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={4}
              placeholder="e.g. Can someone explain how virtual memory works? I'm confused about page tables…"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-400 resize-none text-sm transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Subject</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-emerald-400 text-sm transition-all">
                <option value="">Select subject</option>
                {subjects.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Your Year</label>
              <select value={year} onChange={(e) => setYear(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-emerald-400 text-sm transition-all">
                <option value="">Select year</option>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
              </select>
            </div>
          </div>

          <button onClick={handleSubmit} disabled={routing}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-emerald-100 flex items-center justify-center gap-2">
            {routing ? (
              <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg> AI is routing your doubt…</>
            ) : "Ask & Route →"}
          </button>
        </div>
      )}

      {activeTab === "ask" && submitted && (
        <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm text-center space-y-4">
          <div className="text-5xl">🎓</div>
          <h3 className="text-2xl font-black text-slate-900">Doubt Routed!</h3>
          <p className="text-slate-500">Your <span className="font-bold text-slate-700">{submitted.subject}</span> question has been assigned to <span className="font-bold text-slate-700">{submitted.expert}</span>.</p>
          <p className="text-sm text-slate-400">Expected response: {submitted.eta}</p>
          <button onClick={() => { setSubmitted(null); setQuestion(""); setSubject(""); setYear(""); }}
            className="bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl">Ask Another</button>
        </div>
      )}
    </div>
  );
}