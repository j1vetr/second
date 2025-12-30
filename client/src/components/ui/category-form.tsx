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
  { value: "Sofa", label: "Canapé" },
  { value: "Home", label: "Maison" },
  { value: "Smartphone", label: "Smartphone" },
  { value: "WashingMachine", label: "Électroménager" },
  { value: "Briefcase", label: "Affaires" },
  { value: "Flower2", label: "Fleurs" },
  { value: "Lamp", label: "Lampe" },
  { value: "Palette", label: "Palette" },
  { value: "Baby", label: "Bébé" },
  { value: "Gamepad2", label: "Jeux" },
  { value: "Car", label: "Voiture" },
  { value: "Shirt", label: "Vêtements" },
  { value: "Watch", label: "Montre" },
  { value: "Music", label: "Musique" },
  { value: "Book", label: "Livre" },
  { value: "Camera", label: "Appareil Photo" },
  { value: "Bike", label: "Vélo" },
  { value: "Dumbbell", label: "Sport" },
  { value: "Utensils", label: "Cuisine" },
  { value: "Heart", label: "Coeur" },
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
      toast({ title: "Catégorie créée avec succès" });
      setOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Échec de la création de la catégorie", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Catégorie mise à jour avec succès" });
      setOpen(false);
    },
    onError: () => {
      toast({ title: "Échec de la mise à jour de la catégorie", variant: "destructive" });
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
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            {isEditing ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier la Catégorie" : "Nouvelle Catégorie"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="id">Identifiant de la Catégorie</Label>
              <Input 
                id="id" 
                value={id} 
                onChange={(e) => setId(e.target.value.toLowerCase().replace(/\s+/g, '-'))} 
                placeholder="ex: equipement-sport"
                required
              />
              <p className="text-xs text-muted-foreground">Identifiant unique (minuscules, sans espaces)</p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">Nom de la Catégorie</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="ex: Équipement de Sport"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icône</Label>
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

          <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary">
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold">{name || "Nom de la Catégorie"}</p>
              <p className="text-xs text-muted-foreground">Aperçu</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) ? "Enregistrement..." : (isEditing ? "Mettre à Jour" : "Créer")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
