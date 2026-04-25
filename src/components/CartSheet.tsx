"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSheet({ isOpen, onClose }: CartSheetProps) {
  const { cart, removeFromCart, total } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-espresso/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
        <div className="p-6 border-b border-glass-border flex justify-between items-center bg-cream">
          <h2 className="text-2xl font-serif font-bold text-espresso">Your Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-espresso/5 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="text-6xl text-oat">🛒</div>
              <p className="text-espresso/40 font-medium">Your cart is empty.</p>
              <Link href="/catalog" onClick={onClose} className="text-rose font-bold border-b-2 border-rose">
                Start Shopping
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex space-x-4 items-center">
                <div className="flex-1">
                  <h4 className="font-bold text-espresso">{item.name}</h4>
                  {item.variantName && <p className="text-xs text-espresso/50 uppercase tracking-widest">{item.variantName}</p>}
                  <p className="text-sm text-espresso/60 mt-1">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-espresso">${(item.price * item.quantity).toFixed(2)}</p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-rose font-bold hover:underline mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 bg-cream border-t border-glass-border space-y-4">
            <div className="flex justify-between items-center text-lg font-bold text-espresso">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Link 
              href="/checkout" 
              onClick={onClose}
              className="w-full bg-espresso text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-espresso/90 transition-all shadow-xl"
            >
              <span>Proceed to Checkout</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
