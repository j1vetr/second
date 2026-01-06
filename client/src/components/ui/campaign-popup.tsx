import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { getActiveCampaignPopup, subscribeToNewsletter } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import type { CampaignPopup } from "@shared/schema";

const POPUP_STORAGE_PREFIX = "secondstore_popup_";

function getStorageKey(popupId: string, frequency: string): string {
  if (frequency === "once_per_day") {
    const today = new Date().toISOString().split("T")[0];
    return `${POPUP_STORAGE_PREFIX}${popupId}_${today}`;
  }
  return `${POPUP_STORAGE_PREFIX}${popupId}`;
}

function shouldShowPopup(popup: CampaignPopup): boolean {
  if (popup.frequency === "always") return true;
  
  const storageKey = getStorageKey(popup.id, popup.frequency);
  
  if (popup.frequency === "once_per_session") {
    return !sessionStorage.getItem(storageKey);
  }
  
  if (popup.frequency === "once_per_day") {
    return !localStorage.getItem(storageKey);
  }
  
  return true;
}

function markPopupAsSeen(popup: CampaignPopup): void {
  const storageKey = getStorageKey(popup.id, popup.frequency);
  
  if (popup.frequency === "once_per_session") {
    sessionStorage.setItem(storageKey, "true");
  } else if (popup.frequency === "once_per_day") {
    localStorage.setItem(storageKey, "true");
  }
}

export function CampaignPopupDisplay() {
  const [isVisible, setIsVisible] = useState(false);
  const [activePopup, setActivePopup] = useState<CampaignPopup | null>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { data: popup } = useQuery({
    queryKey: ["active-campaign-popup"],
    queryFn: getActiveCampaignPopup,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (popup && shouldShowPopup(popup)) {
      const timer = setTimeout(() => {
        setActivePopup(popup);
        setIsVisible(true);
      }, popup.delaySeconds * 1000);

      return () => clearTimeout(timer);
    }
  }, [popup]);

  const handleClose = () => {
    if (activePopup) {
      markPopupAsSeen(activePopup);
    }
    setIsVisible(false);
    setActivePopup(null);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      await subscribeToNewsletter(email);
      toast({ title: "Inscription réussie !" });
      handleClose();
    } catch (error: any) {
      toast({ 
        title: error.message || "Échec de l'inscription", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!activePopup) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={handleClose}
            data-testid="popup-overlay"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90vw] max-w-md"
            data-testid="campaign-popup"
          >
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden">
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-black transition-colors"
                data-testid="button-close-popup"
              >
                <X className="w-4 h-4" />
              </button>

              {activePopup.imageUrl && (
                <div className="aspect-video bg-secondary/30 overflow-hidden">
                  <img
                    src={activePopup.imageUrl}
                    alt={activePopup.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6">
                <h2 className="text-xl font-bold mb-2" data-testid="text-popup-title">
                  {activePopup.title}
                </h2>
                
                {activePopup.description && (
                  <p className="text-muted-foreground mb-4" data-testid="text-popup-description">
                    {activePopup.description}
                  </p>
                )}

                {activePopup.type === "newsletter" ? (
                  <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Votre email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1"
                      data-testid="input-popup-email"
                    />
                    <Button type="submit" disabled={isSubmitting} data-testid="button-popup-subscribe">
                      <Mail className="w-4 h-4 mr-2" />
                      S'inscrire
                    </Button>
                  </form>
                ) : activePopup.buttonText && activePopup.buttonLink ? (
                  activePopup.buttonLink.startsWith("http") ? (
                    <Button
                      className="w-full gap-2"
                      data-testid="button-popup-action"
                      onClick={() => {
                        handleClose();
                        window.open(activePopup.buttonLink!, "_blank", "noopener,noreferrer");
                      }}
                    >
                      {activePopup.buttonText}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Link href={activePopup.buttonLink} onClick={handleClose}>
                      <Button className="w-full gap-2" data-testid="button-popup-action">
                        {activePopup.buttonText}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  )
                ) : null}

                {activePopup.productId && activePopup.type === "product_promo" && (
                  <Link href={`/product/${activePopup.productId}`} onClick={handleClose}>
                    <Button variant="outline" className="w-full mt-2 gap-2" data-testid="button-popup-view-product">
                      Voir le produit
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
