import { useState } from "react";
import { useParams } from "wouter";
import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { SlidersHorizontal, ArrowUpDown, LayoutGrid } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getCategories, getSoldProducts } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import { usePageTitle } from "@/hooks/use-page-title";
import { BadgeCheck } from "lucide-react";

export function ProductList() {
  const { categoryId } = useParams();
  const [filterCondition, setFilterCondition] = useState<string[]>([]);
  const [sort, setSort] = useState("newest");
  const [soldSubcategory, setSoldSubcategory] = useState<string | null>(null);
  
  const isSoldPage = categoryId === "sold";

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categoryName = isSoldPage 
    ? "Satılan Ürünler"
    : categoryId 
      ? categories.find(c => c.id === categoryId)?.name || categoryId 
      : "Tous les Produits";
  
  usePageTitle(categoryName);

  const { data: allProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products", categoryId, isSoldPage],
    queryFn: () => {
      if (isSoldPage) {
        return getSoldProducts();
      }
      return categoryId ? getProducts({ category: categoryId }) : getProducts();
    },
  });
  
  const soldSubcategories = isSoldPage 
    ? Array.from(new Set(allProducts.map(p => p.category))).filter(Boolean)
    : [];

  let products = allProducts;
  
  // Filter by sold subcategory
  if (isSoldPage && soldSubcategory) {
    products = products.filter(p => p.category === soldSubcategory);
  }

  // Filter by condition
  if (filterCondition.length > 0) {
    products = products.filter(p => filterCondition.includes(p.condition));
  }

  // Sorting
  if (sort === "featured") {
    products = [...products].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <Accordion type="single" collapsible defaultValue="condition" className="w-full">
        <AccordionItem value="condition" className="border-none">
          <AccordionTrigger className="text-base font-semibold py-2 hover:no-underline">État</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="new" 
                  checked={filterCondition.includes('new')}
                  onCheckedChange={(checked) => {
                    if(checked) setFilterCondition([...filterCondition, 'new'])
                    else setFilterCondition(filterCondition.filter(c => c !== 'new'))
                  }}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="new" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">Neuf</Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="used" 
                  checked={filterCondition.includes('used')}
                  onCheckedChange={(checked) => {
                    if(checked) setFilterCondition([...filterCondition, 'used'])
                    else setFilterCondition(filterCondition.filter(c => c !== 'used'))
                  }}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="used" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">Occasion</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Separator />
      
      <div className="space-y-4">
        <h4 className="font-semibold text-sm">Price Range</h4>
         <p className="text-xs text-muted-foreground italic">Prices are negotiable via offer.</p>
         {/* Placeholder for future price slider */}
      </div>

      {filterCondition.length > 0 && (
         <Button 
           variant="outline" 
           className="w-full mt-4" 
           onClick={() => setFilterCondition([])}
         >
           Effacer les Filtres
         </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary/10">
      {/* Page Header */}
      <div className={cn("bg-background border-b", isSoldPage && "bg-gray-100 dark:bg-gray-900")}>
        <div className="container mx-auto px-6 py-8 md:py-12">
          <div className="flex items-center gap-3">
            {isSoldPage && <BadgeCheck className="w-8 h-8 text-gray-600 dark:text-gray-400" />}
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{categoryName}</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            {isSoldPage 
              ? `${products.length} ürün satıldı. Bu ürünler artık mevcut değildir.`
              : `Découvrez ${products.length} produits premium listés pour vous.`
            }
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 space-y-4">
            {/* Categories Section */}
            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{isSoldPage ? "Satılan Kategoriler" : "Catégories"}</h3>
                <LayoutGrid className="w-4 h-4 text-muted-foreground" />
              </div>
              <Separator className="mb-4" />
              <div className="space-y-1">
                {isSoldPage ? (
                  <>
                    <div 
                      onClick={() => setSoldSubcategory(null)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer",
                        !soldSubcategory
                          ? "bg-gray-700 text-white font-medium" 
                          : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <BadgeCheck className="w-4 h-4" />
                      Tüm Satılanlar
                    </div>
                    {soldSubcategories.map(subcat => {
                      const cat = categories.find(c => c.id === subcat);
                      const IconComponent = cat ? (LucideIcons as any)[cat.icon] || LucideIcons.Package : LucideIcons.Package;
                      return (
                        <div 
                          key={subcat}
                          onClick={() => setSoldSubcategory(subcat)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer",
                            soldSubcategory === subcat
                              ? "bg-gray-700 text-white font-medium" 
                              : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <IconComponent className="w-4 h-4" />
                          {cat?.name || subcat}
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <>
                    <Link href="/products">
                      <div className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer",
                        !categoryId 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                      )}>
                        <LayoutGrid className="w-4 h-4" />
                        Tous les Produits
                      </div>
                    </Link>
                    {categories.map(cat => {
                      const IconComponent = (LucideIcons as any)[cat.icon] || LucideIcons.Package;
                      const isActive = categoryId === cat.id;
                      return (
                        <Link key={cat.id} href={`/category/${cat.id}`}>
                          <div className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer",
                            isActive 
                              ? "bg-primary/10 text-primary font-medium" 
                              : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                          )}>
                            <IconComponent className="w-4 h-4" />
                            {cat.name}
                          </div>
                        </Link>
                      );
                    })}
                    <Link href="/category/sold">
                      <div className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer mt-2 border-t pt-2",
                        "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                      )}>
                        <BadgeCheck className="w-4 h-4" />
                        Satılan Ürünler
                      </div>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Filters Section */}
            <div className="bg-card rounded-xl border p-6 shadow-sm">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Filtres</h3>
                  <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
               </div>
               <Separator className="mb-4" />
               <FilterContent />
            </div>
          </aside>

          {/* Product Grid & Controls */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6 bg-card p-4 rounded-xl border shadow-sm">
              <div className="flex items-center gap-2">
                 {/* Mobile Filter */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <SlidersHorizontal className="w-4 h-4 mr-2" /> Filtres
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Parcourir et Filtrer</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-6">
                      {/* Mobile Categories */}
                      <div>
                        <h4 className="font-semibold text-sm mb-3">{isSoldPage ? "Satılan Kategoriler" : "Catégories"}</h4>
                        <div className="space-y-1">
                          {isSoldPage ? (
                            <>
                              <div 
                                onClick={() => setSoldSubcategory(null)}
                                className={cn(
                                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer",
                                  !soldSubcategory
                                    ? "bg-gray-700 text-white font-medium" 
                                    : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                                )}
                              >
                                <BadgeCheck className="w-4 h-4" />
                                Tüm Satılanlar
                              </div>
                              {soldSubcategories.map(subcat => {
                                const cat = categories.find(c => c.id === subcat);
                                const IconComponent = cat ? (LucideIcons as any)[cat.icon] || LucideIcons.Package : LucideIcons.Package;
                                return (
                                  <div 
                                    key={subcat}
                                    onClick={() => setSoldSubcategory(subcat)}
                                    className={cn(
                                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer",
                                      soldSubcategory === subcat
                                        ? "bg-gray-700 text-white font-medium" 
                                        : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                                    )}
                                  >
                                    <IconComponent className="w-4 h-4" />
                                    {cat?.name || subcat}
                                  </div>
                                );
                              })}
                            </>
                          ) : (
                            <>
                              <Link href="/products">
                                <div className={cn(
                                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer",
                                  !categoryId 
                                    ? "bg-primary/10 text-primary font-medium" 
                                    : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                                )}>
                                  <LayoutGrid className="w-4 h-4" />
                                  Tous les Produits
                                </div>
                              </Link>
                              {categories.map(cat => {
                                const IconComponent = (LucideIcons as any)[cat.icon] || LucideIcons.Package;
                                const isActive = categoryId === cat.id;
                                return (
                                  <Link key={cat.id} href={`/category/${cat.id}`}>
                                    <div className={cn(
                                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer",
                                      isActive 
                                        ? "bg-primary/10 text-primary font-medium" 
                                        : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                                    )}>
                                      <IconComponent className="w-4 h-4" />
                                      {cat.name}
                                    </div>
                                  </Link>
                                );
                              })}
                              <Link href="/category/sold">
                                <div className={cn(
                                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer mt-2 border-t pt-2",
                                  "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                                )}>
                                  <BadgeCheck className="w-4 h-4" />
                                  Satılan Ürünler
                                </div>
                              </Link>
                            </>
                          )}
                        </div>
                      </div>
                      <Separator />
                      {/* Mobile Filters */}
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>
                <span className="text-sm text-muted-foreground hidden sm:inline-block">
                  Affichage de <strong>{products.length}</strong> résultats
                </span>
              </div>

              <div className="flex items-center gap-3">
                 <span className="text-sm text-muted-foreground hidden sm:inline-block">Trier par:</span>
                 <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="w-[140px] md:w-[180px] h-9">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Plus Récent</SelectItem>
                    <SelectItem value="featured">En Vedette</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {productsLoading ? (
              <div className="flex justify-center py-24">
                <Spinner />
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
               <div className="flex flex-col items-center justify-center py-24 bg-card rounded-xl border border-dashed">
                 <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                   <SlidersHorizontal className="w-8 h-8 text-muted-foreground/50" />
                 </div>
                 <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
                 <p className="text-muted-foreground mb-6">Essayez d'ajuster vos filtres ou critères de recherche.</p>
                 <Button onClick={() => setFilterCondition([])}>Effacer Tous les Filtres</Button>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
