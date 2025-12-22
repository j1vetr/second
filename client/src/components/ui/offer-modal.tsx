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
import { motion } from "framer-motion"
import { Confetti } from "@/components/ui/confetti"
import { RippleButton } from "@/components/ui/ripple-button"
import { Sparkles, CheckCircle2 } from "lucide-react"

export function OfferModal({ product }: { product: Product }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const offerMutation = useMutation({
    mutationFn: createOffer,
    onSuccess: () => {
      setShowConfetti(true);
      setShowSuccess(true);
      setTimeout(() => {
        setShowConfetti(false);
        setShowSuccess(false);
        setOpen(false);
        toast({
          title: "🎉 Offer Received!",
          description: "We will contact you as soon as possible.",
          duration: 5000,
        });
      }, 2500);
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
    <>
      <Confetti show={showConfetti} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <RippleButton className="w-full h-14 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white rounded-xl text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 inline-flex items-center justify-center gap-2 group">
            <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
            Get Offer Now
          </RippleButton>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          {showSuccess ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </motion.div>
              <motion.h3 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold mb-2"
              >
                Offer Submitted!
              </motion.h3>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground"
              >
                We'll get back to you soon!
              </motion.p>
            </motion.div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Request Offer
                </DialogTitle>
                <DialogDescription>
                  Fill out the form to get an offer for <strong>{product.title}</strong>.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" required placeholder="John Doe" className="transition-all focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" required placeholder="+90 5XX XXX XX XX" className="transition-all focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required placeholder="example@email.com" className="transition-all focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Offer Amount</Label>
                  <Input id="amount" name="amount" type="text" required placeholder="e.g., 500 CHF" className="transition-all focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="note">Note (Optional)</Label>
                  <Textarea id="note" name="note" placeholder="Any questions about the product..." className="transition-all focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
                    I accept the privacy policy and terms of use.
                  </Label>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    type="submit" 
                    className="w-full mt-2 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90" 
                    disabled={offerMutation.isPending}
                  >
                    {offerMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Submitting...
                      </span>
                    ) : "Submit Offer"}
                  </Button>
                </motion.div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
