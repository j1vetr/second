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
import type { Product } from "@shared/schema"
import { useMutation } from "@tanstack/react-query"
import { createOffer } from "@/lib/api"

export function OfferModal({ product }: { product: Product }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const offerMutation = useMutation({
    mutationFn: createOffer,
    onSuccess: () => {
      toast({
        title: "Offer Received!",
        description: "We will contact you as soon as possible.",
        duration: 5000,
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit offer. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    offerMutation.mutate({
      productId: product.id,
      customerName: formData.get("name") as string,
      customerEmail: formData.get("email") as string,
      customerPhone: formData.get("phone") as string,
      offerAmount: formData.get("amount") as string,
      message: formData.get("note") as string || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-xl text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30">
          Get Offer Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Offer</DialogTitle>
          <DialogDescription>
            Fill out the form to get an offer for <strong>{product.title}</strong>.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" required placeholder="John Doe" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" type="tel" required placeholder="+90 5XX XXX XX XX" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="example@email.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Offer Amount</Label>
            <Input id="amount" name="amount" type="text" required placeholder="e.g., 500 CHF" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="note">Note (Optional)</Label>
            <Textarea id="note" name="note" placeholder="Any questions about the product..." />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" required />
            <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
              I accept the privacy policy and terms of use.
            </Label>
          </div>
          <Button type="submit" className="w-full mt-2" disabled={offerMutation.isPending}>
            {offerMutation.isPending ? "Submitting..." : "Submit Offer"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
