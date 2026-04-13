import { useState } from "react";

const menu = [
  { id: 1, name: "Rajma Chawal", price: 60, emoji: "🍛", category: "Main Course", time: "20 min" },
  { id: 2, name: "Aloo Paratha", price: 40, emoji: "🫓", category: "Breakfast", time: "10 min" },
  { id: 3, name: "Maggi", price: 30, emoji: "🍜", category: "Snacks", time: "7 min" },
  { id: 4, name: "Paneer Bhurji", price: 70, emoji: "🥘", category: "Main Course", time: "15 min" },
  { id: 5, name: "Masala Chai", price: 15, emoji: "☕", category: "Beverages", time: "5 min" },
  { id: 6, name: "Cold Coffee", price: 35, emoji: "🧋", category: "Beverages", time: "5 min" },
  { id: 7, name: "Samosa (2 pcs)", price: 20, emoji: "🥟", category: "Snacks", time: "5 min" },
  { id: 8, name: "Dal Tadka + Rice", price: 55, emoji: "🫕", category: "Main Course", time: "15 min" },
];

const categories = ["All", "Main Course", "Breakfast", "Snacks", "Beverages"];

export default function Canteen() {
  const [cart, setCart] = useState({});
  const [activeCategory, setActiveCategory] = useState("All");
  const [ordered, setOrdered] = useState(false);
  const [block, setBlock] = useState("");
  const [room, setRoom] = useState("");

  const filtered = activeCategory === "All" ? menu : menu.filter((m) => m.category === activeCategory);

  const addToCart = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const removeFromCart = (id) => setCart((c) => {
    const updated = { ...c };
    if (updated[id] > 1) updated[id]--;
    else delete updated[id];
    return updated;
  });

  const cartItems = Object.entries(cart).map(([id, qty]) => ({
    ...menu.find((m) => m.id === Number(id)),
    qty,
  }));
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const handleOrder = () => {
    if (!block || !room) return alert("Please enter your block and room number.");
    setOrdered(true);
  };

  if (ordered) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <div className="text-6xl animate-bounce">🎉</div>
        <h2 className="text-3xl font-black text-slate-900">Order Placed!</h2>
        <p className="text-slate-500">Your food will be delivered to <span className="font-bold text-slate-800">Block {block}, Room {room}</span> in approximately 20–30 minutes.</p>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-left space-y-2">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.emoji} {item.name} × {item.qty}</span>
              <span className="font-bold">₹{item.price * item.qty}</span>
            </div>
          ))}
          <div className="border-t border-amber-200 pt-2 flex justify-between font-black">
            <span>Total</span><span>₹{total}</span>
          </div>
        </div>
        <button onClick={() => { setOrdered(false); setCart({}); }} className="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl">Order Again</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">Campus Service</p>
        <h1 className="text-4xl font-black text-slate-900">🍽️ Canteen</h1>
        <p className="text-slate-500 mt-2">Order food from the campus canteen. Delivered to your room.</p>
      </div>

      {/* Coming soon banner */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl px-5 py-4 mb-6 flex items-center gap-3">
        <span className="text-2xl">🚧</span>
        <div>
          <div className="font-bold text-orange-800">Feature Preview</div>
          <div className="text-sm text-orange-600">Online ordering is coming soon. This is a preview of the interface.</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Menu */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === c ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {filtered.map((item) => (
              <div key={item.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between hover:border-slate-200 transition-all shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{item.emoji}</span>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">{item.name}</div>
                    <div className="text-xs text-slate-400">{item.category} · {item.time}</div>
                    <div className="font-black text-slate-900">₹{item.price}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {cart[item.id] ? (
                    <>
                      <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 transition-all">−</button>
                      <span className="w-5 text-center font-bold text-sm">{cart[item.id]}</span>
                    </>
                  ) : null}
                  <button onClick={() => addToCart(item.id)} className="w-7 h-7 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all">+</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm sticky top-24">
            <h3 className="font-black text-slate-900 mb-4">Your Order {itemCount > 0 && <span className="text-orange-500">({itemCount})</span>}</h3>
            {cartItems.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">Your cart is empty</p>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-slate-700">{item.emoji} {item.name} × {item.qty}</span>
                    <span className="font-bold">₹{item.price * item.qty}</span>
                  </div>
                ))}
                <div className="border-t border-slate-100 pt-3 flex justify-between font-black text-lg">
                  <span>Total</span><span>₹{total}</span>
                </div>

                <div className="space-y-2 pt-1">
                  <input placeholder="Block (e.g. 3)" value={block} onChange={(e) => setBlock(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 transition-all" />
                  <input placeholder="Room number" value={room} onChange={(e) => setRoom(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 transition-all" />
                </div>

                <button onClick={handleOrder}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-orange-100">
                  Place Order 🍽️
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}