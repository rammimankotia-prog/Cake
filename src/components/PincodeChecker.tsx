"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const SERVICED_PINCODES = ["110033", "110009", "110007", "110052", "110085"];

export default function PincodeChecker() {
  const [isOpen, setIsOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState<null | 'serviced' | 'unsupported'>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Don't show on admin pages
    if (pathname.startsWith("/admin")) return;
    const checked = localStorage.getItem('pincode_checked');
    if (!checked) {
      setIsOpen(true);
    }
  }, [pathname]);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (SERVICED_PINCODES.includes(pincode)) {
      setStatus('serviced');
      localStorage.setItem('pincode_checked', 'true');
      setTimeout(() => setIsOpen(false), 2000);
    } else {
      setStatus('unsupported');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm"></div>
      <div className="relative glass p-10 rounded-[2.5rem] max-w-md w-full shadow-2xl animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-rose/10 text-rose rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">📍</div>
          <h2 className="text-2xl font-serif text-navy">Check Delivery</h2>
          <p className="text-navy/60 text-sm mt-2">Enter your pincode to see if we deliver to your studio.</p>
        </div>

        <form onSubmit={handleCheck} className="space-y-6">
          <input 
            type="text" 
            required
            maxLength={6}
            pattern="\d{6}"
            className="w-full bg-white/50 border border-navy/10 rounded-2xl px-6 py-4 text-center text-2xl font-bold tracking-[0.3em] focus:outline-none focus:border-rose transition-all"
            placeholder="110033"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />

          {status === 'serviced' && (
            <p className="text-mint text-center font-bold animate-bounce text-sm">Great! We deliver to you. ✓</p>
          )}
          {status === 'unsupported' && (
            <p className="text-rose text-center font-bold text-sm">Sorry, we don't service this zone yet. ☹</p>
          )}

          <button 
            type="submit"
            className="w-full bg-navy text-white py-4 rounded-2xl font-bold hover:bg-navy/90 transition-all shadow-xl"
          >
            Check Availability
          </button>
        </form>
        
        <button 
          onClick={() => {
            localStorage.setItem('pincode_checked', 'true');
            setIsOpen(false);
          }}
          className="w-full mt-4 text-navy/40 text-xs font-bold uppercase tracking-widest hover:text-navy transition-colors"
        >
          Just Browsing
        </button>
      </div>
    </div>
  );
}
