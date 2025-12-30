import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Eye, Tag } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button, buttonVariants } from "@/components/ui/button";
import type { Product } from "@shared/schema";
import { cn } from "@/lib/utils";
import { useRef } from "react";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

function formatPrice(price: string | null | undefined): string {
  if (!price) return "";
  return `CHF ${parseFloat(price).toFixed(2)}`;
}

function getDiscountPercent(price: string | null, discountPrice: string | null): number {
  if (!price || !discountPrice) return 0;
  return Math.round((1 - parseFloat(discountPrice) / parseFloat(price)) * 100);
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) {
      return;
    }
    setLocation(`/product/${product.slug || product.id}`);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      transition={{ duration: 0.3 }}
      className="group relative bg-card rounded-2xl border overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 perspective-1000 cursor-pointer"
      data-testid={`card-product-${product.id}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary/50 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          decoding="async"
          className="max-w-full max-h-full w-auto h-auto object-contain"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          {product.condition === 'new' && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg bg-gradient-to-r from-primary to-primary/80 text-white">
              Neuf
            </span>
          )}
          {product.condition === 'used_like_new' && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg bg-gradient-to-r from-emerald-500 to-green-500 text-white">
              Comme Neuf
            </span>
          )}
          {product.condition === 'used_good' && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg bg-gradient-to-r from-blue-500 to-sky-500 text-white">
              Bon État
            </span>
          )}
          {product.condition === 'used_fair' && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
              État Correct
            </span>
          )}
          
          {product.discountPrice && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg flex items-center gap-1">
              <Tag className="w-3 h-3" /> -{getDiscountPercent(product.price, product.discountPrice)}%
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <Link href={`/product/${product.slug || product.id}`}>
            <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all">
              <Eye className="w-5 h-5 text-gray-700" />
            </button>
          </Link>
        </div>

        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <Link href={`/product/${product.slug || product.id}`}>
            <Button className="w-full bg-white/95 backdrop-blur-sm text-gray-900 hover:bg-white shadow-lg font-semibold">
              Voir Détails <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-primary font-semibold uppercase tracking-widest">
              {product.category}
            </span>
          </div>
          <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
            {product.title}
          </h3>
        </div>

        <div className="pt-3 border-t border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase">Prix</span>
              {product.price ? (
                <div className="flex items-center gap-2">
                  {product.discountPrice ? (
                    <span className="text-sm font-bold text-red-500">{formatPrice(product.discountPrice)}</span>
                  ) : (
                    <span className="text-sm font-bold text-primary">{formatPrice(product.price)}</span>
                  )}
                </div>
              ) : (
                <span className="text-sm font-bold text-primary">Contactez-nous</span>
              )}
            </div>
            <a 
              href={`https://wa.me/41788664492?text=${encodeURIComponent(`Bonjour, je veux commander: ${product.title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" className="rounded-full px-2 sm:px-4 shadow-lg shadow-[#25D366]/25 bg-[#25D366] hover:bg-[#128C7E]">
                <WhatsAppIcon className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Commander</span>
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 pointer-events-none" />
    </motion.div>
  );
}
