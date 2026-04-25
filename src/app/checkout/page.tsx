"use client";

import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const deliveryFee = total * 85 >= 999 ? 0 : 49;
  const subtotalINR = total * 85;
  const discountAmt = couponApplied ? subtotalINR * (couponDiscount / 100) : 0;
  const gst = (subtotalINR - discountAmt) * 0.05;
  const grandTotal = subtotalINR - discountAmt + deliveryFee + gst;

  const applyCoupon = () => {
    const codes: Record<string, number> = { SUMMER15: 15, VIP25: 25, LOCAL10: 10, LATE20: 20 };
    if (codes[couponCode.toUpperCase()]) {
      setCouponDiscount(codes[couponCode.toUpperCase()]);
      setCouponApplied(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsProcessing(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const { createOrder } = await import("@/app/actions/orders");
      
      await createOrder({
        customerName: formData.get("fullName") as string || "Guest",
        phone: formData.get("phone") as string || "",
        total: grandTotal,
        items: cart.map(i => ({ id: i.id, quantity: i.quantity }))
      });

      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      alert("Failed to place order.");
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 rounded-3xl text-center max-w-lg shadow-2xl border border-slate-100">
          <div className="w-20 h-20 bg-mint/10 text-mint rounded-full flex items-center justify-center text-4xl mx-auto mb-6 animate-bounce">
            ✓
          </div>
          <h1 className="text-3xl font-serif font-bold text-navy mb-3">Order Confirmed!</h1>
          <p className="text-navy/50 mb-2">
            Thank you for choosing <strong className="text-rose">Delish Mama</strong>.
          </p>
          <p className="text-navy/40 text-sm mb-8">
            Your delicious treats are being prepared with love at our Model Town studio.<br />
            A confirmation has been sent to your phone.
          </p>
          <div className="bg-navy/5 rounded-2xl p-4 mb-8 text-sm text-navy/60">
            <p className="font-bold text-navy mb-1">📞 Track via WhatsApp</p>
            <p>Message us at <strong className="text-rose">076619 00009</strong> for live updates</p>
          </div>
          <Link href="/catalog" className="inline-block bg-navy text-white px-8 py-4 rounded-xl font-bold hover:bg-navy/90 transition-all shadow-lg">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      <div className="pt-28 pb-24 px-4 max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-navy/30 mb-8">
          <Link href="/" className="hover:text-navy transition-colors">Home</Link>
          <span>→</span>
          <Link href="/catalog" className="hover:text-navy transition-colors">Menu</Link>
          <span>→</span>
          <span className="text-navy font-bold">Checkout</span>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12 space-x-0">
          {["Cart", "Details", "Payment"].map((step, i) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold ${
                i <= 1 ? "bg-rose text-white" : "bg-navy/5 text-navy/40"
              }`}>
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">{i + 1}</span>
                <span>{step}</span>
              </div>
              {i < 2 && <div className={`w-12 h-0.5 mx-1 ${i < 1 ? "bg-rose" : "bg-navy/10"}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Form (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Delivery Details */}
            <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-serif font-bold text-navy mb-6 flex items-center">
                <span className="w-8 h-8 bg-rose/10 text-rose rounded-lg flex items-center justify-center mr-3 text-sm">📍</span>
                Delivery Details
              </h3>
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-navy/30 block mb-2">Full Name</label>
                    <input name="fullName" type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose transition-colors" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-navy/30 block mb-2">Phone Number</label>
                    <input name="phone" type="tel" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose transition-colors" placeholder="+91 98765 43210" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-navy/30 block mb-2">Delivery Address</label>
                  <textarea required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose transition-colors" rows={3} placeholder="House/Flat no., Street, Landmark..." />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-navy/30 block mb-2">City</label>
                    <input type="text" required defaultValue="Delhi" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose transition-colors" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-navy/30 block mb-2">Pincode</label>
                    <input type="text" required defaultValue="110033" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-rose transition-colors" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-navy/30 block mb-2">State</label>
                    <input type="text" required defaultValue="Delhi" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-navy/30 block mb-2">Delivery Instructions (optional)</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose transition-colors" placeholder="e.g. Ring the doorbell, call on arrival..." />
                </div>
              </form>
            </section>

            {/* Payment Method */}
            <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-serif font-bold text-navy mb-6 flex items-center">
                <span className="w-8 h-8 bg-gold/10 text-gold rounded-lg flex items-center justify-center mr-3 text-sm">💳</span>
                Payment Method
              </h3>
              <div className="space-y-3">
                {[
                  { id: "upi", label: "UPI / Google Pay / PhonePe", badges: ["GPay", "PhonePe", "Paytm"], desc: "Pay instantly via UPI" },
                  { id: "card", label: "Credit / Debit Card", badges: ["VISA", "MC", "RuPay"], desc: "All major cards accepted" },
                  { id: "cod", label: "Cash on Delivery", badges: ["₹"], desc: "Pay when your order arrives" },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                      paymentMethod === method.id
                        ? "bg-rose/5 border-rose"
                        : "bg-slate-50/50 border-transparent hover:border-slate-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center flex-shrink-0 ${
                      paymentMethod === method.id ? "border-rose" : "border-slate-300"
                    }`}>
                      {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-rose rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-navy text-sm">{method.label}</span>
                      <p className="text-[10px] text-navy/30 mt-0.5">{method.desc}</p>
                    </div>
                    <div className="flex space-x-1.5">
                      {method.badges.map((b) => (
                        <span key={b} className="text-[9px] font-mono font-bold bg-white border border-slate-200 px-2 py-0.5 rounded">{b}</span>
                      ))}
                    </div>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Right: Order Summary (2 cols) */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-24 space-y-6">
              <h3 className="text-lg font-serif font-bold text-navy">Order Summary</h3>

              {/* Cart Items */}
              {cart.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-3xl mb-3">🛒</p>
                  <p className="text-navy/30 text-sm">Your cart is empty</p>
                  <Link href="/catalog" className="text-rose font-bold text-sm hover:underline mt-2 inline-block">Browse Menu →</Link>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                      <div className="w-10 h-10 bg-rose/10 rounded-lg flex items-center justify-center text-rose font-bold text-sm flex-shrink-0">
                        {item.quantity}×
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-navy text-sm truncate">{item.name}</p>
                        {item.variantName && <p className="text-[9px] text-navy/30 uppercase tracking-wider">{item.variantName}</p>}
                      </div>
                      <p className="font-bold text-navy text-sm flex-shrink-0">₹{(item.price * 85 * item.quantity).toFixed(0)}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Coupon */}
              <div className="border-t border-slate-100 pt-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-navy/30 block mb-2">Coupon Code</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. SUMMER15"
                    disabled={couponApplied}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono uppercase focus:outline-none focus:border-rose disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={couponApplied || !couponCode}
                    className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                      couponApplied ? "bg-mint/10 text-mint" : "bg-navy text-white hover:bg-navy/90"
                    }`}
                  >
                    {couponApplied ? "Applied ✓" : "Apply"}
                  </button>
                </div>
                {couponApplied && <p className="text-xs text-mint font-bold mt-2">🎉 {couponDiscount}% discount applied!</p>}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-navy/50">
                  <span>Subtotal</span>
                  <span>₹{subtotalINR.toFixed(0)}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-sm text-mint font-semibold">
                    <span>Coupon Discount (-{couponDiscount}%)</span>
                    <span>-₹{discountAmt.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-navy/50">
                  <span>GST (5%)</span>
                  <span>₹{gst.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm text-navy/50">
                  <span>Delivery</span>
                  <span className={deliveryFee === 0 ? "text-mint font-bold" : ""}>
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>
                {deliveryFee === 0 && (
                  <p className="text-[10px] text-mint italic">Free delivery on orders above ₹999</p>
                )}
                <div className="flex justify-between text-navy text-xl font-bold pt-3 border-t border-slate-100">
                  <span>Total</span>
                  <span>₹{grandTotal.toFixed(0)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                form="checkout-form"
                disabled={isProcessing || cart.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-xl transition-all flex items-center justify-center space-x-2 text-base ${
                  isProcessing ? "bg-navy/50 cursor-wait" : cart.length === 0 ? "bg-slate-300 cursor-not-allowed" : "bg-rose hover:bg-rose/90 active:scale-[0.98] shadow-rose/20"
                }`}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <span>Place Order · ₹{grandTotal.toFixed(0)}</span>
                )}
              </button>

              {/* Trust Signals */}
              <div className="flex items-center justify-center space-x-4 pt-2">
                <span className="text-[10px] text-navy/30 flex items-center"><span className="mr-1">🔒</span> Secure Payment</span>
                <span className="text-[10px] text-navy/30 flex items-center"><span className="mr-1">🧁</span> Fresh Guaranteed</span>
                <span className="text-[10px] text-navy/30 flex items-center"><span className="mr-1">📞</span> 24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
