"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getShopStatus } from "@/lib/shop-status";

const navItems = [
  { href: "/admin", icon: "⬡", label: "Dashboard", exact: true, module: "dashboard" },
  { href: "/admin/orders", icon: "📦", label: "Orders", module: "orders" },
  { href: "/admin/inventory", icon: "🧁", label: "Inventory", module: "inventory" },
  { href: "/admin/categories", icon: "🗂️", label: "Menu Structure", module: "menu" },
  { href: "/admin/marketing", icon: "🎯", label: "Marketing", module: "marketing" },
  { href: "/admin/settings", icon: "⚙️", label: "Shop Controls", module: "settings" },
  { href: "/admin/reports", icon: "📊", label: "Reports", module: "reports" },
  { href: "/admin/users", icon: "👥", label: "Users & Roles", module: "users" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isStudioOpen, setIsStudioOpen] = useState<boolean | null>(null);
  const [user, setUser] = useState<{ role: string, permissions: string[], name: string, email: string }>({
    role: "SUPERADMIN",
    permissions: ["*"], // "*" means all
    name: "Super Admin",
    email: "super@delishmama.in"
  });

  const refreshStatus = () => {
    try {
      const saved = localStorage.getItem("bakery_settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.isShopOpen === false) {
          setIsStudioOpen(false);
          return;
        }
      }
    } catch { /* ignore */ }
    setIsStudioOpen(getShopStatus().isOpen);
  };

  useEffect(() => {
    refreshStatus();
    window.addEventListener("bakery-settings-updated", refreshStatus);
    
    // Check if we have a mocked user in local storage to test roles
    const savedUser = localStorage.getItem("bakery_admin_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch(e) {}
    }

    return () => window.removeEventListener("bakery-settings-updated", refreshStatus);
  }, []);

  const switchRole = () => {
    const isSuper = user.role === "SUPERADMIN";
    const newUser = isSuper ? {
      role: "STAFF",
      permissions: ["orders", "inventory", "reports"],
      name: "Staff User",
      email: "staff@delishmama.in"
    } : {
      role: "SUPERADMIN",
      permissions: ["*"],
      name: "Super Admin",
      email: "super@delishmama.in"
    };
    setUser(newUser);
    localStorage.setItem("bakery_admin_user", JSON.stringify(newUser));
    window.location.href = "/admin"; // Force reload to apply permissions cleanly
  };

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const canAccess = (module: string) => {
    return user.permissions.includes("*") || user.permissions.includes(module);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-navy flex flex-col z-50 shadow-2xl">
      {/* Brand */}
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="block">
          <p className="text-2xl font-serif font-bold text-white">
            Delish <span className="text-rose">Mama</span>
          </p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mt-0.5">Admin Panel</p>
        </Link>
      </div>

      {/* Shop Status */}
      <div className="mx-4 my-4 rounded-2xl p-3 flex items-center space-x-3 bg-white/5">
        {isStudioOpen === null ? (
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-white/20" />
        ) : (
          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isStudioOpen ? "bg-mint animate-pulse" : "bg-rose"}`} />
        )}
        <div>
          <p className="text-white text-xs font-bold">
            {isStudioOpen === null ? "Checking…" : isStudioOpen ? "Studio is Open" : "Studio Closed"}
          </p>
          <p className="text-white/30 text-[10px]">9 AM – 1 AM</p>
        </div>
        <Link href="/admin/settings" className="ml-auto text-white/30 hover:text-white transition-colors text-xs">Edit</Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-2 custom-scrollbar">
        {navItems.filter(item => canAccess(item.module)).map(({ href, icon, label, exact }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${
              isActive(href, exact)
                ? "bg-rose text-white shadow-lg shadow-rose/20"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="text-base w-5 text-center">{icon}</span>
            <span className="font-semibold text-sm">{label}</span>
            {isActive(href, exact) && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5 space-y-1">
        <Link
          href="/"
          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          <span className="text-base">🏪</span>
          <span className="text-sm font-semibold">View Storefront</span>
        </Link>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-rose/60 hover:text-rose hover:bg-rose/5 transition-all"
        >
          <span className="text-base">Logout</span>
          <span className="text-sm font-semibold">Sign Out</span>
        </button>

        <button 
          onClick={switchRole}
          className="w-full mt-3 flex items-center space-x-3 px-4 py-2 hover:bg-white/5 rounded-xl transition-colors text-left"
        >
          <div className="w-8 h-8 bg-rose rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-white text-xs font-bold flex items-center space-x-2">
              <span className="truncate">{user.name}</span>
              {user.role === "SUPERADMIN" && <span className="bg-mint/20 text-mint text-[9px] px-1.5 py-0.5 rounded uppercase">Super</span>}
            </p>
            <p className="text-white/30 text-[10px] truncate">{user.email}</p>
          </div>
          <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
        </button>
      </div>
    </aside>
  );
}
