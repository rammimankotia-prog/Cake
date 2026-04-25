import AdminSidebar from "@/components/AdminSidebar";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function AdminReports() {
  const allOrders = await prisma.order.findMany({
    where: { status: { not: "CANCELLED" } },
    include: {
      items: { include: { product: { include: { category: true } } } },
      user: true,
    }
  });

  const totalUsers = await prisma.user.count();

  // Metrics
  const totalRevenue = allOrders.reduce((sum, order) => sum + (order.total * 85), 0);
  const totalOrders = allOrders.length;
  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Revenue Over Time (Last 12 Months)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyRevenue = new Array(12).fill(0);
  const monthLabels = new Array(12).fill("");

  for (let i = 0; i < 12; i++) {
    const date = new Date(currentYear, currentMonth - 11 + i, 1);
    monthLabels[i] = date.toLocaleString('default', { month: 'short' });
  }

  allOrders.forEach(order => {
    const orderDate = new Date(order.createdAt);
    const monthsAgo = (currentYear - orderDate.getFullYear()) * 12 + (currentMonth - orderDate.getMonth());
    if (monthsAgo >= 0 && monthsAgo < 12) {
      monthlyRevenue[11 - monthsAgo] += (order.total * 85);
    }
  });

  const maxMonthlyRevenue = Math.max(...monthlyRevenue, 1);

  // Top Categories
  const categorySales: Record<string, { revenue: number, count: number, name: string }> = {};
  const productSales: Record<string, { revenue: number, count: number, name: string, catName: string }> = {};

  allOrders.forEach(order => {
    order.items.forEach(item => {
      const catId = item.product?.categoryId || "unknown";
      const catName = item.product?.category?.name || "Uncategorized";
      const prodId = item.productId;
      const prodName = item.product?.name || "Unknown Product";
      const itemRev = item.quantity * (item.product?.basePrice || 0) * 85;

      if (!categorySales[catId]) categorySales[catId] = { revenue: 0, count: 0, name: catName };
      categorySales[catId].revenue += itemRev;
      categorySales[catId].count += item.quantity;

      if (!productSales[prodId]) productSales[prodId] = { revenue: 0, count: 0, name: prodName, catName };
      productSales[prodId].revenue += itemRev;
      productSales[prodId].count += item.quantity;
    });
  });

  const totalItemRevenue = Object.values(categorySales).reduce((sum, cat) => sum + cat.revenue, 0);

  const topCategories = Object.values(categorySales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 4)
    .map((cat, i) => ({
      name: cat.name,
      percent: totalItemRevenue > 0 ? Math.round((cat.revenue / totalItemRevenue) * 100) : 0,
      color: ["bg-rose", "bg-navy", "bg-gold", "bg-mint"][i % 4],
      icon: ["🎂", "🎁", "☕", "🥐"][i % 4]
    }));

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 ml-64">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-navy">Business Reports</h1>
            <p className="text-navy/40 text-sm">Comprehensive overview of bakery performance.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 rounded-xl bg-navy text-white text-sm font-bold shadow-lg shadow-navy/20 hover:bg-navy/90 transition-all flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              <span>Export CSV</span>
            </button>
          </div>
        </header>

        <div className="p-8 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, trend: "Lifetime", positive: true, icon: "💰" },
              { label: "Completed Orders", value: totalOrders.toString(), trend: "Success", positive: true, icon: "📦" },
              { label: "Average Order Value", value: `₹${aov.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, trend: "Per Order", positive: true, icon: "🧾" },
              { label: "Total Customers", value: totalUsers.toString(), trend: "Registered", positive: true, icon: "👥" },
            ].map((metric, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-xl">
                    {metric.icon}
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-mint/10 text-mint`}>
                    {metric.trend}
                  </span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-1">{metric.label}</p>
                <h3 className="text-2xl font-bold text-navy">{metric.value}</h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Chart */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-serif font-bold text-navy text-lg mb-6">Revenue Over Time (12 Months)</h3>
              <div className="h-64 flex items-end justify-between space-x-2">
                {monthlyRevenue.map((rev, i) => {
                  const height = rev > 0 ? (rev / maxMonthlyRevenue) * 100 : 0;
                  return (
                    <div key={i} className="w-full flex flex-col items-center group">
                      <div className="w-full bg-slate-50 rounded-t-xl relative overflow-hidden h-full flex items-end">
                        <div 
                          className="w-full bg-rose/20 group-hover:bg-rose transition-all duration-300 rounded-t-xl relative group" 
                          style={{ height: `${Math.max(height, 5)}%` }}
                        >
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-navy text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity">
                            ₹{rev.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-navy/30 mt-2">{monthLabels[i]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Categories */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-serif font-bold text-navy text-lg mb-6">Top Categories by Sales</h3>
              <div className="space-y-5">
                {topCategories.length > 0 ? topCategories.map((cat, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                        <span>{cat.icon}</span>
                        <span className="text-sm font-bold text-navy/80">{cat.name}</span>
                      </div>
                      <span className="text-xs font-bold text-navy/40">{cat.percent}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.percent}%` }}></div>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-navy/40">No sales data available yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Top Products */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-serif font-bold text-navy text-lg">Top Performing Products</h3>
            </div>
            {topProducts.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-navy/30">Product</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-navy/30">Category</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-navy/30">Units Sold</th>
                    <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-navy/30">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {topProducts.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-navy text-sm">{item.name}</td>
                      <td className="px-6 py-4 text-xs text-navy/40 font-bold">{item.catName}</td>
                      <td className="px-6 py-4 font-bold text-navy/80 text-sm">{item.count}</td>
                      <td className="px-6 py-4 text-right font-bold text-mint text-sm">₹{item.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center">
                <p className="text-4xl mb-4">🛒</p>
                <p className="text-navy/40">Waiting for your first sale to generate product reports.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
