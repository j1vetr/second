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
import { Plus, Pencil, Trash2, Search, Package, LayoutGrid, Eye, CheckCircle2, XCircle, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminProducts, getCategories, deleteProduct, deleteCategory, getNewsletterSubscribers, deleteNewsletterSubscriber, updateNewsletterSubscriber } from "@/lib/api";
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

  const { data: subscribers = [], isLoading: subscribersLoading } = useQuery({
    queryKey: ["newsletter-subscribers"],
    queryFn: getNewsletterSubscribers,
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

  const deleteSubscriberMutation = useMutation({
    mutationFn: deleteNewsletterSubscriber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newsletter-subscribers"] });
      toast({ title: "Subscriber deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete subscriber", variant: "destructive" });
    },
  });

  const updateSubscriberMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateNewsletterSubscriber(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newsletter-subscribers"] });
      toast({ title: "Subscriber updated" });
    },
    onError: () => {
      toast({ title: "Failed to update subscriber", variant: "destructive" });
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
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
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
                  <>
                    {/* Mobile: Card Layout */}
                    <div className="md:hidden space-y-3">
                      {filteredProducts.map((product) => (
                        <div key={product.id} className="border rounded-xl p-3 bg-background">
                          <div className="flex gap-3">
                            <img 
                              src={product.image} 
                              alt={product.title} 
                              className="w-16 h-16 rounded-lg object-cover bg-secondary flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm line-clamp-1">{product.title}</h3>
                              <p className="text-xs text-muted-foreground capitalize">{product.category}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <Badge variant={product.condition === 'new' ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0 capitalize">
                                  {product.condition}
                                </Badge>
                                {product.isActive ? (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-green-600 border-green-200 bg-green-50">Actif</Badge>
                                ) : (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-red-600 border-red-200 bg-red-50">Inactif</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t">
                            <Link href={`/product/${product.id}`}>
                              <Button variant="outline" size="sm" className="h-8 px-3">
                                <Eye className="w-3.5 h-3.5 mr-1" /> Voir
                              </Button>
                            </Link>
                            <ProductForm product={product} categories={categories} />
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-8 px-3 text-destructive hover:text-destructive hover:bg-destructive/10" 
                              onClick={() => {
                                if (confirm(`Supprimer "${product.title}"?`)) {
                                  deleteProductMutation.mutate(product.id);
                                }
                              }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop: Table Layout */}
                    <div className="hidden md:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
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
                                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Actif</Badge>
                                ) : (
                                  <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">Inactif</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Link href={`/product/${product.id}`}>
                                    <Button variant="ghost" size="icon" title="Voir">
                                      <Eye className="w-4 h-4 text-muted-foreground" />
                                    </Button>
                                  </Link>
                                  <ProductForm product={product} categories={categories} />
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10" 
                                    title="Supprimer"
                                    onClick={() => {
                                      if (confirm(`Supprimer "${product.title}"?`)) {
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
                        <div className="flex justify-end gap-2 mt-4 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <CategoryForm category={cat} />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive"
                            onClick={() => {
                              if (confirm(`Supprimer "${cat.name}"?`)) {
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

          {/* Newsletter Management */}
          <TabsContent value="newsletter" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Newsletter Subscribers</h2>
                <p className="text-muted-foreground">Manage newsletter subscriptions. Emails are sent every 2 days about new products.</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{subscribers.filter(s => s.isActive).length} active subscribers</span>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                {subscribersLoading ? (
                  <div className="flex justify-center py-12">
                    <Spinner />
                  </div>
                ) : subscribers.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Mail className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No subscribers yet</p>
                    <p className="text-sm">Subscribers will appear here when users sign up for the newsletter.</p>
                  </div>
                ) : (
                  <>
                    {/* Mobile: Card Layout */}
                    <div className="md:hidden space-y-3">
                      {subscribers.map((subscriber) => (
                        <div key={subscriber.id} className="border rounded-xl p-3 bg-background" data-testid={`card-subscriber-${subscriber.id}`}>
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm truncate">{subscriber.email}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {subscriber.createdAt ? new Date(subscriber.createdAt).toLocaleDateString('fr-FR') : "N/A"}
                              </p>
                            </div>
                            <Badge variant={subscriber.isActive ? "default" : "secondary"} className="ml-2 text-xs">
                              {subscriber.isActive ? "Actif" : "Inactif"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8"
                              onClick={() => updateSubscriberMutation.mutate({ 
                                id: subscriber.id, 
                                isActive: !subscriber.isActive 
                              })}
                              data-testid={`button-toggle-subscriber-${subscriber.id}`}
                            >
                              {subscriber.isActive ? (
                                <><XCircle className="w-3.5 h-3.5 mr-1" /> Désactiver</>
                              ) : (
                                <><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Activer</>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-destructive hover:text-destructive"
                              onClick={() => {
                                if (confirm(`Supprimer "${subscriber.email}"?`)) {
                                  deleteSubscriberMutation.mutate(subscriber.id);
                                }
                              }}
                              data-testid={`button-delete-subscriber-${subscriber.id}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop: Table Layout */}
                    <div className="hidden md:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Inscrit le</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subscribers.map((subscriber) => (
                            <TableRow key={subscriber.id} data-testid={`row-subscriber-${subscriber.id}`}>
                              <TableCell className="font-medium">{subscriber.email}</TableCell>
                              <TableCell>
                                {subscriber.createdAt ? new Date(subscriber.createdAt).toLocaleDateString('fr-FR') : "N/A"}
                              </TableCell>
                              <TableCell>
                                <Badge variant={subscriber.isActive ? "default" : "secondary"}>
                                  {subscriber.isActive ? "Actif" : "Inactif"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateSubscriberMutation.mutate({ 
                                      id: subscriber.id, 
                                      isActive: !subscriber.isActive 
                                    })}
                                    title={subscriber.isActive ? "Désactiver" : "Activer"}
                                    data-testid={`button-toggle-subscriber-${subscriber.id}`}
                                  >
                                    {subscriber.isActive ? (
                                      <XCircle className="w-4 h-4 text-muted-foreground" />
                                    ) : (
                                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive"
                                    onClick={() => {
                                      if (confirm(`Supprimer "${subscriber.email}"?`)) {
                                        deleteSubscriberMutation.mutate(subscriber.id);
                                      }
                                    }}
                                    data-testid={`button-delete-subscriber-${subscriber.id}`}
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
        </Tabs>
      </div>
    </div>
  );
}
