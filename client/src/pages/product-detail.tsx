import { useParams, Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OfferModal } from "@/components/ui/offer-modal";
import { 
  MessageCircle, Share2, Heart, CheckCircle2, ShieldCheck, Box, Truck, 
  Ruler, Scale, Package, ArrowLeft, Sparkles, Clock, Eye, Star, 
  ChevronRight, Zap, Award, RotateCcw
} from "lucide-react";
import { ProductCard } from "@/components/ui/product-card";
import { motion, AnimatePresence } from "framer-motion";
import NotFound from "@/pages/not-found";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { getProduct, getProducts } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useState } from "react";

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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Floating Back Button */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-24 left-4 z-50 hidden lg:block"
      >
        <Link href="/products">
          <Button variant="outline" size="sm" className="rounded-full shadow-lg bg-background/80 backdrop-blur-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </Link>
      </motion.div>

      {/* Hero Image Section */}
      <section className="relative">
        <div className="container mx-auto px-4 pt-4 lg:pt-8">
          {/* Mobile Back Button */}
          <Link href="/products" className="lg:hidden">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
            </Button>
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-2xl group">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    src={mockImages[selectedImage]} 
                    alt={product.title} 
                    className="w-full h-full object-cover"
                    data-testid="img-product-main"
                  />
                </AnimatePresence>
                
                {/* Image Overlay Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                    >
                      <Badge className="bg-primary text-white px-3 py-1.5 text-sm font-semibold shadow-lg">
                        <Sparkles className="w-3 h-3 mr-1" /> New Arrival
                      </Badge>
                    </motion.div>
                  )}
                  {product.featured && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                    >
                      <Badge className="bg-yellow-500 text-white px-3 py-1.5 text-sm font-semibold shadow-lg">
                        <Star className="w-3 h-3 mr-1 fill-current" /> Featured
                      </Badge>
                    </motion.div>
                  )}
                </div>

                {/* Action Buttons Overlay */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors",
                      isWishlisted ? "bg-red-500 text-white" : "bg-white/90 text-gray-600 hover:bg-white"
                    )}
                    data-testid="button-wishlist"
                  >
                    <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg"
                    data-testid="button-share"
                  >
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </motion.button>
                </div>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  {selectedImage + 1} / {mockImages.length}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="flex gap-3 justify-center">
                {mockImages.map((img, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "w-20 h-20 rounded-xl overflow-hidden border-2 transition-all",
                      selectedImage === i 
                        ? "border-primary ring-2 ring-primary/30" 
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                    data-testid={`button-thumbnail-${i}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href={`/category/${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
              </nav>

              {/* Title & Meta */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-3xl lg:text-4xl font-bold leading-tight" data-testid="text-product-title">
                    {product.title}
                  </h1>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className="px-3 py-1.5 text-sm">
                    <Box className="w-3 h-3 mr-1.5" />
                    {product.condition === 'new' ? 'Brand New' : 'Pre-owned'}
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1.5 text-sm text-green-600 border-green-200 bg-green-50">
                    <CheckCircle2 className="w-3 h-3 mr-1.5" />
                    In Stock
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span>124 views</span>
                  </div>
                </div>
              </div>

              {/* Price Card - Unique Design */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 rounded-2xl border border-primary/20"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Make Your Offer</p>
                    <p className="text-lg font-bold text-primary">Name Your Price</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  We don't display prices. Tell us what you're willing to pay and we'll get back to you within 24 hours.
                </p>
              </motion.div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <OfferModal product={product} />
                
                <a 
                  href={`https://wa.me/41788664492?text=${encodeURIComponent(`Hi, I'm interested in ${product.title} (ID: ${product.id}). Is it still available?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full text-base h-14 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl shadow-lg shadow-[#25D366]/25" data-testid="button-whatsapp">
                    <WhatsAppIcon className="w-5 h-5 mr-2" /> Quick Order via WhatsApp
                  </Button>
                </a>

                <Button variant="outline" size="lg" className="w-full text-base h-12 rounded-xl" data-testid="button-ask-question">
                  <MessageCircle className="w-4 h-4 mr-2" /> Ask a Question
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-4">
                <TrustBadge icon={<ShieldCheck className="w-5 h-5" />} label="Verified Seller" />
                <TrustBadge icon={<Truck className="w-5 h-5" />} label="Fast Shipping" />
                <TrustBadge icon={<RotateCcw className="w-5 h-5" />} label="Easy Returns" />
              </div>

              {/* Seller Quick Info */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4 p-4 bg-card rounded-xl border"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-lg">
                  SS
                </div>
                <div className="flex-1">
                  <p className="font-semibold">SecondStore Official</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span>4.9</span>
                    </div>
                    <span>•</span>
                    <span>Verified Seller</span>
                    <span>•</span>
                    <span>500+ Sales</span>
                  </div>
                </div>
                <Award className="w-8 h-8 text-primary" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Details Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Description */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-card rounded-2xl border p-6 lg:p-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Box className="w-5 h-5 text-primary" />
                About This Product
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description || "No detailed description provided for this product."}
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                This item has been carefully inspected by our team. 
                {product.condition === 'new' 
                  ? " As a brand new product, it comes in original packaging with all factory accessories." 
                  : " As a pre-owned item, please check the condition rating and photos carefully."}
              </p>
            </div>

            {/* Specifications Grid */}
            <div className="bg-card rounded-2xl border p-6 lg:p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Ruler className="w-5 h-5 text-primary" />
                Specifications
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <SpecItem icon={<Ruler />} label="Dimensions" value={product.dimensions || "Not specified"} />
                <SpecItem icon={<Scale />} label="Weight" value={product.weight || "Not specified"} />
                <SpecItem icon={<Box />} label="Condition" value={product.condition === 'new' ? 'Brand New' : 'Used'} />
                <SpecItem icon={<ShieldCheck />} label="Warranty" value={product.condition === 'new' ? '2 Years' : 'None'} />
              </div>
            </div>

            {/* Included Items */}
            {product.includedItems && product.includedItems.length > 0 && (
              <div className="bg-card rounded-2xl border p-6 lg:p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  What's in the Box
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {product.includedItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Quick Actions Sticky */}
            <div className="bg-card rounded-2xl border p-6 lg:sticky lg:top-24">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <OfferModal product={product} />
                <a 
                  href={`https://wa.me/41788664492?text=${encodeURIComponent(`Hi, I'm interested in ${product.title}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="outline" className="w-full" data-testid="button-whatsapp-sidebar">
                    <WhatsAppIcon className="w-4 h-4 mr-2" /> WhatsApp
                  </Button>
                </a>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <Link href={`/category/${product.category}`}>
                    <Badge variant="secondary">{product.category}</Badge>
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Condition</span>
                  <span className="font-medium">{product.condition === 'new' ? 'New' : 'Used'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-green-600 font-medium">Available</span>
                </div>
              </div>
            </div>

            {/* Why Buy From Us */}
            <div className="bg-gradient-to-br from-primary/5 to-transparent rounded-2xl border border-primary/10 p-6">
              <h3 className="font-semibold mb-4">Why Buy From Us?</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                  <span>All items inspected & verified</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                  <span>Secure payment processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                  <span>Fast & insured shipping</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                  <span>24/7 customer support</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section className="container mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Similar Products</h2>
              <p className="text-muted-foreground">You might also like these</p>
            </div>
            <Link href={`/category/${product.category}`}>
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </section>
      )}
    </div>
  );
}

function TrustBadge({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 p-3 bg-secondary/30 rounded-xl text-center">
      <div className="text-primary">{icon}</div>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

function SpecItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}
