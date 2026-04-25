"use client";

import AdminSidebar from "@/components/AdminSidebar";
import Link from "next/link";
import { useState, useEffect, useTransition } from "react";
import { getOrders, updateOrderStatus } from "@/app/actions/orders";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-gold/10 text-gold",
  CONFIRMED: "bg-blue-50 text-blue-600",
  SHIPPED: "bg-purple-50 text-purple-600",
  DELIVERED: "bg-mint/10 text-mint",
  CANCELLED: "bg-red-50 text-red-500",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getOrders().then(setOrders);
  }, []);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    // Optimistic UI update
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
    // Server update
    startTransition(() => {
      updateOrderStatus(id, newStatus);
    });
  };

  const filtered = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-navy">Order Management</h1>
            <p className="text-navy/40 text-sm">{orders.length} total orders</p>
          </div>
          <button className="bg-rose text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-rose/90 transition-all">
            Export Orders
          </button>
        </header>

        <div className="p-8 space-y-6">
          {/* Filter Tabs */}
          <div className="flex space-x-2 bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100 w-fit">
            {["ALL", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  filter === s ? "bg-navy text-white shadow-sm" : "text-navy/40 hover:text-navy"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-navy/30">Order ID</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-navy/30">Customer</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-navy/30">Items</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-navy/30">Total (₹)</th>
                  <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest text-navy/30">Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-navy/30">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-navy/50">
                      #{order.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-rose/10 flex items-center justify-center text-rose font-bold text-xs">
                          {order.customer[0].toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-navy text-sm block">{order.customer}</span>
                          <span className="text-xs text-navy/40">{order.date}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-navy/50 text-sm max-w-[200px] truncate">{order.items || "N/A"}</td>
                    <td className="px-6 py-4 text-right font-bold text-navy">₹{order.total.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold cursor-pointer border-none focus:ring-2 focus:ring-rose/30 ${STATUS_COLORS[order.status] || STATUS_COLORS["PENDING"]}`}
                      >
                        {["PENDING","CONFIRMED","SHIPPED","DELIVERED","CANCELLED"].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-rose font-bold text-sm hover:underline">Details</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-navy/40 font-medium">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
