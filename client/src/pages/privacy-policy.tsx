import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronRight, Shield, Eye, Lock, Database, UserCheck, Mail } from "lucide-react";
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
    icon: Eye,
    title: "Information We Collect",
    content: `We collect information you provide directly to us, such as when you create an account, make an offer on a product, or contact us for support. This may include:
    
    • Name and contact information (email, phone number)
    • Shipping and billing addresses
    • Product preferences and offer history
    • Communications with our support team`
  },
  {
    icon: Database,
    title: "How We Use Your Information",
    content: `We use the information we collect to:
    
    • Process your offers and facilitate transactions
    • Send you updates about products and offers
    • Improve our services and user experience
    • Communicate with you about promotions and news
    • Ensure the security of our platform`
  },
  {
    icon: Lock,
    title: "Data Security",
    content: `We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:
    
    • Encryption of sensitive data
    • Regular security assessments
    • Secure data storage practices
    • Limited access to personal information`
  },
  {
    icon: UserCheck,
    title: "Your Rights",
    content: `You have the right to:
    
    • Access your personal data
    • Correct inaccurate information
    • Request deletion of your data
    • Opt-out of marketing communications
    • Export your data in a portable format`
  },
  {
    icon: Shield,
    title: "Third-Party Services",
    content: `We may share your information with trusted third parties who assist us in operating our website and conducting our business. These parties are bound by confidentiality agreements and are only permitted to use your information as necessary to provide services to us.`
  },
  {
    icon: Mail,
    title: "Contact Us",
    content: `If you have any questions about this Privacy Policy or our data practices, please contact us at:
    
    Email: info@secondstore.ch
    Phone: +41 78 866 44 92
    Address: Fritz-Oppliger-Strasse 18, 2504 Biel`
  }
];

export function PrivacyPolicy() {
  usePageTitle("Privacy Policy");
  
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
          <span className="text-foreground font-medium">Privacy Policy</span>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
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
