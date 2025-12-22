import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory, updateCategory } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Category } from "@shared/schema";
import { Pencil, Plus } from "lucide-react";
import * as LucideIcons from "lucide-react";

const availableIcons = [
  { value: "Sofa", label: "Sofa" },
  { value: "Home", label: "Home" },
  { value: "Smartphone", label: "Smartphone" },
  { value: "WashingMachine", label: "Washing Machine" },
  { value: "Briefcase", label: "Briefcase" },
  { value: "Flower2", label: "Flower" },
  { value: "Lamp", label: "Lamp" },
  { value: "Palette", label: "Palette" },
  { value: "Baby", label: "Baby" },
  { value: "Gamepad2", label: "Gamepad" },
  { value: "Car", label: "Car" },
  { value: "Shirt", label: "Shirt" },
  { value: "Watch", label: "Watch" },
  { value: "Music", label: "Music" },
  { value: "Book", label: "Book" },
  { value: "Camera", label: "Camera" },
  { value: "Bike", label: "Bike" },
  { value: "Dumbbell", label: "Dumbbell" },
  { value: "Utensils", label: "Utensils" },
  { value: "Heart", label: "Heart" },
];

interface CategoryFormProps {
  category?: Category;
  trigger?: React.ReactNode;
}

export function CategoryForm({ category, trigger }: CategoryFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(category?.name || "");
  const [icon, setIcon] = useState(category?.icon || "Package");
  const [id, setId] = useState(category?.id || "");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const isEditing = !!category;

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Category created successfully" });
      setOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to create category", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Category updated successfully" });
      setOpen(false);
    },
    onError: () => {
      toast({ title: "Failed to update category", variant: "destructive" });
    },
  });

  const resetForm = () => {
    if (!isEditing) {
      setName("");
      setIcon("Package");
      setId("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      updateMutation.mutate({ 
        id: category.id, 
        data: { name, icon } 
      });
    } else {
      createMutation.mutate({ id, name, icon });
    }
  };

  const IconComponent = (LucideIcons as any)[icon] || LucideIcons.Package;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            {isEditing ? <Pencil className="w-3 h-3" /> : <Plus className="w-4 h-4" />}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Category" : "Add New Category"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="id">Category ID</Label>
              <Input 
                id="id" 
                value={id} 
                onChange={(e) => setId(e.target.value.toLowerCase().replace(/\s+/g, '-'))} 
                placeholder="e.g., sports-equipment"
                required
              />
              <p className="text-xs text-muted-foreground">Unique identifier (lowercase, no spaces)</p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g., Sports Equipment"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4" />
                    <span>{availableIcons.find(i => i.value === icon)?.label || icon}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {availableIcons.map((iconOption) => {
                  const Icon = (LucideIcons as any)[iconOption.value] || LucideIcons.Package;
                  return (
                    <SelectItem key={iconOption.value} value={iconOption.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{iconOption.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium">{name || "Category Name"}</p>
              <p className="text-xs text-muted-foreground">Preview</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) ? "Saving..." : (isEditing ? "Update" : "Create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
