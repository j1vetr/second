import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, Pencil, Trash2, Settings, Home, LogOut, 
  Megaphone, Clock, Eye, X, ArrowLeft
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCampaignPopups, createCampaignPopup, updateCampaignPopup, deleteCampaignPopup, getProducts } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CampaignPopup, InsertCampaignPopup } from "@shared/schema";

const typeLabels: Record<string, string> = {
  'announcement': 'Annonce',
  'product_promo': 'Promotion Produit',
  'newsletter': 'Newsletter',
  'custom_link': 'Lien Personnalisé',
};

const frequencyLabels: Record<string, string> = {
  'always': 'Toujours',
  'once_per_session': 'Une fois par session',
  'once_per_day': 'Une fois par jour',
};

export function AdminCampaignPopups() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPopup, setEditingPopup] = useState<CampaignPopup | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: popups = [], isLoading } = useQuery({
    queryKey: ["campaign-popups"],
    queryFn: getCampaignPopups,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  const createMutation = useMutation({
    mutationFn: createCampaignPopup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaign-popups"] });
      toast({ title: "Popup créé avec succès" });
      setIsFormOpen(false);
    },
    onError: () => {
      toast({ title: "Échec de la création du popup", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertCampaignPopup> }) =>
      updateCampaignPopup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaign-popups"] });
      toast({ title: "Popup mis à jour avec succès" });
      setEditingPopup(null);
      setIsFormOpen(false);
    },
    onError: () => {
      toast({ title: "Échec de la mise à jour du popup", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCampaignPopup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaign-popups"] });
      toast({ title: "Popup supprimé avec succès" });
    },
    onError: () => {
      toast({ title: "Échec de la suppression du popup", variant: "destructive" });
    },
  });

  const handleOpenForm = (popup?: CampaignPopup) => {
    setEditingPopup(popup || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingPopup(null);
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]">
      <header className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admins">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary via-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-primary/25">
                <Megaphone className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-semibold text-base">Popups de Campagne</h1>
                <p className="text-[11px] text-muted-foreground -mt-0.5">Gestion des popups promotionnels</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Link href="/">
                <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground hover:text-foreground">
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs">Site</span>
                </Button>
              </Link>
              <Link href="/admin-login">
                <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground hover:text-foreground">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs">Sortir</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Tous les Popups</h2>
          <Button onClick={() => handleOpenForm()} className="gap-2">
            <Plus className="w-4 h-4" />
            Nouveau Popup
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : popups.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-white/5 rounded-2xl border border-border/50 p-12 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
              <Megaphone className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Aucun popup</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Créez votre premier popup promotionnel
            </p>
            <Button onClick={() => handleOpenForm()} className="gap-2">
              <Plus className="w-4 h-4" /> Créer un popup
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence>
              {popups.map((popup, index) => (
                <motion.div
                  key={popup.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {popup.imageUrl && (
                          <div className="w-20 h-20 rounded-lg bg-secondary/30 overflow-hidden shrink-0">
                            <img 
                              src={popup.imageUrl} 
                              alt={popup.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium truncate" data-testid={`text-popup-title-${popup.id}`}>
                              {popup.title}
                            </h3>
                            <Badge variant={popup.isEnabled ? "default" : "secondary"}>
                              {popup.isEnabled ? "Actif" : "Inactif"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {popup.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <Megaphone className="w-3 h-3" />
                              {typeLabels[popup.type] || popup.type}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Délai: {popup.delaySeconds}s
                            </span>
                            <span>
                              {frequencyLabels[popup.frequency] || popup.frequency}
                            </span>
                            <span>
                              Priorité: {popup.priority}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenForm(popup)}
                            data-testid={`button-edit-popup-${popup.id}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              if (confirm(`Supprimer "${popup.title}" ?`)) {
                                deleteMutation.mutate(popup.id);
                              }
                            }}
                            data-testid={`button-delete-popup-${popup.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPopup ? "Modifier le Popup" : "Nouveau Popup"}
            </DialogTitle>
          </DialogHeader>
          <PopupForm
            popup={editingPopup}
            products={products}
            onSubmit={(data) => {
              if (editingPopup) {
                updateMutation.mutate({ id: editingPopup.id, data });
              } else {
                createMutation.mutate(data as InsertCampaignPopup);
              }
            }}
            onCancel={handleCloseForm}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface PopupFormProps {
  popup: CampaignPopup | null;
  products: { id: string; title: string }[];
  onSubmit: (data: Partial<InsertCampaignPopup>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

function PopupForm({ popup, products, onSubmit, onCancel, isLoading }: PopupFormProps) {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    imageUrl: string;
    buttonText: string;
    buttonLink: string;
    productId: string;
    type: "announcement" | "product_promo" | "newsletter" | "custom_link";
    isEnabled: boolean;
    delaySeconds: number;
    durationSeconds: number | null;
    frequency: "always" | "once_per_session" | "once_per_day";
    priority: number;
  }>({
    title: popup?.title || "",
    description: popup?.description || "",
    imageUrl: popup?.imageUrl || "",
    buttonText: popup?.buttonText || "",
    buttonLink: popup?.buttonLink || "",
    productId: popup?.productId || "",
    type: popup?.type || "announcement",
    isEnabled: popup?.isEnabled ?? false,
    delaySeconds: popup?.delaySeconds ?? 3,
    durationSeconds: popup?.durationSeconds || null,
    frequency: popup?.frequency || "once_per_session",
    priority: popup?.priority ?? 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      productId: formData.productId || null,
      durationSeconds: formData.durationSeconds || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            data-testid="input-popup-title"
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            data-testid="input-popup-description"
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="imageUrl">URL de l'image</Label>
          <Input
            id="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="/uploads/image.webp"
            data-testid="input-popup-image"
          />
        </div>

        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(v: "announcement" | "product_promo" | "newsletter" | "custom_link") => setFormData({ ...formData, type: v })}>
            <SelectTrigger data-testid="select-popup-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="announcement">Annonce</SelectItem>
              <SelectItem value="product_promo">Promotion Produit</SelectItem>
              <SelectItem value="newsletter">Newsletter</SelectItem>
              <SelectItem value="custom_link">Lien Personnalisé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="frequency">Fréquence</Label>
          <Select value={formData.frequency} onValueChange={(v: "always" | "once_per_session" | "once_per_day") => setFormData({ ...formData, frequency: v })}>
            <SelectTrigger data-testid="select-popup-frequency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="always">Toujours</SelectItem>
              <SelectItem value="once_per_session">Une fois par session</SelectItem>
              <SelectItem value="once_per_day">Une fois par jour</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.type === "product_promo" && (
          <div className="col-span-2">
            <Label htmlFor="productId">Produit</Label>
            <Select value={formData.productId} onValueChange={(v) => setFormData({ ...formData, productId: v })}>
              <SelectTrigger data-testid="select-popup-product">
                <SelectValue placeholder="Sélectionner un produit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucun</SelectItem>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label htmlFor="buttonText">Texte du bouton</Label>
          <Input
            id="buttonText"
            value={formData.buttonText}
            onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
            placeholder="Découvrir"
            data-testid="input-popup-button-text"
          />
        </div>

        <div>
          <Label htmlFor="buttonLink">Lien du bouton</Label>
          <Input
            id="buttonLink"
            value={formData.buttonLink}
            onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
            placeholder="/products"
            data-testid="input-popup-button-link"
          />
        </div>

        <div>
          <Label htmlFor="delaySeconds">Délai (secondes)</Label>
          <Input
            id="delaySeconds"
            type="number"
            min={0}
            value={formData.delaySeconds}
            onChange={(e) => setFormData({ ...formData, delaySeconds: parseInt(e.target.value) || 0 })}
            data-testid="input-popup-delay"
          />
        </div>

        <div>
          <Label htmlFor="priority">Priorité</Label>
          <Input
            id="priority"
            type="number"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
            data-testid="input-popup-priority"
          />
        </div>

        <div className="col-span-2 flex items-center gap-3">
          <Switch
            id="isEnabled"
            checked={formData.isEnabled}
            onCheckedChange={(checked) => setFormData({ ...formData, isEnabled: checked })}
            data-testid="switch-popup-enabled"
          />
          <Label htmlFor="isEnabled" className="cursor-pointer">
            Activer ce popup
          </Label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading} data-testid="button-save-popup">
          {isLoading ? <Spinner className="w-4 h-4" /> : (popup ? "Mettre à jour" : "Créer")}
        </Button>
      </div>
    </form>
  );
}
