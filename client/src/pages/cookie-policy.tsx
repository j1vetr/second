import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronRight, Cookie, Settings, BarChart3, Target, Clock, ToggleLeft } from "lucide-react";
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

const cookieTypes = [
  {
    icon: Settings,
    title: "Essential Cookies",
    description: "Required for the website to function properly",
    examples: ["Session management", "Security features", "Shopping cart functionality"],
    required: true
  },
  {
    icon: BarChart3,
    title: "Analytics Cookies",
    description: "Help us understand how visitors interact with our website",
    examples: ["Page views", "Time spent on site", "Navigation patterns"],
    required: false
  },
  {
    icon: Target,
    title: "Marketing Cookies",
    description: "Used to deliver relevant advertisements",
    examples: ["Ad personalization", "Campaign effectiveness", "Retargeting"],
    required: false
  },
  {
    icon: Clock,
    title: "Preference Cookies",
    description: "Remember your settings and preferences",
    examples: ["Language preferences", "Theme settings", "Display options"],
    required: false
  }
];

const sections = [
  {
    icon: Cookie,
    title: "What Are Cookies?",
    content: `Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.
    
    Cookies help us remember your preferences, understand how you use our site, and improve your overall experience.`
  },
  {
    icon: ToggleLeft,
    title: "Managing Your Cookies",
    content: `You can control and manage cookies in various ways:
    
    • Browser Settings: Most browsers allow you to refuse or accept cookies, delete existing cookies, or set preferences for certain websites.
    
    • Our Cookie Settings: You can adjust your cookie preferences at any time through the cookie banner on our website.
    
    Please note that disabling certain cookies may affect the functionality of our website.`
  }
];

export function CookiePolicy() {
  usePageTitle("Cookie Policy");
  
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
          <span className="text-foreground font-medium">Cookie Policy</span>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <Cookie className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Learn about how we use cookies and similar technologies to improve your browsing experience.
          </p>
          <p className="text-sm text-muted-foreground mt-4">Last updated: January 2025</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto space-y-8"
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

          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold mb-6 text-center">Types of Cookies We Use</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {cookieTypes.map((cookie, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-card rounded-2xl border p-6 hover:shadow-lg transition-shadow relative overflow-hidden"
                >
                  {cookie.required && (
                    <span className="absolute top-4 right-4 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                      Required
                    </span>
                  )}
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <cookie.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{cookie.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{cookie.description}</p>
                  <ul className="space-y-1">
                    {cookie.examples.map((example, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="w-1 h-1 bg-primary rounded-full" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-2xl border border-primary/20 p-6 md:p-8 text-center"
          >
            <h3 className="text-xl font-semibold mb-3">Questions About Cookies?</h3>
            <p className="text-muted-foreground mb-4">
              If you have any questions about our use of cookies, please contact us.
            </p>
            <p className="text-sm">
              Email: <a href="mailto:info@secondstore.ch" className="text-primary hover:underline">info@secondstore.ch</a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
