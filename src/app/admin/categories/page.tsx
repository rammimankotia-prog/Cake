"use client";

import AdminSidebar from "@/components/AdminSidebar";
import { useState, useEffect } from "react";
import { getCategories, deleteCategoryAction, deleteProductAction, updateCategoryNameAction, createCategoryAction, toggleProductActiveAction } from "@/app/actions/categories";

interface Product {
  id: string;
  name: string;
  price: number;
  weight: string;
  badge: string;
  active: boolean;
  stock: number;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  products: Product[];
  visible: boolean;
}

const INITIAL_CATEGORIES: Category[] = [];

const BADGE_COLORS: Record<string, string> = {
  "Best Seller": "bg-rose/10 text-rose",
  "Chef's Special": "bg-gold/10 text-gold",
  "Seasonal": "bg-mint/10 text-mint",
  "New": "bg-blue-50 text-blue-500",
  "Popular": "bg-purple-50 text-purple-500",
};

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [expanded, setExpanded] = useState<string[]>(["1"]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("🍰");
  const [searchQuery, setSearchQuery] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Load from DB on mount
  useEffect(() => {
    setIsClient(true);
    getCategories().then(data => setCategories(data));
  }, []);

  const toggleExpand = (id: string) =>
    setExpanded((prev) => prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]);

  const toggleCategoryVisible = (id: string) =>
    setCategories((cats) => cats.map((c) => c.id === id ? { ...c, visible: !c.visible } : c));

  const toggleProductActive = async (catId: string, prodId: string) => {
    const product = categories.find(c => c.id === catId)?.products.find(p => p.id === prodId);
    if (!product) return;
    setCategories((cats) =>
      cats.map((c) => c.id === catId
        ? { ...c, products: c.products.map((p) => p.id === prodId ? { ...p, active: !p.active } : p) }
        : c
      )
    );
    await toggleProductActiveAction(prodId, !product.active);
  };

  const deleteCategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category and ALL its products?")) return;
    setCategories((cats) => cats.filter((c) => c.id !== id));
    await deleteCategoryAction(id);
  };

  const deleteProduct = async (catId: string, prodId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setCategories((cats) =>
      cats.map((c) => c.id === catId ? { ...c, products: c.products.filter((p) => p.id !== prodId) } : c)
    );
    await deleteProductAction(prodId);
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const saveEdit = async (id: string) => {
    setCategories((cats) => cats.map((c) => c.id === id ? { ...c, name: editName } : c));
    setEditingId(null);
    await updateCategoryNameAction(id, editName);
  };

  const addCategory = async () => {
    if (!newCatName.trim()) return;
    const tempId = Date.now().toString();
    setCategories((cats) => [
      ...cats,
      { id: tempId, name: newCatName, icon: newCatIcon, color: "bg-rose/10 text-rose", visible: true, products: [] },
    ]);
    const name = newCatName;
    setNewCatName("");
    await createCategoryAction(name, newCatIcon);
    const data = await getCategories();
    setCategories(data);
  };

  const moveCategory = (index: number, dir: -1 | 1) => {
    const newCats = [...categories];
    const target = index + dir;
    if (target < 0 || target >= newCats.length) return;
    [newCats[index], newCats[target]] = [newCats[target], newCats[index]];
    setCategories(newCats);
  };

  const totalProducts = categories.reduce((sum, c) => sum + c.products.length, 0);
  const activeProducts = categories.reduce((sum, c) => sum + c.products.filter((p) => p.active).length, 0);

  const filteredCats = searchQuery
    ? categories.map((c) => ({
        ...c,
        products: c.products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())),
      })).filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.products.length > 0)
    : categories;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-navy">Menu Structure</h1>
            <p className="text-navy/40 text-sm">{categories.length} categories · {totalProducts} products · {activeProducts} active</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose/30 w-52"
              />
              <svg className="absolute left-3 top-3 w-4 h-4 text-navy/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={() => setExpanded(categories.map((c) => c.id))}
              className="px-4 py-2.5 rounded-xl bg-navy/5 text-navy text-sm font-bold hover:bg-navy/10 transition-all"
            >
              Expand All
            </button>
            <button
              onClick={() => setExpanded([])}
              className="px-4 py-2.5 rounded-xl bg-navy/5 text-navy text-sm font-bold hover:bg-navy/10 transition-all"
            >
              Collapse All
            </button>
          </div>
        </header>

        <div className="p-8 grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left: Category List */}
          <div className="xl:col-span-3 space-y-4">
            {filteredCats.map((cat, catIndex) => (
              <div
                key={cat.id}
                className={`bg-white rounded-3xl border shadow-sm overflow-hidden transition-all ${cat.visible ? "border-slate-100" : "border-slate-100 opacity-60"}`}
              >
                {/* Category Header */}
                <div className="flex items-center px-6 py-4 gap-4 group">
                  {/* Drag Handle */}
                  <div className="flex flex-col gap-0.5 cursor-grab opacity-30 group-hover:opacity-60 transition-opacity">
                    <div className="flex gap-0.5">{[0,0].map((_,i)=><div key={i} className="w-1 h-1 bg-navy rounded-full"/>)}</div>
                    <div className="flex gap-0.5">{[0,0].map((_,i)=><div key={i} className="w-1 h-1 bg-navy rounded-full"/>)}</div>
                    <div className="flex gap-0.5">{[0,0].map((_,i)=><div key={i} className="w-1 h-1 bg-navy rounded-full"/>)}</div>
                  </div>

                  {/* Reorder */}
                  <div className="flex flex-col gap-1">
                    <button onClick={() => moveCategory(catIndex, -1)} className="text-navy/20 hover:text-navy/60 transition-colors">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"/></svg>
                    </button>
                    <button onClick={() => moveCategory(catIndex, 1)} className="text-navy/20 hover:text-navy/60 transition-colors">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                    </button>
                  </div>

                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0 ${cat.color}`}>
                    {cat.icon}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    {editingId === cat.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          autoFocus
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && saveEdit(cat.id)}
                          className="font-bold text-navy text-lg border-b-2 border-rose focus:outline-none bg-transparent flex-1"
                        />
                        <button onClick={() => saveEdit(cat.id)} className="text-mint font-bold text-sm">Save</button>
                        <button onClick={() => setEditingId(null)} className="text-navy/30 text-sm">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <h3 className="font-bold text-navy text-lg leading-tight">{cat.name}</h3>
                        <span className="text-[10px] text-navy/30 font-bold bg-navy/5 px-2 py-0.5 rounded-full">
                          {cat.products.length} items
                        </span>
                        {!cat.visible && (
                          <span className="text-[10px] text-rose font-bold bg-rose/5 px-2 py-0.5 rounded-full">Hidden</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {/* Visibility Toggle */}
                    <button
                      onClick={() => toggleCategoryVisible(cat.id)}
                      title={cat.visible ? "Hide category" : "Show category"}
                      className={`p-2 rounded-lg transition-colors ${cat.visible ? "text-mint hover:bg-mint/10" : "text-navy/30 hover:bg-navy/5"}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={cat.visible ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"} />
                      </svg>
                    </button>

                    {/* Edit */}
                    <button onClick={() => startEdit(cat)} className="p-2 rounded-lg text-navy/30 hover:text-navy hover:bg-navy/5 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>

                    {/* Delete */}
                    <button onClick={() => deleteCategory(cat.id)} className="p-2 rounded-lg text-navy/20 hover:text-rose hover:bg-rose/5 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>

                    {/* Expand Toggle */}
                    <button
                      onClick={() => toggleExpand(cat.id)}
                      className="p-2 rounded-lg text-navy/30 hover:text-navy hover:bg-navy/5 transition-colors"
                    >
                      <svg
                        className={`w-5 h-5 transition-transform duration-300 ${expanded.includes(cat.id) ? "rotate-180" : ""}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Products Table */}
                {expanded.includes(cat.id) && (
                  <div className="border-t border-slate-50">
                    {cat.products.length === 0 ? (
                      <div className="py-10 text-center text-navy/30 text-sm italic">
                        No products yet. Add one from Inventory Flow.
                      </div>
                    ) : (
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-50/70">
                            <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-navy/30">Product</th>
                            <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-navy/30">Weight</th>
                            <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-navy/30">Price</th>
                            <th className="px-6 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-navy/30">Stock</th>
                            <th className="px-6 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-navy/30">Status</th>
                            <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-navy/30">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {cat.products.map((product) => (
                            <tr key={product.id} className={`hover:bg-slate-50/50 transition-colors ${!product.active ? "opacity-50" : ""}`}>
                              <td className="px-6 py-3.5">
                                <div className="flex items-center space-x-3">
                                  <span className="font-semibold text-navy text-sm">{product.name}</span>
                                  {product.badge && (
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${BADGE_COLORS[product.badge] || "bg-slate-100 text-slate-500"}`}>
                                      {product.badge}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-3.5 text-navy/40 text-sm">{product.weight}</td>
                              <td className="px-6 py-3.5 font-bold text-navy text-sm">₹{product.price.toLocaleString()}</td>
                              <td className="px-6 py-3.5 text-center">
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                  product.stock === 0 ? "bg-red-50 text-red-400" :
                                  product.stock <= 5 ? "bg-gold/10 text-gold" :
                                  "bg-mint/10 text-mint"
                                }`}>
                                  {product.stock === 0 ? "Out of Stock" : `${product.stock} left`}
                                </span>
                              </td>
                              <td className="px-6 py-3.5 text-center">
                                <button
                                  onClick={() => toggleProductActive(cat.id, product.id)}
                                  className={`relative inline-flex h-5 w-9 rounded-full transition-colors duration-300 focus:outline-none ${product.active ? "bg-mint" : "bg-slate-200"}`}
                                >
                                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${product.active ? "translate-x-4" : ""}`} />
                                </button>
                              </td>
                              <td className="px-6 py-3.5 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <button 
                                    onClick={() => alert("Product editing is coming soon to the Inventory Flow.")}
                                    className="p-1.5 rounded-lg text-navy/30 hover:text-navy hover:bg-navy/5 transition-colors">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => deleteProduct(cat.id, product.id)}
                                    className="p-1.5 rounded-lg text-navy/20 hover:text-rose hover:bg-rose/5 transition-colors"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {/* Add product to category quick-link */}
                    <div className="px-6 py-3 border-t border-slate-50">
                      <a href="/admin/inventory" className="text-xs font-bold text-rose hover:underline flex items-center space-x-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Add product to {cat.name}</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right: Add Category + Stats */}
          <div className="xl:col-span-1 space-y-5">
            {/* Add Category Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sticky top-28">
              <h3 className="font-serif font-bold text-navy text-lg mb-5">New Category</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-navy/30 block mb-2">Icon</label>
                  <div className="flex flex-wrap gap-2">
                    {["🎂","☕","🥐","🎁","🍰","🧁","🍫","🫐"].map((ico) => (
                      <button
                        key={ico}
                        onClick={() => setNewCatIcon(ico)}
                        className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${newCatIcon === ico ? "bg-rose/10 ring-2 ring-rose" : "bg-slate-50 hover:bg-slate-100"}`}
                      >
                        {ico}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-navy/30 block mb-2">Category Name</label>
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCategory()}
                    placeholder="e.g. Vegan Delights"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose transition-colors"
                  />
                </div>
                <button
                  onClick={addCategory}
                  className="w-full bg-rose text-white py-3 rounded-xl font-bold text-sm hover:bg-rose/90 transition-all shadow-sm shadow-rose/20 active:scale-95"
                >
                  + Create Category
                </button>
              </div>

              {/* Stats Summary */}
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-navy/30">Menu Stats</h4>
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">{cat.icon}</span>
                      <span className="text-navy/60 text-xs font-semibold truncate max-w-[110px]">{cat.name}</span>
                    </div>
                    <span className="text-xs font-bold text-navy/30">{cat.products.length}</span>
                  </div>
                ))}
                <div className="border-t border-slate-100 pt-3 flex justify-between">
                  <span className="text-xs font-bold text-navy/40">Total Active</span>
                  <span className="text-xs font-bold text-mint">{activeProducts}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
