import { useParams } from "wouter";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OfferModal } from "@/components/ui/offer-modal";
import { MessageCircle, Share2, Heart, CheckCircle2 } from "lucide-react";
import { ProductCard } from "@/components/ui/product-card";
import { motion } from "framer-motion";
import NotFound from "@/pages/not-found";

export function ProductDetail() {
  const { id } = useParams();
  const product = MOCK_PRODUCTS.find(p => p.id === id);

  if (!product) return <NotFound />;

  const similarProducts = MOCK_PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        
        {/* Gallery Section */}
        <div className="space-y-4">
          <motion.div 
            layoutId={`product-image-${product.id}`}
            className="aspect-[4/3] rounded-2xl overflow-hidden bg-secondary border"
          >
            <img 
              src={product.image} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
             {/* Mock thumbnails - just repeating the main image for demo */}
             {[1,2,3,4].map(i => (
               <div key={i} className="aspect-square rounded-lg overflow-hidden bg-secondary cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
                 <img src={product.image} className="w-full h-full object-cover opacity-70 hover:opacity-100" />
               </div>
             ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge 
                variant="outline" 
                className={`${product.condition === 'new' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-secondary text-secondary-foreground'} px-3 py-1 text-sm`}
              >
                {product.condition === 'new' ? 'Brand New' : 'Used'}
              </Badge>
              {product.featured && (
                 <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 px-3 py-1 text-sm">
                   Featured
                 </Badge>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.title}</h1>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> In Stock
              </span>
              <span>•</span>
              <span>Product Code: #{product.id}00{product.id}</span>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.description || "No detailed description provided for this product."}
            </p>
          </div>

          <div className="p-6 bg-secondary/30 rounded-xl space-y-4 border">
            <h3 className="font-semibold">Product Features</h3>
            <ul className="grid grid-cols-2 gap-y-2 text-sm">
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium capitalize">{product.category}</span>
              </li>
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Condition</span>
                <span className="font-medium">{product.condition === 'new' ? 'New' : 'Used'}</span>
              </li>
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Warranty</span>
                <span className="font-medium">{product.condition === 'new' ? '2 Years' : 'None'}</span>
              </li>
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">Buyer Pays</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <OfferModal product={product} />
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                <MessageCircle className="w-4 h-4 mr-2" /> Ask Question
              </Button>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="flex-1 border">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="flex-1 border">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="mt-24">
          <h2 className="text-2xl font-bold mb-8">Similar Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
