import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronRight, FileText, Scale, AlertTriangle, CreditCard, Package, Ban, Gavel } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";

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

const sections = [
  {
    icon: Scale,
    title: "Acceptance of Terms",
    content: `By accessing and using SecondStore.ch, you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our services.
    
    These terms apply to all visitors, users, and others who access or use our platform.`
  },
  {
    icon: Package,
    title: "Product Listings & Offers",
    content: `SecondStore.ch operates on an offer-based system. Product prices are not fixed, and buyers submit offers for products they wish to purchase.
    
    • All product descriptions are provided in good faith
    • Product conditions are clearly marked as "New" or "Used"
    • SecondStore reserves the right to accept or reject any offer
    • Offers are not binding until accepted by SecondStore`
  },
  {
    icon: CreditCard,
    title: "Payments & Transactions",
    content: `Upon acceptance of your offer:
    
    • Payment details will be communicated via email or WhatsApp
    • Payments must be completed within the specified timeframe
    • All prices are in Swiss Francs (CHF) unless otherwise stated
    • SecondStore is not responsible for any additional fees charged by your bank`
  },
  {
    icon: AlertTriangle,
    title: "Product Condition & Returns",
    content: `All products are sold as described. Please review product descriptions carefully before making an offer.
    
    • New products come with manufacturer warranty where applicable
    • Used products are sold "as-is" unless otherwise specified
    • Returns are accepted within 14 days for products that significantly differ from their description
    • Shipping costs for returns may apply`
  },
  {
    icon: Ban,
    title: "Prohibited Activities",
    content: `Users agree not to:
    
    • Submit fraudulent offers or provide false information
    • Interfere with the proper functioning of the website
    • Attempt to access other users' accounts
    • Use automated systems to interact with our platform
    • Violate any applicable laws or regulations`
  },
  {
    icon: Gavel,
    title: "Limitation of Liability",
    content: `SecondStore.ch shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
    
    We make no warranties regarding the availability, reliability, or quality of our services beyond what is required by law.`
  },
  {
    icon: FileText,
    title: "Changes to Terms",
    content: `We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website.
    
    Your continued use of SecondStore.ch after any changes indicates your acceptance of the new terms.
    
    For questions about these terms, contact us at info@secondstore.ch`
  }
];

export function TermsOfUse() {
  usePageTitle("Terms of Use");
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <div className="container mx-auto px-6 py-12">
        <motion.nav 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
        >
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">Terms of Use</span>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Use</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using our platform. By using SecondStore.ch, you agree to these terms.
          </p>
          <p className="text-sm text-muted-foreground mt-4">Last updated: January 2025</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto space-y-6"
        >
          {sections.map((section, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-card rounded-2xl border p-6 md:p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
