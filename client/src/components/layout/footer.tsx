import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { subscribeToNewsletter } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);
    try {
      await subscribeToNewsletter(email.trim());
      toast({ title: "Successfully subscribed!", description: "You'll receive updates about new products." });
      setEmail("");
    } catch (error: any) {
      toast({ title: error.message || "Failed to subscribe", variant: "destructive" });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-secondary/50 border-t pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-2xl p-6 md:p-8 mb-12 border border-primary/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-2">Stay Updated!</h3>
              <p className="text-muted-foreground text-sm">Subscribe to get notified about new products and special offers.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 min-w-0 md:w-64 px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
                data-testid="input-newsletter-email"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
                data-testid="button-newsletter-subscribe"
              >
                {isSubscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <img src="/assets/logo.png" alt="SecondStore" className="h-20 object-contain" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Meeting point for premium second-hand and new products. Reach your dream products with secure shopping and fast communication.
            </p>
            <div className="flex gap-4">
              <ButtonIcon icon={<Instagram className="w-4 h-4" />} />
              <ButtonIcon icon={<Twitter className="w-4 h-4" />} />
              <ButtonIcon icon={<Facebook className="w-4 h-4" />} />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/products" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/how-it-works" className="hover:text-primary transition-colors">How it Works</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Categories</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/category/furniture" className="hover:text-primary transition-colors">Furniture</Link></li>
              <li><Link href="/category/electronics" className="hover:text-primary transition-colors">Electronics</Link></li>
              <li><Link href="/category/fashion" className="hover:text-primary transition-colors">Fashion</Link></li>
              <li><Link href="/category/hobbies" className="hover:text-primary transition-colors">Hobbies</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Contact</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>Fritz-Oppliger-Strasse 18,<br />2504 Biel</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+41 78 866 44 92</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>info@secondstore.ch</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2025 SecondStore.ch. All rights reserved.</p>
          <p>
            Developed by{" "}
            <a href="https://toov.com.tr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
              TOOV
            </a>{" "}
            &lt;3
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-use" className="hover:text-foreground transition-colors">Terms of Use</Link>
            <Link href="/cookie-policy" className="hover:text-foreground transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ButtonIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-background border hover:border-primary hover:text-primary transition-colors">
      {icon}
    </a>
  );
}
