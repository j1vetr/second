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
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

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
    : "All Products";

  const FilterContent = () => (
    <div className="space-y-6">
      <Accordion type="single" collapsible defaultValue="condition" className="w-full">
        <AccordionItem value="condition" className="border-none">
          <AccordionTrigger className="text-base font-semibold py-2 hover:no-underline">Condition</AccordionTrigger>
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
                <Label htmlFor="new" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">Brand New</Label>
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
                <Label htmlFor="used" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">Used</Label>
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
           Clear Filters
         </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary/10">
      {/* Page Header */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{categoryName}</h1>
          <p className="text-muted-foreground text-lg">
            Discover {products.length} premium products listed for you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 bg-card rounded-xl border p-6 shadow-sm">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Filters</h3>
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
                      <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-8">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>
                <span className="text-sm text-muted-foreground hidden sm:inline-block">
                  Showing <strong>{products.length}</strong> results
                </span>
              </div>

              <div className="flex items-center gap-3">
                 <span className="text-sm text-muted-foreground hidden sm:inline-block">Sort by:</span>
                 <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="w-[140px] md:w-[180px] h-9">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest Listed</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
               <div className="flex flex-col items-center justify-center py-24 bg-card rounded-xl border border-dashed">
                 <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                   <SlidersHorizontal className="w-8 h-8 text-muted-foreground/50" />
                 </div>
                 <h3 className="text-xl font-semibold mb-2">No products found</h3>
                 <p className="text-muted-foreground mb-6">Try adjusting your filters or search criteria.</p>
                 <Button onClick={() => setFilterCondition([])}>Clear All Filters</Button>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
