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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Search, Package, MessageSquare, LayoutGrid, Eye, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminProducts, getCategories, getOffers, deleteProduct, deleteCategory, deleteOffer, updateOfferStatus } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { ProductForm } from "@/components/ui/product-form";
import { CategoryForm } from "@/components/ui/category-form";
import * as LucideIcons from "lucide-react";

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

  const { data: offers = [], isLoading: offersLoading } = useQuery({
    queryKey: ["offers"],
    queryFn: () => getOffers(),
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete product", variant: "destructive" });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Category deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete category", variant: "destructive" });
    },
  });

  const deleteOfferMutation = useMutation({
    mutationFn: deleteOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast({ title: "Offer deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete offer", variant: "destructive" });
    },
  });

  const updateOfferStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "pending" | "accepted" | "rejected" }) =>
      updateOfferStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast({ title: "Offer status updated" });
    },
    onError: () => {
      toast({ title: "Failed to update offer status", variant: "destructive" });
    },
  });

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-secondary/10 pb-8">
      {/* Admin Header */}
      <div className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-6 h-6 text-primary" />
            <h1 className="font-bold text-lg">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, Admin</span>
            <Link href="/admin-login">
              <Button variant="outline" size="sm">Logout</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="offers">Offers</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          {/* Products Management */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
              <div>
                <h2 className="text-2xl font-bold">Product Management</h2>
                <p className="text-muted-foreground">Manage your inventory, prices and details.</p>
              </div>
              <ProductForm 
                categories={categories} 
                trigger={
                  <Button className="bg-primary text-white">
                    <Plus className="w-4 h-4 mr-2" /> Add New Product
                  </Button>
                }
              />
            </div>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search products..." 
                      className="pl-9" 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className="flex justify-center py-12">
                    <Spinner />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">Image</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <img 
                              src={product.image} 
                              alt={product.title} 
                              className="w-10 h-10 rounded-md object-cover bg-secondary"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{product.title}</TableCell>
                          <TableCell className="capitalize">{product.category}</TableCell>
                          <TableCell>
                            <Badge variant={product.condition === 'new' ? 'default' : 'secondary'} className="capitalize">
                              {product.condition}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {product.isActive ? (
                              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Active</Badge>
                            ) : (
                              <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">Inactive</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/product/${product.id}`}>
                                <Button variant="ghost" size="icon" title="View">
                                  <Eye className="w-4 h-4 text-muted-foreground" />
                                </Button>
                              </Link>
                              <ProductForm product={product} categories={categories} />
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-destructive hover:text-destructive hover:bg-destructive/10" 
                                title="Delete"
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete "${product.title}"?`)) {
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
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Offers Management */}
          <TabsContent value="offers" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Offer Requests</h2>
                <p className="text-muted-foreground">Review and manage price offers from customers.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 from yesterday</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">Action required</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6">
                {offersLoading ? (
                  <div className="flex justify-center py-12">
                    <Spinner />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Offer Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {offers.map((offer) => {
                        const product = products.find(p => p.id === offer.productId);
                        return (
                          <TableRow key={offer.id}>
                            <TableCell className="text-muted-foreground">
                              {offer.createdAt ? new Date(offer.createdAt).toLocaleDateString() : "N/A"}
                            </TableCell>
                            <TableCell className="font-medium">{offer.customerName}</TableCell>
                            <TableCell>{product?.title || "Unknown Product"}</TableCell>
                            <TableCell>{offer.offerAmount}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  offer.status === 'accepted' ? 'default' : 
                                  offer.status === 'rejected' ? 'destructive' : 'secondary'
                                }
                                className="capitalize"
                              >
                                {offer.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-green-600 hover:bg-green-50" 
                                  title="Accept"
                                  onClick={() => updateOfferStatusMutation.mutate({ id: offer.id, status: "accepted" })}
                                  disabled={offer.status !== "pending"}
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-red-600 hover:bg-red-50" 
                                  title="Reject"
                                  onClick={() => updateOfferStatusMutation.mutate({ id: offer.id, status: "rejected" })}
                                  disabled={offer.status !== "pending"}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Management */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Categories</h2>
                <p className="text-muted-foreground">Manage product categories and icons.</p>
              </div>
              <CategoryForm 
                trigger={
                  <Button className="bg-primary text-white">
                    <Plus className="w-4 h-4 mr-2" /> Add Category
                  </Button>
                }
              />
            </div>

            {categoriesLoading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => {
                  const IconComponent = (LucideIcons as any)[cat.icon] || LucideIcons.Package;
                  return (
                    <Card key={cat.id} className="group hover:border-primary/50 transition-all">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{cat.name}</CardTitle>
                        <div className="p-2 bg-secondary rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <IconComponent className="w-4 h-4" /> 
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xs text-muted-foreground">ID: {cat.id}</div>
                        <div className="text-xs text-muted-foreground">Icon: {cat.icon}</div>
                        <div className="flex justify-end gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <CategoryForm category={cat} />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${cat.name}"?`)) {
                                deleteCategoryMutation.mutate(cat.id);
                              }
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
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
