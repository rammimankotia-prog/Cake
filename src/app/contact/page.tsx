"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<null | 'success'>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('success');
  };

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      
      <div className="pt-40 pb-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-rose font-bold tracking-widest uppercase text-sm mb-4 block">Get in Touch</span>
          <h1 className="text-5xl md:text-6xl font-serif text-navy">Visit Our Studio</h1>
          <p className="text-navy/60 mt-4 max-w-xl mx-auto">
            Whether it's a custom cake inquiry or just a craving for artisanal coffee, we'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-12">
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-rose/10 text-rose rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div>
                <h4 className="text-xl font-serif font-bold text-navy mb-2">Location</h4>
                <p className="text-navy/60 leading-relaxed">
                  2nd Main Rd, opp. MCD Parking, <br />
                  Model Town Phase 2, Pocket E, <br />
                  Model Town Phase I, Delhi, 110033
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-rose/10 text-rose rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <div>
                <h4 className="text-xl font-serif font-bold text-navy mb-2">Phone</h4>
                <p className="text-navy/60">076619 00009</p>
                <p className="text-navy/40 text-sm mt-1">Available 08:30 AM - 01:00 AM</p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-rose/10 text-rose rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <h4 className="text-xl font-serif font-bold text-navy mb-2">Social</h4>
                <a href="https://www.instagram.com/delishmama_/" target="_blank" className="text-rose font-bold hover:underline">@delishmama_</a>
                <p className="text-navy/40 text-sm mt-1">Follow for daily fresh bakes</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass p-10 rounded-3xl">
            {formStatus === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-mint/10 text-mint rounded-full flex items-center justify-center text-3xl">✓</div>
                <h3 className="text-2xl font-serif text-navy">Message Sent!</h3>
                <p className="text-navy/60">Thank you for reaching out. We'll get back to you shortly.</p>
                <button onClick={() => setFormStatus(null)} className="text-rose font-bold text-sm underline">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-navy/40 uppercase tracking-widest mb-2">Your Name</label>
                    <input type="text" required className="w-full bg-cream border border-navy/10 rounded-xl px-4 py-3 focus:outline-none focus:border-rose transition-colors" placeholder="Raman" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy/40 uppercase tracking-widest mb-2">Email Address</label>
                    <input type="email" required className="w-full bg-cream border border-navy/10 rounded-xl px-4 py-3 focus:outline-none focus:border-rose transition-colors" placeholder="raman@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy/40 uppercase tracking-widest mb-2">Inquiry Type</label>
                  <select className="w-full bg-cream border border-navy/10 rounded-xl px-4 py-3 focus:outline-none focus:border-rose transition-colors">
                    <option>Custom Cake Inquiry</option>
                    <option>Table Reservation</option>
                    <option>Catering Request</option>
                    <option>General Feedback</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy/40 uppercase tracking-widest mb-2">Your Message</label>
                  <textarea required className="w-full bg-cream border border-navy/10 rounded-xl px-4 py-3 focus:outline-none focus:border-rose transition-colors" rows={5} placeholder="Tell us about your dream cake..."></textarea>
                </div>
                <button className="w-full bg-navy text-white py-4 rounded-xl font-bold hover:bg-navy/90 transition-all shadow-xl">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
