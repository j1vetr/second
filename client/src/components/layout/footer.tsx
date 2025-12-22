import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <img src="/assets/logo.png" alt="SecondStore" className="h-8 object-contain" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium ikinci el ve sıfır ürünlerin buluşma noktası. Güvenli alışveriş ve hızlı iletişim ile hayalinizdeki ürünlere ulaşın.
            </p>
            <div className="flex gap-4">
              <ButtonIcon icon={<Instagram className="w-4 h-4" />} />
              <ButtonIcon icon={<Twitter className="w-4 h-4" />} />
              <ButtonIcon icon={<Facebook className="w-4 h-4" />} />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Hızlı Bağlantılar</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/"><a className="hover:text-primary transition-colors">Ana Sayfa</a></Link></li>
              <li><Link href="/products"><a className="hover:text-primary transition-colors">Tüm Ürünler</a></Link></li>
              <li><Link href="/about"><a className="hover:text-primary transition-colors">Hakkımızda</a></Link></li>
              <li><Link href="/contact"><a className="hover:text-primary transition-colors">İletişim</a></Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Kategoriler</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/category/furniture"><a className="hover:text-primary transition-colors">Mobilya</a></Link></li>
              <li><Link href="/category/electronics"><a className="hover:text-primary transition-colors">Elektronik</a></Link></li>
              <li><Link href="/category/fashion"><a className="hover:text-primary transition-colors">Giyim & Moda</a></Link></li>
              <li><Link href="/category/hobbies"><a className="hover:text-primary transition-colors">Hobi</a></Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">İletişim</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>İstanbul, Türkiye<br />Merkez Ofis</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+90 (555) 123 45 67</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>info@secondstore.ch</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2024 SecondStore.ch. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Gizlilik Politikası</a>
            <a href="#" className="hover:text-foreground">Kullanım Şartları</a>
            <a href="#" className="hover:text-foreground">Çerez Politikası</a>
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
