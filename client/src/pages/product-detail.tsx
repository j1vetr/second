import { useParams } from "wouter";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OfferModal } from "@/components/ui/offer-modal";
import { MessageCircle, Share2, Heart, CheckCircle2, ShieldCheck, Box, Truck } from "lucide-react";
import { ProductCard } from "@/components/ui/product-card";
import { motion } from "framer-motion";
import NotFound from "@/pages/not-found";
import { Separator } from "@/components/ui/separator";

export function ProductDetail() {
  const { id } = useParams();
  const product = MOCK_PRODUCTS.find(p => p.id === id);

  if (!product) return <NotFound />;

  const similarProducts = MOCK_PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-secondary/10 pb-16">
      {/* Breadcrumb / Top Bar - Optional */}
      <div className="bg-background border-b py-3">
        <div className="container mx-auto px-4 text-sm text-muted-foreground">
           Home / {product.category} / <span className="text-foreground font-medium">{product.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Gallery Section (Left - 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div 
              layoutId={`product-image-${product.id}`}
              className="aspect-[4/3] rounded-2xl overflow-hidden bg-white border shadow-sm relative group"
            >
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                 {product.isNew && <Badge className="bg-primary text-white">New Arrival</Badge>}
              </div>
            </motion.div>
            
            <div className="grid grid-cols-4 gap-4">
               {/* Mock thumbnails */}
               {[1,2,3,4].map(i => (
                 <div key={i} className="aspect-square rounded-xl overflow-hidden bg-white border cursor-pointer hover:ring-2 hover:ring-primary transition-all opacity-80 hover:opacity-100">
                   <img src={product.image} className="w-full h-full object-cover" />
                 </div>
               ))}
            </div>
          </div>

          {/* Info Section (Right - 5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-card rounded-2xl border p-6 md:p-8 shadow-sm space-y-6 sticky top-24">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge 
                    variant="secondary" 
                    className="px-3 py-1 text-sm bg-secondary text-secondary-foreground"
                  >
                    {product.category}
                  </Badge>
                  <div className="flex items-center gap-2">
                     <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                       <Heart className="w-5 h-5 text-muted-foreground" />
                     </Button>
                     <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                       <Share2 className="w-5 h-5 text-muted-foreground" />
                     </Button>
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold mb-3 leading-tight">{product.title}</h1>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 text-green-700 rounded-md font-medium">
                    <CheckCircle2 className="w-4 h-4" /> In Stock
                  </span>
                  <span className="flex items-center gap-1.5 px-2 py-1 bg-secondary rounded-md font-medium text-foreground">
                    <Box className="w-4 h-4" /> {product.condition === 'new' ? 'Brand New' : 'Used'}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                 <p className="text-muted-foreground leading-relaxed">
                   {product.description || "No detailed description provided for this product."}
                 </p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-2">
                 <div className="p-3 bg-secondary/20 rounded-lg border border-border/50">
                    <span className="text-xs text-muted-foreground block mb-1">Condition</span>
                    <span className="font-semibold">{product.condition === 'new' ? 'New' : 'Used'}</span>
                 </div>
                 <div className="p-3 bg-secondary/20 rounded-lg border border-border/50">
                    <span className="text-xs text-muted-foreground block mb-1">Warranty</span>
                    <span className="font-semibold">{product.condition === 'new' ? '2 Years' : 'None'}</span>
                 </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <OfferModal product={product} />
                
                <a 
                  href={`https://wa.me/41788664492?text=${encodeURIComponent(`Hi, I'm interested in ${product.title} (ID: ${product.id}). Is it still available?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button className="w-full text-base h-12 bg-[#25D366] hover:bg-[#128C7E] text-white">
                    <MessageCircle className="w-4 h-4 mr-2" /> Order via WhatsApp
                  </Button>
                </a>

                <Button variant="outline" size="lg" className="w-full text-base h-12">
                  <MessageCircle className="w-4 h-4 mr-2" /> Ask Seller a Question
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-6 pt-4 text-xs text-muted-foreground">
                 <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Secure Payment</span>
                 <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-24">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-bold">Similar Products</h2>
               <Button variant="link">View All</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
