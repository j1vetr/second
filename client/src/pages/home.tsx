import { ArrowRight, ShieldCheck, Truck, MessageCircle, Star, Users, Package, TrendingUp, ChevronRight, Zap } from "lucide-react";
import { Link } from "wouter";
import { Button, buttonVariants } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import { CategoryCard } from "@/components/ui/category-card";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getProducts } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import * as Icons from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import type { Product } from "@shared/schema";

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

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section with Category Sidebar */}
      <section className="relative overflow-hidden bg-secondary/30">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Category Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-64 flex-shrink-0"
            >
              <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                <div className="bg-primary text-primary-foreground px-4 py-3 font-semibold">
                  Categories
                </div>
                {categoriesLoading ? (
                  <div className="p-4 flex justify-center">
                    <Spinner />
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
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/50 transition-colors cursor-pointer group"
                            data-testid={`hero-category-${cat.id}`}
                          >
                            <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="text-sm group-hover:text-primary transition-colors">{cat.name}</span>
                            <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground/50 group-hover:text-primary transition-colors" />
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center lg:text-left"
              >
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Premium Products, <span className="text-primary">Your Price</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl mb-6 leading-relaxed">
                  Browse, like it, make an offer. No fixed prices, just great deals.
                </p>
                <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
                  <Link href="/products" className={cn(buttonVariants({ size: "lg" }), "h-12 px-8 text-base bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 w-full sm:w-auto")}>
                    Discover Products
                  </Link>
                  <Link href="/how-it-works" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-12 px-8 text-base w-full sm:w-auto")}>
                    How it Works?
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Today's Deals Slider */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden xl:block w-72 flex-shrink-0"
            >
              <div className="bg-card rounded-2xl p-4 border shadow-sm h-full">
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
        
        {/* Abstract Background Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
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

      {/* Categories Grid */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Browse Categories</h2>
          <Link href="/products" className={cn(buttonVariants({ variant: "link" }), "text-primary p-0")}>
            See All <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
        {categoriesLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map(cat => (
              <CategoryCard key={cat.id} id={cat.id} name={cat.name} iconName={cat.icon} />
            ))}
          </div>
        )}
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

      {/* Newsletter Section */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Subscribe to our newsletter and be the first to know about new arrivals and special offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              data-testid="input-newsletter-email"
            />
            <Button className="bg-primary hover:bg-primary/90 text-white px-6" data-testid="button-subscribe">
              Subscribe
            </Button>
          </div>
        </div>
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
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-card border rounded-xl p-6 text-center"
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 text-primary">
        {icon}
      </div>
      <div className="text-2xl font-bold text-primary">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
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
