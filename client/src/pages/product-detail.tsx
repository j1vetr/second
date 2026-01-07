import { useParams, Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Share2, CheckCircle2, ShieldCheck, Box, Truck, 
  Ruler, Scale, Package, Sparkles, Star, ChevronRight, 
  ZoomIn, ZoomOut, ChevronLeft, Award, Clock, Info, Tag, BadgeCheck
} from "lucide-react";

function formatPrice(price: string | null | undefined): string {
  if (!price) return "";
  return `CHF ${parseFloat(price).toFixed(2)}`;
}

function getDiscountPercent(price: string | null, discountPrice: string | null): number {
  if (!price || !discountPrice) return 0;
  return Math.round((1 - parseFloat(discountPrice) / parseFloat(price)) * 100);
}

function getConditionLabel(condition: string): string {
  switch (condition) {
    case 'new': return 'Neuf';
    case 'used_like_new': return 'Comme Neuf';
    case 'used_good': return 'Bon État';
    case 'used_fair': return 'État Correct';
    case 'used': return 'Utilisé';
    default: return 'Occasion';
  }
}
import { ProductCard } from "@/components/ui/product-card";
import { motion } from "framer-motion";
import NotFound from "@/pages/not-found";
import { useQuery } from "@tanstack/react-query";
import { getProduct, getProducts } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useState, useRef, useMemo } from "react";
import DOMPurify from "dompurify";
import { usePageTitle } from "@/hooks/use-page-title";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function ProductDetail() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id!),
    enabled: !!id,
  });

  usePageTitle(product?.title || "Product Details");

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

  // Use images array if available, otherwise fall back to single image
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const specs = [
    { icon: Ruler, label: "Dimensions", value: product.dimensions },
    { icon: Scale, label: "Weight", value: product.weight },
    { icon: Box, label: "Condition", value: getConditionLabel(product.condition) },
    { icon: ShieldCheck, label: "Warranty", value: product.condition === 'new' ? '2 Years' : 'None' },
  ].filter(s => s.value);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20 w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-6 box-border">
        {/* Breadcrumb */}
        <motion.nav 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
        >
          <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/products" className="hover:text-primary transition-colors">Produits</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/category/${product.category}`} className="hover:text-primary transition-colors capitalize">{product.category}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium truncate max-w-[200px]">{product.title}</span>
        </motion.nav>

        <div className="grid lg:grid-cols-5 gap-4 lg:gap-8">
          {/* Image Gallery - 3 cols */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-4 min-w-0 overflow-hidden"
          >
            {/* Main Image */}
            <div 
              ref={imageRef}
              className={cn(
                "relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden bg-secondary/10 cursor-zoom-in group border-2 border-primary",
                isZoomed && "cursor-zoom-out"
              )}
              onClick={() => setIsZoomed(!isZoomed)}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => isZoomed && setIsZoomed(false)}
            >
              <motion.img 
                src={productImages[selectedImage]} 
                alt={product.title}
                className={cn(
                  "absolute inset-0 w-full h-full object-contain transition-transform duration-500",
                  product.isSold && "grayscale"
                )}
                style={isZoomed ? {
                  transform: 'scale(2.5)',
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                } : {}}
                data-testid="img-product-main"
              />
              
              {/* Sold Overlay */}
              {product.isSold && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
                  <div className="bg-gray-900/90 text-white px-8 py-4 rounded-2xl text-2xl font-bold uppercase tracking-wider flex items-center gap-3 shadow-2xl transform -rotate-12">
                    <BadgeCheck className="w-8 h-8" />
                    VENDU
                  </div>
                </div>
              )}
              
              {/* Floating Badges - Compact */}
              <div className="absolute top-2 left-2 flex gap-1 flex-wrap max-w-[60%]">
                {product.isSold && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                    <Badge className="bg-gray-800 text-white px-2 py-0.5 text-xs shadow border-0">
                      <BadgeCheck className="w-3 h-3 mr-1" /> Vendu
                    </Badge>
                  </motion.div>
                )}
                {!product.isSold && product.condition === 'new' && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                    <Badge className="bg-gradient-to-r from-primary to-orange-500 text-white px-2 py-0.5 text-xs shadow border-0">
                      <Sparkles className="w-3 h-3 mr-1" /> Neuf
                    </Badge>
                  </motion.div>
                )}
                {!product.isSold && product.condition === 'used_like_new' && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                    <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-2 py-0.5 text-xs shadow border-0">
                      Comme Neuf
                    </Badge>
                  </motion.div>
                )}
                {!product.isSold && product.condition === 'used_good' && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                    <Badge className="bg-gradient-to-r from-blue-500 to-sky-500 text-white px-2 py-0.5 text-xs shadow border-0">
                      Bon État
                    </Badge>
                  </motion.div>
                )}
                {!product.isSold && product.condition === 'used_fair' && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                    <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-2 py-0.5 text-xs shadow border-0">
                      État Correct
                    </Badge>
                  </motion.div>
                )}
                {!product.isSold && product.featured && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }}>
                    <Badge className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-2 py-0.5 text-xs shadow border-0">
                      <Star className="w-3 h-3 mr-1 fill-current" /> Vedette
                    </Badge>
                  </motion.div>
                )}
              </div>


              {/* Zoom Hint */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-4 right-4 bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                {isZoomed ? 'Cliquez pour dézoomer' : 'Cliquez pour zoomer'}
              </motion.div>

              {/* Image Nav Arrows */}
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => prev === 0 ? productImages.length - 1 : prev - 1); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => (prev + 1) % productImages.length); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-4 bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                {selectedImage + 1} / {productImages.length}
              </div>
            </div>

            {/* Thumbnail Strip with Scroll */}
            <div className="relative group/thumbnails w-full max-w-full overflow-hidden box-border">
              {/* Left Arrow - Always visible on mobile when needed */}
              {productImages.length > 4 && (
                <button
                  onClick={() => {
                    const container = document.getElementById('thumbnail-container');
                    if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
                  }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 flex items-center justify-center shadow-lg transition-all hover:scale-110"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              
              {/* Scrollable Container - Fixed width with proper padding for arrows */}
              <div 
                id="thumbnail-container"
                className={cn(
                  "flex gap-2 overflow-x-auto py-2 scroll-smooth max-w-full",
                  productImages.length > 4 ? "px-10" : "px-2 justify-center"
                )}
                style={{ 
                  scrollbarWidth: 'none', 
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {productImages.map((img, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all shadow-md flex-shrink-0 bg-secondary/50 flex items-center justify-center",
                      selectedImage === i 
                        ? "border-primary ring-4 ring-primary/20 scale-105" 
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={img} alt="" className="max-w-full max-h-full w-auto h-auto object-contain" loading="lazy" />
                  </motion.button>
                ))}
              </div>
              
              {/* Right Arrow - Always visible on mobile when needed */}
              {productImages.length > 4 && (
                <button
                  onClick={() => {
                    const container = document.getElementById('thumbnail-container');
                    if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 flex items-center justify-center shadow-lg transition-all hover:scale-110"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Social Share Section */}
            <div className="flex items-center gap-3 mt-4">
              <span className="text-sm text-muted-foreground">Partager:</span>
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(product.title + ' - ' + window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition-transform"
                  data-testid="share-whatsapp"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform"
                  data-testid="share-facebook"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(product.title)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform"
                  data-testid="share-twitter"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                  className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-center hover:scale-110 transition-transform"
                  data-testid="share-copy"
                  title="Copier le lien"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Description Section Below Image */}
            {product.description && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl border p-6 mt-6"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  Description du Produit
                </h3>
                <div 
                  className="prose prose-sm max-w-none text-muted-foreground leading-relaxed dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }}
                />
              </motion.div>
            )}
          </motion.div>

          {/* Product Info - 2 cols */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-6"
          >
            {/* Category & Title */}
            <motion.div variants={itemVariants}>
              <Link href={`/category/${product.category}`}>
                <Badge variant="secondary" className="mb-3 px-3 py-1 text-xs uppercase tracking-wider hover:bg-primary hover:text-white transition-colors cursor-pointer">
                  {product.category}
                </Badge>
              </Link>
              <h1 className="text-3xl lg:text-4xl font-bold leading-tight" data-testid="text-product-title">
                {product.title}
              </h1>
            </motion.div>

            {/* Status Pills */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
              <span className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
                product.condition === 'new' && "bg-gradient-to-r from-primary/10 to-orange-500/10 text-primary border border-primary/20",
                product.condition === 'used_like_new' && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                product.condition === 'used_good' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                product.condition === 'used_fair' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                product.condition === 'used' && "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
              )}>
                <Box className="w-4 h-4" />
                {getConditionLabel(product.condition)}
              </span>
              {product.isSold ? (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <BadgeCheck className="w-4 h-4" />
                  Vendu
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <CheckCircle2 className="w-4 h-4" />
                  En Stock
                </span>
              )}
              {product.isFreeShipping ? (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <Truck className="w-4 h-4" />
                  Livraison gratuite
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  <Truck className="w-4 h-4" />
                  Frais de port
                </span>
              )}
            </motion.div>

            {/* Price Display */}
            {product.price && (
              <motion.div variants={itemVariants} className="bg-gradient-to-br from-primary/5 to-orange-500/5 rounded-2xl border border-primary/20 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Prix</p>
                    {product.discountPrice ? (
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-red-500">{formatPrice(product.discountPrice)}</span>
                        <span className="text-lg text-muted-foreground line-through">{formatPrice(product.price)}</span>
                      </div>
                    ) : (
                      <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
                    )}
                  </div>
                  {product.discountPrice && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full text-sm font-bold">
                      <Tag className="w-4 h-4" />
                      -{getDiscountPercent(product.price, product.discountPrice)}% RÉDUCTION
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Specifications Card */}
            {specs.length > 0 && (
              <motion.div variants={itemVariants} className="bg-gradient-to-br from-card to-secondary/20 rounded-2xl border p-5 space-y-4">
                <h3 className="font-semibold flex items-center gap-2 text-lg">
                  <Info className="w-5 h-5 text-primary" />
                  Product Details
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {specs.map((spec, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-background rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-md transition-all"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <spec.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">{spec.label}</p>
                        <p className="font-medium text-sm break-words">{spec.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Included Items */}
            {product.includedItems && product.includedItems.length > 0 && (
              <motion.div variants={itemVariants} className="bg-gradient-to-br from-green-50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/10 rounded-2xl border border-green-200/50 dark:border-green-800/30 p-5">
                <h3 className="font-semibold flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-green-600" />
                  What's Included
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.includedItems.map((item, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-background rounded-full text-sm border border-green-200 dark:border-green-800/50 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      {item}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CTA Button - WhatsApp Order or Sold */}
            <motion.div variants={itemVariants} className="pt-2">
              {product.isSold ? (
                <Button className="w-full h-14 bg-gray-400 hover:bg-gray-500 text-white rounded-xl text-base font-semibold cursor-not-allowed" disabled data-testid="button-sold">
                  <BadgeCheck className="w-5 h-5 mr-2" /> Ce produit a été vendu
                </Button>
              ) : (
                <a 
                  href={`https://wa.me/41788664492?text=${encodeURIComponent(`Bonjour, je veux commander: ${product.title}${product.price ? ` - Prix: CHF ${product.discountPrice || product.price}` : ''}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full h-14 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl text-base font-semibold shadow-lg shadow-[#25D366]/20 transition-all hover:shadow-xl hover:shadow-[#25D366]/30" data-testid="button-whatsapp-order">
                    <WhatsAppIcon className="w-5 h-5 mr-2" /> Commander via WhatsApp
                  </Button>
                </a>
              )}
            </motion.div>

            {/* Trust Bar */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-3 gap-2 pt-4"
            >
              <TrustItem icon={<ShieldCheck className="w-5 h-5" />} text="Vérifié" />
              <TrustItem icon={<Truck className="w-5 h-5" />} text="Livraison Rapide" />
              <TrustItem icon={<Clock className="w-5 h-5" />} text="Réponse 24h" />
            </motion.div>

            {/* Premium Badge */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl border border-primary/20"
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Garantie Qualité SecondStore</p>
                <p className="text-xs text-muted-foreground">Chaque article est inspecté et vérifié</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold">Vous Aimerez Aussi</h2>
                <p className="text-muted-foreground mt-1">Produits similaires dans {product.category}</p>
              </div>
              <Link href={`/category/${product.category}`}>
                <Button variant="outline" className="rounded-full">
                  Voir Tout <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {similarProducts.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}

function TrustItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 p-3 bg-secondary/30 rounded-xl text-center">
      <div className="text-primary">{icon}</div>
      <span className="text-xs font-medium text-muted-foreground">{text}</span>
    </div>
  );
}
