import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Plus, X, Upload, GripVertical, RotateCw, RotateCcw } from "lucide-react";
import type { Product, Category, InsertProduct } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  trigger?: React.ReactNode;
}

export function ProductForm({ product, categories, trigger }: ProductFormProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<Partial<InsertProduct>>({
    title: product?.title || "",
    category: product?.category || "",
    condition: product?.condition || "new",
    image: product?.image || "",
    images: product?.images || [],
    description: product?.description || "",
    dimensions: product?.dimensions || "",
    weight: product?.weight || "",
    featured: product?.featured || false,
    isNew: product?.isNew || false,
    isActive: product?.isActive ?? true,
    includedItems: product?.includedItems || [],
    price: product?.price || null,
    discountPrice: product?.discountPrice || null,
  });
  const [hasDiscount, setHasDiscount] = useState(!!product?.discountPrice);
  
  const [newItem, setNewItem] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isRotating, setIsRotating] = useState<number | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>(
    product?.images?.length ? product.images : (product?.image ? [product.image] : [])
  );

  const createMutation = useMutation({
    mutationFn: (data: InsertProduct) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({ title: "Produit créé avec succès" });
      setOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Échec de la création du produit", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<InsertProduct>) => updateProduct(product!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({ title: "Produit mis à jour avec succès" });
      setOpen(false);
    },
    onError: () => {
      toast({ title: "Échec de la mise à jour du produit", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      condition: "new",
      image: "",
      images: [],
      description: "",
      dimensions: "",
      weight: "",
      featured: false,
      isNew: false,
      isActive: true,
      includedItems: [],
      price: null,
      discountPrice: null,
    });
    setUploadedImages([]);
    setHasDiscount(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      for (const file of Array.from(files)) {
        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          toast({ title: `${file.name} est trop volumineux. Taille maximum: 10MB.`, variant: "destructive" });
          continue;
        }

        // Upload file
        const formDataUpload = new FormData();
        formDataUpload.append("image", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Échec du téléchargement");
        }

        const result = await response.json();
        setUploadedImages(prev => [...prev, result.url]);
      }
      
      toast({ title: `${files.length} image(s) téléchargée(s) avec succès` });
    } catch (error) {
      toast({ 
        title: error instanceof Error ? error.message : "Échec du téléchargement de l'image", 
        variant: "destructive" 
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    setUploadedImages(prev => {
      const newImages = [...prev];
      const [removed] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, removed);
      return newImages;
    });
  };

  const rotateImage = async (index: number, direction: 'left' | 'right') => {
    const imageUrl = uploadedImages[index];
    // Only allow rotating uploaded images (not external URLs)
    if (!imageUrl.startsWith('/uploads/')) {
      toast({ title: "Impossible de faire pivoter les images externes", variant: "destructive" });
      return;
    }
    
    // Remove cache buster if present for the API call
    const cleanUrl = imageUrl.split('?')[0];
    
    setIsRotating(index);
    try {
      const response = await fetch('/api/rotate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: cleanUrl, direction })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Échec de la rotation');
      }
      
      const result = await response.json();
      // Update the image URL with cache buster to force reload
      setUploadedImages(prev => prev.map((img, i) => 
        i === index ? result.url : img
      ));
      toast({ title: `Image pivotée vers la ${direction === 'left' ? 'gauche' : 'droite'}` });
    } catch (error) {
      toast({ 
        title: error instanceof Error ? error.message : "Échec de la rotation de l'image", 
        variant: "destructive" 
      });
    } finally {
      setIsRotating(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || uploadedImages.length === 0) {
      toast({ title: "Veuillez remplir les champs requis et télécharger au moins une image", variant: "destructive" });
      return;
    }

    const submitData = {
      ...formData,
      image: uploadedImages[0], // First image is the main image
      images: uploadedImages,
    };

    if (product) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData as InsertProduct);
    }
  };

  const addIncludedItem = () => {
    if (newItem.trim()) {
      setFormData(prev => ({
        ...prev,
        includedItems: [...(prev.includedItems || []), newItem.trim()]
      }));
      setNewItem("");
    }
  };

  const removeIncludedItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      includedItems: (prev.includedItems || []).filter((_, i) => i !== index)
    }));
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" title={product ? "Modifier" : "Ajouter"}>
            {product ? <Pencil className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4" />}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Modifier le Produit" : "Ajouter un Nouveau Produit"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du Produit *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Entrez le titre du produit"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">État *</Label>
            <Select 
              value={formData.condition} 
              onValueChange={(value: "new" | "used_like_new" | "used_good" | "used_fair") => setFormData(prev => ({ ...prev, condition: value }))}
            >
              <SelectTrigger className="w-full md:w-1/2">
                <SelectValue placeholder="Sélectionner l'état" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Neuf</SelectItem>
                <SelectItem value="used_like_new">Occasion - Comme Neuf</SelectItem>
                <SelectItem value="used_good">Occasion - Bon État</SelectItem>
                <SelectItem value="used_fair">Occasion - État Correct</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 p-4 bg-secondary/30 rounded-lg border">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix (CHF) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value || null }))}
                  placeholder="ex: 299.00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="discountPrice">Prix Réduit (CHF)</Label>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="hasDiscount"
                      checked={hasDiscount}
                      onCheckedChange={(checked) => {
                        setHasDiscount(checked);
                        if (!checked) {
                          setFormData(prev => ({ ...prev, discountPrice: null }));
                        }
                      }}
                    />
                    <Label htmlFor="hasDiscount" className="text-xs text-muted-foreground">En Promo</Label>
                  </div>
                </div>
                <Input
                  id="discountPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.discountPrice || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountPrice: e.target.value || null }))}
                  placeholder="ex: 199.00"
                  disabled={!hasDiscount}
                  className={!hasDiscount ? "opacity-50" : ""}
                />
                {hasDiscount && formData.price && formData.discountPrice && (
                  <p className="text-xs text-green-600">
                    {Math.round((1 - parseFloat(formData.discountPrice as string) / parseFloat(formData.price as string)) * 100)}% de réduction
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Images du Produit * <span className="text-muted-foreground text-xs">(La première image sera l'image principale)</span></Label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.webp,.heic,.heif,.tiff,.tif,.bmp,image/*"
              onChange={handleFileUpload}
              className="hidden"
              multiple
              data-testid="input-image-upload"
            />
            
            {/* Uploaded Images Grid */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                {uploadedImages.map((img, index) => (
                  <div 
                    key={index} 
                    className={`relative rounded-xl overflow-hidden border-2 ${index === 0 ? 'border-primary' : 'border-border'} bg-secondary/30`}
                  >
                    <div className="relative aspect-square bg-secondary/50 flex items-center justify-center">
                      <img 
                        src={img} 
                        alt={`Product ${index + 1}`} 
                        className="max-w-full max-h-full w-auto h-auto object-contain"
                      />
                      {index === 0 && (
                        <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                          Principal
                        </span>
                      )}
                      {isRotating === index && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    
                    {/* Always visible controls below image */}
                    <div className="p-2 bg-background/80 backdrop-blur-sm border-t flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => rotateImage(index, 'left')}
                          title="Tourner à gauche"
                          disabled={isRotating !== null}
                          className="h-9 w-9 p-0"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => rotateImage(index, 'right')}
                          title="Tourner à droite"
                          disabled={isRotating !== null}
                          className="h-9 w-9 p-0"
                        >
                          <RotateCw className="w-4 h-4" />
                        </Button>
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => moveImage(index, 0)}
                            title="Définir comme image principale"
                            className="h-9 w-9 p-0"
                          >
                            <GripVertical className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="h-9 w-9 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Upload Area */}
            <div 
              className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-2 py-4">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-muted-foreground">Téléchargement...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-4">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Cliquez pour télécharger des images</p>
                    <p className="text-xs text-muted-foreground">
                      JPEG, PNG, WebP, HEIC, GIF (max 10MB) - Sélection multiple autorisée
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dimensions">Dimensions</Label>
              <Input
                id="dimensions"
                value={formData.dimensions || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
                placeholder="ex: 100 x 50 x 30 cm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Poids</Label>
              <Input
                id="weight"
                value={formData.weight || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                placeholder="ex: 5 kg"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={formData.isActive ?? true}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive" className="flex items-center gap-2">
                Actif
                <span className={`text-xs px-2 py-0.5 rounded ${formData.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {formData.isActive ? 'Visible' : 'Masqué'}
                </span>
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="featured"
                checked={formData.featured || false}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
              />
              <Label htmlFor="featured">Produit en Vedette</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                id="isNew"
                checked={formData.isNew || false}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isNew: checked }))}
              />
              <Label htmlFor="isNew">Nouvelle Arrivée</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <RichTextEditor
              content={formData.description || ""}
              onChange={(content) => setFormData(prev => ({ ...prev, description: content }))}
              placeholder="Entrez la description du produit..."
            />
          </div>

          <div className="space-y-2">
            <Label>Articles Inclus</Label>
            <div className="flex gap-2">
              <Input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Ajouter un article inclus"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addIncludedItem();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addIncludedItem}>
                Ajouter
              </Button>
            </div>
            {formData.includedItems && formData.includedItems.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.includedItems.map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm">
                    {item}
                    <button type="button" onClick={() => removeIncludedItem(i)} className="hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading || isUploading}>
              {isLoading ? "Enregistrement..." : (product ? "Mettre à Jour" : "Créer le Produit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
