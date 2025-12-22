import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Sparkles, Box } from "lucide-react";
import { Link } from "wouter";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-card rounded-xl border overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge 
            variant={product.condition === 'new' ? 'default' : 'secondary'}
            className={`${product.condition === 'new' ? 'bg-primary text-primary-foreground' : 'bg-white/90 text-black backdrop-blur-sm'} border-0 px-3 py-1 font-medium shadow-sm`}
          >
            {product.condition === 'new' ? 'Brand New' : 'Used'}
          </Badge>
          
          {product.featured && (
            <Badge className="bg-yellow-400/90 text-black border-0 backdrop-blur-sm gap-1">
              <Sparkles className="w-3 h-3" /> Featured
            </Badge>
          )}
        </div>

        {/* Overlay Action */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <Link href={`/product/${product.id}`} className={cn(buttonVariants({ variant: "secondary" }), "rounded-full gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300")}>
            View <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{product.category}</p>
          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
            {product.title}
          </h3>
        </div>

        <div className="pt-2 flex items-center justify-between gap-3 border-t border-border/50">
           <Link href={`/product/${product.id}`} className={cn(buttonVariants({ variant: "default" }), "w-full shadow-lg shadow-primary/20")}>
             Get Offer
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
