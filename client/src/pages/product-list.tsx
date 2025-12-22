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
import { MOCK_PRODUCTS, CATEGORIES } from "@/lib/mockData";
import { SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function ProductList() {
  const { categoryId } = useParams();
  const [filterCondition, setFilterCondition] = useState<string[]>([]);
  const [sort, setSort] = useState("newest");

  let products = MOCK_PRODUCTS;

  // Filter by category
  if (categoryId) {
    products = products.filter(p => p.category === categoryId);
  }

  // Filter by condition
  if (filterCondition.length > 0) {
    products = products.filter(p => filterCondition.includes(p.condition));
  }

  // Sorting
  if (sort === "newest") {
    // Mock sorting logic
    products = [...products].reverse(); 
  }

  const categoryName = categoryId 
    ? CATEGORIES.find(c => c.id === categoryId)?.name 
    : "Tüm Ürünler";

  const FilterContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold mb-4 text-lg">Durum</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="new" 
              checked={filterCondition.includes('new')}
              onCheckedChange={(checked) => {
                if(checked) setFilterCondition([...filterCondition, 'new'])
                else setFilterCondition(filterCondition.filter(c => c !== 'new'))
              }}
            />
            <Label htmlFor="new">Sıfır</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="used" 
              checked={filterCondition.includes('used')}
              onCheckedChange={(checked) => {
                if(checked) setFilterCondition([...filterCondition, 'used'])
                else setFilterCondition(filterCondition.filter(c => c !== 'used'))
              }}
            />
            <Label htmlFor="used">2. El</Label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{categoryName}</h1>
          <p className="text-muted-foreground">{products.length} ürün listeleniyor</p>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Mobile Filter */}
          <Sheet>
            <SheetTrigger asChild>
               <Button variant="outline" className="md:hidden flex-1">
                <SlidersHorizontal className="w-4 h-4 mr-2" /> Filtrele
               </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="mt-8">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sıralama" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">En Yeniler</SelectItem>
              <SelectItem value="featured">Öne Çıkanlar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-24">
             <FilterContent />
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
             <div className="text-center py-20 bg-secondary/20 rounded-xl">
               <p className="text-lg text-muted-foreground">Bu kriterlere uygun ürün bulunamadı.</p>
               <Button variant="link" onClick={() => setFilterCondition([])}>Filtreleri Temizle</Button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
