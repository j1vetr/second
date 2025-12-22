import { ArrowRight, ShieldCheck, Truck, MessageCircle, Star, Users, Package, TrendingUp, ChevronRight, Zap, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { Button, buttonVariants } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import { CategoryCard } from "@/components/ui/category-card";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getProducts } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import { FloatingParticles, GradientOrb } from "@/components/ui/floating-particles";
import { ProductCardSkeleton, CategoryCardSkeleton } from "@/components/ui/shimmer";
import * as Icons from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import type { Product } from "@shared/schema";
import { usePageTitle } from "@/hooks/use-page-title";

function TodaysDealsSlider({ products }: { products: Product[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const dealProducts = useMemo(() => {
    return [...products].sort(() => Math.random() - 0.5).slice(0, 5);
  }, [products]);

  useEffect(() => {
    if (dealProducts.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % dealProducts.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [dealProducts.length]);

  if (dealProducts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No deals available
      </div>
    );
  }

  const currentProduct = dealProducts[currentIndex];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Zap className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-bold text-lg">Today's Deals</h3>
      </div>
      
      <div className="relative flex-1 min-h-[280px] overflow-hidden rounded-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProduct.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Link href={`/product/${currentProduct.id}`}>
              <div className="relative h-full bg-white rounded-xl overflow-hidden group cursor-pointer">
                <img 
                  src={currentProduct.image} 
                  alt={currentProduct.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                <div className="absolute top-3 left-3">
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-semibold",
                    currentProduct.condition === 'new' 
                      ? "bg-primary text-white" 
                      : "bg-white/90 text-gray-800 backdrop-blur-sm"
                  )}>
                    {currentProduct.condition === 'new' ? 'NEW' : 'USED'}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <p className="text-xs text-white/70 uppercase tracking-wider mb-1">{currentProduct.category}</p>
                  <p className="font-bold text-base line-clamp-2 leading-tight">{currentProduct.title}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                      Make an Offer
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-1.5 z-10">
          {dealProducts.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.preventDefault(); setCurrentIndex(i); }}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === currentIndex
                  ? "bg-white w-6" 
                  : "bg-white/40 hover:bg-white/60 w-1.5"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Home() {
  usePageTitle("Premium Products at Your Price");
  
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: allProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  const { data: featuredProducts = [], isLoading: featuredLoading } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => getProducts({ featured: true }),
  });

  const newProducts = allProducts.filter(p => p.isNew).slice(0, 4);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.5]);

  const quickTags = ["Trending", "New Arrivals", "Best Sellers", "Top Rated", "Budget Friendly"];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section with Category Sidebar */}
      <section ref={heroRef} className="relative bg-gradient-to-br from-secondary/30 via-background to-primary/5">
        <div className="hidden lg:block">
          <FloatingParticles count={25} />
          <GradientOrb className="w-[600px] h-[600px] bg-primary/10 top-0 -right-64" />
          <GradientOrb className="w-[400px] h-[400px] bg-orange-500/10 bottom-0 -left-32" />
        </div>
        
        <div className="container mx-auto px-4 py-8 pb-12 lg:py-12 relative z-10">
        
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Category Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-64 flex-shrink-0"
            >
              <div className="bg-card border rounded-xl overflow-hidden shadow-lg lg:bg-card/80 lg:backdrop-blur-sm">
                <div className="bg-gradient-to-r from-primary to-orange-500 text-primary-foreground px-4 py-3 font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Categories
                </div>
                {categoriesLoading ? (
                  <div className="p-4 space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-10 bg-secondary/50 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <nav className="py-2">
                    {categories.map((cat, index) => {
                      const Icon = (Icons as any)[cat.icon] || Icons.Box;
                      return (
                        <Link key={cat.id} href={`/category/${cat.id}`}>
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ x: 5, backgroundColor: "hsl(var(--secondary))" }}
                            className="flex items-center gap-3 px-4 py-2.5 transition-colors cursor-pointer group"
                            data-testid={`hero-category-${cat.id}`}
                          >
                            <motion.div 
                              whileHover={{ scale: 1.2, rotate: 10 }}
                              className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"
                            >
                              <Icon className="w-4 h-4 text-primary" />
                            </motion.div>
                            <span className="text-sm group-hover:text-primary transition-colors">{cat.name}</span>
                            <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </motion.div>
                        </Link>
                      );
                    })}
                  </nav>
                )}
              </div>
            </motion.div>

            {/* Hero Content */}
            <div className="flex-1 flex flex-col justify-center lg:pl-8">
              <div className="text-center">
                <div className="overflow-hidden mb-2">
                  <motion.h1 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
                  >
                    Premium Products
                  </motion.h1>
                </div>
                
                <div className="overflow-hidden mb-6">
                  <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-orange-500 to-primary bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
                      Your Price
                    </span>
                  </motion.div>
                </div>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-lg text-muted-foreground max-w-xl mx-auto mb-6 leading-relaxed"
                >
                  Browse, like it, make an offer. No fixed prices, just great deals on quality products.
                </motion.p>

                {/* Quick Discovery Tags */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                  className="flex flex-wrap justify-center gap-2 mb-8"
                >
                  {quickTags.map((tag, i) => (
                    <motion.button
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all",
                        activeTag === tag
                          ? "bg-primary text-white shadow-lg shadow-primary/30"
                          : "bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {tag}
                    </motion.button>
                  ))}
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                  <Link href="/products">
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(251, 118, 24, 0.3)" }}
                      whileTap={{ scale: 0.98 }}
                      className="h-14 px-10 text-base bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white shadow-lg shadow-primary/25 w-full sm:w-auto rounded-xl font-semibold inline-flex items-center justify-center group"
                    >
                      Discover Products
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                  <Link href="/how-it-works" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-14 px-10 text-base w-full sm:w-auto rounded-xl")}>
                    How it Works?
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Today's Deals Slider */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden xl:block w-72 flex-shrink-0"
            >
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 border shadow-lg h-full animate-tilt-3d">
                {productsLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Spinner />
                  </div>
                ) : (
                  <TodaysDealsSlider products={allProducts} />
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<Package className="w-6 h-6" />} value="500+" label="Products" />
          <StatCard icon={<Users className="w-6 h-6" />} value="2,000+" label="Happy Customers" />
          <StatCard icon={<Star className="w-6 h-6" />} value="4.9" label="Customer Rating" />
          <StatCard icon={<TrendingUp className="w-6 h-6" />} value="98%" label="Satisfaction Rate" />
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 bg-secondary/20 py-16 rounded-3xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Deals</h2>
            <p className="text-muted-foreground">Special pieces selected for you.</p>
          </div>
          <Link href="/products" className={cn(buttonVariants({ variant: "outline" }), "hidden sm:flex")}>
            View All
          </Link>
        </div>
        {featuredLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* How it works / Trust */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose SecondStore?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We provide a trusted marketplace for quality second-hand and new products with transparent pricing.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Feature 
            icon={<ShieldCheck className="w-10 h-10 text-primary" />}
            title="Secure Shopping"
            desc="All products are checked and approved by our expert team."
          />
          <Feature 
            icon={<MessageCircle className="w-10 h-10 text-primary" />}
            title="Easy Communication"
            desc="Make an offer for the product you like with one click, talk to the seller instantly."
          />
          <Feature 
            icon={<Truck className="w-10 h-10 text-primary" />}
            title="Fast Delivery"
            desc="Your products are safely at your door with contracted cargo companies."
          />
        </div>
      </section>
      
      {/* New Arrivals */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">New Arrivals</h2>
            <p className="text-muted-foreground">Fresh products just added to our collection.</p>
          </div>
          <Link href="/products" className={cn(buttonVariants({ variant: "link" }), "text-primary p-0")}>
            See All <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
        {productsLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : newProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No new products at the moment. Check back soon!
          </div>
        )}
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">What Our Customers Say</h2>
          <p className="text-muted-foreground">Real reviews from satisfied customers</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <TestimonialCard 
            name="Ahmet Y."
            text="I found exactly what I was looking for at a great price. The process was smooth and the product arrived quickly."
            rating={5}
          />
          <TestimonialCard 
            name="Elif K."
            text="Love the offer system! I got a beautiful vintage desk for my home office. Highly recommend SecondStore."
            rating={5}
          />
          <TestimonialCard 
            name="Mehmet S."
            text="Great customer service and quality products. Will definitely be shopping here again."
            rating={4}
          />
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-6 rounded-2xl bg-card border text-center hover:border-primary/30 transition-colors hover:shadow-lg"
    >
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
    </motion.div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
  const [count, setCount] = useState(0);
  const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
  const suffix = value.replace(/[0-9]/g, '');
  
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [numericValue]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-card/80 backdrop-blur-sm border rounded-xl p-6 text-center relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <motion.div 
        whileHover={{ rotate: 10, scale: 1.1 }}
        className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-orange-500/10 flex items-center justify-center mx-auto mb-3 text-primary relative z-10"
      >
        {icon}
      </motion.div>
      <div className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent relative z-10">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-muted-foreground relative z-10">{label}</div>
    </motion.div>
  );
}

function TestimonialCard({ name, text, rating }: { name: string, text: string, rating: number }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-card border rounded-xl p-6"
    >
      <div className="flex gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            className={cn("w-4 h-4", i < rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30")} 
          />
        ))}
      </div>
      <p className="text-muted-foreground mb-4">"{text}"</p>
      <div className="font-semibold">{name}</div>
    </motion.div>
  );
}
