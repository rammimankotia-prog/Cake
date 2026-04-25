import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import Link from "next/link";

const OCCASIONS = [
  { icon: "🎂", label: "Birthday" },
  { icon: "💍", label: "Anniversary" },
  { icon: "💝", label: "Valentine's" },
  { icon: "🎓", label: "Graduation" },
  { icon: "🎉", label: "Celebration" },
  { icon: "🌹", label: "Just Because" },
];

const TRUST_BADGES = [
  { icon: "🚀", title: "Same Day Delivery", desc: "Order before 6 PM" },
  { icon: "🌙", title: "Midnight Delivery", desc: "We bake till 1 AM" },
  { icon: "👨‍🍳", title: "Freshly Baked", desc: "Made to order, daily" },
  { icon: "✅", title: "FSSAI Certified", desc: "Food safety guaranteed" },
];

const featuredProducts = [
  {
    title: "Signature Kunafa Cake",
    description: "A Middle Eastern-inspired fusion dessert with crunchy pastry layers, silky cream, and rose syrup drizzle.",
    basePrice: 70.00,
    image: "/cake-kunafa.png",
    badge: "Chef's Special",
    badgeColor: "bg-gold",
    variants: [
      { id: "v1", name: "500g", price: 70.00 },
      { id: "v2", name: "1kg", price: 130.00 },
    ]
  },
  {
    title: "Boutique Birthday Cake",
    description: "Personalized celebration cakes crafted by Chef Bhawna. Pink fondant roses, gold leaf, and dreamy frosting.",
    basePrice: 60.00,
    image: "/cake-birthday.png",
    badge: "Best Seller",
    badgeColor: "bg-rose",
    variants: [
      { id: "v3", name: "500g", price: 60.00 },
      { id: "v4", name: "1kg", price: 110.00 },
      { id: "v5", name: "2kg", price: 200.00 },
    ]
  },
  {
    title: "Mango Charlotte",
    description: "Seasonal artisanal cake with fresh Alphonso mango slices, light mousse, and sponge lady fingers.",
    basePrice: 65.00,
    image: "/cake-mango.png",
    badge: "Seasonal",
    badgeColor: "bg-gold",
    variants: [
      { id: "v6", name: "500g", price: 65.00 },
      { id: "v7", name: "1kg", price: 120.00 },
    ]
  },
];

const INSTAGRAM_POSTS = [
  { src: "/cake-kunafa.png", caption: "Kunafa Magic ✨" },
  { src: "/cake-birthday.png", caption: "Birthday Dreams 🎂" },
  { src: "/cake-mango.png", caption: "Mango Season 🥭" },
  { src: "/croissant-paneer.png", caption: "Fusion Croissant 🥐" },
  { src: "/cake-kunafa.png", caption: "Late Night Bakes 🌙" },
  { src: "/cake-birthday.png", caption: "Custom Studio 🎨" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="/hero.png"
          alt="Delish Mama Cake Studio"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/40 to-navy/80" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <span className="inline-block bg-rose/20 border border-rose/40 text-rose text-xs font-bold uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-6">
            Est. 2026 · Model Town, Delhi
          </span>
          <h1 className="text-7xl md:text-[9rem] font-serif text-white leading-none mb-4 drop-shadow-2xl">
            Delish <span className="text-rose italic">Mama</span>
          </h1>
          <p className="text-xl md:text-2xl font-light text-white/80 tracking-[0.25em] uppercase mb-10">
            Cake Studio <span className="text-rose">&</span> Cafe
          </p>

          {/* Delivery Promise Strip */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            {["🚀 Same Day Delivery", "🌙 Midnight Orders till 1 AM", "✅ 100% Freshly Baked"].map(item => (
              <span key={item} className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full">
                {item}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/catalog" className="px-10 py-4 bg-rose text-white rounded-full font-bold text-lg hover:bg-rose/90 transition-all shadow-2xl hover:scale-105 active:scale-95">
              Order Now
            </Link>
            <Link href="/about" className="px-10 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all">
              Our Story
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES (Bakingo-style) ── */}
      <section className="py-10 bg-navy">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {TRUST_BADGES.map(({ icon, title, desc }) => (
            <div key={title} className="flex items-center space-x-4">
              <span className="text-3xl">{icon}</span>
              <div>
                <p className="text-white font-bold text-sm">{title}</p>
                <p className="text-white/50 text-xs">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SHOP BY OCCASION (Bakingo-style) ── */}
      <section className="py-20 px-4 bg-oat/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-rose font-bold tracking-widest uppercase text-sm block mb-3">Find Your Perfect Cake</span>
            <h2 className="text-4xl md:text-5xl font-serif text-navy">Shop by Occasion</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {OCCASIONS.map(({ icon, label }) => (
              <Link key={label} href={`/catalog?occasion=${label.toLowerCase()}`}
                className="group flex flex-col items-center p-6 bg-white rounded-2xl hover:shadow-xl transition-all hover:-translate-y-1 border border-navy/5"
              >
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{icon}</span>
                <span className="text-sm font-bold text-navy/70 group-hover:text-rose transition-colors">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-rose font-bold tracking-widest uppercase text-sm mb-4 block">Studio Favourites</span>
              <h2 className="text-4xl md:text-5xl font-serif text-navy">Our Signature <br/>Masterpieces</h2>
            </div>
            <Link href="/catalog" className="text-navy font-bold border-b-2 border-rose pb-1 hover:text-rose transition-colors">
              View Full Menu →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredProducts.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── BANNER STRIP (Bakingo-style promotional) ── */}
      <section className="py-20 bg-rose relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="text-[20rem] font-serif text-white whitespace-nowrap select-none -mt-20">DELISH MAMA DELISH MAMA</div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
            Custom Cakes Made to <span className="italic">Order</span>
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Designed by our Russia-trained Chef Bhawna Sareen. Share your dream, we'll bake the masterpiece.
          </p>
          <Link href="/contact" className="inline-block bg-white text-rose px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all">
            Request Custom Cake
          </Link>
        </div>
      </section>

      {/* ── INSTAGRAM FEED (Bakingo-style) ── */}
      <section className="py-24 px-4 bg-oat/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-rose font-bold tracking-widest uppercase text-sm block mb-3">Follow Along</span>
            <h2 className="text-4xl md:text-5xl font-serif text-navy">A Glimpse from <br/>Our Studio</h2>
            <a href="https://www.instagram.com/delishmama_/" target="_blank"
               className="inline-flex items-center space-x-2 mt-4 text-navy/60 font-bold hover:text-rose transition-colors">
              <span>@delishmama_</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {INSTAGRAM_POSTS.map((post, i) => (
              <a key={i} href="https://www.instagram.com/delishmama_/" target="_blank"
                 className="group relative aspect-square overflow-hidden rounded-2xl">
                <Image src={post.src} alt={post.caption} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/50 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity text-center px-2">{post.caption}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <div className="text-gold text-4xl font-serif italic">Russia-Trained</div>
            <p className="text-white/60 text-sm">Chef Bhawna brings international pastry artistry to every single creation.</p>
          </div>
          <div className="space-y-4">
            <div className="text-gold text-4xl font-serif italic">Midnight Ready</div>
            <p className="text-white/60 text-sm">Order up to 1 AM. Perfect for surprise parties and last-minute celebrations.</p>
          </div>
          <div className="space-y-4">
            <div className="text-gold text-4xl font-serif italic">FSSAI Safe</div>
            <p className="text-white/60 text-sm">Certified hygienic kitchen with only the freshest, locally sourced ingredients.</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-cream py-16 border-t border-navy/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="text-3xl font-serif font-bold text-navy block mb-3">
                Delish <span className="text-rose">Mama</span>
              </Link>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy/30 mb-4">Cake Studio & Cafe</p>
              <p className="text-navy/60 text-sm leading-relaxed mb-4">
                2nd Main Rd, opp. MCD Parking, Model Town Phase 2,<br/>
                Pocket E, Model Town Phase I, Delhi, 110033
              </p>
              <p className="text-navy font-bold">📞 076619 00009</p>
              <p className="text-navy/40 text-xs mt-1">Open: 9 AM – 1 AM · 7 days a week</p>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-navy/40 mb-6">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                {[["Catalog", "/catalog"], ["About Us", "/about"], ["Contact", "/contact"], ["Custom Cakes", "/contact"], ["Admin", "/admin"]].map(([label, href]) => (
                  <li key={label}><Link href={href} className="text-navy/60 hover:text-rose transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-navy/40 mb-6">Connect</h4>
              <div className="space-y-3">
                <a href="https://www.instagram.com/delishmama_/" target="_blank" className="flex items-center space-x-2 text-navy/60 hover:text-rose transition-colors text-sm font-bold">
                  <span>Instagram</span><span className="text-xs">→</span>
                </a>
                <p className="text-navy/60 text-sm">WhatsApp: 076619 00009</p>
              </div>
            </div>
          </div>
          <div className="border-t border-navy/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-navy/30 text-[10px] uppercase tracking-widest">© 2026 Delish Mama - Cake Studio & Cafe. All rights reserved.</p>
            <p className="text-navy/30 text-[10px]">FSSAI Certified · Made with ❤️ in Model Town, Delhi</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
