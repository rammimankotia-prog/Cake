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
                <span className="text-2xl font-serif font-bold text-navy tracking-tight group-hover:text-rose transition-colors leading-none">
                  Delish <span className="text-rose group-hover:text-navy transition-colors">Mama</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-navy/40 font-bold mt-1">
                  Cake Studio & Cafe
                </span>
              </div>
            </Link>
            
            <div className="hidden md:flex space-x-8 items-center">
              <div className="flex items-center space-x-4">
                <a href="tel:+917661900009" className="flex items-center space-x-2 text-navy/60 font-bold text-xs hover:text-navy transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <span>076619 00009</span>
                </a>
                <a href="https://wa.me/917661900009" target="_blank" className="flex items-center space-x-1.5 bg-mint/10 text-mint px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-mint hover:text-white transition-all">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>WhatsApp</span>
                </a>
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
