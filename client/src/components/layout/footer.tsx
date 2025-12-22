import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <img src="/assets/logo.png" alt="SecondStore" className="h-12 object-contain" />
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
