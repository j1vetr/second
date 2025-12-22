import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Plus, X, Upload, GripVertical } from "lucide-react";
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
  const [uploadedImages, setUploadedImages] = useState<string[]>(
    product?.images?.length ? product.images : (product?.image ? [product.image] : [])
  );

  const createMutation = useMutation({
    mutationFn: (data: InsertProduct) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({ title: "Product created successfully" });
      setOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to create product", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<InsertProduct>) => updateProduct(product!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({ title: "Product updated successfully" });
      setOpen(false);
    },
    onError: () => {
      toast({ title: "Failed to update product", variant: "destructive" });
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
          toast({ title: `${file.name} is too large. Maximum size is 10MB.`, variant: "destructive" });
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
          throw new Error(error.error || "Upload failed");
        }

        const result = await response.json();
        setUploadedImages(prev => [...prev, result.url]);
      }
      
      toast({ title: `${files.length} image(s) uploaded successfully` });
    } catch (error) {
      toast({ 
        title: error instanceof Error ? error.message : "Failed to upload image", 
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || uploadedImages.length === 0) {
      toast({ title: "Please fill in required fields and upload at least one image", variant: "destructive" });
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
          <Button variant="ghost" size="icon" title={product ? "Edit" : "Add"}>
            {product ? <Pencil className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4" />}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Product Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter product title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
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
            <Label htmlFor="condition">Condition *</Label>
            <Select 
              value={formData.condition} 
              onValueChange={(value: "new" | "used") => setFormData(prev => ({ ...prev, condition: value }))}
            >
              <SelectTrigger className="w-full md:w-1/2">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="used">Used</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 p-4 bg-secondary/30 rounded-lg border">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (CHF) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value || null }))}
                  placeholder="e.g., 299.00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="discountPrice">Discount Price (CHF)</Label>
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
                    <Label htmlFor="hasDiscount" className="text-xs text-muted-foreground">On Sale</Label>
                  </div>
                </div>
                <Input
                  id="discountPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.discountPrice || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountPrice: e.target.value || null }))}
                  placeholder="e.g., 199.00"
                  disabled={!hasDiscount}
                  className={!hasDiscount ? "opacity-50" : ""}
                />
                {hasDiscount && formData.price && formData.discountPrice && (
                  <p className="text-xs text-green-600">
                    {Math.round((1 - parseFloat(formData.discountPrice as string) / parseFloat(formData.price as string)) * 100)}% discount
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Product Images * <span className="text-muted-foreground text-xs">(First image will be the main image)</span></Label>
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                {uploadedImages.map((img, index) => (
                  <div 
                    key={index} 
                    className={`relative group rounded-lg overflow-hidden border-2 ${index === 0 ? 'border-primary' : 'border-transparent'}`}
                  >
                    <img 
                      src={img} 
                      alt={`Product ${index + 1}`} 
                      className="w-full h-24 object-cover"
                    />
                    {index === 0 && (
                      <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                        Main
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => moveImage(index, 0)}
                          title="Set as main image"
                        >
                          <GripVertical className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(index)}
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
                  <span className="text-sm text-muted-foreground">Uploading...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-4">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Click to upload images</p>
                    <p className="text-xs text-muted-foreground">
                      JPEG, PNG, WebP, HEIC, GIF (max 10MB each) - Multiple selection allowed
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
                placeholder="e.g., 100 x 50 x 30 cm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                value={formData.weight || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                placeholder="e.g., 5 kg"
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
                Active
                <span className={`text-xs px-2 py-0.5 rounded ${formData.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {formData.isActive ? 'Visible' : 'Hidden'}
                </span>
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="featured"
                checked={formData.featured || false}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
              />
              <Label htmlFor="featured">Featured Product</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                id="isNew"
                checked={formData.isNew || false}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isNew: checked }))}
              />
              <Label htmlFor="isNew">New Arrival</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description (HTML supported)</Label>
            <RichTextEditor
              content={formData.description || ""}
              onChange={(content) => setFormData(prev => ({ ...prev, description: content }))}
              placeholder="Enter product description..."
            />
          </div>

          <div className="space-y-2">
            <Label>Included Items</Label>
            <div className="flex gap-2">
              <Input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Add included item"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addIncludedItem();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addIncludedItem}>
                Add
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
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isUploading}>
              {isLoading ? "Saving..." : (product ? "Update Product" : "Create Product")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
