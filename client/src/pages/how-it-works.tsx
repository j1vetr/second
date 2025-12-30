import { motion } from "framer-motion";
import { MessageCircle, Search, Truck, CheckCircle2, ShieldCheck, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { usePageTitle } from "@/hooks/use-page-title";

export function HowItWorks() {
  usePageTitle("How It Works");
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">How It Works?</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Whether you are looking for brand new items or premium second-hand treasures, 
              SecondStore makes the process simple, secure, and transparent.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 space-y-24">
        
        {/* Second Hand Process */}
        <section>
          <div className="flex flex-col md:flex-row items-center gap-4 mb-12">
            <div className="bg-primary/10 p-3 rounded-full">
              <Box className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Buying Second-Hand Products</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-border -z-10" />

            <StepCard 
              number={1}
              icon={<Search className="w-6 h-6" />}
              title="Find & Inspect"
              desc="Browse our curated collection. Check high-quality photos and detailed condition reports (New, Like New, Used)."
            />
            <StepCard 
              number={2}
              icon={<MessageCircle className="w-6 h-6" />}
              title="Make an Offer"
              desc="No fixed prices. Use the 'Get Offer' button or contact us via WhatsApp to propose your price or ask questions."
            />
            <StepCard 
              number={3}
              icon={<Truck className="w-6 h-6" />}
              title="Secure Delivery"
              desc="Once agreed, we handle the secure payment and delivery to your doorstep. Inspect upon arrival."
            />
          </div>
        </section>

        {/* New Products Process */}
        <section>
          <div className="flex flex-col md:flex-row items-center gap-4 mb-12">
            <div className="bg-green-500/10 p-3 rounded-full">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold">Buying Brand New Products</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
             {/* Connecting Line (Desktop) */}
             <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-border -z-10" />

            <StepCard 
              number={1}
              icon={<Search className="w-6 h-6" />}
              title="Select Product"
              desc="Explore our catalog of brand new items with full warranty. Filter by 'New' condition to see only fresh stock."
            />
            <StepCard 
              number={2}
              icon={<MessageCircle className="w-6 h-6" />}
              title="Order Direct"
              desc="Contact us directly via WhatsApp for the best current price and stock availability confirmation."
            />
            <StepCard 
              number={3}
              icon={<ShieldCheck className="w-6 h-6" />}
              title="Warranty & Support"
              desc="Receive your brand new product with original packaging and full manufacturer warranty."
            />
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-primary/5 rounded-3xl p-8 md:p-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of satisfied customers who found their perfect match at SecondStore.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/products">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                Browse Products
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact Us
              </Button>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}

function StepCard({ number, icon, title, desc }: { number: number, icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-card p-8 rounded-2xl border shadow-sm relative group hover:shadow-md transition-all">
      <div className="w-12 h-12 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center mb-6 text-foreground group-hover:border-primary group-hover:text-primary transition-colors z-10 relative">
        {icon}
        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
          {number}
        </div>
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
