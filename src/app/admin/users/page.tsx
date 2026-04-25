"use client";

import AdminSidebar from "@/components/AdminSidebar";
import { useState, useEffect } from "react";

const MODULES = [
  { id: "dashboard", label: "Dashboard", icon: "⬡" },
  { id: "orders", label: "Orders", icon: "📦" },
  { id: "inventory", label: "Inventory", icon: "🧁" },
  { id: "menu", label: "Menu Structure", icon: "🗂️" },
  { id: "marketing", label: "Marketing", icon: "🎯" },
  { id: "settings", label: "Shop Controls", icon: "⚙️" },
  { id: "reports", label: "Reports", icon: "📊" },
  { id: "users", label: "Users & Roles", icon: "👥" },
];

const INITIAL_USERS = [
  { id: "1", name: "Super Admin", email: "super@delishmama.in", role: "SUPERADMIN", permissions: ["*"], active: true },
  { id: "2", name: "Staff User", email: "staff@delishmama.in", role: "STAFF", permissions: ["dashboard", "orders", "inventory", "reports"], active: true },
  { id: "3", name: "Marketing Head", email: "marketing@delishmama.in", role: "ADMIN", permissions: ["dashboard", "marketing", "reports"], active: true },
];

export default function AdminUsers() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("bakery_users");
    if (saved) {
      try { setUsers(JSON.parse(saved)); } catch(e) {}
    } else {
      localStorage.setItem("bakery_users", JSON.stringify(INITIAL_USERS));
    }

    const savedUser = localStorage.getItem("bakery_admin_user");
    if (savedUser) {
      try { setCurrentUser(JSON.parse(savedUser)); } catch(e) {}
    } else {
      setCurrentUser(INITIAL_USERS[0]);
    }
  }, []);

  const saveUsers = (newUsers: any[]) => {
    setUsers(newUsers);
    localStorage.setItem("bakery_users", JSON.stringify(newUsers));
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser.id) {
      saveUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    } else {
      saveUsers([...users, { ...editingUser, id: Date.now().toString(), active: true }]);
    }
    setIsModalOpen(false);
  };

  const togglePermission = (modId: string) => {
    if (editingUser.permissions.includes("*")) return; // Super admin has all

    setEditingUser((prev: any) => {
      const newPerms = prev.permissions.includes(modId) 
        ? prev.permissions.filter((p: string) => p !== modId)
        : [...prev.permissions, modId];
      return { ...prev, permissions: newPerms };
    });
  };

  const isSuperAdmin = currentUser?.role === "SUPERADMIN";

  if (!currentUser) return null;

  if (!isSuperAdmin && !currentUser.permissions.includes("users")) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <AdminSidebar />
        <main className="flex-1 ml-64 p-12 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-rose/10 text-rose rounded-full flex items-center justify-center mx-auto text-3xl">🔒</div>
            <h1 className="text-2xl font-serif font-bold text-navy">Access Denied</h1>
            <p className="text-navy/50">You do not have permission to view the Users module.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      
      <main className="flex-1 ml-64 relative">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-navy">User Management</h1>
            <p className="text-navy/40 text-sm">Control who has access to which modules.</p>
          </div>
          {isSuperAdmin && (
            <button 
              onClick={() => {
                setEditingUser({ name: "", email: "", role: "STAFF", permissions: ["dashboard"] });
                setIsModalOpen(true);
              }}
              className="bg-rose text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-rose/20 hover:bg-rose/90 transition-colors"
            >
              + Add New User
            </button>
          )}
        </header>

        <div className="p-8">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-navy/30">User</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-navy/30">Role</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-navy/30">Module Access</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-navy/30">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-navy/5 text-navy flex items-center justify-center font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-navy text-sm">{user.name}</p>
                          <p className="text-xs text-navy/40">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                        user.role === "SUPERADMIN" ? "bg-mint/10 text-mint" :
                        user.role === "ADMIN" ? "bg-purple-50 text-purple-600" :
                        "bg-slate-100 text-slate-500"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {user.permissions.includes("*") ? (
                          <span className="text-xs font-bold text-mint bg-mint/10 px-2 py-0.5 rounded">All Modules</span>
                        ) : (
                          user.permissions.map((p: string) => {
                            const mod = MODULES.find(m => m.id === p);
                            return mod ? (
                              <span key={p} className="text-[10px] font-bold text-navy/60 bg-navy/5 px-2 py-1 rounded" title={mod.label}>
                                {mod.icon} {mod.label}
                              </span>
                            ) : null;
                          })
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isSuperAdmin && (
                        <button 
                          onClick={() => {
                            setEditingUser({ ...user });
                            setIsModalOpen(true);
                          }}
                          className="text-sm font-bold text-rose hover:underline"
                        >
                          Edit Permissions
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        {isModalOpen && editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/20 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-serif font-bold text-navy">
                  {editingUser.id ? "Edit User Permissions" : "Create New User"}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-navy/30 hover:text-navy">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleSaveUser} className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">Name</label>
                    <input 
                      type="text" required
                      value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">Email</label>
                    <input 
                      type="email" required
                      value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">Role Level</label>
                  <select 
                    value={editingUser.role} 
                    onChange={e => {
                      const role = e.target.value;
                      setEditingUser({
                        ...editingUser, 
                        role, 
                        permissions: role === "SUPERADMIN" ? ["*"] : editingUser.permissions.filter((p:string) => p !== "*")
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose"
                  >
                    <option value="STAFF">Staff (Limited Access)</option>
                    <option value="ADMIN">Admin (Manager Access)</option>
                    <option value="SUPERADMIN">Super Admin (Full Access)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-3">Module Permissions</label>
                  {editingUser.role === "SUPERADMIN" ? (
                    <div className="bg-mint/10 border border-mint/20 rounded-xl p-4 flex items-center space-x-3">
                      <span className="text-mint text-xl">🌟</span>
                      <div>
                        <p className="text-mint font-bold text-sm">Super Admin Access</p>
                        <p className="text-mint/60 text-xs">This user automatically has access to all current and future modules.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {MODULES.map((mod) => (
                        <label key={mod.id} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                          editingUser.permissions.includes(mod.id) ? 'bg-rose/5 border-rose text-rose shadow-sm' : 'bg-slate-50 border-slate-200 text-navy/50 hover:bg-slate-100'
                        }`}>
                          <input 
                            type="checkbox" className="hidden"
                            checked={editingUser.permissions.includes(mod.id)}
                            onChange={() => togglePermission(mod.id)}
                          />
                          <span className="mr-3 text-lg">{mod.icon}</span>
                          <span className="text-sm font-bold">{mod.label}</span>
                          {editingUser.permissions.includes(mod.id) && (
                            <svg className="w-4 h-4 ml-auto text-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          )}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-navy/50 hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-rose text-white shadow-lg shadow-rose/20 hover:bg-rose/90 transition-colors">
                    Save Permissions
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
