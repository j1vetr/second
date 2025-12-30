import { useState, useRef, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProduct, getCategories, createProduct, updateProduct } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ArrowLeft, Upload, X, RotateCcw, RotateCw, GripVertical, Save, Settings, Home, Eye } from "lucide-react";
import { Link } from "wouter";
import type { Product, Category } from "@shared/schema";

const conditionOptions = [
  { value: "new", label: "Neuf" },
  { value: "used_like_new", label: "Comme Neuf" },
  { value: "used_good", label: "Bon État" },
  { value: "used_fair", label: "État Correct" },
];

export function AdminProductEdit() {
  const [, params] = useRoute("/admin/product/:id");
  const [, navigate] = useLocation();
  const productId = params?.id;
  const isNew = productId === "new";
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    condition: "new" as "new" | "used_like_new" | "used_good" | "used_fair",
    image: "",
    images: [] as string[],
    description: "",
    dimensions: "",
    weight: "",
    includedItems: [] as string[],
    featured: false,
    isNew: false,
    isActive: true,
    price: "" as string | null,
    discountPrice: "" as string | null,
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isRotating, setIsRotating] = useState<number | null>(null);
  const [newItem, setNewItem] = useState("");
  const [hasDiscount, setHasDiscount] = useState(false);

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId!),
    enabled: !isNew && !!productId,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  useEffect(() => {
    if (product && !isNew) {
      const imgs = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);
      setFormData({
        title: product.title,
        category: product.category,
        condition: product.condition,
        image: product.image,
        images: imgs,
        description: product.description || "",
        dimensions: product.dimensions || "",
        weight: product.weight || "",
        includedItems: product.includedItems || [],
        featured: product.featured || false,
        isNew: product.isNew || false,
        isActive: product.isActive ?? true,
        price: product.price || "",
        discountPrice: product.discountPrice || "",
      });
      setUploadedImages(imgs);
      setHasDiscount(!!product.discountPrice);
    }
  }, [product, isNew]);

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Produit créé avec succès" });
      navigate("/admins");
    },
    onError: () => {
      toast({ title: "Échec de la création du produit", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      toast({ title: "Produit mis à jour avec succès" });
      navigate("/admins");
    },
    onError: () => {
      toast({ title: "Échec de la mise à jour du produit", variant: "destructive" });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
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
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const rotateImage = async (index: number, direction: 'left' | 'right') => {
    const imageUrl = uploadedImages[index];
    if (!imageUrl) return;
    
    setIsRotating(index);
    try {
      const response = await fetch('/api/rotate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: imageUrl.split('?')[0], direction }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Échec de la rotation');
      }
      
      const result = await response.json();
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

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const moveImage = (from: number, to: number) => {
    setUploadedImages(prev => {
      const newImages = [...prev];
      const [removed] = newImages.splice(from, 1);
      newImages.splice(to, 0, removed);
      return newImages;
    });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || uploadedImages.length === 0) {
      toast({ title: "Veuillez remplir tous les champs obligatoires", variant: "destructive" });
      return;
    }

    const productData = {
      title: formData.title,
      category: formData.category,
      condition: formData.condition,
      image: uploadedImages[0],
      images: uploadedImages,
      description: formData.description || null,
      dimensions: formData.dimensions || null,
      weight: formData.weight || null,
      includedItems: formData.includedItems,
      featured: formData.featured,
      isNew: formData.isNew,
      isActive: formData.isActive,
      price: formData.price || null,
      discountPrice: hasDiscount ? formData.discountPrice : null,
    };

    if (isNew) {
      createMutation.mutate(productData as any);
    } else {
      updateMutation.mutate({ id: productId!, data: productData });
    }
  };

  if (productLoading && !isNew) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/20 via-background to-secondary/10">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-xl border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-3xl mx-auto px-4">
          <div className="h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/admins">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="font-semibold text-sm">{isNew ? "Nouveau Produit" : "Modifier le Produit"}</h1>
                <p className="text-xs text-muted-foreground">SecondStore.ch</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isNew && product && (
                <Link href={`/product/${productId}`}>
                  <Button variant="ghost" size="sm" className="gap-1.5 h-8">
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Voir</span>
                  </Button>
                </Link>
              )}
              <Button 
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
                size="sm"
                className="gap-1.5 h-8"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {(createMutation.isPending || updateMutation.isPending) ? "..." : "Enregistrer"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Form Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Informations de Base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="ex: Canapé en cuir moderne"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(v) => setFormData(prev => ({ ...prev, category: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat: Category) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">État *</Label>
                  <Select 
                    value={formData.condition} 
                    onValueChange={(v: "new" | "used_like_new" | "used_good" | "used_fair") => setFormData(prev => ({ ...prev, condition: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {conditionOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Prix (CHF)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value || null }))}
                    placeholder="ex: 299.00"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="discountPrice">Prix Réduit</Label>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="hasDiscount"
                        checked={hasDiscount}
                        onCheckedChange={(checked) => {
                          setHasDiscount(checked);
                          if (!checked) setFormData(prev => ({ ...prev, discountPrice: null }));
                        }}
                      />
                      <Label htmlFor="hasDiscount" className="text-xs text-muted-foreground">Promo</Label>
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Images *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.webp,.heic,.heif,image/*"
                onChange={handleFileUpload}
                className="hidden"
                multiple
              />
              
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {uploadedImages.map((img, index) => (
                    <div 
                      key={index} 
                      className={`relative rounded-xl overflow-hidden border-2 ${index === 0 ? 'border-primary' : 'border-border'} bg-secondary/30`}
                    >
                      <div className="aspect-square bg-secondary/50 flex items-center justify-center">
                        <img 
                          src={img} 
                          alt={`Product ${index + 1}`} 
                          className="max-w-full max-h-full object-contain"
                        />
                        {index === 0 && (
                          <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                            Principal
                          </span>
                        )}
                        {isRotating === index && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                      <div className="p-1.5 bg-background/80 flex items-center justify-between gap-1">
                        <div className="flex items-center gap-0.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => rotateImage(index, 'left')}
                            disabled={isRotating !== null}
                            className="h-7 w-7 p-0"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => rotateImage(index, 'right')}
                            disabled={isRotating !== null}
                            className="h-7 w-7 p-0"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                          </Button>
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => moveImage(index, 0)}
                              className="h-7 w-7 p-0"
                            >
                              <GripVertical className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-xl cursor-pointer hover:border-primary/50 hover:bg-secondary/30 transition-all"
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2 py-6">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-muted-foreground">Téléchargement...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-6">
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                      <Upload className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">Cliquez pour télécharger</p>
                    <p className="text-xs text-muted-foreground">JPEG, PNG, WebP (max 10MB)</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Détails</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="isActive" className="text-sm">
                    Actif <span className={`text-xs px-1.5 py-0.5 rounded ${formData.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {formData.isActive ? 'Visible' : 'Masqué'}
                    </span>
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  />
                  <Label htmlFor="featured" className="text-sm">Vedette</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="isNew"
                    checked={formData.isNew}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isNew: checked }))}
                  />
                  <Label htmlFor="isNew" className="text-sm">Nouvelle Arrivée</Label>
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
                    placeholder="Ajouter un article"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addIncludedItem();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addIncludedItem} size="sm">
                    Ajouter
                  </Button>
                </div>
                {formData.includedItems && formData.includedItems.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.includedItems.map((item, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-secondary rounded-full text-sm">
                        {item}
                        <button type="button" onClick={() => removeIncludedItem(i)} className="hover:text-destructive">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-3 pb-6">
            <Link href="/admins" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Annuler
              </Button>
            </Link>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) ? "Enregistrement..." : (isNew ? "Créer le Produit" : "Mettre à Jour")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
