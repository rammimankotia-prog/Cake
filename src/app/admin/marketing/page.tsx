"use client";

import AdminSidebar from "@/components/AdminSidebar";
import { useState } from "react";

interface Campaign {
  id: number;
  title: string;
  discount: number;
  target: string;
  status: "Active" | "Scheduled" | "Expired" | "Draft";
  startDate: string;
  endDate: string;
  uses: number;
  code: string;
}

interface Tier {
  id: number;
  name: string;
  icon: string;
  color: string;
  discount: number;
  minSpend: number;
  members: number;
}

const INITIAL_CAMPAIGNS: Campaign[] = [
  { id: 1, title: "Summer Sizzler", discount: 15, target: "All Customers", status: "Active", startDate: "2026-04-20", endDate: "2026-05-20", uses: 34, code: "SUMMER15" },
  { id: 2, title: "VIP Exclusive Drop", discount: 25, target: "VIP Tier", status: "Active", startDate: "2026-04-01", endDate: "2026-06-01", uses: 12, code: "VIP25" },
  { id: 3, title: "Model Town Locals", discount: 10, target: "Pincode 110033", status: "Scheduled", startDate: "2026-05-01", endDate: "2026-05-15", uses: 0, code: "LOCAL10" },
  { id: 4, title: "Midnight Munchies", discount: 20, target: "Orders after 11 PM", status: "Active", startDate: "2026-04-15", endDate: "2026-04-30", uses: 8, code: "LATE20" },
  { id: 5, title: "Birthday Week", discount: 30, target: "Birthday Users", status: "Draft", startDate: "", endDate: "", uses: 0, code: "BDAY30" },
];

const TIERS: Tier[] = [
  { id: 1, name: "Gold", icon: "👑", color: "from-gold/20 to-gold/5", discount: 20, minSpend: 10000, members: 12 },
  { id: 2, name: "Silver", icon: "⭐", color: "from-slate-200/40 to-slate-100/20", discount: 10, minSpend: 5000, members: 34 },
  { id: 3, name: "Regular", icon: "🎯", color: "from-navy/5 to-navy/[0.02]", discount: 5, minSpend: 0, members: 89 },
];

const STATUS_COLORS: Record<string, string> = {
  Active: "bg-mint/10 text-mint border-mint/20",
  Scheduled: "bg-gold/10 text-gold border-gold/20",
  Expired: "bg-slate-100 text-slate-400 border-slate-200",
  Draft: "bg-navy/5 text-navy/40 border-navy/10",
};

export default function AdminMarketing() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [newCamp, setNewCamp] = useState({ title: "", discount: 10, target: "All Customers", code: "", startDate: "", endDate: "" });
  const [filter, setFilter] = useState("All");

  const addCampaign = () => {
    if (!newCamp.title || !newCamp.code) return;
    setCampaigns([
      ...campaigns,
      { ...newCamp, id: Date.now(), status: "Draft", uses: 0 },
    ]);
    setShowNewCampaign(false);
    setNewCamp({ title: "", discount: 10, target: "All Customers", code: "", startDate: "", endDate: "" });
  };

  const toggleStatus = (id: number) => {
    setCampaigns(campaigns.map((c) =>
      c.id === id ? { ...c, status: c.status === "Active" ? "Draft" : "Active" } : c
    ));
  };

  const deleteCampaign = (id: number) => setCampaigns(campaigns.filter((c) => c.id !== id));

  const filtered = filter === "All" ? campaigns : campaigns.filter((c) => c.status === filter);

  const activeCampaigns = campaigns.filter((c) => c.status === "Active").length;
  const totalUses = campaigns.reduce((s, c) => s + c.uses, 0);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-navy">Marketing Hub</h1>
            <p className="text-navy/40 text-sm">{activeCampaigns} active campaigns · {totalUses} total coupon uses</p>
          </div>
          <button
            onClick={() => setShowNewCampaign(true)}
            className="bg-rose text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-rose/90 transition-all shadow-sm shadow-rose/20"
          >
            + Launch Campaign
          </button>
        </header>

        <div className="p-8 space-y-8">
          {/* KPI Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: "Active Campaigns", value: activeCampaigns, icon: "🎯", color: "from-rose/20 to-rose/5", textColor: "text-rose" },
              { label: "Total Coupon Uses", value: totalUses, icon: "🏷️", color: "from-gold/20 to-gold/5", textColor: "text-gold" },
              { label: "Loyalty Members", value: TIERS.reduce((s, t) => s + t.members, 0), icon: "👥", color: "from-mint/20 to-mint/5", textColor: "text-mint" },
              { label: "Avg Discount", value: `${Math.round(campaigns.reduce((s, c) => s + c.discount, 0) / campaigns.length)}%`, icon: "💸", color: "from-navy/10 to-navy/5", textColor: "text-navy" },
            ].map((stat, i) => (
              <div key={i} className={`rounded-3xl p-6 bg-gradient-to-br ${stat.color} border border-slate-100 relative overflow-hidden`}>
                <div className="absolute right-4 top-4 text-3xl opacity-20">{stat.icon}</div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-2">{stat.label}</p>
                <p className={`text-3xl font-serif font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Campaigns (2/3) */}
            <div className="xl:col-span-2 space-y-5">
              {/* Filter */}
              <div className="flex space-x-2 bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100 w-fit">
                {["All", "Active", "Scheduled", "Draft", "Expired"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      filter === s ? "bg-navy text-white" : "text-navy/40 hover:text-navy"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Campaign Cards */}
              <div className="space-y-3">
                {filtered.map((camp) => (
                  <div key={camp.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-5 group hover:shadow-md transition-all">
                    {/* Discount Badge */}
                    <div className="w-14 h-14 bg-rose/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-rose font-bold text-lg">{camp.discount}%</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-bold text-navy text-base">{camp.title}</h3>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLORS[camp.status]}`}>{camp.status}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-navy/40">
                        <span>🎯 {camp.target}</span>
                        <span>·</span>
                        <span className="font-mono bg-slate-50 px-2 py-0.5 rounded text-navy/50">{camp.code}</span>
                        {camp.startDate && <span>· {camp.startDate} → {camp.endDate}</span>}
                      </div>
                    </div>

                    {/* Stats + Actions */}
                    <div className="flex items-center space-x-5 flex-shrink-0">
                      <div className="text-center">
                        <p className="text-lg font-bold text-navy">{camp.uses}</p>
                        <p className="text-[9px] text-navy/30 font-bold uppercase">uses</p>
                      </div>
                      <button
                        onClick={() => toggleStatus(camp.id)}
                        className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${camp.status === "Active" ? "bg-mint" : "bg-slate-200"}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${camp.status === "Active" ? "translate-x-5" : ""}`} />
                      </button>
                      <button onClick={() => deleteCampaign(camp.id)} className="p-2 rounded-lg text-navy/20 hover:text-rose hover:bg-rose/5 transition-colors opacity-0 group-hover:opacity-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Automation Block */}
              <div className="bg-navy rounded-3xl p-6 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-rose/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                <div className="relative z-10">
                  <h4 className="text-lg font-serif font-bold mb-4">⚡ Automation Rules</h4>
                  <div className="space-y-3">
                    {[
                      { rule: "Birthday auto-email + 15% coupon", trigger: "user.birthday === today", active: true },
                      { rule: "Cart abandoned → WhatsApp nudge", trigger: "cart.age > 2 hours", active: true },
                      { rule: "First-time order → Welcome 10% off", trigger: "user.orderCount === 0", active: false },
                      { rule: "VIP upgrade after ₹10,000 spent", trigger: "user.totalSpend >= 10000", active: true },
                    ].map((auto, i) => (
                      <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                        <div>
                          <p className="text-white/90 text-sm font-semibold">{auto.rule}</p>
                          <p className="text-white/30 text-xs font-mono mt-0.5">{auto.trigger}</p>
                        </div>
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${auto.active ? "bg-mint" : "bg-white/20"}`} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Loyalty Tiers */}
            <div className="space-y-5">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100">
                  <h2 className="text-lg font-serif font-bold text-navy">Loyalty Tiers</h2>
                </div>
                <div className="p-4 space-y-3">
                  {TIERS.map((tier) => (
                    <div key={tier.id} className={`rounded-2xl p-4 bg-gradient-to-r ${tier.color} border border-slate-100`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{tier.icon}</span>
                          <span className="font-bold text-navy">{tier.name}</span>
                        </div>
                        <span className="text-xs font-bold text-rose">{tier.discount}% Off</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-navy/40">
                        <span>Min. ₹{tier.minSpend.toLocaleString()}</span>
                        <span className="font-bold">{tier.members} members</span>
                      </div>
                      <div className="mt-2 h-1.5 bg-white/50 rounded-full overflow-hidden">
                        <div className="h-full bg-rose/40 rounded-full" style={{ width: `${Math.min(tier.members / 100 * 100, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-navy/30 font-bold text-sm hover:border-rose/30 hover:text-rose transition-all">
                    + Create New Tier
                  </button>
                </div>
              </div>

              {/* Coupon Generator */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-lg font-serif font-bold text-navy mb-4">Quick Coupon</h2>
                <div className="space-y-3">
                  <input placeholder="Coupon code e.g. DIWALI20" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose uppercase font-mono tracking-wider" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" placeholder="% off" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose" />
                    <input type="number" placeholder="Max uses" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose" />
                  </div>
                  <button className="w-full bg-rose text-white py-3 rounded-xl font-bold text-sm hover:bg-rose/90 transition-all shadow-sm shadow-rose/20 active:scale-95">
                    Generate Coupon
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* New Campaign Modal */}
        {showNewCampaign && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-navy/50 backdrop-blur-sm" onClick={() => setShowNewCampaign(false)} />
            <div className="relative bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
              <h2 className="text-2xl font-serif font-bold text-navy mb-6">Launch Campaign</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-navy/30 block mb-2">Campaign Name</label>
                  <input value={newCamp.title} onChange={(e) => setNewCamp({ ...newCamp, title: e.target.value })} placeholder="e.g. Monsoon Madness" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-navy/30 block mb-2">Discount %</label>
                    <input type="number" value={newCamp.discount} onChange={(e) => setNewCamp({ ...newCamp, discount: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-navy/30 block mb-2">Coupon Code</label>
                    <input value={newCamp.code} onChange={(e) => setNewCamp({ ...newCamp, code: e.target.value.toUpperCase() })} placeholder="SAVE20" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono uppercase focus:outline-none focus:border-rose" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-navy/30 block mb-2">Target Audience</label>
                  <select value={newCamp.target} onChange={(e) => setNewCamp({ ...newCamp, target: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose">
                    <option>All Customers</option>
                    <option>VIP Tier</option>
                    <option>Silver Tier</option>
                    <option>Pincode 110033</option>
                    <option>Birthday Users</option>
                    <option>Orders after 11 PM</option>
                    <option>First-time Buyers</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-navy/30 block mb-2">Start Date</label>
                    <input type="date" value={newCamp.startDate} onChange={(e) => setNewCamp({ ...newCamp, startDate: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-navy/30 block mb-2">End Date</label>
                    <input type="date" value={newCamp.endDate} onChange={(e) => setNewCamp({ ...newCamp, endDate: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose" />
                  </div>
                </div>
                <div className="flex space-x-3 pt-2">
                  <button onClick={addCampaign} className="flex-1 bg-rose text-white py-3 rounded-xl font-bold text-sm hover:bg-rose/90 transition-all shadow-sm">
                    Launch Campaign
                  </button>
                  <button onClick={() => setShowNewCampaign(false)} className="px-6 py-3 rounded-xl font-bold text-sm text-navy/40 hover:bg-slate-50 transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
