"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { getShopStatus } from "@/lib/shop-status";

interface Variant {
  id: string;
  name: string;
  price: number;
  color?: string;
  image?: string;
}

interface ProductCardProps {
  title: string;
  description: string;
  basePrice: number;
  image: string;
  variants?: Variant[];
  badge?: string;
  badgeColor?: string;
  imageZoom?: number | null;
  imagePosX?: number | null;
  imagePosY?: number | null;
}

export default function ProductCard({ 
  title, description, basePrice, image, variants, badge, badgeColor = "bg-rose",
  imageZoom = 1, imagePosX = 50, imagePosY = 50
}: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(variants?.[0] || null);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { addToCart } = useCart();
  const shopStatus = getShopStatus();

  const displayPrice = selectedVariant ? selectedVariant.price : basePrice;

  const handleAddToCart = () => {
    addToCart({
      id: selectedVariant ? `${title}-${selectedVariant.id}` : title,
      productId: title,
      name: title,
      price: displayPrice,
      quantity: 1,
      variantName: selectedVariant?.name
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-surface-low rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-text-high/5">
      {/* Product Image */}
      <div className="relative h-64 w-full overflow-hidden bg-surface-mid/50">
        <Image
          src={imgError ? '/hero.png' : (image || '/hero.png')}
          alt={title}
          fill
          className="object-cover transition-transform duration-700"
          style={{
            transform: `scale(${imageZoom ?? 1})`,
            objectPosition: `${imagePosX ?? 50}% ${imagePosY ?? 50}%`
          }}
          onError={() => setImgError(true)}
        />

        {/* Badge */}
        {badge && (
          <div className={`absolute top-4 left-4 ${badgeColor} text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg`}>
            {badge}
          </div>
        )}

        {/* Price Tag */}
        <div className="absolute top-4 right-4 bg-surface-low/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
          <span className="text-text-high font-bold text-sm">₹{displayPrice.toFixed(0)}</span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-text-high/0 group-hover:bg-text-high/5 transition-all duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-serif font-bold text-text-high mb-2 leading-tight">{title}</h3>
        <p className="text-text-mid text-sm mb-5 line-clamp-2 leading-relaxed">{description}</p>

        {/* Weight/Variant Selector */}
        {variants && variants.length > 0 && (
          <div className="mb-5">
            <p className="text-[10px] font-bold text-text-low uppercase tracking-widest mb-2">Select Weight</p>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedVariant?.id === v.id
                      ? "bg-text-high text-background shadow-sm"
                      : "bg-surface-mid text-text-mid hover:bg-text-high/10"
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={!shopStatus.isOpen}
          className={`w-full py-3 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center space-x-2 ${
            !shopStatus.isOpen
              ? "bg-text-high/5 text-text-low cursor-not-allowed"
              : added
              ? "bg-mint text-white scale-95"
              : "bg-rose text-white hover:bg-rose/90 hover:shadow-lg active:scale-95"
          }`}
        >
          {!shopStatus.isOpen ? (
            <span>Shop Closed</span>
          ) : added ? (
            <span>Added to Cart ✓</span>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
