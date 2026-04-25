"use client";

import AdminSidebar from "@/components/AdminSidebar";
import { useState, useEffect } from "react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    openTime: "09:00",
    closeTime: "01:00",
    servicedPincodes: "110033, 110009, 110007",
    globalDiscount: 0,
    isShopOpen: true,
    shoppingCartEnabled: true,
    chatbotActive: true,
  });

  const [saveStatus, setSaveStatus] = useState<null | 'saved'>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bakery_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('bakery_settings', JSON.stringify(settings));
    // Notify all components (Sidebar, Navbar, Chatbot) that settings changed
    window.dispatchEvent(new CustomEvent('bakery-settings-updated'));
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 ml-64">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 py-4">
          <h1 className="text-2xl font-serif font-bold text-navy">Shop Controls</h1>
          <p className="text-navy/40 text-sm">Manage delivery zones, operating hours, and storefront features.</p>
        </header>
        <div className="p-8 max-w-3xl space-y-8">
          
          {/* AI Assistant Controls */}
          <div className="glass p-8 rounded-3xl bg-white border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mint to-rose"></div>
            <h3 className="text-xl font-serif text-navy mb-6 flex items-center">
              <span className="w-8 h-8 bg-mint/10 text-mint rounded-lg flex items-center justify-center mr-3 text-sm">🤖</span>
              Smart AI Assistant
            </h3>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <h4 className="font-bold text-navy text-sm">Active AI Chatbot</h4>
                <p className="text-xs text-navy/40 mt-1">When enabled, the floating AI assistant will be visible to all visitors for lead generation and inquiries.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-6">
                <input 
                  type="checkbox" 
                  checked={settings.chatbotActive} 
                  onChange={(e) => setSettings({...settings, chatbotActive: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-mint shadow-inner"></div>
              </label>
            </div>
          </div>

          {/* Storefront Features */}
          <div className="glass p-8 rounded-3xl bg-white border border-slate-100 shadow-sm relative overflow-hidden">
            <h3 className="text-xl font-serif text-navy mb-6 flex items-center">
              <span className="w-8 h-8 bg-mint/10 text-mint rounded-lg flex items-center justify-center mr-3 text-sm">🛒</span>
              Storefront Features
            </h3>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <h4 className="font-bold text-navy text-sm">Shopping Cart Functionality</h4>
                <p className="text-xs text-navy/40 mt-1">When disabled, customers can view the menu but cannot add items to cart or checkout. Use this to put the shop in "Catalogue Mode".</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-6">
                <input 
                  type="checkbox" 
                  checked={settings.shoppingCartEnabled} 
                  onChange={(e) => setSettings({...settings, shoppingCartEnabled: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-mint shadow-inner"></div>
              </label>
            </div>
          </div>

          {/* Shop Hours */}
          <div className="glass p-8 rounded-3xl">
            <h3 className="text-xl font-serif text-navy mb-6 flex items-center">
              <span className="w-8 h-8 bg-rose/10 text-rose rounded-lg flex items-center justify-center mr-3 text-sm">⏰</span>
              Operating Hours
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-navy/40 uppercase tracking-widest mb-2">Opening Time</label>
                <input 
                  type="time" 
                  value={settings.openTime}
                  onChange={(e) => setSettings({...settings, openTime: e.target.value})}
                  className="w-full bg-white/50 border border-navy/10 rounded-xl px-4 py-3 focus:outline-none focus:border-rose"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy/40 uppercase tracking-widest mb-2">Closing Time</label>
                <input 
                  type="time" 
                  value={settings.closeTime}
                  onChange={(e) => setSettings({...settings, closeTime: e.target.value})}
                  className="w-full bg-white/50 border border-navy/10 rounded-xl px-4 py-3 focus:outline-none focus:border-rose"
                />
              </div>
            </div>
            <p className="text-[10px] text-navy/40 mt-4 italic">* Note: Shop is currently serving late nights until 1:00 AM.</p>
          </div>

          {/* Delivery Perimeter */}
          <div className="glass p-8 rounded-3xl">
            <h3 className="text-xl font-serif text-navy mb-6 flex items-center">
              <span className="w-8 h-8 bg-gold/10 text-gold rounded-lg flex items-center justify-center mr-3 text-sm">📍</span>
              Delivery Perimeter
            </h3>
            <div>
              <label className="block text-xs font-bold text-navy/40 uppercase tracking-widest mb-2">Serviced Pincodes (Comma Separated)</label>
              <textarea 
                value={settings.servicedPincodes}
                onChange={(e) => setSettings({...settings, servicedPincodes: e.target.value})}
                className="w-full bg-white/50 border border-navy/10 rounded-xl px-4 py-3 focus:outline-none focus:border-rose font-mono text-sm"
                rows={3}
                placeholder="110033, 110009, 110007..."
              />
              <p className="text-[10px] text-navy/40 mt-2">Customers outside these zones will be restricted from checkout.</p>
            </div>
          </div>

          {/* Global Promotions */}
          <div className="glass p-8 rounded-3xl">
            <h3 className="text-xl font-serif text-navy mb-6 flex items-center">
              <span className="w-8 h-8 bg-rose/10 text-rose rounded-lg flex items-center justify-center mr-3 text-sm">🏷️</span>
              Global Operations Override
            </h3>
            <div className="flex items-center space-x-6">
              <div className="flex-1">
                <label className="block text-xs font-bold text-navy/40 uppercase tracking-widest mb-2">Festive Discount (%)</label>
                <input 
                  type="number" 
                  value={settings.globalDiscount}
                  onChange={(e) => setSettings({...settings, globalDiscount: parseInt(e.target.value)})}
                  className="w-full bg-white/50 border border-navy/10 rounded-xl px-4 py-3 focus:outline-none focus:border-rose"
                  min="0"
                  max="100"
                />
              </div>
              <div className="flex items-center space-x-3 mt-6 p-3 bg-rose/5 rounded-xl border border-rose/10">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.isShopOpen} 
                    onChange={(e) => setSettings({...settings, isShopOpen: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose"></div>
                </label>
                <div>
                  <div className="text-sm font-bold text-navy">Master Switch</div>
                  <div className="text-[10px] text-navy/40 font-bold uppercase tracking-widest">{settings.isShopOpen ? 'Shop is OPEN' : 'Shop is CLOSED'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pb-12">
            <button
              onClick={handleSave}
              className={`px-12 py-4 rounded-xl font-bold transition-all shadow-xl text-white ${
                saveStatus === "saved" ? "bg-mint hover:bg-mint/90" : "bg-navy hover:bg-navy/90"
              }`}
            >
              {saveStatus === "saved" ? "✓ Changes Saved" : "Save All Settings"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
