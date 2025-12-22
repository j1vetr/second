import { ArrowRight, ShieldCheck, Truck, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import { CategoryCard } from "@/components/ui/category-card";
import { CATEGORIES, MOCK_PRODUCTS } from "@/lib/mockData";
import { motion } from "framer-motion";

export function Home() {
  const featuredProducts = MOCK_PRODUCTS.filter(p => p.featured);
  const newProducts = MOCK_PRODUCTS.filter(p => p.isNew).slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary/30 pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Aradığın Fırsat, <br className="hidden md:block" />
              <span className="text-primary">SecondStore</span>'da Seni Bekliyor.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Premium ikinci el ve sıfır ürünler için güvenilir adres. 
              Fiyat yok, stres yok. Beğen, teklif ver, sahip ol.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/products">
                <Button size="lg" className="h-12 px-8 text-base bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 w-full sm:w-auto">
                  Ürünleri Keşfet
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base w-full sm:w-auto">
                  Nasıl Çalışır?
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Abstract Background Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Kategorilere Göz At</h2>
          <Link href="/products">
            <Button variant="link" className="text-primary p-0">Tümünü Gör <ArrowRight className="ml-2 w-4 h-4" /></Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map(cat => (
            <CategoryCard key={cat.id} id={cat.id} name={cat.name} iconName={cat.icon} />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 bg-secondary/20 py-16 rounded-3xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Öne Çıkan Fırsatlar</h2>
            <p className="text-muted-foreground">Sizin için seçtiğimiz en özel parçalar.</p>
          </div>
          <Link href="/products">
            <Button variant="outline" className="hidden sm:flex">Hepsini İncele</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* How it works / Trust */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <Feature 
            icon={<ShieldCheck className="w-10 h-10 text-primary" />}
            title="Güvenli Alışveriş"
            desc="Tüm ürünler uzman ekibimiz tarafından kontrol edilir ve onaylanır."
          />
          <Feature 
            icon={<MessageCircle className="w-10 h-10 text-primary" />}
            title="Kolay İletişim"
            desc="Beğendiğiniz ürün için tek tıkla teklif verin, satıcıyla anında görüşün."
          />
          <Feature 
            icon={<Truck className="w-10 h-10 text-primary" />}
            title="Hızlı Teslimat"
            desc="Anlaşmalı kargo firmaları ile ürünleriniz güvenle kapınızda."
          />
        </div>
      </section>
      
      {/* New Arrivals */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">Yeni Eklenenler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-card border text-center hover:border-primary/30 transition-colors">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );
}
