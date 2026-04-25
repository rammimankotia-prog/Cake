import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function CatalogPage() {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        include: {
          variants: true
        }
      }
    },
    orderBy: {
      order: 'asc'
    }
  });

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      
      <div className="pt-32 pb-24 px-4 max-w-7xl mx-auto">
        <header className="mb-16">
          <span className="text-rose font-bold tracking-widest uppercase text-sm mb-4 block">Our Online Store</span>
          <h1 className="text-5xl md:text-6xl font-serif text-espresso">The E-Menu</h1>
          <p className="text-espresso/60 mt-4 max-w-xl">
            Browse our selection of fresh artisanal breads and pastries. Hand-baked daily and delivered fresh to your door.
          </p>
        </header>

        {categories.map((category) => (
          <section key={category.id} className="mb-20">
            <div className="flex items-center space-x-4 mb-10">
              <h2 className="text-3xl font-serif text-espresso whitespace-nowrap">{category.name}</h2>
              <div className="h-px bg-espresso/10 w-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {category.products.map((product) => (
                <ProductCard 
                  key={product.id}
                  title={product.name}
                  description={product.description}
                  basePrice={product.basePrice}
                  image={product.image}
                  imageZoom={product.imageZoom}
                  imagePosX={product.imagePosX}
                  imagePosY={product.imagePosY}
                  variants={product.variants.map(v => ({
                    id: v.id,
                    name: v.name,
                    price: v.price
                  }))}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
