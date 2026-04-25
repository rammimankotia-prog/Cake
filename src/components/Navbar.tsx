"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import CartSheet from "./CartSheet";
import { getShopStatus } from "@/lib/shop-status";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart } = useCart();
  const shopStatus = getShopStatus();

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      {!shopStatus.isOpen && (
        <div className="fixed top-0 w-full z-[60] bg-rose text-white text-[10px] py-1.5 font-bold uppercase tracking-[0.2em] text-center shadow-lg">
          {shopStatus.message}
        </div>
      )}
      <nav className={`fixed w-full z-50 glass border-b border-glass-border ${!shopStatus.isOpen ? 'mt-7' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-14 h-14 rounded-full border-2 border-rose flex items-center justify-center bg-white p-1 overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-500">
                  <img 
                    src="/logo.png" 
                    alt="Delish Mama Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-rose text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                  2024
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-serif font-bold text-text-high tracking-tight group-hover:text-rose transition-colors leading-none">
                  Delish <span className="text-rose group-hover:text-text-high transition-colors">Mama</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-text-low font-bold mt-1">
                  Cake Studio & Cafe
                </span>
              </div>
            </Link>
            
            <div className="hidden md:flex space-x-8 items-center">
              <Link href="/catalog" className="text-text-mid hover:text-text-high font-medium transition-colors">Catalog</Link>
              <Link href="/about" className="text-text-mid hover:text-text-high font-medium transition-colors">About</Link>
              <Link href="/contact" className="text-text-mid hover:text-text-high font-medium transition-colors">Contact</Link>
              <Link href="/admin" className="text-text-mid hover:text-text-high font-medium transition-colors">Admin</Link>
              
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-text-high/80 hover:text-text-high transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartItemsCount > 0 && (
                  <span className="absolute top-0 right-0 bg-rose text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              <Link href="/login" className="bg-rose text-white px-6 py-2.5 rounded-full font-semibold hover:bg-rose/90 transition-all shadow-sm">
                Sign In
              </Link>
            </div>

            <div className="md:hidden flex items-center space-x-4">
              <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-text-high">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartItemsCount > 0 && (
                  <span className="absolute top-0 right-0 bg-rose text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartItemsCount}
                  </span>
                )}
              </button>
              <button onClick={() => setIsOpen(!isOpen)} className="text-text-high p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 bg-surface-low border-b border-text-high/5 shadow-xl' : 'max-h-0'}`}>
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link href="/catalog" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-lg font-serif font-bold text-text-high hover:bg-rose/10 hover:text-rose transition-all">Catalog</Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-lg font-serif font-bold text-text-high hover:bg-rose/10 hover:text-rose transition-all">About Our Story</Link>
            <Link href="/contact" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-lg font-serif font-bold text-text-high hover:bg-rose/10 hover:text-rose transition-all">Contact Us</Link>
            <Link href="/admin" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-lg font-serif font-bold text-text-high hover:bg-rose/10 hover:text-rose transition-all">Admin Dashboard</Link>
            <div className="pt-4 border-t border-text-high/5">
              <Link href="/login" onClick={() => setIsOpen(false)} className="w-full bg-rose text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2">
                <span>Sign In / Register</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
