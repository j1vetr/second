import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, Pencil, Trash2, Search, Package, LayoutGrid, Eye, 
  Tags, ShoppingBag, LogOut, Home, Settings, Grid3X3, List,
  Filter, ChevronDown, Star, Clock, CheckCircle2, XCircle,
  MoreHorizontal, ExternalLink, Copy, Archive
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminProducts, getCategories, deleteProduct, deleteCategory } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { CategoryForm } from "@/components/ui/category-form";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const conditionLabels: Record<string, string> = {
  'new': 'Neuf',
  'used_like_new': 'Comme Neuf',
  'used_good': 'Bon État',
  'used_fair': 'État Correct',
  'used': 'Utilisé',
};

const conditionColors: Record<string, string> = {
  'new': 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  'used_like_new': 'bg-blue-500/10 text-blue-600 border-blue-200',
  'used_good': 'bg-amber-500/10 text-amber-600 border-amber-200',
  'used_fair': 'bg-gray-500/10 text-gray-600 border-gray-200',
  'used': 'bg-orange-500/10 text-orange-600 border-orange-200',
};

export function AdminDashboard() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
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

  let filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  if (statusFilter === "active") {
    filteredProducts = filteredProducts.filter(p => p.isActive);
  } else if (statusFilter === "inactive") {
    filteredProducts = filteredProducts.filter(p => !p.isActive);
  }

  if (categoryFilter !== "all") {
    filteredProducts = filteredProducts.filter(p => p.category === categoryFilter);
  }

  const activeProducts = products.filter(p => p.isActive).length;
  const inactiveProducts = products.filter(p => !p.isActive).length;
  const featuredProducts = products.filter(p => p.featured).length;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]">
      {/* Premium Admin Header */}
      <header className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary via-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-primary/25">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-semibold text-base">SecondStore Admin</h1>
                <p className="text-[11px] text-muted-foreground -mt-0.5">Gestion du catalogue</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-border/50 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{products.length}</p>
                <p className="text-[11px] text-muted-foreground">Produits</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-border/50 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeProducts}</p>
                <p className="text-[11px] text-muted-foreground">Actifs</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-border/50 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{featuredProducts}</p>
                <p className="text-[11px] text-muted-foreground">Vedettes</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-border/50 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Tags className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{categories.length}</p>
                <p className="text-[11px] text-muted-foreground">Catégories</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="products" className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <TabsList className="h-10 p-1 bg-secondary/50 rounded-xl">
              <TabsTrigger value="products" className="rounded-lg px-4 gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-sm">
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Produits</span>
              </TabsTrigger>
              <TabsTrigger value="categories" className="rounded-lg px-4 gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-sm">
                <Tags className="w-4 h-4" />
                <span className="hidden sm:inline">Catégories</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4 mt-4">
            {/* Toolbar */}
            <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/50 p-3 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher..." 
                    className="pl-9 h-9 bg-secondary/30 border-0 rounded-xl" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                    <SelectTrigger className="h-9 w-[130px] rounded-xl bg-secondary/30 border-0">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="active">Actifs</SelectItem>
                      <SelectItem value="inactive">Inactifs</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-9 w-[140px] rounded-xl bg-secondary/30 border-0">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* View Toggle */}
                  <div className="hidden sm:flex items-center gap-1 bg-secondary/30 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "p-1.5 rounded-lg transition-all",
                        viewMode === "grid" ? "bg-white dark:bg-white/10 shadow-sm" : "hover:bg-white/50"
                      )}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "p-1.5 rounded-lg transition-all",
                        viewMode === "list" ? "bg-white dark:bg-white/10 shadow-sm" : "hover:bg-white/50"
                      )}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add Button */}
                  <Link href="/admin/product/new">
                    <Button size="sm" className="h-9 gap-1.5 rounded-xl shadow-lg shadow-primary/20">
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">Ajouter</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {productsLoading ? (
              <div className="flex justify-center py-20">
                <Spinner />
              </div>
            ) : filteredProducts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-white/5 rounded-2xl border border-border/50 p-12 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Aucun produit</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {search ? "Aucun produit ne correspond à votre recherche" : "Commencez par ajouter votre premier produit"}
                </p>
                <Link href="/admin/product/new">
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" /> Ajouter un produit
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                {viewMode === "grid" ? (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  >
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="group bg-white dark:bg-white/5 rounded-2xl border border-border/50 overflow-hidden hover:shadow-xl hover:shadow-black/5 hover:border-primary/20 transition-all duration-300"
                      >
                        {/* Image */}
                        <div className="relative aspect-[4/3] bg-secondary/30 overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.title}
                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                          />
                          
                          {/* Status Badge */}
                          <div className="absolute top-2 left-2 flex gap-1.5">
                            {product.isActive ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500 text-white shadow-lg">
                                Actif
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500 text-white shadow-lg">
                                Inactif
                              </span>
                            )}
                            {product.featured && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500 text-white shadow-lg flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5" /> Vedette
                              </span>
                            )}
                          </div>

                          {/* Quick Actions - Hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
                            <div className="flex gap-2">
                              <Link href={`/product/${product.slug || product.id}`}>
                                <Button size="sm" variant="secondary" className="h-8 gap-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-900 shadow-lg">
                                  <Eye className="w-3.5 h-3.5" /> Voir
                                </Button>
                              </Link>
                              <Link href={`/admin/product/${product.id}`}>
                                <Button size="sm" className="h-8 gap-1.5 rounded-lg shadow-lg">
                                  <Pencil className="w-3.5 h-3.5" /> Éditer
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium text-sm line-clamp-2 leading-tight">{product.title}</h3>
                              <p className="text-[11px] text-muted-foreground mt-1 capitalize">{product.category}</p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/product/${product.id}`} className="flex items-center gap-2">
                                    <Pencil className="w-4 h-4" /> Modifier
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/product/${product.slug || product.id}`} className="flex items-center gap-2">
                                    <ExternalLink className="w-4 h-4" /> Voir sur le site
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => {
                                    if (confirm(`Supprimer "${product.title}" ?`)) {
                                      deleteProductMutation.mutate(product.id);
                                    }
                                  }}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "px-2 py-0.5 rounded-md text-[10px] font-medium border",
                              conditionColors[product.condition] || "bg-gray-100 text-gray-600"
                            )}>
                              {conditionLabels[product.condition] || product.condition}
                            </span>
                            {product.price && (
                              <span className="text-xs font-semibold text-primary">
                                CHF {parseFloat(product.price).toFixed(0)}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white dark:bg-white/5 rounded-2xl border border-border/50 overflow-hidden"
                  >
                    <div className="divide-y divide-border/50">
                      {filteredProducts.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className="group flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors"
                        >
                          {/* Image */}
                          <div className="w-14 h-14 rounded-xl bg-secondary/50 overflow-hidden shrink-0 flex items-center justify-center">
                            <img 
                              src={product.image} 
                              alt={product.title}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-sm truncate">{product.title}</h3>
                              {product.featured && (
                                <Star className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[11px] text-muted-foreground capitalize">{product.category}</span>
                              <span className="text-muted-foreground">•</span>
                              <span className={cn(
                                "px-1.5 py-0.5 rounded text-[10px] font-medium",
                                conditionColors[product.condition]
                              )}>
                                {conditionLabels[product.condition]}
                              </span>
                            </div>
                          </div>

                          {/* Status */}
                          <div className="hidden sm:flex items-center gap-3">
                            {product.price && (
                              <span className="text-sm font-semibold">CHF {parseFloat(product.price).toFixed(0)}</span>
                            )}
                            {product.isActive ? (
                              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Actif" />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-red-500" title="Inactif" />
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/product/${product.slug || product.id}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/product/${product.id}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Pencil className="w-4 h-4 text-primary" />
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => {
                                if (confirm(`Supprimer "${product.title}" ?`)) {
                                  deleteProductMutation.mutate(product.id);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Results count */}
            {filteredProducts.length > 0 && (
              <p className="text-xs text-muted-foreground text-center py-2">
                {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} affiché{filteredProducts.length > 1 ? 's' : ''}
              </p>
            )}
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4 mt-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Catégories</h2>
                <p className="text-sm text-muted-foreground">Organisez vos produits</p>
              </div>
              <CategoryForm 
                trigger={
                  <Button size="sm" className="h-9 gap-1.5 rounded-xl shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4" /> Ajouter
                  </Button>
                }
              />
            </div>

            {categoriesLoading ? (
              <div className="flex justify-center py-20">
                <Spinner />
              </div>
            ) : categories.length === 0 ? (
              <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/50 p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                  <Tags className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Aucune catégorie</h3>
                <p className="text-sm text-muted-foreground">Créez votre première catégorie</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat, index) => {
                  const IconComponent = (LucideIcons as any)[cat.icon] || LucideIcons.Package;
                  const productCount = products.filter(p => p.category === cat.id).length;
                  return (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group bg-white dark:bg-white/5 rounded-2xl border border-border/50 p-5 hover:shadow-xl hover:shadow-black/5 hover:border-primary/20 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-primary" /> 
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <CategoryForm category={cat} />
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => {
                              if (confirm(`Supprimer "${cat.name}" ?`)) {
                                deleteCategoryMutation.mutate(cat.id);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <h3 className="font-semibold text-base mb-1">{cat.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {productCount} produit{productCount !== 1 ? 's' : ''}
                      </p>
                    </motion.div>
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
