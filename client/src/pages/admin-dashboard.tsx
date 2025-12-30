import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Search, Package, LayoutGrid, Eye, CheckCircle2, XCircle, Tags, ShoppingBag, LogOut, Home, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminProducts, getCategories, deleteProduct, deleteCategory } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { CategoryForm } from "@/components/ui/category-form";
import * as LucideIcons from "lucide-react";

const conditionLabels: Record<string, string> = {
  'new': 'Neuf',
  'used_like_new': 'Comme Neuf',
  'used_good': 'Bon État',
  'used_fair': 'État Correct',
};

export function AdminDashboard() {
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: getAdminProducts,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Produit supprimé avec succès" });
    },
    onError: () => {
      toast({ title: "Échec de la suppression du produit", variant: "destructive" });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Catégorie supprimée avec succès" });
    },
    onError: () => {
      toast({ title: "Échec de la suppression de la catégorie", variant: "destructive" });
    },
  });

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const activeProducts = products.filter(p => p.isActive).length;
  const inactiveProducts = products.filter(p => !p.isActive).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/20 via-background to-secondary/10">
      {/* Modern Admin Header */}
      <header className="bg-background/80 backdrop-blur-xl border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-lg">Panneau Admin</h1>
                <p className="text-xs text-muted-foreground">SecondStore.ch</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Accueil</span>
                </Button>
              </Link>
              <Link href="/admin-login">
                <Button variant="outline" size="sm" className="gap-2">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards - Only Products and Categories */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-2xl">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Produits</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className="text-green-600">{activeProducts} actifs</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-red-500">{inactiveProducts} inactifs</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Catégories</p>
                  <p className="text-2xl font-bold">{categories.length}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Tags className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Organisation des produits</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="w-full max-w-md grid grid-cols-2 h-12 p-1 bg-secondary/50 rounded-xl">
            <TabsTrigger value="products" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Produits</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2">
              <Tags className="w-4 h-4" />
              <span className="hidden sm:inline">Catégories</span>
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Gestion des Produits</h2>
                <p className="text-sm text-muted-foreground">Gérez votre inventaire et vos prix</p>
              </div>
              <Link href="/admin/product/new">
                <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2">
                  <Plus className="w-4 h-4" /> Nouveau Produit
                </Button>
              </Link>
            </div>

            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher un produit..." 
                    className="pl-10 bg-secondary/30 border-0" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className="flex justify-center py-12">
                    <Spinner />
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="font-medium">Aucun produit trouvé</p>
                    <p className="text-sm">Ajoutez votre premier produit pour commencer</p>
                  </div>
                ) : (
                  <>
                    {/* Mobile: Card Layout */}
                    <div className="md:hidden space-y-3">
                      {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-secondary/20 rounded-2xl p-4 space-y-3">
                          <div className="flex gap-4">
                            <div className="w-20 h-20 rounded-xl bg-background flex-shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
                              <img 
                                src={product.image} 
                                alt={product.title} 
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm line-clamp-2">{product.title}</h3>
                              <p className="text-xs text-muted-foreground mt-1 capitalize">{product.category}</p>
                              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                                  {conditionLabels[product.condition] || product.condition}
                                </Badge>
                                {product.isActive ? (
                                  <Badge className="text-[10px] px-2 py-0.5 bg-green-500/20 text-green-700 border-0">Actif</Badge>
                                ) : (
                                  <Badge className="text-[10px] px-2 py-0.5 bg-red-500/20 text-red-700 border-0">Inactif</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                            <Link href={`/product/${product.slug || product.id}`} className="flex-1">
                              <Button variant="outline" size="sm" className="w-full h-9 gap-1.5">
                                <Eye className="w-4 h-4" /> Voir
                              </Button>
                            </Link>
                            <Link href={`/admin/product/${product.id}`}>
                              <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                                <Pencil className="w-4 h-4 text-primary" />
                              </Button>
                            </Link>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-9 w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10" 
                              onClick={() => {
                                if (confirm(`Supprimer "${product.title}" ?`)) {
                                  deleteProductMutation.mutate(product.id);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop: Table Layout */}
                    <div className="hidden md:block">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Nom du Produit</TableHead>
                            <TableHead>Catégorie</TableHead>
                            <TableHead>État</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredProducts.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell>
                                <div className="w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center overflow-hidden">
                                  <img 
                                    src={product.image} 
                                    alt={product.title} 
                                    className="max-w-full max-h-full object-contain"
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="font-medium max-w-[200px] truncate">{product.title}</TableCell>
                              <TableCell className="capitalize">{product.category}</TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {conditionLabels[product.condition] || product.condition}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {product.isActive ? (
                                  <Badge className="bg-green-500/20 text-green-700 border-0">Actif</Badge>
                                ) : (
                                  <Badge className="bg-red-500/20 text-red-700 border-0">Inactif</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Link href={`/product/${product.slug || product.id}`}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Voir">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </Link>
                                  <Link href={`/admin/product/${product.id}`}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Modifier">
                                      <Pencil className="w-4 h-4 text-primary" />
                                    </Button>
                                  </Link>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" 
                                    title="Supprimer"
                                    onClick={() => {
                                      if (confirm(`Supprimer "${product.title}" ?`)) {
                                        deleteProductMutation.mutate(product.id);
                                      }
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Gestion des Catégories</h2>
                <p className="text-sm text-muted-foreground">Organisez vos produits par catégorie</p>
              </div>
              <CategoryForm 
                trigger={
                  <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2">
                    <Plus className="w-4 h-4" /> Nouvelle Catégorie
                  </Button>
                }
              />
            </div>

            {categoriesLoading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : categories.length === 0 ? (
              <Card className="shadow-sm">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Tags className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="font-medium">Aucune catégorie</p>
                  <p className="text-sm">Créez votre première catégorie pour organiser vos produits</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => {
                  const IconComponent = (LucideIcons as any)[cat.icon] || LucideIcons.Package;
                  const productCount = products.filter(p => p.category === cat.id).length;
                  return (
                    <Card key={cat.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                              <IconComponent className="w-6 h-6 text-primary" /> 
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {productCount} produit{productCount !== 1 ? 's' : ''}
                            </Badge>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{cat.name}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Icône: {cat.icon}
                            </p>
                          </div>
                        </div>
                        <div className="px-4 py-3 bg-secondary/30 border-t flex items-center justify-end gap-2">
                          <CategoryForm category={cat} />
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              if (confirm(`Supprimer la catégorie "${cat.name}" ?`)) {
                                deleteCategoryMutation.mutate(cat.id);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
