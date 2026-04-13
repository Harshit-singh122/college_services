import { useState } from "react";

const mockListings = [
  { id: 1, title: "Higher Engineering Mathematics", seller: "Rohan K.", price: 280, condition: "Good", category: "Books", emoji: "📗", age: "2 days ago" },
  { id: 2, title: "Usha Room Cooler (40L)", seller: "Priya S.", price: 2500, condition: "Fair", category: "Appliances", emoji: "❄️", age: "1 day ago" },
  { id: 3, title: "Mini Drafter Set", seller: "Amit V.", price: 150, condition: "Like New", category: "Stationery", emoji: "📐", age: "5 hrs ago" },
  { id: 4, title: "Casio FX-991EX Calculator", seller: "Sneha R.", price: 600, condition: "Good", category: "Electronics", emoji: "🔢", age: "3 hrs ago" },
  { id: 5, title: "Mattress (single, foam)", seller: "Dev M.", price: 800, condition: "Fair", category: "Furniture", emoji: "🛏️", age: "Just now" },
];

const categories = ["All", "Books", "Appliances", "Electronics", "Stationery", "Furniture"];

const conditionColor = {
  "Like New": "bg-emerald-100 text-emerald-700",
  "Good": "bg-blue-100 text-blue-700",
  "Fair": "bg-amber-100 text-amber-700",
};

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState("browse");
  const [filterCat, setFilterCat] = useState("All");
  const [nlInput, setNlInput] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState(null);
  const [listed, setListed] = useState(false);

  const filtered = filterCat === "All" ? mockListings : mockListings.filter((l) => l.category === filterCat);

  const handleNLParse = () => {
    if (!nlInput.trim()) return;
    setParsing(true);
    setTimeout(() => {
      const lower = nlInput.toLowerCase();
      let title = "Item";
      let price = 0;
      let condition = "Good";
      let category = "Other";

      // Simple regex-style extraction simulation
      const priceMatch = nlInput.match(/₹?\d+/);
      if (priceMatch) price = parseInt(priceMatch[0].replace("₹", ""));

      if (lower.includes("book") || lower.includes("textbook")) { category = "Books"; title = "Textbook"; }
      else if (lower.includes("cooler") || lower.includes("fan")) { category = "Appliances"; title = "Room Cooler"; }
      else if (lower.includes("calculator")) { category = "Electronics"; title = "Calculator"; }
      else if (lower.includes("mattress")) { category = "Furniture"; title = "Mattress"; }
      else if (lower.includes("drafter")) { category = "Stationery"; title = "Drafter Set"; }

      if (lower.includes("new") || lower.includes("like new")) condition = "Like New";
      else if (lower.includes("fair") || lower.includes("used") || lower.includes("wear")) condition = "Fair";

      // Extract any quoted or capitalized title
      const titleMatch = nlInput.match(/"([^"]+)"/);
      if (titleMatch) title = titleMatch[1];

      setParsed({ title, price, condition, category });
      setParsing(false);
    }, 1500);
  };

  const handleList = () => {
    if (!parsed) return;
    setListed(true);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1">Campus Service</p>
        <h1 className="text-4xl font-black text-slate-900">🛒 Marketplace</h1>
        <p className="text-slate-500 mt-2">Buy and sell campus items. Just describe what you have — AI creates the listing.</p>
      </div>

      <div className="bg-rose-50 border border-rose-200 rounded-2xl px-5 py-4 mb-6 flex items-center gap-3">
        <span className="text-2xl">🚧</span>
        <div>
          <div className="font-bold text-rose-800">Feature Preview</div>
          <div className="text-sm text-rose-600">Full marketplace is coming soon. Try the AI listing tool below.</div>
        </div>
      </div>

      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit">
        {["browse", "sell"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}>
            {tab === "browse" ? "🛍️ Browse" : "💰 Sell"}
          </button>
        ))}
      </div>

      {activeTab === "browse" && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button key={c} onClick={() => setFilterCat(c)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  filterCat === c ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                }`}>{c}</button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map((item) => (
              <div key={item.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:border-slate-200 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{item.emoji}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${conditionColor[item.condition]}`}>{item.condition}</span>
                </div>
                <div className="font-bold text-slate-900 mb-1">{item.title}</div>
                <div className="text-xs text-slate-400 mb-3">{item.category} · {item.age}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-slate-900">₹{item.price}</span>
                  <span className="text-xs text-slate-500">by {item.seller}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "sell" && !listed && (
        <div className="space-y-5">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="font-black text-slate-900 mb-1">✨ Describe it, we'll list it</h3>
              <p className="text-sm text-slate-500">Just type naturally — AI extracts the details and formats a clean listing.</p>
            </div>
            <div className="flex gap-3">
              <input value={nlInput} onChange={(e) => setNlInput(e.target.value)}
                placeholder={`"Selling my Maclaurin math textbook, slight wear, 300 bucks"`}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleNLParse()} />
              <button onClick={handleNLParse} disabled={parsing}
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-5 py-3 rounded-xl transition-all text-sm whitespace-nowrap">
                {parsing ? "Parsing…" : "✨ Parse"}
              </button>
            </div>
          </div>

          {parsed && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-sm font-bold text-slate-600">AI-Generated Listing Preview</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block">Item Name</label>
                  <input value={parsed.title} onChange={(e) => setParsed({ ...parsed, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-rose-400 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block">Price (₹)</label>
                  <input type="number" value={parsed.price} onChange={(e) => setParsed({ ...parsed, price: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-rose-400 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block">Category</label>
                  <select value={parsed.category} onChange={(e) => setParsed({ ...parsed, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-rose-400 transition-all">
                    {categories.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block">Condition</label>
                  <select value={parsed.condition} onChange={(e) => setParsed({ ...parsed, condition: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-rose-400 transition-all">
                    <option>Like New</option>
                    <option>Good</option>
                    <option>Fair</option>
                  </select>
                </div>
              </div>

              <button onClick={handleList}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-rose-100">
                Post Listing 🛒
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "sell" && listed && (
        <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm text-center space-y-4">
          <div className="text-5xl">🎉</div>
          <h3 className="text-2xl font-black text-slate-900">Listed!</h3>
          <p className="text-slate-500">Your <span className="font-bold text-slate-700">{parsed.title}</span> is now live on the marketplace for <span className="font-bold text-slate-700">₹{parsed.price}</span>.</p>
          <button onClick={() => { setListed(false); setParsed(null); setNlInput(""); }}
            className="bg-rose-500 text-white font-bold px-6 py-3 rounded-xl">List Another Item</button>
        </div>
      )}
    </div>
  );
}