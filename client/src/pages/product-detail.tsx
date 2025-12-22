import { useParams, Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OfferModal } from "@/components/ui/offer-modal";
import { 
  MessageCircle, Share2, Heart, CheckCircle2, ShieldCheck, Box, Truck, 
  Ruler, Scale, Package, Sparkles, Star, ChevronRight, 
  ZoomIn, ZoomOut, ChevronLeft
} from "lucide-react";
import { ProductCard } from "@/components/ui/product-card";
import { motion } from "framer-motion";
import NotFound from "@/pages/not-found";
import { useQuery } from "@tanstack/react-query";
import { getProduct, getProducts } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

export function ProductDetail() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id!),
    enabled: !!id,
  });

  const { data: allProducts = [] } = useQuery({
    queryKey: ["products", product?.category],
    queryFn: () => product?.category ? getProducts({ category: product.category }) : getProducts(),
    enabled: !!product,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !isZoomed) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !product) return <NotFound />;

  const similarProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const mockImages = [product.image, product.image, product.image, product.image];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <motion.nav 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
        >
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium truncate">{product.title}</span>
        </motion.nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image with Zoom */}
            <div 
              ref={imageRef}
              className={cn(
                "relative aspect-square rounded-2xl overflow-hidden bg-secondary/20 cursor-zoom-in group",
                isZoomed && "cursor-zoom-out"
              )}
              onClick={() => setIsZoomed(!isZoomed)}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => isZoomed && setIsZoomed(false)}
            >
              <motion.img 
                src={mockImages[selectedImage]} 
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-300"
                style={isZoomed ? {
                  transform: 'scale(2)',
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                } : {}}
                data-testid="img-product-main"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.condition === 'new' && (
                  <Badge className="bg-primary text-white px-3 py-1.5 shadow-lg">
                    <Sparkles className="w-3 h-3 mr-1" /> New
                  </Badge>
                )}
                {product.featured && (
                  <Badge className="bg-amber-500 text-white px-3 py-1.5 shadow-lg">
                    <Star className="w-3 h-3 mr-1 fill-current" /> Featured
                  </Badge>
                )}
              </div>

              {/* Zoom Indicator */}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded-full text-xs backdrop-blur-sm flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {isZoomed ? <ZoomOut className="w-3 h-3" /> : <ZoomIn className="w-3 h-3" />}
                {isZoomed ? 'Click to zoom out' : 'Click to zoom in'}
              </div>

              {/* Image Navigation */}
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => prev === 0 ? mockImages.length - 1 : prev - 1); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => (prev + 1) % mockImages.length); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 justify-center">
              {mockImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                    selectedImage === i 
                      ? "border-primary ring-2 ring-primary/20" 
                      : "border-transparent opacity-50 hover:opacity-100"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Title */}
            <div>
              <div className="flex items-center gap-2 text-sm text-primary font-medium mb-2">
                <span className="uppercase tracking-wider">{product.category}</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-4" data-testid="text-product-title">
                {product.title}
              </h1>
              
              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
                  product.condition === 'new' 
                    ? "bg-primary/10 text-primary" 
                    : "bg-secondary text-secondary-foreground"
                )}>
                  <Box className="w-4 h-4" />
                  {product.condition === 'new' ? 'Brand New' : 'Pre-owned'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700">
                  <CheckCircle2 className="w-4 h-4" />
                  Available
                </span>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Specifications */}
            <div className="grid grid-cols-2 gap-3">
              {product.dimensions && (
                <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl">
                  <Ruler className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Dimensions</p>
                    <p className="text-sm font-medium">{product.dimensions}</p>
                  </div>
                </div>
              )}
              {product.weight && (
                <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl">
                  <Scale className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Weight</p>
                    <p className="text-sm font-medium">{product.weight}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Included Items */}
            {product.includedItems && product.includedItems.length > 0 && (
              <div className="p-4 bg-secondary/20 rounded-xl">
                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  What's Included
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.includedItems.map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-background rounded-md text-sm">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <OfferModal product={product} />
              
              <a 
                href={`https://wa.me/41788664492?text=${encodeURIComponent(`Hi, I'm interested in ${product.title} (ID: ${product.id}). Is it still available?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full h-12 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl text-base" data-testid="button-whatsapp">
                  <WhatsAppIcon className="w-5 h-5 mr-2" /> Order via WhatsApp
                </Button>
              </a>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 h-12 rounded-xl"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  data-testid="button-wishlist"
                >
                  <Heart className={cn("w-5 h-5 mr-2", isWishlisted && "fill-red-500 text-red-500")} />
                  {isWishlisted ? 'Saved' : 'Save'}
                </Button>
                <Button variant="outline" className="flex-1 h-12 rounded-xl" data-testid="button-share">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 pt-4 border-t text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" /> Verified
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-primary" /> Fast Shipping
              </span>
              <span className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-primary" /> 24h Response
              </span>
            </div>
          </motion.div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Similar Products</h2>
              <Link href={`/category/${product.category}`}>
                <Button variant="ghost" className="text-primary">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
