import { useState } from "react";

const mockItems = [
  { id: 1, type: "Lost", title: "Blue water bottle", tags: ["blue", "water bottle", "Milton"], location: "Mess Hall", date: "Apr 11", emoji: "🍶", match: true },
  { id: 2, type: "Found", title: "boAt Airdopes earphones", tags: ["boAt", "earphones", "black", "TWS"], location: "Library", date: "Apr 12", emoji: "🎧", match: false },
  { id: 3, type: "Lost", title: "Casio scientific calculator", tags: ["Casio", "calculator", "fx-991"], location: "Room 204", date: "Apr 10", emoji: "🔢", match: false },
  { id: 4, type: "Found", title: "Blue denim jacket", tags: ["jacket", "denim", "blue", "medium"], location: "Ground Floor", date: "Apr 13", emoji: "🧥", match: false },
];

export default function LostFound() {
  const [activeTab, setActiveTab] = useState("browse");
  const [reportType, setReportType] = useState("Lost");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [tags, setTags] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    // Simulate Gemini Vision tagging
    setAnalyzing(true);
    setTimeout(() => {
      setTags(["blue", "water bottle", "plastic", "Milton", "500ml"]);
      setAnalyzing(false);
    }, 1800);
  };

  const handleSubmit = () => {
    if (!description || !location) return alert("Please fill in all fields.");
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-bold text-violet-500 uppercase tracking-widest mb-1">Campus Service</p>
        <h1 className="text-4xl font-black text-slate-900">🔍 Lost & Found</h1>
        <p className="text-slate-500 mt-2">Upload a photo — Gemini Vision auto-tags it and matches with other reports.</p>
      </div>

      <div className="bg-violet-50 border border-violet-200 rounded-2xl px-5 py-4 mb-6 flex items-center gap-3">
        <span className="text-2xl">🚧</span>
        <div>
          <div className="font-bold text-violet-800">Feature Preview</div>
          <div className="text-sm text-violet-600">AI image matching is coming soon. Browse the demo below.</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit">
        {["browse", "report"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all capitalize ${
              activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}>
            {tab === "browse" ? "📋 Browse Items" : "➕ Report Item"}
          </button>
        ))}
      </div>

      {activeTab === "browse" && (
        <div className="space-y-3">
          {mockItems.map((item) => (
            <div key={item.id} className={`bg-white border rounded-2xl p-5 shadow-sm flex items-start gap-4 hover:border-slate-200 transition-all ${item.match ? "border-emerald-200 bg-emerald-50/30" : "border-slate-100"}`}>
              <div className="text-3xl">{item.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${item.type === "Lost" ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
                    {item.type}
                  </span>
                  {item.match && <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-600">🔗 Potential Match</span>}
                  <span className="text-xs text-slate-400">{item.date}</span>
                </div>
                <div className="font-bold text-slate-800 mb-1">{item.title}</div>
                <div className="text-sm text-slate-500 mb-2">📍 {item.location}</div>
                <div className="flex gap-1.5 flex-wrap">
                  {item.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "report" && !submitted && (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex gap-2">
            {["Lost", "Found"].map((t) => (
              <button key={t} onClick={() => setReportType(t)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                  reportType === t ? (t === "Lost" ? "bg-red-500 text-white border-red-500" : "bg-emerald-500 text-white border-emerald-500") : "bg-white border-slate-200 text-slate-600"
                }`}>
                {t === "Lost" ? "😢 I Lost Something" : "😊 I Found Something"}
              </button>
            ))}
          </div>

          {/* Image upload with AI tagging */}
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
              Upload a Photo <span className="text-violet-500 font-normal">(AI will auto-tag it)</span>
            </label>
            {!preview ? (
              <label className="border-2 border-dashed border-slate-200 hover:border-violet-300 hover:bg-violet-50/50 rounded-xl p-8 flex flex-col items-center cursor-pointer transition-all">
                <span className="text-3xl mb-2">📷</span>
                <span className="text-sm text-slate-500 font-medium">Click to upload</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            ) : (
              <div className="space-y-3">
                <img src={preview} alt="preview" className="w-full max-h-48 object-cover rounded-xl border border-slate-100" />
                {analyzing ? (
                  <div className="flex items-center gap-2 text-sm text-violet-600 font-medium">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Gemini Vision is analyzing your photo…
                  </div>
                ) : tags.length > 0 && (
                  <div>
                    <div className="text-xs text-slate-400 font-medium mb-1.5">AI-EXTRACTED TAGS</div>
                    <div className="flex gap-1.5 flex-wrap">
                      {tags.map((tag) => (
                        <span key={tag} className="text-xs bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full font-semibold">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
              placeholder="Describe the item in detail…"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-400 resize-none text-sm transition-all" />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">Where was it lost/found?</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Library, Mess Hall, Block 3 corridor…"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-400 text-sm transition-all" />
          </div>

          <button onClick={handleSubmit}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-violet-100">
            Submit Report 🔍
          </button>
        </div>
      )}

      {activeTab === "report" && submitted && (
        <div className="text-center py-16 space-y-4">
          <div className="text-5xl">✅</div>
          <h3 className="text-2xl font-black text-slate-900">Report Submitted!</h3>
          <p className="text-slate-500">We'll notify you if a matching item is found. AI is checking existing reports now.</p>
          <button onClick={() => { setSubmitted(false); setPreview(null); setTags([]); setDescription(""); setLocation(""); }}
            className="bg-violet-600 text-white font-bold px-6 py-3 rounded-xl">Submit Another</button>
        </div>
      )}
    </div>
  );
}