import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Star, Eye, Tag, ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import { Button, buttonVariants } from "@/components/ui/button";
import type { Product } from "@shared/schema";
import { cn } from "@/lib/utils";
import { useRef } from "react";

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
      transition={{ duration: 0.3 }}
      className="group relative bg-card rounded-2xl border overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 perspective-1000"
      data-testid={`card-product-${product.id}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className={cn(
            "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg",
            product.condition === 'new' 
              ? "bg-gradient-to-r from-primary to-primary/80 text-white" 
              : "bg-white/95 text-gray-700 backdrop-blur-sm"
          )}>
            {product.condition === 'new' ? '✨ New' : '♻️ Used'}
          </span>
          
          {product.featured && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" /> Featured
            </span>
          )}
          
          {product.isNew && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-lg flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Just In
            </span>
          )}
        </div>

        {product.discountPrice && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg flex items-center gap-1">
              <Tag className="w-3 h-3" /> -{getDiscountPercent(product.price, product.discountPrice)}%
            </span>
          </div>
        )}

        <div className={cn(
          "absolute top-3 right-3 transition-all duration-300 translate-y-2 group-hover:translate-y-0",
          product.discountPrice ? "opacity-0 group-hover:opacity-100" : "opacity-0 group-hover:opacity-100"
        )}>
          <Link href={`/product/${product.id}`}>
            <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all">
              <Eye className="w-5 h-5 text-gray-700" />
            </button>
          </Link>
        </div>

        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <Link href={`/product/${product.id}`}>
            <Button className="w-full bg-white/95 backdrop-blur-sm text-gray-900 hover:bg-white shadow-lg font-semibold">
              View Details <ArrowRight className="w-4 h-4 ml-2" />
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
              <span className="text-[10px] text-muted-foreground uppercase">Price</span>
              {product.price ? (
                <div className="flex items-center gap-2">
                  {product.discountPrice ? (
                    <>
                      <span className="text-sm font-bold text-red-500">{formatPrice(product.discountPrice)}</span>
                      <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</span>
                    </>
                  ) : (
                    <span className="text-sm font-bold text-primary">{formatPrice(product.price)}</span>
                  )}
                </div>
              ) : (
                <span className="text-sm font-bold text-primary">Contact Us</span>
              )}
            </div>
            <Link href={`/product/${product.id}`}>
              <Button size="sm" className="rounded-full px-4 shadow-lg shadow-primary/25 bg-primary hover:bg-primary/90">
                <ShoppingCart className="w-4 h-4 mr-1" /> Buy
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 pointer-events-none" />
    </motion.div>
  );
}
