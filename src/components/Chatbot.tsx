"use client";

import { useState, useEffect, useRef } from "react";

interface Message {
  text: string;
  isBot: boolean;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm your Delish Mama Assistant. 🍰 Can I have your Mobile Number to get started?", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState<'IDENTIFY' | 'GET_NAME' | 'GET_EMAIL' | 'GET_ADDRESS' | 'CHAT'>('IDENTIFY');
  const [mobile, setMobile] = useState("");
  const [userData, setUserData] = useState<any>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setInput("");

    if (step === 'IDENTIFY') {
      setMobile(userMessage);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, mobile: userMessage, step: 'IDENTIFY' })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { text: data.reply, isBot: true }]);
      setStep(data.nextStep);
    } 
    else if (step === 'GET_NAME') {
      const updatedData = { ...userData, name: userMessage };
      setUserData(updatedData);
      setMessages(prev => [...prev, { text: "Got it! And your Email address, please? 📧", isBot: true }]);
      setStep('GET_EMAIL');
    }
    else if (step === 'GET_EMAIL') {
      const updatedData = { ...userData, email: userMessage };
      setUserData(updatedData);
      setMessages(prev => [...prev, { text: "Almost done! Where should we deliver your cakes? Please provide your full Address. 🏠", isBot: true }]);
      setStep('GET_ADDRESS');
    }
    else if (step === 'GET_ADDRESS') {
      const updatedData = { ...userData, address: userMessage };
      setUserData(updatedData);
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, mobile, step: 'FINALIZE_LEAD', userData: updatedData })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { text: data.reply, isBot: true }]);
      setStep('CHAT');
    }
    else {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, mobile, step: 'CHAT', userData })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { text: data.reply, isBot: true }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] md:w-[400px] h-[550px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-rose p-6 text-white flex items-center space-x-4 relative overflow-hidden">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg width="100%" height="100%"><pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="white"/></pattern><rect width="100%" height="100%" fill="url(#dots)"/></svg>
            </div>
            
            <div className="w-12 h-12 rounded-full bg-white p-1 overflow-hidden shadow-inner relative z-10">
              <img src="/logo.png" alt="Delish Mama" className="w-full h-full object-contain" />
            </div>
            <div className="relative z-10">
              <h3 className="font-serif font-bold text-lg leading-tight">Delish Mama</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 flex items-center">
                <span className="w-1.5 h-1.5 bg-mint rounded-full mr-1.5 animate-pulse"></span>
                Smart AI Assistant
              </p>
            </div>
            <button onClick={() => setIsOpen(false)} className="ml-auto p-2 hover:bg-white/10 rounded-full transition-colors relative z-10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  m.isBot 
                    ? 'bg-white text-navy rounded-tl-none border border-slate-100' 
                    : 'bg-rose text-white rounded-tr-none shadow-rose/10'
                }`}>
                  {m.text.split('\n').map((line, j) => (
                    <p key={j} className={j > 0 ? 'mt-2' : ''}>
                      {line.startsWith('*') && line.endsWith('*') ? <strong>{line.replace(/\*/g, '')}</strong> : line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 focus-within:border-rose focus-within:ring-1 focus-within:ring-rose/20 transition-all">
              <input 
                type="text" 
                className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none"
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                className="bg-rose text-white p-2.5 rounded-xl hover:bg-rose/90 transition-all active:scale-95 shadow-lg shadow-rose/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
            <p className="text-[9px] text-center text-slate-400 mt-3 font-medium uppercase tracking-tighter">
              100% Veg • Studio Masterpieces • Model Town
            </p>
          </div>
        </div>
      )}

      {/* Floating Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-rose rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-300 relative group"
      >
        <div className="absolute -top-1 -right-1 bg-mint w-4 h-4 rounded-full border-2 border-white animate-pulse z-10" />
        <div className="absolute inset-0 bg-rose rounded-full animate-ping opacity-20 group-hover:opacity-40 transition-opacity"></div>
        {isOpen ? (
          <svg className="w-8 h-8 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-8 h-8 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )}
        <span className="absolute right-20 bg-navy text-white text-[10px] font-bold py-2.5 px-5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-2xl translate-x-4 group-hover:translate-x-0">
          How can I help you? ✨
        </span>
      </button>
    </div>
  );
}
