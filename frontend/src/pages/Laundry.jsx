import { useState } from "react";

const slots = [
  "7:00 AM – 9:00 AM",
  "9:00 AM – 11:00 AM",
  "11:00 AM – 1:00 PM",
  "2:00 PM – 4:00 PM",
  "4:00 PM – 6:00 PM",
  "6:00 PM – 8:00 PM",
];

const days = ["Today", "Tomorrow", "Day After"];

export default function Laundry() {
  const [nlInput, setNlInput] = useState("");
  const [parsed, setParsed] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [booked, setBooked] = useState(false);
  const [block, setBlock] = useState("");
  const [room, setRoom] = useState("");

  const handleNLParse = () => {
    if (!nlInput.trim()) return;
    setParsing(true);
    // Simulated AI parsing
    setTimeout(() => {
      const lower = nlInput.toLowerCase();
      let day = "Tomorrow";
      let slot = "9:00 AM – 11:00 AM";
      if (lower.includes("today")) day = "Today";
      if (lower.includes("after")) day = "Day After";
      if (lower.includes("morning") || lower.includes("7") || lower.includes("8")) slot = "7:00 AM – 9:00 AM";
      if (lower.includes("afternoon") || lower.includes("2") || lower.includes("3")) slot = "2:00 PM – 4:00 PM";
      if (lower.includes("evening") || lower.includes("5") || lower.includes("6")) slot = "4:00 PM – 6:00 PM";
      if (lower.includes("11") || lower.includes("noon")) slot = "11:00 AM – 1:00 PM";
      setParsed({ day, slot });
      setSelectedDay(day);
      setSelectedSlot(slot);
      setParsing(false);
    }, 1200);
  };

  const handleBook = () => {
    if (!selectedDay || !selectedSlot) return alert("Select a day and slot.");
    if (!block || !room) return alert("Enter your block and room number.");
    setBooked(true);
  };

  if (booked) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <div className="text-6xl">👕</div>
        <h2 className="text-3xl font-black text-slate-900">Laundry Booked!</h2>
        <p className="text-slate-500">Pickup scheduled for <span className="font-bold text-slate-800">{selectedDay}</span> during the <span className="font-bold text-slate-800">{selectedSlot}</span> slot.</p>
        <p className="text-sm text-slate-400">Room: Block {block}, Room {room}</p>
        <button onClick={() => { setBooked(false); setParsed(null); setNlInput(""); setSelectedDay(null); setSelectedSlot(null); }}
          className="bg-sky-500 text-white font-bold px-6 py-3 rounded-xl mt-4">Book Another</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-bold text-sky-500 uppercase tracking-widest mb-1">Campus Service</p>
        <h1 className="text-4xl font-black text-slate-900">👕 Laundry</h1>
        <p className="text-slate-500 mt-2">Schedule laundry pickup. Just type when you want it — AI figures out the rest.</p>
      </div>

      <div className="bg-sky-50 border border-sky-200 rounded-2xl px-5 py-4 mb-6 flex items-center gap-3">
        <span className="text-2xl">🚧</span>
        <div>
          <div className="font-bold text-sky-800">Feature Preview</div>
          <div className="text-sm text-sky-600">Live laundry scheduling coming soon. Explore the interface below.</div>
        </div>
      </div>

      {/* NL input */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4 mb-5">
        <div>
          <h3 className="font-black text-slate-900 mb-1">🤖 Just tell us when</h3>
          <p className="text-sm text-slate-500">Type naturally — our AI will find the right slot for you.</p>
        </div>
        <div className="flex gap-3">
          <input
            value={nlInput}
            onChange={(e) => setNlInput(e.target.value)}
            placeholder={`"Book laundry tomorrow morning after 9"`}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleNLParse()}
          />
          <button onClick={handleNLParse} disabled={parsing}
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-5 py-3 rounded-xl transition-all text-sm whitespace-nowrap">
            {parsing ? "Parsing…" : "✨ Parse"}
          </button>
        </div>

        {parsed && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm">
            <span className="font-bold text-emerald-700">AI suggests: </span>
            <span className="text-emerald-800">{parsed.day} · {parsed.slot}</span>
            <span className="text-emerald-500 text-xs ml-2">(you can change below)</span>
          </div>
        )}
      </div>

      {/* Manual selection */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
        <h3 className="font-black text-slate-900">Or pick manually</h3>

        <div>
          <div className="text-sm font-semibold text-slate-600 mb-2">Day</div>
          <div className="flex gap-2">
            {days.map((d) => (
              <button key={d} onClick={() => setSelectedDay(d)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                  selectedDay === d ? "bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-100" : "bg-white border-slate-200 text-slate-600 hover:border-sky-200"
                }`}>{d}</button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-slate-600 mb-2">Time Slot</div>
          <div className="grid grid-cols-2 gap-2">
            {slots.map((s) => (
              <button key={s} onClick={() => setSelectedSlot(s)}
                className={`py-2.5 px-4 rounded-xl text-sm font-semibold transition-all border ${
                  selectedSlot === s ? "bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-100" : "bg-white border-slate-200 text-slate-600 hover:border-sky-200"
                }`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Block (e.g. 3)" value={block} onChange={(e) => setBlock(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 transition-all" />
          <input placeholder="Room number" value={room} onChange={(e) => setRoom(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 transition-all" />
        </div>

        <button onClick={handleBook}
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-sky-100">
          Confirm Booking 👕
        </button>
      </div>
    </div>
  );
}