"use client";

import AdminSidebar from "@/components/AdminSidebar";
import { useState, useRef, useEffect } from "react";

export default function AdminInventory() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [product, setProduct] = useState({
    name: "",
    category: "Cakes",
    description: "",
    basePrice: 0,
    discountPct: 0,
    weights: ["500g", "1kg"],
    variantPrices: { "500g": 0, "1kg": 0 } as Record<string, number>
  });

  // Sync initial variant prices with base price if they are 0
  useEffect(() => {
    if (product.basePrice > 0) {
      setProduct(prev => {
        const newVariantPrices = { ...prev.variantPrices };
        let updated = false;
        prev.weights.forEach(w => {
          if (!newVariantPrices[w] || newVariantPrices[w] === 0) {
            newVariantPrices[w] = prev.basePrice;
            updated = true;
          }
        });
        return updated ? { ...prev, variantPrices: newVariantPrices } : prev;
      });
    }
  }, [product.basePrice, product.weights]);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<null | 'idle' | 'saving' | 'success' | 'draft'>('idle');
  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleWeight = (weight: string) => {
    setProduct(prev => {
      const isSelected = prev.weights.includes(weight);
      const newWeights = isSelected
        ? prev.weights.filter(w => w !== weight)
        : [...prev.weights, weight];
      
      const newVariantPrices = { ...prev.variantPrices };
      if (!isSelected && (!newVariantPrices[weight] || newVariantPrices[weight] === 0)) {
        // Automatically assign base price to newly selected weight
        newVariantPrices[weight] = prev.basePrice;
      }

      return { ...prev, weights: newWeights, variantPrices: newVariantPrices };
    });
  };

  const updateVariantPrice = (weight: string, price: number) => {
    setProduct(prev => ({
      ...prev,
      variantPrices: {
        ...prev.variantPrices,
        [weight]: price
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Saving Product:", { ...product, image: imagePreview });
    
    // Save to database via server action
    try {
      const { createProduct } = await import('@/app/actions/inventory');
      await createProduct({ ...product, imagePreview });
    } catch (err) {
      console.error("Failed to save to database", err);
    }

    setStatus('success');
    
    setTimeout(() => {
      setStatus('idle');
      setProduct({
        name: "",
        category: "Cakes",
        description: "",
        basePrice: 0,
        discountPct: 0,
        weights: ["500g", "1kg"],
        variantPrices: { "500g": 0, "1kg": 0 }
      });
      setImagePreview(null);
    }, 3000);
  };

  const handleSaveDraft = async () => {
    setStatus('saving');
    await new Promise(resolve => setTimeout(resolve, 1000));
    localStorage.setItem('inventory_draft', JSON.stringify({ ...product, imagePreview }));
    setStatus('draft');
    setTimeout(() => setStatus('idle'), 3000);
  };

  const finalPrice = product.basePrice - (product.basePrice * (product.discountPct / 100));

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 ml-64">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-navy">Inventory Flow</h1>
            <p className="text-navy/40 text-sm">Add new studio masterpieces to your online menu.</p>
          </div>
          <div className="flex items-center space-x-3">
            {status === 'draft' && <span className="text-xs font-bold text-navy/40 animate-pulse">Draft Saved</span>}
            <span className="text-[10px] font-bold uppercase tracking-widest text-navy/30 bg-navy/5 px-3 py-2 rounded-xl">Admin Showcase</span>
          </div>
        </header>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="glass p-8 rounded-3xl space-y-6 bg-white border border-slate-100 shadow-sm">
                <div>
                  <label className="block text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">Product Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-rose transition-colors"
                    placeholder="e.g., Belgian Chocolate Truffle"
                    value={product.name}
                    onChange={(e) => setProduct({...product, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">Description</label>
                  <textarea 
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-rose transition-colors"
                    rows={4}
                    placeholder="Describe the flavor profile, ingredients, and texture..."
                    value={product.description}
                    onChange={(e) => setProduct({...product, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">Category</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-rose transition-colors"
                      value={product.category}
                      onChange={(e) => setProduct({...product, category: e.target.value})}
                    >
                      <option>Cakes</option>
                      <option>Pastries & Sweets</option>
                      <option>Cookies</option>
                      <option>Delight Boxes</option>
                      <option>Cafe Fusion</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">Base Price (Starting From)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-navy/40 font-bold">₹</span>
                      <input 
                        type="number" 
                        required
                        min="0"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:border-rose transition-colors font-bold text-navy"
                        value={product.basePrice || ""}
                        onChange={(e) => setProduct({...product, basePrice: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Variant & Pricing Configuration</h3>
                  <span className="text-[10px] text-navy/30">Select sizes and assign prices</span>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  {["Per Piece", "Box of 6", "250g", "500g", "1kg", "1.5kg", "2kg"].map(weight => (
                    <label key={weight} className="flex items-center space-x-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="hidden peer"
                        checked={product.weights.includes(weight)}
                        onChange={() => toggleWeight(weight)}
                      />
                      <div className={`px-5 py-2.5 rounded-xl border transition-all text-sm font-bold ${
                        product.weights.includes(weight) 
                          ? 'bg-rose text-white border-rose shadow-md shadow-rose/20' 
                          : 'bg-slate-50 border-slate-200 text-navy/50 hover:border-rose/50 hover:text-rose'
                      }`}>
                        {weight}
                      </div>
                    </label>
                  ))}
                </div>

                {/* Variant Pricing Table */}
                {product.weights.length > 0 && (
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-2 gap-4 p-4 border-b border-slate-100 bg-slate-100/50">
                      <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Active Variant</div>
                      <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Specific Price (₹)</div>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {product.weights.map(weight => {
                        const variantPrice = product.variantPrices[weight] || 0;
                        const discountedVariant = variantPrice - (variantPrice * (product.discountPct / 100));
                        
                        return (
                          <div key={weight} className="grid grid-cols-2 gap-4 p-4 items-center hover:bg-white transition-colors">
                            <div className="font-bold text-navy flex items-center space-x-2">
                              <span className="w-2 h-2 rounded-full bg-rose"></span>
                              <span>{weight}</span>
                            </div>
                            <div className="relative flex items-center space-x-3">
                              <div className="relative flex-1">
                                <span className="absolute left-3 top-2.5 text-navy/40 font-bold text-sm">₹</span>
                                <input 
                                  type="number" 
                                  min="0"
                                  className="w-full bg-white border border-slate-200 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:border-rose transition-colors font-bold text-navy"
                                  value={product.variantPrices[weight] || ""}
                                  onChange={(e) => updateVariantPrice(weight, parseFloat(e.target.value) || 0)}
                                />
                              </div>
                              {product.discountPct > 0 && (
                                <div className="text-right w-20">
                                  <div className="text-[9px] text-mint font-bold uppercase tracking-widest">After {product.discountPct}%</div>
                                  <div className="text-sm font-bold text-navy">₹{discountedVariant.toFixed(0)}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Actions */}
            <div className="space-y-8">
              <div className="glass p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-[10px] font-bold text-navy/40 uppercase tracking-widest">Product Image</label>
                  {imagePreview && (
                    <button type="button" onClick={() => setImagePreview(null)} className="text-[10px] text-rose font-bold hover:underline">
                      Remove
                    </button>
                  )}
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/png, image/jpeg, image/webp" 
                  className="hidden" 
                />

                <div 
                  onClick={() => !imagePreview && fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center text-center p-2 transition-all relative overflow-hidden ${
                    imagePreview 
                      ? 'border-transparent' 
                      : isDragging 
                        ? 'border-rose bg-rose/5 cursor-copy' 
                        : 'border-slate-200 bg-slate-50 hover:border-rose/50 hover:bg-rose/5 cursor-pointer group'
                  }`}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-white shadow-sm text-navy/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:text-rose transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      </div>
                      <p className="text-xs font-bold text-navy/60">Drop image here</p>
                      <p className="text-[10px] text-navy/30 mt-1">or click to browse files</p>
                      <p className="text-[9px] text-navy/20 mt-3 bg-white px-2 py-1 rounded border border-slate-100">JPG, PNG up to 5MB</p>
                    </>
                  )}
                </div>
              </div>

              <div className="glass p-8 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[10px] font-bold text-navy/40 uppercase tracking-widest">Global Discount (%)</label>
                    {product.discountPct > 0 && (
                      <span className="text-[10px] text-mint font-bold bg-mint/10 px-2 py-0.5 rounded">Active</span>
                    )}
                  </div>
                  <input 
                    type="number" 
                    min="0"
                    max="100"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-rose transition-colors"
                    value={product.discountPct || ""}
                    onChange={(e) => setProduct({...product, discountPct: parseInt(e.target.value) || 0})}
                  />
                  <p className="text-[9px] text-navy/30 mt-2">This discount applies automatically to all active variants.</p>
                </div>
                
                <div className="pt-2 space-y-3">
                  <button 
                    type="submit"
                    disabled={status === 'saving'}
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-xl transition-all flex items-center justify-center space-x-2 ${
                      status === 'success' 
                        ? 'bg-mint hover:bg-mint/90 shadow-mint/20' 
                        : status === 'saving'
                          ? 'bg-rose/70 cursor-wait'
                          : 'bg-rose hover:bg-rose/90 shadow-rose/20 active:scale-[0.98]'
                    }`}
                  >
                    {status === 'saving' ? (
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : status === 'success' ? (
                      <span>✓ Added to Menu</span>
                    ) : (
                      <span>Publish Product</span>
                    )}
                  </button>
                  <button 
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={status === 'saving'}
                    className="w-full bg-slate-50 border border-slate-200 text-navy/60 py-4 rounded-xl font-bold hover:bg-slate-100 hover:text-navy transition-all active:scale-[0.98]"
                  >
                    Save as Draft
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
