import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProduct, getCategories, createProduct, updateProduct } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft, Upload, X, RotateCcw, RotateCw, Save, Eye, 
  ImageIcon, FileText, Settings2, Tag, Sparkles, Check,
  ChevronRight, AlertCircle, Star, Package, Info
} from "lucide-react";
import { Link } from "wouter";
import type { Product, Category } from "@shared/schema";

const conditionOptions = [
  { value: "new", label: "Neuf", color: "bg-emerald-500" },
  { value: "used_like_new", label: "Comme Neuf", color: "bg-blue-500" },
  { value: "used_good", label: "Bon État", color: "bg-amber-500" },
  { value: "used_fair", label: "État Correct", color: "bg-gray-500" },
];

const sections = [
  { id: "info", label: "Informations", icon: FileText },
  { id: "media", label: "Médias", icon: ImageIcon },
  { id: "details", label: "Détails", icon: Info },
  { id: "settings", label: "Paramètres", icon: Settings2 },
];

export function AdminProductEdit() {
  const [, params] = useRoute("/admin/product/:id");
  const [, navigate] = useLocation();
  const productId = params?.id;
  const isNew = productId === "new";
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeSection, setActiveSection] = useState("info");
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
      toast({ title: `${files.length} image(s) téléchargée(s)` });
    } catch (error) {
      toast({ 
        title: error instanceof Error ? error.message : "Échec du téléchargement", 
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
        throw new Error('Échec de la rotation');
      }
      
      const result = await response.json();
      setUploadedImages(prev => prev.map((img, i) => i === index ? result.url : img));
    } catch (error) {
      toast({ title: "Échec de la rotation", variant: "destructive" });
    } finally {
      setIsRotating(null);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const setAsPrimary = (index: number) => {
    if (index === 0) return;
    setUploadedImages(prev => {
      const newImages = [...prev];
      const [removed] = newImages.splice(index, 1);
      newImages.unshift(removed);
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

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
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

  const isValid = formData.title && formData.category && uploadedImages.length > 0;

  if (productLoading && !isNew) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#0a0a0a]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]">
      {/* Sticky Header */}
      <header className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/admins">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div className="hidden sm:block">
                <h1 className="font-semibold text-sm">{isNew ? "Nouveau Produit" : formData.title || "Modifier"}</h1>
                <p className="text-[11px] text-muted-foreground">
                  {isNew ? "Créer un nouveau produit" : "Modification en cours"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isValid && (
                <div className="hidden sm:flex items-center gap-1.5 text-amber-600 text-xs">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Champs requis manquants</span>
                </div>
              )}
              {!isNew && product && (
                <Link href={`/product/${product.slug || productId}`}>
                  <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs">
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Aperçu</span>
                  </Button>
                </Link>
              )}
              <Button 
                onClick={() => handleSubmit()}
                disabled={!isValid || createMutation.isPending || updateMutation.isPending}
                size="sm"
                className="h-8 gap-1.5 text-xs rounded-lg shadow-lg shadow-primary/20"
              >
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Enregistrer</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation - Desktop */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-20">
              <nav className="bg-white dark:bg-white/5 rounded-2xl border border-border/50 p-2 space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {section.label}
                    </button>
                  );
                })}
              </nav>

              {/* Quick Stats */}
              <div className="mt-4 bg-white dark:bg-white/5 rounded-2xl border border-border/50 p-4">
                <h4 className="text-xs font-medium text-muted-foreground mb-3">Résumé</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Images</span>
                    <span className="font-medium">{uploadedImages.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Statut</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-medium",
                      formData.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
                    )}>
                      {formData.isActive ? "Actif" : "Inactif"}
                    </span>
                  </div>
                  {formData.featured && (
                    <div className="flex items-center gap-1.5 text-amber-600">
                      <Star className="w-3.5 h-3.5" />
                      <span className="text-xs">Produit vedette</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Section Tabs */}
          <div className="lg:hidden overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex gap-2 min-w-max">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-lg" 
                        : "bg-white dark:bg-white/5 text-muted-foreground border border-border/50"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {section.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {/* Info Section */}
              {activeSection === "info" && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/50 p-5">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      Informations principales
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title" className="text-xs text-muted-foreground mb-1.5 block">
                          Titre du produit *
                        </Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="ex: Canapé en cuir moderne"
                          className="h-11 rounded-xl bg-secondary/30 border-0"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1.5 block">
                            Catégorie *
                          </Label>
                          <Select 
                            value={formData.category} 
                            onValueChange={(v) => setFormData(prev => ({ ...prev, category: v }))}
                          >
                            <SelectTrigger className="h-11 rounded-xl bg-secondary/30 border-0">
                              <SelectValue placeholder="Sélectionner..." />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat: Category) => (
                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1.5 block">
                            État *
                          </Label>
                          <Select 
                            value={formData.condition} 
                            onValueChange={(v: any) => setFormData(prev => ({ ...prev, condition: v }))}
                          >
                            <SelectTrigger className="h-11 rounded-xl bg-secondary/30 border-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {conditionOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  <div className="flex items-center gap-2">
                                    <span className={cn("w-2 h-2 rounded-full", opt.color)} />
                                    {opt.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/50 p-5">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary" />
                      Tarification
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1.5 block">
                          Prix (CHF)
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">CHF</span>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.price || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value || null }))}
                            placeholder="0.00"
                            className="h-11 pl-12 rounded-xl bg-secondary/30 border-0"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <Label className="text-xs text-muted-foreground">Prix réduit</Label>
                          <div className="flex items-center gap-2">
                            <Switch
                              id="hasDiscount"
                              checked={hasDiscount}
                              onCheckedChange={(checked) => {
                                setHasDiscount(checked);
                                if (!checked) setFormData(prev => ({ ...prev, discountPrice: null }));
                              }}
                            />
                            <Label htmlFor="hasDiscount" className="text-[10px] text-muted-foreground">
                              Promotion
                            </Label>
                          </div>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">CHF</span>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.discountPrice || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, discountPrice: e.target.value || null }))}
                            placeholder="0.00"
                            disabled={!hasDiscount}
                            className={cn(
                              "h-11 pl-12 rounded-xl bg-secondary/30 border-0",
                              !hasDiscount && "opacity-50"
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Media Section */}
              {activeSection === "media" && (
                <motion.div
                  key="media"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/50 p-5">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-primary" />
                      Galerie d'images
                      {uploadedImages.length === 0 && (
                        <span className="text-xs text-red-500 ml-2">* Requis</span>
                      )}
                    </h3>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif,.webp,.heic,.heif,image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      multiple
                    />

                    {/* Image Grid */}
                    {uploadedImages.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                        {uploadedImages.map((img, index) => (
                          <motion.div
                            key={index}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={cn(
                              "relative group rounded-xl overflow-hidden border-2 transition-all",
                              index === 0 ? "border-primary shadow-lg shadow-primary/20" : "border-border/50 hover:border-primary/50"
                            )}
                          >
                            <div className="aspect-square bg-secondary/30 flex items-center justify-center">
                              <img 
                                src={img} 
                                alt={`Image ${index + 1}`} 
                                className="max-w-full max-h-full object-contain p-2"
                              />
                              
                              {/* Primary Badge */}
                              {index === 0 && (
                                <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-medium shadow-lg">
                                  Principal
                                </span>
                              )}

                              {/* Rotating Overlay */}
                              {isRotating === index && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                </div>
                              )}

                              {/* Hover Actions */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-2">
                                <div className="flex items-center justify-between gap-1">
                                  <div className="flex gap-1">
                                    <button
                                      type="button"
                                      onClick={() => rotateImage(index, 'left')}
                                      disabled={isRotating !== null}
                                      className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"
                                    >
                                      <RotateCcw className="w-3.5 h-3.5 text-white" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => rotateImage(index, 'right')}
                                      disabled={isRotating !== null}
                                      className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"
                                    >
                                      <RotateCw className="w-3.5 h-3.5 text-white" />
                                    </button>
                                    {index !== 0 && (
                                      <button
                                        type="button"
                                        onClick={() => setAsPrimary(index)}
                                        className="p-1.5 bg-primary/80 hover:bg-primary rounded-lg backdrop-blur-sm transition-colors"
                                        title="Définir comme principal"
                                      >
                                        <Star className="w-3.5 h-3.5 text-white" />
                                      </button>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="p-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors"
                                  >
                                    <X className="w-3.5 h-3.5 text-white" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Upload Zone */}
                    <div
                      onClick={() => !isUploading && fileInputRef.current?.click()}
                      className={cn(
                        "border-2 border-dashed rounded-2xl cursor-pointer transition-all",
                        "hover:border-primary/50 hover:bg-primary/5",
                        uploadedImages.length === 0 ? "py-12" : "py-6"
                      )}
                    >
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm font-medium">Téléchargement en cours...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center">
                            <Upload className="w-6 h-6 text-primary" />
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-sm">Cliquez pour ajouter des images</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              JPEG, PNG, WebP, HEIC • Max 10MB par image
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Details Section */}
              {activeSection === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {/* Description */}
                  <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/50 p-5">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      Description
                    </h3>
                    <RichTextEditor
                      content={formData.description || ""}
                      onChange={(content) => setFormData(prev => ({ ...prev, description: content }))}
                      placeholder="Décrivez votre produit en détail..."
                    />
                  </div>

                  {/* Specs */}
                  <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/50 p-5">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Package className="w-4 h-4 text-primary" />
                      Spécifications
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1.5 block">
                          Dimensions
                        </Label>
                        <Input
                          value={formData.dimensions || ""}
                          onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
                          placeholder="ex: 100 x 50 x 30 cm"
                          className="h-11 rounded-xl bg-secondary/30 border-0"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1.5 block">
                          Poids
                        </Label>
                        <Input
                          value={formData.weight || ""}
                          onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                          placeholder="ex: 5 kg"
                          className="h-11 rounded-xl bg-secondary/30 border-0"
                        />
                      </div>
                    </div>

                    {/* Included Items */}
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">
                        Éléments inclus
                      </Label>
                      {formData.includedItems && formData.includedItems.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {formData.includedItems.map((item, index) => (
                            <span 
                              key={index}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary/50 rounded-full text-sm"
                            >
                              <Check className="w-3 h-3 text-emerald-500" />
                              {item}
                              <button
                                type="button"
                                onClick={() => removeIncludedItem(index)}
                                className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Input
                          value={newItem}
                          onChange={(e) => setNewItem(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addIncludedItem())}
                          placeholder="Ajouter un élément..."
                          className="h-10 rounded-xl bg-secondary/30 border-0"
                        />
                        <Button 
                          type="button" 
                          onClick={addIncludedItem}
                          variant="secondary"
                          size="sm"
                          className="h-10 px-4 rounded-xl"
                        >
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Settings Section */}
              {activeSection === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/50 p-5">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Settings2 className="w-4 h-4 text-primary" />
                      Visibilité & Options
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Active Toggle */}
                      <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            formData.isActive ? "bg-emerald-500/20" : "bg-red-500/20"
                          )}>
                            {formData.isActive ? (
                              <Eye className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <Eye className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">Produit actif</p>
                            <p className="text-xs text-muted-foreground">
                              {formData.isActive ? "Visible sur le site" : "Masqué du site"}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={formData.isActive}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                        />
                      </div>

                      {/* Featured Toggle */}
                      <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            formData.featured ? "bg-amber-500/20" : "bg-gray-500/10"
                          )}>
                            <Star className={cn(
                              "w-5 h-5",
                              formData.featured ? "text-amber-500 fill-amber-500" : "text-gray-400"
                            )} />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Produit vedette</p>
                            <p className="text-xs text-muted-foreground">Affiché en avant sur la page d'accueil</p>
                          </div>
                        </div>
                        <Switch
                          checked={formData.featured}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                        />
                      </div>

                      {/* New Arrival Toggle */}
                      <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            formData.isNew ? "bg-blue-500/20" : "bg-gray-500/10"
                          )}>
                            <Sparkles className={cn(
                              "w-5 h-5",
                              formData.isNew ? "text-blue-500" : "text-gray-400"
                            )} />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Nouvelle arrivée</p>
                            <p className="text-xs text-muted-foreground">Badge "Nouveau" affiché</p>
                          </div>
                        </div>
                        <Switch
                          checked={formData.isNew}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isNew: checked }))}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Preview Panel - Desktop */}
          <aside className="hidden xl:block w-72 shrink-0">
            <div className="sticky top-20">
              <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/50 overflow-hidden">
                <div className="p-4 border-b border-border/50">
                  <h4 className="text-xs font-medium text-muted-foreground">Aperçu</h4>
                </div>
                <div className="p-4">
                  {uploadedImages.length > 0 ? (
                    <div className="aspect-square bg-secondary/30 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
                      <img 
                        src={uploadedImages[0]} 
                        alt="Preview" 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-secondary/30 rounded-xl mb-4 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <h3 className="font-medium text-sm line-clamp-2 mb-1">
                    {formData.title || "Titre du produit"}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {categories.find(c => c.id === formData.category)?.name || "Catégorie"}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] font-medium",
                      conditionOptions.find(c => c.value === formData.condition)?.color,
                      "text-white"
                    )}>
                      {conditionOptions.find(c => c.value === formData.condition)?.label}
                    </span>
                    {formData.price && (
                      <span className="text-sm font-semibold">
                        CHF {parseFloat(formData.price).toFixed(0)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-border/50 p-4 safe-area-pb">
        <Button 
          onClick={() => handleSubmit()}
          disabled={!isValid || createMutation.isPending || updateMutation.isPending}
          className="w-full h-12 rounded-xl shadow-lg shadow-primary/20 gap-2"
        >
          {(createMutation.isPending || updateMutation.isPending) ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          Enregistrer le produit
        </Button>
      </div>
    </div>
  );
}
