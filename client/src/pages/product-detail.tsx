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

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

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
                    <WhatsAppIcon className="w-5 h-5 mr-2" /> Order via WhatsApp
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
