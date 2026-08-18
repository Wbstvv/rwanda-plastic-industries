import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";
import {
  Search, Menu, X, Phone, Mail, MapPin, ChevronRight, Package, LayoutDashboard,
  ClipboardList, Truck, Boxes, Users, Settings, LogOut, Plus, Minus, Heart,
  CheckCircle2, Circle, AlertTriangle, ArrowLeft, Star, MessageCircle, Factory,
  ShieldCheck, Recycle, Award, Filter, Download, Send, Edit3, Trash2, TrendingUp,
  DollarSign, Package as PackageIcon, BarChart3
} from "lucide-react";

const CURRENCY = (n) => `RWF ${Number(n || 0).toLocaleString("en-US")}`;
const ORDER_STAGES = ["Quote Requested","Quote Sent","Quote Accepted","Order Confirmed","Processing","Ready for Delivery","Out for Delivery","Delivered","Completed"];
const uid = (p) => `${p}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;

/* ---------- atoms ---------- */
function Badge({ tone = "slate", children }) {
  const tones = { slate:"bg-[#3F4A52]/10 text-[#3F4A52]", amber:"bg-[#E8A23D]/15 text-[#8a5c17]", green:"bg-[#1B6B4E]/10 text-[#1B6B4E]", rust:"bg-[#B5482A]/10 text-[#B5482A]", ink:"bg-[#14181C] text-[#EEEEE6]" };
  return <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase ${tones[tone]}`}>{children}</span>;
}
function SpecTag({ children, className = "" }) {
  return <div className={`relative bg-[#14181C] text-[#EEEEE6] font-mono text-[11px] px-2 py-1 ${className}`} style={{ clipPath: "polygon(0 0,100% 0,100% 100%,8px 100%,0 calc(100% - 8px))" }}>{children}</div>;
}
function Btn({ children, onClick, variant = "primary", className = "", type = "button", disabled }) {
  const base = "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-md transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed";
  const variants = { primary:"bg-[#E8A23D] text-[#14181C] hover:bg-[#d8922e] active:scale-[.98]", dark:"bg-[#14181C] text-[#EEEEE6] hover:bg-[#252b31] active:scale-[.98]", ghost:"bg-transparent text-[#14181C] border border-[#14181C]/20 hover:border-[#14181C]/50", danger:"bg-[#B5482A] text-white hover:bg-[#9c3b21]", subtle:"bg-[#14181C]/5 text-[#14181C] hover:bg-[#14181C]/10" };
  return <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>{children}</button>;
}
function Field({ label, children, full }) {
  return <div className={full ? "sm:col-span-2" : ""}><label className="block text-xs font-semibold uppercase tracking-widest text-[#3F4A52] mb-1.5">{label}</label>{children}</div>;
}

/* ---------- Nav / Footer ---------- */
function TopNav({ route, setRoute, session, profile, quoteCount, mobileOpen, setMobileOpen, signOut }) {
  const navItems = [{ key:"home", label:"Home" }, { key:"products", label:"Products" }, { key:"custom", label:"Custom Solutions" }, { key:"about", label:"About" }, { key:"contact", label:"Contact" }];
  const dashRoute = profile?.role === "customer" ? "customer-dashboard" : "admin-dashboard";
  return (
    <header className="sticky top-0 z-40 bg-[#14181C] text-[#EEEEE6]">
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-16">
        <button onClick={() => setRoute({ page: "home" })} className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 bg-[#E8A23D] rounded-sm flex items-center justify-center"><Factory size={18} className="text-[#14181C]" /></div>
          <div className="leading-tight text-left"><div className="font-black tracking-tight text-[15px]">RWANDA PLASTIC</div><div className="text-[10px] tracking-[0.2em] text-[#E8A23D] font-mono">INDUSTRIES LTD</div></div>
        </button>
        <nav className="hidden lg:flex items-center gap-7 text-[13.5px] font-medium">
          {navItems.map(n => <button key={n.key} onClick={() => setRoute({ page: n.key })} className={`hover:text-[#E8A23D] transition-colors ${route.page === n.key ? "text-[#E8A23D]" : "text-[#EEEEE6]/85"}`}>{n.label}</button>)}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          <button onClick={() => setRoute({ page: "quote-builder" })} className="relative p-2 hover:text-[#E8A23D]">
            <ClipboardList size={19} />
            {quoteCount > 0 && <span className="absolute -top-1 -right-1 bg-[#E8A23D] text-[#14181C] text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center px-1">{quoteCount}</span>}
          </button>
          {!session ? <Btn variant="primary" onClick={() => setRoute({ page: "login" })}>Log In</Btn> : (
            <div className="flex items-center gap-2">
              <Badge tone="amber">{profile?.role || "…"}</Badge>
              <Btn variant="ghost" className="!border-[#EEEEE6]/30 !text-[#EEEEE6]" onClick={() => setRoute({ page: dashRoute })}><LayoutDashboard size={15} /> Dashboard</Btn>
              <button title="Log out" onClick={signOut} className="p-2 hover:text-[#E8A23D]"><LogOut size={17} /></button>
            </div>
          )}
        </div>
        <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#EEEEE6]/10 px-5 py-4 space-y-3">
          {navItems.map(n => <button key={n.key} onClick={() => { setRoute({ page: n.key }); setMobileOpen(false); }} className="block text-sm font-medium">{n.label}</button>)}
          <div className="pt-2 flex gap-2">
            <Btn className="flex-1" variant="subtle" onClick={() => { setRoute({ page: "quote-builder" }); setMobileOpen(false); }}>Quote ({quoteCount})</Btn>
            {!session ? <Btn className="flex-1" onClick={() => { setRoute({ page: "login" }); setMobileOpen(false); }}>Log In</Btn> : <Btn className="flex-1" onClick={() => { setRoute({ page: dashRoute }); setMobileOpen(false); }}>Dashboard</Btn>}
          </div>
        </div>
      )}
    </header>
  );
}
function Footer({ setRoute }) {
  return (
    <footer className="bg-[#14181C] text-[#EEEEE6]/70 mt-24">
      <div className="max-w-7xl mx-auto px-5 py-14 grid md:grid-cols-4 gap-10 text-sm">
        <div><div className="font-black text-[#EEEEE6] text-lg mb-3">RWANDA PLASTIC INDUSTRIES</div><p className="leading-relaxed max-w-xs">Manufacturing and supplying quality plastic products across Rwanda since 2009.</p></div>
        <div><div className="text-[#E8A23D] font-semibold mb-3 text-xs tracking-widest uppercase">Company</div><ul className="space-y-2">
          <li><button onClick={() => setRoute({ page: "about" })} className="hover:text-[#EEEEE6]">About Us</button></li>
          <li><button onClick={() => setRoute({ page: "products" })} className="hover:text-[#EEEEE6]">Products</button></li>
          <li><button onClick={() => setRoute({ page: "custom" })} className="hover:text-[#EEEEE6]">Custom Solutions</button></li>
        </ul></div>
        <div><div className="text-[#E8A23D] font-semibold mb-3 text-xs tracking-widest uppercase">Legal</div><ul className="space-y-2">
          <li><button onClick={() => setRoute({ page: "privacy" })} className="hover:text-[#EEEEE6]">Privacy Policy</button></li>
          <li><button onClick={() => setRoute({ page: "terms" })} className="hover:text-[#EEEEE6]">Terms of Service</button></li>
        </ul></div>
        <div><div className="text-[#E8A23D] font-semibold mb-3 text-xs tracking-widest uppercase">Contact</div><ul className="space-y-2.5">
          <li className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0" /> KK 46 Ave, Kigali, Rwanda</li>
          <li className="flex items-center gap-2"><Phone size={15} /> +250 252 510 138</li>
          <li className="flex items-center gap-2"><Mail size={15} /> sales@rwandaplastic.rw</li>
        </ul></div>
      </div>
      <div className="border-t border-[#EEEEE6]/10 text-center text-xs py-5">© 2026 Rwanda Plastic Industries Ltd. All rights reserved.</div>
    </footer>
  );
}

/* ---------- Home ---------- */
function Home({ setRoute, products }) {
  const featured = products.slice(0, 4);
  const categories = [...new Map(products.map(p => [p.category_id, p.product_categories])).entries()];
  return (
    <div>
      <section className="bg-[#14181C] text-[#EEEEE6] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest text-[#E8A23D] mb-5 border border-[#E8A23D]/30 rounded-full px-3 py-1"><span className="w-1.5 h-1.5 rounded-full bg-[#E8A23D]" /> KIGALI, RWANDA — EST. 2009</div>
            <h1 className="font-black leading-[1.02]" style={{ fontSize: "clamp(2.4rem,5vw,4rem)" }}>Quality plastic<br />products for<br /><span className="text-[#E8A23D]">Rwanda and beyond.</span></h1>
            <p className="mt-6 text-[#EEEEE6]/70 text-lg max-w-md leading-relaxed">Reliable plastic solutions for homes, businesses, manufacturers and institutions — manufactured locally, delivered nationwide.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Btn onClick={() => setRoute({ page: "products" })}>Browse Products <ChevronRight size={16} /></Btn>
              <Btn variant="ghost" className="!border-[#EEEEE6]/30 !text-[#EEEEE6]" onClick={() => setRoute({ page: "quote-builder" })}>Request a Quote</Btn>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[["120+","Products manufactured"],["3,400t","Output / year"],["800+","B2B customers served"],["16","Districts delivered to"]].map(([n,l]) => (
              <div key={l} className="border border-[#EEEEE6]/15 rounded-lg p-5 bg-[#EEEEE6]/[0.03]"><div className="font-mono text-3xl font-semibold text-[#E8A23D]">{n}</div><div className="text-xs text-[#EEEEE6]/60 mt-1.5">{l}</div></div>
            ))}
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-5 py-16">
        <div className="flex items-end justify-between mb-8"><div><div className="text-[#E8A23D] font-mono text-xs tracking-widest uppercase mb-2">Catalogue</div><h2 className="font-black text-3xl text-[#14181C]">Product categories</h2></div>
          <button onClick={() => setRoute({ page: "products" })} className="text-sm font-semibold text-[#14181C] hover:text-[#E8A23D] flex items-center gap-1">View all <ChevronRight size={15} /></button></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(([id, c]) => c && (
            <button key={id} onClick={() => setRoute({ page: "products", category: id })} className="text-left border border-[#14181C]/10 rounded-lg p-5 hover:border-[#E8A23D] hover:shadow-md transition-all bg-white">
              <div className="text-2xl mb-2">{c.icon}</div><div className="font-semibold text-sm text-[#14181C]">{c.name}</div>
            </button>
          ))}
        </div>
      </section>
      <section className="bg-white py-16"><div className="max-w-7xl mx-auto px-5">
        <div className="text-[#E8A23D] font-mono text-xs tracking-widest uppercase mb-2">Featured</div>
        <h2 className="font-black text-3xl text-[#14181C] mb-8">Popular this month</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{featured.map(p => <ProductCard key={p.id} p={p} setRoute={setRoute} />)}</div>
      </div></section>
      <section className="max-w-7xl mx-auto px-5 py-16 grid md:grid-cols-3 gap-8">
        {[[ShieldCheck,"Certified quality","Every product batch is tested for material integrity and load tolerance before dispatch."],
          [Truck,"Nationwide delivery","Direct delivery to all 16 districts we serve, with real-time order tracking."],
          [Recycle,"Sustainable materials","Increasing use of recycled-content HDPE and PP across our household product lines."]].map(([Icon,t,b]) => (
          <div key={t} className="flex gap-4"><div className="w-11 h-11 rounded-md bg-[#14181C] flex items-center justify-center shrink-0"><Icon size={20} className="text-[#E8A23D]" /></div>
            <div><div className="font-bold text-[#14181C] mb-1">{t}</div><div className="text-sm text-[#3F4A52] leading-relaxed">{b}</div></div></div>
        ))}
      </section>
    </div>
  );
}
function ProductCard({ p, setRoute, favorites, toggleFav }) {
  const low = p.stock <= p.min_stock;
  return (
    <div className="group border border-[#14181C]/10 rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow flex flex-col">
      <div className="relative h-40 bg-gradient-to-br from-[#EEEEE6] to-[#dedcd0] flex items-center justify-center">
        <Package size={44} className="text-[#14181C]/25" /><SpecTag className="absolute top-0 left-0">{p.id}</SpecTag>
        {toggleFav && <button onClick={() => toggleFav(p.id)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"><Heart size={15} className={favorites?.includes(p.id) ? "fill-[#B5482A] text-[#B5482A]" : "text-[#14181C]/40"} /></button>}
        {low && <div className="absolute bottom-0 inset-x-0"><Badge tone="rust">Low stock</Badge></div>}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <button onClick={() => setRoute({ page: "product", id: p.id })} className="font-bold text-[#14181C] text-sm text-left mb-1.5 hover:text-[#E8A23D]">{p.name}</button>
        <div className="text-xs text-[#3F4A52] mb-3">{p.material} · {p.unit}</div>
        <div className="mt-auto flex items-end justify-between"><div className="font-mono font-semibold text-[#14181C]">{CURRENCY(p.price)}</div>
          <button onClick={() => setRoute({ page: "product", id: p.id })} className="text-xs font-semibold text-[#14181C] flex items-center gap-0.5 hover:text-[#E8A23D]">View <ChevronRight size={13} /></button></div>
      </div>
    </div>
  );
}

/* ---------- Products / Detail ---------- */
function Products({ products, categories, route, setRoute, favorites, toggleFav }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(route.category || "all");
  useEffect(() => setCat(route.category || "all"), [route.category]);
  const filtered = products.filter(p => (cat === "all" || p.category_id === cat) && (q.trim() === "" || p.name.toLowerCase().includes(q.toLowerCase()) || p.id.toLowerCase().includes(q.toLowerCase())));
  return (
    <div className="max-w-7xl mx-auto px-5 py-10">
      <h1 className="font-black text-3xl text-[#14181C] mb-1">Product Catalogue</h1>
      <p className="text-[#3F4A52] text-sm mb-7">{filtered.length} products</p>
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-56 shrink-0">
          <div className="relative mb-5"><Search size={16} className="absolute left-3 top-3 text-[#3F4A52]/50" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search products or SKU" className="w-full pl-9 pr-3 py-2.5 rounded-md border border-[#14181C]/15 text-sm focus:outline-none focus:border-[#E8A23D]" /></div>
          <div className="text-xs font-semibold tracking-widest uppercase text-[#3F4A52] mb-2 flex items-center gap-1"><Filter size={13} /> Category</div>
          <div className="flex md:flex-col gap-1.5 flex-wrap">
            <button onClick={() => setCat("all")} className={`text-left text-sm px-3 py-2 rounded-md ${cat === "all" ? "bg-[#14181C] text-[#EEEEE6]" : "hover:bg-[#14181C]/5"}`}>All Products</button>
            {categories.map(c => <button key={c.id} onClick={() => setCat(c.id)} className={`text-left text-sm px-3 py-2 rounded-md ${cat === c.id ? "bg-[#14181C] text-[#EEEEE6]" : "hover:bg-[#14181C]/5"}`}>{c.icon} {c.name}</button>)}
          </div>
        </aside>
        <div className="flex-1 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(p => <ProductCard key={p.id} p={p} setRoute={setRoute} favorites={favorites} toggleFav={toggleFav} />)}
          {filtered.length === 0 && <div className="col-span-full text-center py-16 text-[#3F4A52]">No products match “{q}”.</div>}
        </div>
      </div>
    </div>
  );
}
function ProductDetail({ products, route, setRoute, addToQuote, favorites, toggleFav }) {
  const p = products.find(x => x.id === route.id);
  const [size, setSize] = useState(p?.sizes?.[0]);
  const [color, setColor] = useState(p?.colors?.[0]);
  const [qty, setQty] = useState(p?.moq || 1);
  if (!p) return <div className="max-w-4xl mx-auto px-5 py-16 text-center">Product not found.</div>;
  const low = p.stock <= p.min_stock;
  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <button onClick={() => setRoute({ page: "products" })} className="flex items-center gap-1.5 text-sm text-[#3F4A52] hover:text-[#14181C] mb-6"><ArrowLeft size={15} /> Back to catalogue</button>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative h-80 rounded-lg bg-gradient-to-br from-[#EEEEE6] to-[#dedcd0] flex items-center justify-center mb-3">
          <Package size={90} className="text-[#14181C]/20" /><SpecTag className="absolute top-0 left-0">{p.id}</SpecTag>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">{low ? <Badge tone="rust">Low Stock</Badge> : <Badge tone="green">In Stock</Badge>}</div>
          <h1 className="font-black text-2xl text-[#14181C] mb-2">{p.name}</h1>
          <p className="text-[#3F4A52] text-sm leading-relaxed mb-5">{p.description}</p>
          <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
            <div><div className="text-[#3F4A52]/60 text-xs font-mono">RETAIL PRICE</div><div className="font-bold font-mono">{CURRENCY(p.price)} / {p.unit}</div></div>
            <div><div className="text-[#3F4A52]/60 text-xs font-mono">WHOLESALE PRICE</div><div className="font-bold font-mono">{CURRENCY(p.wholesale_price)} / {p.unit}</div></div>
            <div><div className="text-[#3F4A52]/60 text-xs font-mono">MOQ</div><div className="font-semibold">{p.moq} {p.unit}s</div></div>
            <div><div className="text-[#3F4A52]/60 text-xs font-mono">MATERIAL</div><div className="font-semibold">{p.material}</div></div>
          </div>
          <div className="mb-4"><div className="text-xs font-semibold uppercase tracking-widest text-[#3F4A52] mb-2">Size</div>
            <div className="flex gap-2 flex-wrap">{(p.sizes||[]).map(s => <button key={s} onClick={() => setSize(s)} className={`px-3 py-1.5 rounded-md text-sm border ${size === s ? "bg-[#14181C] text-[#EEEEE6] border-[#14181C]" : "border-[#14181C]/20"}`}>{s}</button>)}</div></div>
          <div className="mb-6"><div className="text-xs font-semibold uppercase tracking-widest text-[#3F4A52] mb-2">Colour</div>
            <div className="flex gap-2 flex-wrap">{(p.colors||[]).map(c => <button key={c} onClick={() => setColor(c)} className={`px-3 py-1.5 rounded-md text-sm border ${color === c ? "bg-[#14181C] text-[#EEEEE6] border-[#14181C]" : "border-[#14181C]/20"}`}>{c}</button>)}</div></div>
          <div className="flex items-center gap-4 mb-6"><div className="text-xs font-semibold uppercase tracking-widest text-[#3F4A52]">Quantity</div>
            <div className="flex items-center border border-[#14181C]/20 rounded-md">
              <button onClick={() => setQty(Math.max(p.moq, qty - 10))} className="p-2"><Minus size={14} /></button>
              <input value={qty} onChange={e => setQty(Number(e.target.value) || 0)} className="w-16 text-center outline-none text-sm" />
              <button onClick={() => setQty(qty + 10)} className="p-2"><Plus size={14} /></button>
            </div></div>
          <div className="flex flex-wrap gap-3">
            <Btn onClick={() => addToQuote(p, size, color, qty)}><ClipboardList size={16} /> Add to Quote</Btn>
            <Btn variant="ghost" onClick={() => setRoute({ page: "custom" })}>Request Custom Order</Btn>
            <button onClick={() => toggleFav(p.id)} className="p-2.5 rounded-md border border-[#14181C]/15"><Heart size={17} className={favorites?.includes(p.id) ? "fill-[#B5482A] text-[#B5482A]" : "text-[#14181C]/50"} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Quote Builder ---------- */
function QuoteBuilder({ draft, setDraft, setRoute, submitQuote, session, profile }) {
  const [form, setForm] = useState({ company: profile?.company_name || "", contact: profile?.full_name || "", phone: profile?.phone || "", email: session?.user?.email || "", deliveryLocation: "", requiredDate: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const total = draft.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const update = (id, field, val) => setDraft(draft.map(i => i.key === id ? { ...i, [field]: val } : i));
  const remove = (id) => setDraft(draft.filter(i => i.key !== id));
  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <h1 className="font-black text-3xl text-[#14181C] mb-1">Request a Quotation</h1>
      <p className="text-[#3F4A52] text-sm mb-8">Select your products, confirm quantities, and tell us your delivery needs.</p>
      {draft.length === 0 ? (
        <div className="border border-dashed border-[#14181C]/20 rounded-lg p-14 text-center text-[#3F4A52]"><ClipboardList size={30} className="mx-auto mb-3 opacity-40" />No products added yet. <button onClick={() => setRoute({ page: "products" })} className="text-[#14181C] font-semibold underline ml-1">Browse products</button></div>
      ) : (
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
          <div>
            <div className="border border-[#14181C]/10 rounded-lg overflow-hidden mb-8">
              {draft.map((i, idx) => (
                <div key={i.key} className={`flex items-center gap-4 p-4 ${idx > 0 ? "border-t border-[#14181C]/10" : ""}`}>
                  <div className="w-11 h-11 bg-[#EEEEE6] rounded-md flex items-center justify-center shrink-0"><Package size={18} className="text-[#14181C]/30" /></div>
                  <div className="flex-1 min-w-0"><div className="font-semibold text-sm text-[#14181C] truncate">{i.name}</div><div className="text-xs text-[#3F4A52]">{i.size} · {i.color} · {CURRENCY(i.unitPrice)}/unit</div></div>
                  <input type="number" value={i.qty} onChange={e => update(i.key, "qty", Number(e.target.value) || 0)} className="w-20 border border-[#14181C]/15 rounded-md px-2 py-1.5 text-sm text-center" />
                  <div className="w-28 text-right font-mono text-sm font-semibold">{CURRENCY(i.qty * i.unitPrice)}</div>
                  <button onClick={() => remove(i.key)} className="text-[#B5482A]"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Company / Customer Name"><input className="in" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></Field>
              <Field label="Contact Person"><input className="in" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} /></Field>
              <Field label="Phone"><input className="in" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+250 7__ ___ ___" /></Field>
              <Field label="Email"><input className="in" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></Field>
              <Field label="Delivery Location"><input className="in" value={form.deliveryLocation} onChange={e => setForm({ ...form, deliveryLocation: e.target.value })} placeholder="District, Province" /></Field>
              <Field label="Required Delivery Date"><input type="date" className="in" value={form.requiredDate} onChange={e => setForm({ ...form, requiredDate: e.target.value })} /></Field>
              <Field label="Additional Requirements" full><textarea className="in" rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></Field>
            </div>
          </div>
          <div className="h-fit border border-[#14181C]/10 rounded-lg p-6 bg-[#EEEEE6]/40 sticky top-24">
            <div className="font-bold text-[#14181C] mb-4">Quotation Summary</div>
            <div className="flex justify-between text-sm mb-2"><span className="text-[#3F4A52]">Items</span><span>{draft.length}</span></div>
            <div className="flex justify-between text-sm mb-4"><span className="text-[#3F4A52]">Est. Subtotal</span><span className="font-mono font-semibold">{CURRENCY(total)}</span></div>
            {!session && <div className="text-xs text-[#B5482A] mb-3">You'll need to log in or create an account to submit a quote request.</div>}
            <Btn className="w-full" disabled={!form.company || !form.phone || !form.deliveryLocation || submitting}
              onClick={async () => { setSubmitting(true); await submitQuote(form, draft); setSubmitting(false); }}>
              <Send size={15} /> {submitting ? "Submitting…" : "Submit Quote Request"}
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}
function QuoteSuccess({ setRoute, lastQuoteId }) {
  return (
    <div className="max-w-lg mx-auto px-5 py-24 text-center">
      <CheckCircle2 size={48} className="mx-auto text-[#1B6B4E] mb-5" />
      <h1 className="font-black text-2xl text-[#14181C] mb-2">Quotation Request Submitted</h1>
      <p className="text-[#3F4A52] text-sm mb-1">Your reference number is</p>
      <div className="font-mono text-xl font-bold text-[#E8A23D] mb-6">{lastQuoteId}</div>
      <p className="text-sm text-[#3F4A52] mb-8">Our sales team will review your request and send pricing shortly.</p>
      <Btn onClick={() => setRoute({ page: "customer-dashboard" })}>View My Quotations</Btn>
    </div>
  );
}

/* ---------- Static pages ---------- */
function CustomSolutions({ session, submitCustomRequest }) {
  const [submitted, setSubmitted] = useState(false);
  const [f, setF] = useState({ productType:"", dimensions:"", quantity:"", colour:"", material:"", intendedUse:"", additionalSpecs:"", requiredDate:"" });
  return (
    <div className="max-w-3xl mx-auto px-5 py-14">
      <h1 className="font-black text-3xl text-[#14181C] mb-2">Custom Plastic Solutions</h1>
      <p className="text-[#3F4A52] mb-8">Tell us what you need manufactured — our production team will follow up with a tailored quotation.</p>
      {submitted ? (
        <div className="border border-[#1B6B4E]/30 bg-[#1B6B4E]/5 rounded-lg p-8 text-center"><CheckCircle2 size={36} className="mx-auto text-[#1B6B4E] mb-3" /><div className="font-bold text-[#14181C] mb-1">Request received</div><p className="text-sm text-[#3F4A52]">Our team will contact you within 2 business days.</p></div>
      ) : !session ? (
        <div className="border border-dashed border-[#14181C]/20 rounded-lg p-10 text-center text-[#3F4A52]">Please log in to submit a custom request.</div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Product Type"><input className="in" value={f.productType} onChange={e=>setF({...f,productType:e.target.value})} /></Field>
          <Field label="Quantity"><input type="number" className="in" value={f.quantity} onChange={e=>setF({...f,quantity:e.target.value})} /></Field>
          <Field label="Desired Dimensions"><input className="in" value={f.dimensions} onChange={e=>setF({...f,dimensions:e.target.value})} placeholder="L x W x H (cm)" /></Field>
          <Field label="Colour"><input className="in" value={f.colour} onChange={e=>setF({...f,colour:e.target.value})} /></Field>
          <Field label="Material Requirements"><input className="in" value={f.material} onChange={e=>setF({...f,material:e.target.value})} /></Field>
          <Field label="Required Delivery Date"><input type="date" className="in" value={f.requiredDate} onChange={e=>setF({...f,requiredDate:e.target.value})} /></Field>
          <Field label="Intended Use" full><input className="in" value={f.intendedUse} onChange={e=>setF({...f,intendedUse:e.target.value})} /></Field>
          <Field label="Additional Specifications" full><textarea className="in" rows={3} value={f.additionalSpecs} onChange={e=>setF({...f,additionalSpecs:e.target.value})} /></Field>
          <div className="sm:col-span-2"><Btn onClick={async () => { await submitCustomRequest(f); setSubmitted(true); }}>Submit Custom Request</Btn></div>
        </div>
      )}
    </div>
  );
}
function About() {
  return (
    <div className="max-w-4xl mx-auto px-5 py-16">
      <h1 className="font-black text-3xl text-[#14181C] mb-6">About Rwanda Plastic Industries</h1>
      <p className="text-[#3F4A52] leading-relaxed mb-4">Founded in Kigali, Rwanda Plastic Industries Ltd manufactures and supplies plastic products for households, industry, agriculture, and construction across Rwanda.</p>
      <div className="grid sm:grid-cols-3 gap-5">
        {[[Award,"17 years","In operation"],[Factory,"24/7","Production capacity"],[Users,"800+","Active B2B clients"]].map(([Icon,n,l]) => (
          <div key={l} className="border border-[#14181C]/10 rounded-lg p-5 text-center"><Icon size={22} className="mx-auto mb-2 text-[#E8A23D]" /><div className="font-black text-xl text-[#14181C]">{n}</div><div className="text-xs text-[#3F4A52]">{l}</div></div>
        ))}
      </div>
    </div>
  );
}
function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-16">
      <h1 className="font-black text-3xl text-[#14181C] mb-6">Contact Us</h1>
      <p className="text-[#3F4A52] mb-8">Have a question or need a quick response from our sales team? Reach out directly.</p>
      <div className="space-y-3 text-sm mb-8">
        <div className="flex items-center gap-3"><MapPin size={17} className="text-[#E8A23D]" /> KK 46 Ave, Kigali, Rwanda</div>
        <div className="flex items-center gap-3"><Phone size={17} className="text-[#E8A23D]" /> +250 252 510 138</div>
        <div className="flex items-center gap-3"><Mail size={17} className="text-[#E8A23D]" /> sales@rwandaplastic.rw</div>
      </div>
      <div className="flex gap-2">
        <Btn variant="dark"><MessageCircle size={15} /> WhatsApp</Btn>
        <Btn variant="ghost"><Phone size={15} /> Call Us</Btn>
      </div>
    </div>
  );
}
function SimplePage({ title, body }) {
  return <div className="max-w-3xl mx-auto px-5 py-16"><h1 className="font-black text-3xl text-[#14181C] mb-6">{title}</h1><p className="text-[#3F4A52] leading-relaxed whitespace-pre-line">{body}</p></div>;
}

/* ---------- Auth ---------- */
function Login({ setRoute }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", fullName: "", companyName: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(""); setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { full_name: form.fullName } } });
        if (error) throw error;
        // update profile with company/phone after trigger creates the row
        const { data: { user } } = await supabase.auth.getUser();
        if (user) await supabase.from("profiles").update({ company_name: form.companyName, phone: form.phone }).eq("id", user.id);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (error) throw error;
      }
      setRoute({ page: "home" });
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  }

  return (
    <div className="max-w-md mx-auto px-5 py-16">
      <h1 className="font-black text-2xl text-[#14181C] mb-1">{mode === "login" ? "Log In" : "Create an Account"}</h1>
      <p className="text-sm text-[#3F4A52] mb-6">{mode === "login" ? "Access your customer dashboard." : "New customer accounts start with customer access."}</p>
      <div className="flex gap-2 mb-6">
        <button onClick={() => setMode("login")} className={`flex-1 py-2 rounded-md text-sm font-semibold ${mode==="login"?"bg-[#14181C] text-[#EEEEE6]":"bg-[#14181C]/5 text-[#14181C]"}`}>Log In</button>
        <button onClick={() => setMode("signup")} className={`flex-1 py-2 rounded-md text-sm font-semibold ${mode==="signup"?"bg-[#14181C] text-[#EEEEE6]":"bg-[#14181C]/5 text-[#14181C]"}`}>Sign Up</button>
      </div>
      <div className="space-y-3">
        {mode === "signup" && <>
          <Field label="Full Name"><input className="in" value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})} /></Field>
          <Field label="Company Name"><input className="in" value={form.companyName} onChange={e=>setForm({...form,companyName:e.target.value})} /></Field>
          <Field label="Phone"><input className="in" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+250 7__ ___ ___" /></Field>
        </>}
        <Field label="Email"><input type="email" className="in" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></Field>
        <Field label="Password"><input type="password" className="in" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} /></Field>
      </div>
      {error && <div className="text-sm text-[#B5482A] mt-3">{error}</div>}
      <Btn className="w-full mt-6" disabled={loading} onClick={handleSubmit}>{loading ? "Please wait…" : mode === "login" ? "Log In" : "Create Account"}</Btn>
    </div>
  );
}

/* ---------- Order timeline ---------- */
function OrderTimeline({ stage }) {
  const idx = ORDER_STAGES.indexOf(stage);
  return (
    <div className="flex flex-wrap gap-y-3">
      {ORDER_STAGES.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center w-24">
            {i <= idx ? <CheckCircle2 size={18} className="text-[#1B6B4E]" /> : <Circle size={18} className="text-[#14181C]/20" />}
            <div className={`text-[10px] text-center mt-1 leading-tight ${i <= idx ? "text-[#14181C] font-semibold" : "text-[#3F4A52]/50"}`}>{s}</div>
          </div>
          {i < ORDER_STAGES.length - 1 && <div className={`h-0.5 w-4 ${i < idx ? "bg-[#1B6B4E]" : "bg-[#14181C]/15"}`} />}
        </div>
      ))}
    </div>
  );
}

/* ---------- Customer Dashboard ---------- */
function CustomerDashboard({ profile, quotations, orders, favProducts, respondQuotation, setRoute, updateProfile }) {
  const [tab, setTab] = useState("overview");
  const [profileForm, setProfileForm] = useState({ company_name: profile?.company_name || "", phone: profile?.phone || "", address: profile?.address || "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const stats = [
    { label:"Active Orders", value: orders.filter(o=>o.stage!=="Completed").length, icon:Truck },
    { label:"Pending Quotations", value: quotations.filter(q=>["Quote Requested","Quote Sent"].includes(q.status)).length, icon:ClipboardList },
    { label:"Completed Orders", value: orders.filter(o=>["Completed","Delivered"].includes(o.stage)).length, icon:PackageIcon },
    { label:"Outstanding Payments", value: orders.filter(o=>o.payment_status!=="Paid").length, icon:DollarSign },
  ];
  const tabs = [["overview","Overview"],["orders","My Orders"],["quotations","My Quotations"],["invoices","My Invoices"],["favourites","Favourite Products"],["profile","My Profile"]];
  return (
    <div className="max-w-7xl mx-auto px-5 py-8 grid md:grid-cols-[220px_1fr] gap-8">
      <aside className="space-y-1"><div className="font-bold text-[#14181C] mb-3 px-2">{profile?.company_name || profile?.full_name}</div>
        {tabs.map(([k,l]) => <button key={k} onClick={()=>setTab(k)} className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium ${tab===k?"bg-[#14181C] text-[#EEEEE6]":"hover:bg-[#14181C]/5 text-[#14181C]"}`}>{l}</button>)}
      </aside>
      <div>
        {tab === "overview" && <>
          <h1 className="font-black text-2xl text-[#14181C] mb-6">Dashboard Overview</h1>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map(({label,value,icon:Icon}) => <div key={label} className="border border-[#14181C]/10 rounded-lg p-5"><Icon size={18} className="text-[#E8A23D] mb-2" /><div className="font-black text-2xl text-[#14181C]">{value}</div><div className="text-xs text-[#3F4A52]">{label}</div></div>)}
          </div>
          <div className="font-bold text-[#14181C] mb-3">Recent Orders</div>
          <div className="space-y-2">{orders.slice(0,3).map(o => <div key={o.id} className="border border-[#14181C]/10 rounded-lg p-4 flex items-center justify-between"><div><div className="font-mono text-sm font-semibold">{o.id}</div><div className="text-xs text-[#3F4A52]">{o.created_at?.slice(0,10)}</div></div><Badge tone="amber">{o.stage}</Badge></div>)}</div>
        </>}
        {tab === "orders" && <>
          <h1 className="font-black text-2xl text-[#14181C] mb-6">My Orders</h1>
          <div className="space-y-5">{orders.map(o => (
            <div key={o.id} className="border border-[#14181C]/10 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2"><div className="font-mono font-bold">{o.id}</div>
                <div className="flex items-center gap-3"><Badge tone={o.payment_status==="Paid"?"green":"amber"}>{o.payment_status}</Badge><div className="font-mono font-semibold">{CURRENCY(o.total)}</div></div></div>
              <OrderTimeline stage={o.stage} />
              <div className="mt-4 text-xs text-[#3F4A52] flex items-center gap-4 flex-wrap"><span className="flex items-center gap-1"><MapPin size={12} /> {o.delivery_location}</span>{o.driver && <span className="flex items-center gap-1"><Truck size={12} /> {o.driver} · {o.vehicle}</span>}</div>
            </div>
          ))}</div>
        </>}
        {tab === "quotations" && <>
          <h1 className="font-black text-2xl text-[#14181C] mb-6">My Quotations</h1>
          <div className="space-y-4">{quotations.map(q => {
            const subtotal = (q.quotation_items||[]).reduce((s,i)=>s+i.qty*i.unit_price,0);
            const total = subtotal - (q.discount||0) + (q.delivery_fee||0) + (q.tax||0);
            return (
              <div key={q.id} className="border border-[#14181C]/10 rounded-lg p-5">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2"><div className="font-mono font-bold">{q.id}</div><Badge tone={q.status==="Quote Sent"?"amber":q.status==="Quote Requested"?"slate":"green"}>{q.status}</Badge></div>
                <div className="text-sm text-[#3F4A52] mb-3">{(q.quotation_items||[]).map(i=>`${i.name} × ${i.qty}`).join(", ")}</div>
                {q.status === "Quote Sent" && <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4 bg-[#EEEEE6]/50 rounded-md p-3">
                    <div><div className="text-[#3F4A52]/60">Subtotal</div><div className="font-mono font-semibold">{CURRENCY(subtotal)}</div></div>
                    <div><div className="text-[#3F4A52]/60">Discount</div><div className="font-mono font-semibold text-[#1B6B4E]">-{CURRENCY(q.discount)}</div></div>
                    <div><div className="text-[#3F4A52]/60">Delivery Fee</div><div className="font-mono font-semibold">{CURRENCY(q.delivery_fee)}</div></div>
                    <div><div className="text-[#3F4A52]/60">Total</div><div className="font-mono font-bold">{CURRENCY(total)}</div></div>
                  </div>
                  <div className="flex gap-2">
                    <Btn onClick={()=>respondQuotation(q,"accept")}>Accept Quotation</Btn>
                    <Btn variant="danger" onClick={()=>respondQuotation(q,"reject")}>Reject</Btn>
                  </div>
                </>}
              </div>
            );
          })}</div>
        </>}
        {tab === "invoices" && <>
          <h1 className="font-black text-2xl text-[#14181C] mb-6">My Invoices</h1>
          {orders.length === 0 ? <div className="text-[#3F4A52] text-sm">No invoices yet — invoices are created once an order is confirmed.</div> : (
            <div className="space-y-3">{orders.map(o => (
              <div key={o.id} className="border border-[#14181C]/10 rounded-lg p-4 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="font-mono font-semibold text-sm">INV-{o.id.replace("O-","")}</div>
                  <div className="text-xs text-[#3F4A52]">{o.created_at?.slice(0,10)} · {CURRENCY(o.total)}</div>
                </div>
                <Badge tone={o.payment_status==="Paid"?"green":"amber"}>{o.payment_status}</Badge>
              </div>
            ))}</div>
          )}
          <p className="text-xs text-[#3F4A52] mt-6">PDF download isn't wired up yet — for now this lists every invoice with its payment status. Ask your Claude to add PDF export when you're ready.</p>
        </>}
        {tab === "favourites" && <>
          <h1 className="font-black text-2xl text-[#14181C] mb-6">Favourite Products</h1>
          {favProducts.length === 0 ? <div className="text-[#3F4A52] text-sm">No favourites yet.</div> : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{favProducts.map(p => <ProductCard key={p.id} p={p} setRoute={setRoute} favorites={favProducts.map(x=>x.id)} />)}</div>}
        </>}
        {tab === "profile" && <>
          <h1 className="font-black text-2xl text-[#14181C] mb-6">My Profile</h1>
          <div className="grid sm:grid-cols-2 gap-4 max-w-lg">
            <Field label="Company Name"><input className="in" value={profileForm.company_name} onChange={e=>setProfileForm({...profileForm, company_name:e.target.value})} /></Field>
            <Field label="Phone"><input className="in" value={profileForm.phone} onChange={e=>setProfileForm({...profileForm, phone:e.target.value})} /></Field>
            <Field label="Address" full><input className="in" value={profileForm.address} onChange={e=>setProfileForm({...profileForm, address:e.target.value})} /></Field>
            <Field label="Email" full><input className="in" defaultValue={profile?.email} disabled /></Field>
          </div>
          <div className="flex items-center gap-3 mt-5">
            <Btn disabled={savingProfile} onClick={async () => { setSavingProfile(true); await updateProfile(profileForm); setSavingProfile(false); setSavedMsg(true); setTimeout(()=>setSavedMsg(false), 2500); }}>
              {savingProfile ? "Saving…" : "Save Changes"}
            </Btn>
            {savedMsg && <span className="text-sm text-[#1B6B4E] font-medium">Saved</span>}
          </div>
        </>}
      </div>
    </div>
  );
}

/* ---------- Staff / Admin Dashboard ---------- */
function AdminDashboard({ profile, quotations, orders, products, customers, refreshAll, updateQuotation, updateOrder, adjustStock, addProduct, removeProduct, companySettings, updateCompanySettings }) {
  const [tab, setTab] = useState("overview");
  const lowStock = products.filter(p => p.stock <= p.min_stock);
  const tabsBase = [["overview","Overview",BarChart3],["quotations","Quotations",ClipboardList],["orders","Orders",Truck],["inventory","Inventory",Boxes],["customers","Customers",Users]];
  const tabsAdmin = [...tabsBase, ["products","Products",Package], ["settings","Settings",Settings]];
  const tabs = profile?.role === "admin" ? tabsAdmin : tabsBase;

  return (
    <div className="max-w-7xl mx-auto px-5 py-8 grid md:grid-cols-[220px_1fr] gap-8">
      <aside className="space-y-1">
        <div className="font-bold text-[#14181C] mb-1 px-2">{profile?.role === "admin" ? "Admin Panel" : "Staff Panel"}</div>
        <div className="text-xs text-[#3F4A52] px-2 mb-3">Rwanda Plastic Industries</div>
        {tabs.map(([k,l,Icon]) => <button key={k} onClick={()=>setTab(k)} className={`w-full flex items-center gap-2.5 text-left px-3 py-2.5 rounded-md text-sm font-medium ${tab===k?"bg-[#14181C] text-[#EEEEE6]":"hover:bg-[#14181C]/5 text-[#14181C]"}`}><Icon size={15}/>{l}</button>)}
      </aside>
      <div>
        {tab === "overview" && <>
          <h1 className="font-black text-2xl text-[#14181C] mb-6">Dashboard</h1>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[["Total Sales", CURRENCY(orders.reduce((s,o)=>s+Number(o.total),0)), DollarSign],
              ["Pending Orders", orders.filter(o=>!["Delivered","Completed"].includes(o.stage)).length, Truck],
              ["Pending Quotations", quotations.filter(q=>q.status==="Quote Requested").length, ClipboardList],
              ["Total Customers", customers.length, Users],
              ["Outstanding Payments", orders.filter(o=>o.payment_status!=="Paid").length, AlertTriangle],
              ["Low-Stock Products", lowStock.length, Boxes]].map(([label,value,Icon]) => (
              <div key={label} className="border border-[#14181C]/10 rounded-lg p-5"><Icon size={18} className="text-[#E8A23D] mb-2" /><div className="font-black text-xl text-[#14181C]">{value}</div><div className="text-xs text-[#3F4A52]">{label}</div></div>
            ))}
          </div>
          {lowStock.length > 0 && <div className="border border-[#B5482A]/30 bg-[#B5482A]/5 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 font-semibold text-[#B5482A] mb-2 text-sm"><AlertTriangle size={16}/> Low-stock alerts</div>
            {lowStock.map(p => <div key={p.id} className="text-sm text-[#3F4A52]">Warning: <b>{p.name}</b> is below minimum stock level ({p.stock}/{p.min_stock}).</div>)}
          </div>}
        </>}
        {tab === "quotations" && <QuotationsPanel quotations={quotations} updateQuotation={updateQuotation} />}
        {tab === "orders" && <OrdersPanel orders={orders} updateOrder={updateOrder} />}
        {tab === "inventory" && <InventoryPanel products={products} adjustStock={adjustStock} />}
        {tab === "customers" && <CustomersPanel customers={customers} />}
        {tab === "products" && profile?.role === "admin" && <ProductsPanel products={products} addProduct={addProduct} removeProduct={removeProduct} />}
        {tab === "settings" && profile?.role === "admin" && <SettingsPanel companySettings={companySettings} updateCompanySettings={updateCompanySettings} />}
      </div>
    </div>
  );
}
function SettingsPanel({ companySettings, updateCompanySettings }) {
  const [form, setForm] = useState({
    company_name: companySettings?.company_name || "Rwanda Plastic Industries Ltd",
    phone: companySettings?.phone || "+250 252 510 138",
    address: companySettings?.address || "KK 46 Ave, Kigali, Rwanda",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <div>
      <h1 className="font-black text-2xl text-[#14181C] mb-6">Company Settings</h1>
      <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
        <Field label="Company Name" full><input className="in" value={form.company_name} onChange={e=>setForm({...form, company_name:e.target.value})} /></Field>
        <Field label="Phone"><input className="in" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} /></Field>
        <Field label="Address" full><input className="in" value={form.address} onChange={e=>setForm({...form, address:e.target.value})} /></Field>
        <Field label="Currency"><input className="in" defaultValue="RWF" disabled /></Field>
        <Field label="Timezone"><input className="in" defaultValue="Africa/Kigali" disabled /></Field>
      </div>
      <div className="flex items-center gap-3 mt-5">
        <Btn disabled={saving} onClick={async () => { setSaving(true); await updateCompanySettings(form); setSaving(false); setSaved(true); setTimeout(()=>setSaved(false), 2500); }}>
          {saving ? "Saving…" : "Save Settings"}
        </Btn>
        {saved && <span className="text-sm text-[#1B6B4E] font-medium">Saved</span>}
      </div>
    </div>
  );
}
function QuotationsPanel({ quotations, updateQuotation }) {
  const [editing, setEditing] = useState(null);
  const [pricing, setPricing] = useState({ discount:0, deliveryFee:0, tax:0, expiry:"" });
  return (
    <div><h1 className="font-black text-2xl text-[#14181C] mb-6">Quotation Requests</h1>
      <div className="space-y-4">{quotations.map(q => {
        const subtotal = (q.quotation_items||[]).reduce((s,i)=>s+i.qty*i.unit_price,0);
        return (
          <div key={q.id} className="border border-[#14181C]/10 rounded-lg p-5">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2"><div className="font-mono font-bold">{q.id}</div><Badge tone={q.status==="Quote Requested"?"slate":q.status==="Quote Sent"?"amber":"green"}>{q.status}</Badge></div>
            <div className="text-sm font-semibold text-[#14181C]">{q.company}</div>
            <div className="text-xs text-[#3F4A52] mb-3">{q.contact} · {q.phone} · Delivery: {q.delivery_location}</div>
            <div className="text-sm text-[#3F4A52] mb-3">{(q.quotation_items||[]).map(i=>`${i.name} × ${i.qty}`).join(", ")}</div>
            <div className="text-xs text-[#3F4A52] mb-3">Subtotal: <span className="font-mono font-semibold text-[#14181C]">{CURRENCY(subtotal)}</span></div>
            {editing === q.id && <div className="bg-[#EEEEE6]/50 rounded-md p-4 grid sm:grid-cols-4 gap-3 mb-3">
              <Field label="Discount (RWF)"><input type="number" className="in" value={pricing.discount} onChange={e=>setPricing({...pricing,discount:Number(e.target.value)})} /></Field>
              <Field label="Delivery Fee"><input type="number" className="in" value={pricing.deliveryFee} onChange={e=>setPricing({...pricing,deliveryFee:Number(e.target.value)})} /></Field>
              <Field label="Tax (RWF)"><input type="number" className="in" value={pricing.tax} onChange={e=>setPricing({...pricing,tax:Number(e.target.value)})} /></Field>
              <Field label="Expiry Date"><input type="date" className="in" value={pricing.expiry} onChange={e=>setPricing({...pricing,expiry:e.target.value})} /></Field>
            </div>}
            <div className="flex gap-2">
              {editing === q.id ? <>
                <Btn onClick={async ()=>{ await updateQuotation(q.id, { discount:pricing.discount, delivery_fee:pricing.deliveryFee, tax:pricing.tax, expiry:pricing.expiry||null, status:"Quote Sent" }); setEditing(null); }}><Send size={14}/> Send Quotation</Btn>
                <Btn variant="ghost" onClick={()=>setEditing(null)}>Cancel</Btn>
              </> : <Btn variant="subtle" onClick={()=>{ setEditing(q.id); setPricing({ discount:q.discount||0, deliveryFee:q.delivery_fee||0, tax:q.tax||0, expiry:q.expiry||"" }); }}><Edit3 size={14}/> Edit Pricing & Send</Btn>}
            </div>
          </div>
        );
      })}</div>
    </div>
  );
}
function OrdersPanel({ orders, updateOrder }) {
  return (
    <div><h1 className="font-black text-2xl text-[#14181C] mb-6">Orders</h1>
      <div className="space-y-5">{orders.map(o => (
        <div key={o.id} className="border border-[#14181C]/10 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2"><div className="font-mono font-bold">{o.id} <span className="text-[#3F4A52] font-sans font-normal text-sm">— {o.customer_name}</span></div><div className="font-mono font-semibold">{CURRENCY(o.total)}</div></div>
          <OrderTimeline stage={o.stage} />
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <select value={o.stage} onChange={e=>updateOrder(o.id,{stage:e.target.value})} className="in !w-auto text-sm">{ORDER_STAGES.map(s=><option key={s} value={s}>{s}</option>)}</select>
            <select value={o.payment_status} onChange={e=>updateOrder(o.id,{payment_status:e.target.value})} className="in !w-auto text-sm">{["Pending","Paid","Partially Paid","Failed","Refunded"].map(s=><option key={s}>{s}</option>)}</select>
            <input defaultValue={o.driver||""} onBlur={e=>updateOrder(o.id,{driver:e.target.value})} placeholder="Driver name" className="in !w-40 text-sm" />
            <input defaultValue={o.vehicle||""} onBlur={e=>updateOrder(o.id,{vehicle:e.target.value})} placeholder="Vehicle" className="in !w-32 text-sm" />
          </div>
        </div>
      ))}</div>
    </div>
  );
}
function InventoryPanel({ products, adjustStock }) {
  return (
    <div><h1 className="font-black text-2xl text-[#14181C] mb-6">Inventory</h1>
      <div className="border border-[#14181C]/10 rounded-lg overflow-x-auto"><table className="w-full text-sm">
        <thead className="bg-[#14181C] text-[#EEEEE6] text-left"><tr>{["SKU","Product","Stock","Min Level","Status","Adjust"].map(h=><th key={h} className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr></thead>
        <tbody>{products.map(p => { const low = p.stock <= p.min_stock; return (
          <tr key={p.id} className="border-t border-[#14181C]/10">
            <td className="px-4 py-3 font-mono text-xs">{p.id}</td><td className="px-4 py-3 font-medium">{p.name}</td>
            <td className="px-4 py-3 font-mono">{p.stock}</td><td className="px-4 py-3 font-mono text-[#3F4A52]">{p.min_stock}</td>
            <td className="px-4 py-3">{low ? <Badge tone="rust">Low Stock</Badge> : <Badge tone="green">Healthy</Badge>}</td>
            <td className="px-4 py-3"><div className="flex items-center gap-1"><button onClick={()=>adjustStock(p,-10)} className="w-7 h-7 rounded-md bg-[#14181C]/5 flex items-center justify-center"><Minus size={13}/></button><button onClick={()=>adjustStock(p,10)} className="w-7 h-7 rounded-md bg-[#14181C]/5 flex items-center justify-center"><Plus size={13}/></button></div></td>
          </tr>
        );})}</tbody>
      </table></div>
    </div>
  );
}
function CustomersPanel({ customers }) {
  return (
    <div><h1 className="font-black text-2xl text-[#14181C] mb-6">Customers</h1>
      <div className="border border-[#14181C]/10 rounded-lg overflow-x-auto"><table className="w-full text-sm">
        <thead className="bg-[#14181C] text-[#EEEEE6] text-left"><tr>{["Company / Name","Type","Phone","Email"].map(h=><th key={h} className="px-4 py-3 font-semibold text-xs uppercase">{h}</th>)}</tr></thead>
        <tbody>{customers.map(c => (
          <tr key={c.id} className="border-t border-[#14181C]/10"><td className="px-4 py-3 font-medium">{c.company_name || c.full_name}</td><td className="px-4 py-3">{c.customer_type}</td><td className="px-4 py-3 font-mono text-xs">{c.phone}</td><td className="px-4 py-3">{c.email}</td></tr>
        ))}</tbody>
      </table></div>
    </div>
  );
}
function ProductsPanel({ products, addProduct, removeProduct }) {
  const [showNew, setShowNew] = useState(false);
  const [nf, setNf] = useState({ name:"", category_id:"household", price:"", wholesale_price:"", stock:"", min_stock:"", moq:"", material:"", unit:"piece" });
  return (
    <div>
      <div className="flex items-center justify-between mb-6"><h1 className="font-black text-2xl text-[#14181C]">Products</h1><Btn onClick={()=>setShowNew(!showNew)}><Plus size={15}/> Add Product</Btn></div>
      {showNew && <div className="border border-[#14181C]/10 rounded-lg p-5 mb-6 grid sm:grid-cols-3 gap-4">
        <Field label="Name"><input className="in" value={nf.name} onChange={e=>setNf({...nf,name:e.target.value})} /></Field>
        <Field label="Category ID"><input className="in" value={nf.category_id} onChange={e=>setNf({...nf,category_id:e.target.value})} placeholder="household" /></Field>
        <Field label="Material"><input className="in" value={nf.material} onChange={e=>setNf({...nf,material:e.target.value})} /></Field>
        <Field label="Retail Price (RWF)"><input type="number" className="in" value={nf.price} onChange={e=>setNf({...nf,price:e.target.value})} /></Field>
        <Field label="Wholesale Price"><input type="number" className="in" value={nf.wholesale_price} onChange={e=>setNf({...nf,wholesale_price:e.target.value})} /></Field>
        <Field label="MOQ"><input type="number" className="in" value={nf.moq} onChange={e=>setNf({...nf,moq:e.target.value})} /></Field>
        <Field label="Stock Qty"><input type="number" className="in" value={nf.stock} onChange={e=>setNf({...nf,stock:e.target.value})} /></Field>
        <Field label="Min Stock Level"><input type="number" className="in" value={nf.min_stock} onChange={e=>setNf({...nf,min_stock:e.target.value})} /></Field>
        <Field label="Unit"><input className="in" value={nf.unit} onChange={e=>setNf({...nf,unit:e.target.value})} /></Field>
        <div className="sm:col-span-3"><Btn onClick={async ()=>{ await addProduct(nf); setShowNew(false); }}>Save Product</Btn></div>
      </div>}
      <div className="border border-[#14181C]/10 rounded-lg overflow-x-auto"><table className="w-full text-sm">
        <thead className="bg-[#14181C] text-[#EEEEE6] text-left"><tr>{["SKU","Name","Price","Stock",""].map(h=><th key={h} className="px-4 py-3 font-semibold text-xs uppercase">{h}</th>)}</tr></thead>
        <tbody>{products.map(p => <tr key={p.id} className="border-t border-[#14181C]/10"><td className="px-4 py-3 font-mono text-xs">{p.id}</td><td className="px-4 py-3 font-medium">{p.name}</td><td className="px-4 py-3 font-mono">{CURRENCY(p.price)}</td><td className="px-4 py-3 font-mono">{p.stock}</td><td className="px-4 py-3"><button onClick={()=>removeProduct(p.id)} className="text-[#B5482A]"><Trash2 size={15}/></button></td></tr>)}</tbody>
      </table></div>
    </div>
  );
}

/* ============================================================
   App root — all data comes from Supabase (real DB, real auth)
   ============================================================ */
export default function App() {
  const [route, setRoute] = useState({ page: "home" });
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [companySettings, setCompanySettings] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [quoteDraft, setQuoteDraft] = useState([]);
  const [lastQuoteId, setLastQuoteId] = useState("");
  const [loaded, setLoaded] = useState(false);

  const fetchProducts = useCallback(async () => {
    const { data } = await supabase.from("products").select("*, product_categories(id,name,icon)").order("id");
    setProducts(data || []);
  }, []);
  const fetchCategories = useCallback(async () => {
    const { data } = await supabase.from("product_categories").select("*");
    setCategories(data || []);
  }, []);
  const fetchProfile = useCallback(async (userId) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    setProfile(data || null);
    return data;
  }, []);
  const fetchQuotations = useCallback(async () => {
    const { data } = await supabase.from("quotations").select("*, quotation_items(*)").order("created_at", { ascending: false });
    setQuotations(data || []);
  }, []);
  const fetchOrders = useCallback(async () => {
    const { data } = await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
    setOrders(data || []);
  }, []);
  const fetchCustomers = useCallback(async () => {
    const { data } = await supabase.from("profiles").select("*").eq("role", "customer");
    setCustomers(data || []);
  }, []);
  const fetchFavorites = useCallback(async (userId) => {
    const { data } = await supabase.from("favourites").select("product_id").eq("customer_id", userId);
    setFavorites((data || []).map(f => f.product_id));
  }, []);
  const fetchCompanySettings = useCallback(async () => {
    const { data } = await supabase.from("company_settings").select("*").eq("id", 1).single();
    setCompanySettings(data || null);
  }, []);
  async function updateProfile(patch) {
    if (!session) return;
    await supabase.from("profiles").update(patch).eq("id", session.user.id);
    await fetchProfile(session.user.id);
  }
  async function updateCompanySettings(patch) {
    await supabase.from("company_settings").update(patch).eq("id", 1);
    await fetchCompanySettings();
  }

  useEffect(() => {
    (async () => {
      await fetchProducts();
      await fetchCategories();
      const { data: { session: s } } = await supabase.auth.getSession();
      setSession(s);
      if (s) {
        const p = await fetchProfile(s.user.id);
        await fetchFavorites(s.user.id);
        if (p?.role === "customer") { await fetchQuotations(); await fetchOrders(); }
        else if (p?.role === "staff" || p?.role === "admin") { await fetchQuotations(); await fetchOrders(); await fetchCustomers(); await fetchCompanySettings(); }
      }
      setLoaded(true);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, s) => {
      setSession(s);
      if (s) { const p = await fetchProfile(s.user.id); await fetchFavorites(s.user.id); if (p?.role==="customer"){await fetchQuotations(); await fetchOrders();} else if (p){await fetchQuotations(); await fetchOrders(); await fetchCustomers();} }
      else { setProfile(null); setFavorites([]); setQuotations([]); setOrders([]); }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signOut() { await supabase.auth.signOut(); setRoute({ page: "home" }); }

  function addToQuote(p, size, color, qty) {
    setQuoteDraft(d => [...d, { key: uid("item"), productId: p.id, name: p.name, size, color, qty, unitPrice: p.wholesale_price }]);
  }
  async function toggleFav(productId) {
    if (!session) { setRoute({ page: "login" }); return; }
    if (favorites.includes(productId)) {
      await supabase.from("favourites").delete().eq("customer_id", session.user.id).eq("product_id", productId);
      setFavorites(f => f.filter(x => x !== productId));
    } else {
      await supabase.from("favourites").insert({ customer_id: session.user.id, product_id: productId });
      setFavorites(f => [...f, productId]);
    }
  }
  async function submitQuote(form, items) {
    if (!session) { setRoute({ page: "login" }); return; }
    const id = uid("Q");
    await supabase.from("quotations").insert({
      id, customer_id: session.user.id, company: form.company, contact: form.contact, phone: form.phone, email: form.email,
      delivery_location: form.deliveryLocation, required_date: form.requiredDate || null, notes: form.notes, status: "Quote Requested",
    });
    await supabase.from("quotation_items").insert(items.map(i => ({ quotation_id: id, product_id: i.productId, name: i.name, qty: i.qty, unit_price: i.unitPrice })));
    setQuoteDraft([]);
    setLastQuoteId(id);
    await fetchQuotations();
    setRoute({ page: "quote-success" });
  }
  async function submitCustomRequest(f) {
    await supabase.from("custom_requests").insert({
      customer_id: session.user.id, product_type: f.productType, dimensions: f.dimensions, quantity: Number(f.quantity) || null,
      colour: f.colour, material: f.material, intended_use: f.intendedUse, additional_specs: f.additionalSpecs, required_date: f.requiredDate || null,
    });
  }
  async function respondQuotation(q, action) {
    if (action === "accept") {
      const subtotal = (q.quotation_items||[]).reduce((s,i)=>s+i.qty*i.unit_price,0);
      const total = subtotal - (q.discount||0) + (q.delivery_fee||0) + (q.tax||0);
      const orderId = uid("O");
      await supabase.from("orders").insert({ id: orderId, quotation_id: q.id, customer_id: session.user.id, customer_name: q.company, stage: "Order Confirmed", total, delivery_location: q.delivery_location, payment_status: "Pending" });
      await supabase.from("order_items").insert((q.quotation_items||[]).map(i => ({ order_id: orderId, product_id: i.product_id, name: i.name, qty: i.qty, unit_price: i.unit_price })));
      await supabase.from("quotations").update({ status: "Quote Accepted" }).eq("id", q.id);
    } else {
      await supabase.from("quotations").update({ status: "Rejected" }).eq("id", q.id);
    }
    await fetchQuotations(); await fetchOrders();
  }
  async function updateQuotation(id, patch) { await supabase.from("quotations").update(patch).eq("id", id); await fetchQuotations(); }
  async function updateOrder(id, patch) { await supabase.from("orders").update(patch).eq("id", id); await fetchOrders(); }
  async function adjustStock(p, delta) {
    const newStock = Math.max(0, p.stock + delta);
    await supabase.from("products").update({ stock: newStock }).eq("id", p.id);
    await supabase.from("inventory_transactions").insert({ product_id: p.id, change: delta, reason: "Manual adjustment", created_by: session?.user?.id });
    await fetchProducts();
  }
  async function addProduct(nf) {
    const id = uid("P");
    await supabase.from("products").insert({ id, name: nf.name, category_id: nf.category_id, material: nf.material, unit: nf.unit, price: Number(nf.price)||0, wholesale_price: Number(nf.wholesale_price)||Number(nf.price)||0, moq: Number(nf.moq)||1, stock: Number(nf.stock)||0, min_stock: Number(nf.min_stock)||10, sizes:["Standard"], colors:["Standard"] });
    await fetchProducts();
  }
  async function removeProduct(id) { await supabase.from("products").delete().eq("id", id); await fetchProducts(); }

  const favProducts = products.filter(p => favorites.includes(p.id));
  const dashRoute = profile?.role === "customer" ? "customer-dashboard" : "admin-dashboard";

  const pages = {
    home: <Home setRoute={setRoute} products={products} />,
    products: <Products products={products} categories={categories} route={route} setRoute={setRoute} favorites={favorites} toggleFav={toggleFav} />,
    product: <ProductDetail products={products} route={route} setRoute={setRoute} addToQuote={addToQuote} favorites={favorites} toggleFav={toggleFav} />,
    "quote-builder": <QuoteBuilder draft={quoteDraft} setDraft={setQuoteDraft} setRoute={setRoute} submitQuote={submitQuote} session={session} profile={profile} />,
    "quote-success": <QuoteSuccess setRoute={setRoute} lastQuoteId={lastQuoteId} />,
    custom: <CustomSolutions session={session} submitCustomRequest={submitCustomRequest} />,
    about: <About />,
    contact: <Contact />,
    faq: <SimplePage title="FAQ" body={"What is the minimum order quantity?\nMOQ varies by product, shown on each product page.\n\nHow long does delivery take?\nMost Kigali orders arrive within 2-3 business days; upcountry up to 5.\n\nCan I request custom dimensions or colours?\nYes — use Custom Solutions.\n\nWhat payment methods are supported?\nMobile Money, bank transfer, card, and cash on delivery for approved accounts."} />,
    privacy: <SimplePage title="Privacy Policy" body={"Rwanda Plastic Industries Ltd collects only the information necessary to process quotations, orders and deliveries, stored securely in a managed database with role-based access controls."} />,
    terms: <SimplePage title="Terms of Service" body={"By placing an order or requesting a quotation, you agree to our standard trading terms including pricing validity, delivery timelines, and payment terms confirmed on each quotation."} />,
    login: <Login setRoute={setRoute} />,
    "customer-dashboard": <CustomerDashboard profile={profile} quotations={quotations} orders={orders} favProducts={favProducts} respondQuotation={respondQuotation} setRoute={setRoute} updateProfile={updateProfile} />,
    "admin-dashboard": <AdminDashboard profile={profile} quotations={quotations} orders={orders} products={products} customers={customers} updateQuotation={updateQuotation} updateOrder={updateOrder} adjustStock={adjustStock} addProduct={addProduct} removeProduct={removeProduct} companySettings={companySettings} updateCompanySettings={updateCompanySettings} />,
  };

  return (
    <div className="min-h-screen bg-[#EEEEE6] text-[#14181C]">
      {route.page !== "login" && <TopNav route={route} setRoute={setRoute} session={session} profile={profile} quoteCount={quoteDraft.length} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} signOut={signOut} />}
      {loaded ? (pages[route.page] || pages.home) : <div className="py-32 text-center text-[#3F4A52]">Loading…</div>}
      {route.page !== "login" && <Footer setRoute={setRoute} />}
    </div>
  );
}
