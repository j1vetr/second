import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { Product } from "@/lib/mockData"

export function OfferModal({ product }: { product: Product }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    toast({
      title: "Teklifiniz Alındı!",
      description: "En kısa sürede sizinle iletişime geçeceğiz.",
      duration: 5000,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="flex-1 bg-primary hover:bg-primary/90 text-lg py-6 shadow-lg shadow-primary/25">
          Hemen Teklif Al
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Teklif İste</DialogTitle>
          <DialogDescription>
            <strong>{product.title}</strong> için teklif formunu doldurun.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Ad Soyad</Label>
            <Input id="name" required placeholder="Adınız Soyadınız" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input id="phone" type="tel" required placeholder="05XX XXX XX XX" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">E-posta</Label>
            <Input id="email" type="email" required placeholder="ornek@email.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="note">Notunuz (Opsiyonel)</Label>
            <Textarea id="note" placeholder="Ürün hakkında sormak istedikleriniz..." />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" required />
            <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
              KVKK ve kullanım şartlarını kabul ediyorum.
            </Label>
          </div>
          <Button type="submit" className="w-full mt-2">Teklifi Gönder</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
