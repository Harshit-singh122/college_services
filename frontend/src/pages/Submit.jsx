import { useState, useRef } from "react";
import { submitProblem, getImageUrl } from "../api";

const BLOCKS = ["1", "2", "3", "4", "5", "6"];

const categories = [
  { icon: "🚿", label: "Bathroom & Hygiene" },
  { icon: "🛡️", label: "Anti-Ragging & Safety" },
  { icon: "🍱", label: "Mess & Food Quality" },
  { icon: "📚", label: "Academic Issues" },
  { icon: "🔧", label: "Infrastructure / Maintenance" },
  { icon: "📌", label: "Other" },
];

export default function Submit() {
  const [description, setDescription] = useState("");
  const [block, setBlock] = useState("");
  const [room, setRoom] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!description.trim()) return setError("Please describe your problem.");
    if (description.trim().length < 10) return setError("Description is too short (min 10 chars).");
    if (!block) return setError("Please select your hostel block.");
    if (!room || room < 1 || room > 999) return setError("Please enter a valid room number.");

    setLoading(true);
    try {
      const fullDescription = `[Block ${block}, Room ${room}] ${description.trim()}`;
      const data = await submitProblem(fullDescription, image);
      setResult({ ...data, block, room });
      setDescription(""); setBlock(""); setRoom("");
      setImage(null); setPreview(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const confidenceColor = (c) => {
    if (c >= 0.8) return "text-emerald-600";
    if (c >= 0.5) return "text-amber-600";
    return "text-red-500";
  };

  const confidenceBg = (c) => {
    if (c >= 0.8) return "bg-emerald-50 border-emerald-200";
    if (c >= 0.5) return "bg-amber-50 border-amber-200";
    return "bg-red-50 border-red-200";
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
          <div>
            <div className="font-bold text-emerald-800">Complaint submitted successfully!</div>
            <div className="text-sm text-emerald-600">Routed to {result.department}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium mb-1">YOUR TRACKING ID</div>
              <div className="font-mono font-black text-2xl text-slate-900 tracking-widest">{result.tracking_id}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400 font-medium mb-1">LOCATION</div>
              <div className="font-bold text-slate-700">Block {result.block}, Room {result.room}</div>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-xs text-slate-400 font-medium mb-1">CATEGORY</div>
              <div className="font-bold text-slate-800">{result.category}</div>
            </div>
            <div className={`rounded-xl p-4 border ${confidenceBg(result.confidence)}`}>
              <div className="text-xs text-slate-400 font-medium mb-1">AI CONFIDENCE</div>
              <div className={`font-black text-xl ${confidenceColor(result.confidence)}`}>
                {Math.round(result.confidence * 100)}%
              </div>
            </div>
            <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 col-span-2">
              <div className="text-xs text-violet-500 font-medium mb-1">ROUTED TO</div>
              <div className="font-bold text-violet-800">{result.department}</div>
            </div>
          </div>

          {result.fallback && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700">
              ⚠️ Low AI confidence — sent to General Administration for manual review.
            </div>
          )}

          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-xs text-slate-400 font-medium mb-1.5">AI REASONING</div>
            <div className="text-sm text-slate-600 leading-relaxed">{result.reasoning}</div>
          </div>

          <p className="text-xs text-slate-400 text-center">Save your Tracking ID to check status later</p>
        </div>

        <button
          onClick={() => setResult(null)}
          className="w-full bg-white border border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-slate-700 font-semibold py-3 rounded-xl transition-all text-sm"
        >
          + Submit Another Complaint
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-1">Student Portal</p>
        <h1 className="text-4xl font-black text-slate-900">File a Complaint</h1>
        <p className="text-slate-500 mt-2">Our AI agent classifies and routes it to the right team instantly.</p>
      </div>

      {/* Category reference */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {categories.map((c, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-xl px-3 py-2.5 flex items-center gap-2">
            <span className="text-base">{c.icon}</span>
            <span className="text-xs font-medium text-slate-600 leading-tight">{c.label}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Hostel Block <span className="text-red-400">*</span></label>
            <select
              value={block}
              onChange={(e) => setBlock(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
            >
              <option value="">Select block</option>
              {BLOCKS.map((b) => <option key={b} value={b}>Block {b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Room Number <span className="text-red-400">*</span></label>
            <input
              type="number"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g. 204"
              min={1} max={999}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Describe your problem <span className="text-red-400">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="e.g. Bathroom on 3rd floor has no water since yesterday morning. The tap is completely dry..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all resize-none"
          />
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-slate-400">Be specific — better description = better routing</span>
            <span className={`text-xs font-medium ${description.length < 10 ? "text-red-400" : "text-slate-400"}`}>
              {description.length} chars
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Attach a photo <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          {!preview ? (
            <div
              onClick={() => fileRef.current.click()}
              className="border-2 border-dashed border-slate-200 hover:border-violet-300 hover:bg-violet-50/50 rounded-xl p-8 text-center cursor-pointer transition-all group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📷</div>
              <div className="text-sm font-medium text-slate-500">Click to upload a photo</div>
              <div className="text-xs text-slate-400 mt-1">JPG, PNG — up to 5MB</div>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden">
              <img src={preview} alt="preview" className="w-full max-h-48 object-cover" />
              <button
                type="button"
                onClick={() => { setImage(null); setPreview(null); fileRef.current.value = ""; }}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all"
              >
                ✕ Remove
              </button>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-violet-200 hover:shadow-violet-300 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              AI is analyzing your complaint...
            </>
          ) : "Submit Complaint →"}
        </button>
      </form>
    </div>
  );
}