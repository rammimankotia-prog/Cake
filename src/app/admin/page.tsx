import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const totalOrders = await prisma.order.count();
  const totalRevenue = await prisma.order.aggregate({ _sum: { total: true } });
  const totalProducts = await prisma.product.count();
  const totalUsers = await prisma.user.count();

  const recentOrders = await prisma.order.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  const topProducts = await prisma.product.findMany({ take: 5 });

  const totalCategories = await prisma.category.count();

  const stats = [
    {
      label: "Total Revenue",
      value: `₹${((totalRevenue._sum.total || 0) * 85).toFixed(0)}`,
      sub: "Lifetime sales",
      icon: "💰",
      trend: "up",
      color: "from-mint/20 to-mint/5",
      textColor: "text-mint",
    },
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      sub: "Total placed orders",
      icon: "📦",
      trend: "up",
      color: "from-rose/20 to-rose/5",
      textColor: "text-rose",
    },
    {
      label: "Live Products",
      value: totalProducts.toString(),
      sub: `${totalCategories} categories`,
      icon: "🧁",
      trend: "neutral",
      color: "from-gold/20 to-gold/5",
      textColor: "text-gold",
    },
    {
      label: "Customers",
      value: totalUsers.toString(),
      sub: "Registered accounts",
      icon: "👥",
      trend: "up",
      color: "from-navy/10 to-navy/5",
      textColor: "text-navy",
    },
  ];

  const statusColors: Record<string, string> = {
    PENDING: "bg-gold/10 text-gold border border-gold/20",
    CONFIRMED: "bg-blue-50 text-blue-600 border border-blue-200",
    SHIPPED: "bg-purple-50 text-purple-600 border border-purple-200",
    DELIVERED: "bg-mint/10 text-mint border border-mint/20",
    CANCELLED: "bg-red-50 text-red-500 border border-red-200",
  };

  const quickActions = [
    { label: "Add Product", href: "/admin/inventory", icon: "🧁", color: "bg-rose" },
    { label: "Manage Orders", href: "/admin/orders", icon: "📦", color: "bg-navy" },
    { label: "Marketing", href: "/admin/marketing", icon: "🎯", color: "bg-gold" },
    { label: "Shop Controls", href: "/admin/settings", icon: "⚙️", color: "bg-navy/70" },
  ];

  const allOrders = await prisma.order.findMany({
    include: { items: { include: { product: true } }, user: true },
  });

  // Calculate Best Seller
  const productSales: Record<string, { count: number, name: string }> = {};
  allOrders.forEach(order => {
    order.items.forEach(item => {
      if (!productSales[item.productId]) {
        productSales[item.productId] = { count: 0, name: item.product?.name || "Unknown" };
      }
      productSales[item.productId].count += item.quantity;
    });
  });
  const bestSeller = Object.values(productSales).sort((a, b) => b.count - a.count)[0] || { name: "No Sales Yet", count: 0 };
  const totalItemsSold = Object.values(productSales).reduce((acc, curr) => acc + curr.count, 0);
  const bestSellerPercent = totalItemsSold > 0 ? (bestSeller.count / totalItemsSold) * 100 : 0;

  // Calculate Peak Hour
  const hourCounts: Record<number, number> = {};
  allOrders.forEach(o => {
    const hour = new Date(o.createdAt).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  const peakHour = parseInt(Object.keys(hourCounts).reduce((a, b) => hourCounts[parseInt(a)] > hourCounts[parseInt(b)] ? a : b, "0"));
  const peakHourOrders = hourCounts[peakHour] || 0;
  const peakHourPercent = allOrders.length > 0 ? (peakHourOrders / allOrders.length) * 100 : 0;
  const formatHour = (h: number) => h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`;

  // Fetch Delivery Coverage
  const settings = await prisma.shopSettings.findUnique({ where: { id: "global" } });
  const activePincodes = settings?.servicedPincodes.split(",").map(p => p.trim()) || [];

  // Generate Activity Feed
  const recentActivities = [
    ...allOrders.map(o => ({
      icon: "🧁",
      text: `New order #${o.id.slice(-6).toUpperCase()} placed`,
      date: new Date(o.createdAt),
      time: new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })),
    ...allOrders.filter(o => o.user).map(o => ({
      icon: "👤",
      text: `Customer checkout: ${o.user?.name || o.user?.email || "Guest"}`,
      date: new Date(o.createdAt),
      time: new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 4);

  try {
    // We already did some prisma calls above, but let's wrap the whole return
    return (
      <div className="flex min-h-screen bg-slate-50">
        <AdminSidebar />
  
        {/* Main Content */}
        <main className="flex-1 ml-64 min-h-screen">
          {/* Top Header Bar */}
          <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif font-bold text-navy">Executive Dashboard</h1>
              <p className="text-navy/40 text-sm">
                {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/catalog" target="_blank" className="bg-rose text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-rose/90 transition-all shadow-sm shadow-rose/20">
                + New Order
              </Link>
              <button className="bg-navy/5 text-navy px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-navy/10 transition-all">
                Export CSV
              </button>
            </div>
          </header>
  
          <div className="p-8 space-y-8">
            {/* KPI Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {stats.map((stat, i) => (
                <div key={i} className={`rounded-3xl p-6 bg-gradient-to-br ${stat.color} border border-slate-100 relative overflow-hidden`}>
                  <div className="absolute right-4 top-4 text-3xl opacity-20">{stat.icon}</div>
                  <p className="text-xs font-bold uppercase tracking-widest text-navy/40 mb-3">{stat.label}</p>
                  <p className={`text-3xl font-serif font-bold ${stat.textColor} mb-1`}>{stat.value}</p>
                  <p className="text-xs font-semibold text-navy/30">{stat.sub}</p>
                </div>
              ))}
            </div>
  
            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map(({ label, href, icon, color }) => (
                <Link
                  key={href}
                  href={href}
                  className={`${color} text-white rounded-2xl p-5 flex items-center space-x-4 hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg group`}
                >
                  <span className="text-2xl">{icon}</span>
                  <span className="font-bold text-sm">{label}</span>
                  <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
              ))}
            </div>
  
            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Orders Table */}
              <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-lg font-serif font-bold text-navy">Recent Orders</h2>
                  <Link href="/admin/orders" className="text-rose text-sm font-bold hover:underline">
                    View All →
                  </Link>
                </div>
  
                {recentOrders.length === 0 ? (
                  <div className="py-16 text-center">
                    <p className="text-5xl mb-4">📭</p>
                    <p className="text-navy/30 font-medium">No orders yet. Share your store link to start receiving orders!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-navy/30">Order</th>
                          <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-navy/30">Customer</th>
                          <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-navy/30">Status</th>
                          <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-navy/30">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-mono text-sm text-navy/60">
                              #{order.id.slice(-6).toUpperCase()}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-rose/10 rounded-full flex items-center justify-center text-rose font-bold text-xs">
                                  {(order.user?.name || order.user?.email || "?")[0].toUpperCase()}
                                </div>
                                <span className="text-navy font-semibold text-sm">{order.user?.name || order.user?.email || "Guest"}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${statusColors[order.status] || "bg-slate-100 text-slate-500"}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-navy">
                              ₹{(order.total * 85).toFixed(0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
  
              {/* Right Panel */}
              <div className="space-y-6">
                {/* Top Products */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-serif font-bold text-navy">Studio Menu</h2>
                    <Link href="/admin/inventory" className="text-rose text-sm font-bold hover:underline">Manage →</Link>
                  </div>
                  <div className="p-4 space-y-2">
                    {topProducts.map((product, i) => (
                      <div key={product.id} className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                        <span className="w-7 h-7 bg-rose/10 text-rose rounded-lg flex items-center justify-center font-bold text-xs">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-navy font-semibold text-sm truncate">{product.name}</p>
                          <p className="text-navy/30 text-xs">₹{(product.basePrice * 85).toFixed(0)}</p>
                        </div>
                        <span className={`w-2 h-2 rounded-full ${product.isActive ? 'bg-mint' : 'bg-slate-200'}`} />
                      </div>
                    ))}
                    {topProducts.length === 0 && <p className="text-center text-sm text-navy/40 py-4">Menu is empty</p>}
                  </div>
                </div>
  
                {/* Activity Feed */}
                <div className="bg-navy rounded-3xl p-6 text-white">
                  <h2 className="text-lg font-serif font-bold mb-5">Live Activity</h2>
                  <div className="space-y-4">
                    {recentActivities.length > 0 ? recentActivities.map((item, i) => (
                      <div key={i} className="flex items-start space-x-3">
                        <span className="text-base mt-0.5">{item.icon}</span>
                        <div className="flex-1">
                          <p className="text-white/80 text-sm">{item.text}</p>
                          <p className="text-white/30 text-xs">{item.time}</p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-sm text-white/40">No recent activity detected.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
  
            {/* Bottom Performance Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-navy/30 mb-2">Best Seller</p>
                <p className="text-xl font-serif font-bold text-navy truncate" title={bestSeller.name}>{bestSeller.name}</p>
                <p className="text-navy/40 text-sm mt-1">{bestSeller.count} items sold</p>
                <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose rounded-full transition-all duration-1000" style={{ width: `${Math.min(bestSellerPercent, 100)}%` }} />
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-navy/30 mb-2">Peak Hour</p>
                <p className="text-xl font-serif font-bold text-navy">
                  {allOrders.length > 0 ? `${formatHour(peakHour)} - ${formatHour((peakHour + 1) % 24)}` : "Not enough data"}
                </p>
                <p className="text-navy/40 text-sm mt-1">
                  {allOrders.length > 0 ? `${Math.round(peakHourPercent)}% of all orders` : "Awaiting first orders"}
                </p>
                <div className="mt-4 flex space-x-1 items-end h-10">
                  {Array.from({length: 12}).map((_, i) => {
                    // Generate visual bars representing hour distribution 
                    const simulatedHeight = hourCounts[(peakHour + i - 6 + 24) % 24] || 0;
                    const maxCount = Math.max(...Object.values(hourCounts), 1);
                    return (
                      <div key={i} className="flex-1 bg-rose/20 rounded-sm" style={{ height: `${(simulatedHeight / maxCount) * 100}%`, minHeight: '10%' }} />
                    )
                  })}
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-navy/30 mb-2">Delivery Coverage</p>
                <p className="text-xl font-serif font-bold text-navy">{activePincodes.length > 0 ? `${activePincodes.length} Active Zones` : "No zones active"}</p>
                <p className="text-navy/40 text-sm mt-1">Accepting local orders</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {activePincodes.slice(0, 4).map(pin => (
                    <span key={pin} className="bg-navy/5 text-navy/60 text-xs font-bold px-3 py-1 rounded-full">{pin}</span>
                  ))}
                  {activePincodes.length > 4 && <span className="bg-navy/5 text-navy/60 text-xs font-bold px-3 py-1 rounded-full">+{activePincodes.length - 4}</span>}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="flex min-h-screen bg-slate-50 font-sans">
        <AdminSidebar />
        <main className="flex-1 ml-64 p-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-red-100">
              <div className="bg-red-500 p-8 text-white flex items-center space-x-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl animate-pulse">
                  ⚠️
                </div>
                <div>
                  <h1 className="text-3xl font-serif font-bold">Admin Dashboard Error</h1>
                  <p className="text-white/80 font-medium">A database or application error prevented this page from loading.</p>
                </div>
              </div>

              <div className="p-10 space-y-8">
                <div className="bg-slate-900 rounded-2xl p-6 relative group">
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <p className="text-rose font-mono text-sm mb-4"># Error Log Trace</p>
                  <pre className="text-slate-300 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                    {error.message || "Unknown server error occurred."}
                  </pre>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 hover:border-rose/30 transition-all">
                    <h3 className="text-navy font-bold text-lg mb-3">Diagnostic Result</h3>
                    <p className="text-navy/60 text-sm leading-relaxed mb-6">
                      If the error mentions <b>"no such column"</b>, your database is out of sync with the latest code updates. This happens after adding new features like stock management or image adjustments.
                    </p>
                    <a 
                      href="/api/setup" 
                      target="_blank"
                      className="inline-flex items-center space-x-2 bg-navy text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-navy/90 transition-all shadow-lg"
                    >
                      <span>Run Database Fix</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </a>
                  </div>

                  <div className="bg-rose/5 rounded-3xl p-8 border border-rose/10 flex flex-col justify-center">
                    <h3 className="text-rose font-bold text-lg mb-2">Technical Support</h3>
                    <p className="text-navy/50 text-sm mb-4">Please screenshot this page and send it to your developer for a quick fix.</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="text-navy font-bold text-sm flex items-center space-x-2 hover:text-rose transition-colors"
                    >
                      <span>Try Refreshing Page</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}
}
