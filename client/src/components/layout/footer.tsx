import { Link } from "wouter";
import { Facebook, Instagram, Mail, MapPin, Phone, Send, Loader2 } from "lucide-react";
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
      toast({ title: "Inscription réussie!", description: "Vous recevrez des mises à jour sur les nouveaux produits." });
      setEmail("");
    } catch (error: any) {
      toast({ title: error.message || "Échec de l'inscription", variant: "destructive" });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-secondary/50 border-t pt-16 pb-20 md:pb-8">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-2xl p-6 md:p-8 mb-12 border border-primary/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-2">Restez Informé!</h3>
              <p className="text-muted-foreground text-sm">Abonnez-vous pour être notifié des nouveaux produits et offres spéciales.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre email"
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
                S'abonner
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <img src="/assets/logo-light.png" alt="SecondStore" className="h-20 object-contain dark:hidden" />
            <img src="/assets/logo-dark.png" alt="SecondStore" className="h-20 object-contain hidden dark:block" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Point de rencontre pour des produits d'occasion et neufs de qualité. Atteignez vos produits de rêve avec des achats sécurisés et une communication rapide.
            </p>
            <div className="flex gap-4">
              <SocialLink href="https://www.instagram.com/secondstorech" icon={<Instagram className="w-4 h-4" />} />
              <SocialLink href="https://www.facebook.com/secondstorech" icon={<Facebook className="w-4 h-4" />} />
              <SocialLink 
                href="https://www.tiktok.com/@secondstorech" 
                icon={
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                } 
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Liens Rapides</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Accueil</Link></li>
              <li><Link href="/products" className="hover:text-primary transition-colors">Tous les Produits</Link></li>
              <li><Link href="/how-it-works" className="hover:text-primary transition-colors">Comment ça marche</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Catégories</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/category/furniture" className="hover:text-primary transition-colors">Meubles</Link></li>
              <li><Link href="/category/electronics" className="hover:text-primary transition-colors">Électronique</Link></li>
              <li><Link href="/category/fashion" className="hover:text-primary transition-colors">Mode</Link></li>
              <li><Link href="/category/hobbies" className="hover:text-primary transition-colors">Loisirs</Link></li>
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

        <div className="border-t pt-8 space-y-6">
          <div className="flex flex-wrap justify-center items-center gap-4">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" 
              alt="Mastercard" 
              className="h-5 opacity-70 hover:opacity-100 transition-opacity"
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
              alt="Visa" 
              className="h-5 opacity-70 hover:opacity-100 transition-opacity"
            />
            <img 
              src="https://www.twint.ch/content/themes/twint/images/twint-logo.svg" 
              alt="Twint" 
              className="h-5 opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>© 2026 SecondStore.ch. Tous droits réservés.</p>
            <div className="flex gap-6">
              <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Politique de Confidentialité</Link>
              <Link href="/terms-of-use" className="hover:text-foreground transition-colors">Conditions d'Utilisation</Link>
              <Link href="/cookie-policy" className="hover:text-foreground transition-colors">Politique des Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-8 h-8 flex items-center justify-center rounded-full bg-background border hover:border-primary hover:text-primary transition-colors"
    >
      {icon}
    </a>
  );
}
