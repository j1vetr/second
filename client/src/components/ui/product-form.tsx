import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Plus, X } from "lucide-react";
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
  
  const [formData, setFormData] = useState<Partial<InsertProduct>>({
    title: product?.title || "",
    category: product?.category || "",
    condition: product?.condition || "new",
    image: product?.image || "",
    description: product?.description || "",
    dimensions: product?.dimensions || "",
    weight: product?.weight || "",
    featured: product?.featured || false,
    isNew: product?.isNew || false,
    includedItems: product?.includedItems || [],
  });
  
  const [newItem, setNewItem] = useState("");

  const createMutation = useMutation({
    mutationFn: (data: InsertProduct) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
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
      description: "",
      dimensions: "",
      weight: "",
      featured: false,
      isNew: false,
      includedItems: [],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.image) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }

    if (product) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData as InsertProduct);
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

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="condition">Condition *</Label>
              <Select 
                value={formData.condition} 
                onValueChange={(value: "new" | "used") => setFormData(prev => ({ ...prev, condition: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Image URL *</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://..."
                required
              />
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

          <div className="flex gap-6">
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : (product ? "Update Product" : "Create Product")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
