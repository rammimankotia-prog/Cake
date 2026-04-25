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
            <Link href="/" className="flex flex-col group">
              <span className="text-2xl font-serif font-bold text-navy tracking-tight group-hover:text-rose transition-colors">
                Delish <span className="text-rose group-hover:text-navy transition-colors">Mama</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-navy/40 -mt-1 font-bold">
                Cake Studio & Cafe
              </span>
            </Link>
            
            <div className="hidden md:flex space-x-8 items-center">
              <div className="flex items-center space-x-2 text-navy/60 font-bold text-xs">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span>076619 00009</span>
              </div>
              <Link href="/catalog" className="text-navy/80 hover:text-navy font-medium transition-colors">Catalog</Link>
              <Link href="/about" className="text-navy/80 hover:text-navy font-medium transition-colors">About</Link>
              <Link href="/contact" className="text-navy/80 hover:text-navy font-medium transition-colors">Contact</Link>
              <Link href="/admin" className="text-navy/80 hover:text-navy font-medium transition-colors">Admin</Link>
              
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-espresso/80 hover:text-espresso transition-colors"
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
              <button onClick={() => setIsCartOpen(true)} className="relative p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartItemsCount > 0 && (
                  <span className="absolute top-0 right-0 bg-rose text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartItemsCount}
                  </span>
                )}
              </button>
              <button onClick={() => setIsOpen(!isOpen)} className="text-espresso p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
