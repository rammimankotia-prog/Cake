import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-surface-low">
      <Navbar />
      
      {/* Story Hero */}
      <section className="pt-40 pb-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
            <Image 
              src="/hero.png" // Placeholder for Chef Bhawna's photo
              alt="Chef Bhawna Sareen"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <p className="text-sm font-bold uppercase tracking-[0.3em] mb-2">Founder & CEO</p>
              <h2 className="text-4xl font-serif">Bhawna Sareen</h2>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <span className="text-rose font-bold tracking-widest uppercase text-sm mb-4 block">Our Story</span>
              <h1 className="text-5xl md:text-6xl font-serif text-text-high leading-tight">
                Where Passion Meets <br />
                <span className="italic text-rose">Artistry</span>
              </h1>
            </div>
            
            <div className="text-lg text-text-mid leading-relaxed space-y-4">
              <p>
                Delish Mama isn't just a bakery; it's a Cake Studio where every creation is treated as a masterpiece. 
                Founded by <strong>Bhawna Sareen</strong>, a professionally trained pastry chef who completed her 
                advanced studies in <strong>Russia 🇷🇺</strong>, the studio brings international standards of 
                artisan baking to the heart of Model Town, Delhi.
              </p>

              <p>
                Chef Bhawna's journey began with a vision to transform traditional desserts into boutique experiences. 
                Specializing in both artisanal pastries and premium <strong>Gelato</strong> (via our sub-brand Gelato & Caffé), 
                she meticulously crafts each recipe to balance flavor, texture, and visual elegance.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <h4 className="text-3xl font-serif text-text-high">1 AM</h4>
                <p className="text-sm text-text-low uppercase tracking-wider font-bold">Late Night Service</p>
              </div>
              <div>
                <h4 className="text-3xl font-serif text-text-high">100%</h4>
                <p className="text-sm text-text-low uppercase tracking-wider font-bold">Artisanal & Fresh</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-surface-high text-on-high overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-serif mb-4">The Studio Philosophy</h3>
            <div className="h-1 w-20 bg-rose mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="glass p-10 rounded-3xl text-center border-white/5">
              <div className="text-4xl mb-6">🇷🇺</div>
              <h4 className="text-xl font-serif mb-4 text-on-high">Global Training</h4>
              <p className="text-on-high/60 text-sm">Techniques refined in Russia, bringing international pastry standards to your doorstep.</p>
            </div>
            <div className="glass p-10 rounded-3xl text-center border-white/5">
              <div className="text-4xl mb-6">🎨</div>
              <h4 className="text-xl font-serif mb-4 text-on-high">Artisanal Craft</h4>
              <p className="text-on-high/60 text-sm">We don't mass-produce. Each cake is handcrafted with obsessive attention to detail.</p>
            </div>
            <div className="glass p-10 rounded-3xl text-center border-white/5">
              <div className="text-4xl mb-6">☕</div>
              <h4 className="text-xl font-serif mb-4 text-on-high">The Cafe Vibe</h4>
              <p className="text-on-high/60 text-sm">A boutique space designed for community, conversations, and the perfect iced latte.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <h2 className="text-4xl font-serif text-text-high mb-8">Ready to experience the magic?</h2>
        <Link href="/catalog" className="inline-block bg-rose text-white px-10 py-4 rounded-full font-bold hover:bg-rose/90 transition-all shadow-xl">
          Browse Our Studio Menu
        </Link>
      </section>

      <Footer />
    </main>
  );
}
