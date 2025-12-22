import { Link, useLocation } from "wouter";
import { Search, Menu, Sun, Moon } from "lucide-react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";
import { CATEGORIES, MOCK_PRODUCTS, Product } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import React, { useState, useEffect, useRef } from "react";

// Custom Link component compatible with Radix UI NavigationMenu
const HeaderLink = React.forwardRef<
  HTMLAnchorElement, 
  { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ href, onClick, className, children, ...props }, ref) => {
  const [_, setLocation] = useLocation();
  return (
    <a
      ref={ref}
      href={href}
      className={className}
      onClick={(e) => {
        // Allow default behavior for ctrl/cmd/shift clicks (open in new tab)
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        
        e.preventDefault();
        setLocation(href);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </a>
  );
});
HeaderLink.displayName = "HeaderLink";

export function Header() {
  const { setTheme } = useTheme();
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 0) {
      const results = MOCK_PRODUCTS.filter(product =>
        product.title.toLowerCase().includes(term.toLowerCase()) ||
        product.category.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="flex flex-col gap-4 mt-8">
              <Link href="/" className="text-lg font-medium">
                Home
              </Link>
              <div className="text-sm font-semibold text-muted-foreground mt-4">Categories</div>
              {CATEGORIES.map(cat => (
                <Link key={cat.id} href={`/category/${cat.id}`} className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                    <DynamicIcon name={cat.icon} className="h-4 w-4" />
                    {cat.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
            <img src="/assets/logo.png" alt="SecondStore" className="h-12 md:h-16 object-contain" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <HeaderLink href="/" className={cn(navigationMenuTriggerStyle(), location === '/' && "text-primary")}>
                    Home
                  </HeaderLink>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {CATEGORIES.map((cat) => (
                      <ListItem
                        key={cat.id}
                        title={cat.name}
                        href={`/category/${cat.id}`}
                        iconName={cat.icon}
                      />
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <HeaderLink href="/products" className={cn(navigationMenuTriggerStyle(), location === '/products' && "text-primary")}>
                    All Products
                  </HeaderLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 md:gap-4 flex-1 md:flex-none justify-end">
          <div className="hidden lg:block relative w-[300px]" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search products..." 
                className="pl-9 bg-secondary/50 border-transparent focus:bg-background focus:border-primary/50 transition-all rounded-full"
                value={searchTerm}
                onChange={handleSearch}
                onFocus={() => { if (searchTerm) setShowResults(true); }}
              />
            </div>
            
            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-popover rounded-xl border shadow-lg overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                {searchResults.length > 0 ? (
                  <ul className="max-h-[300px] overflow-y-auto py-2">
                    {searchResults.map(product => (
                      <li key={product.id}>
                        <Link href={`/product/${product.id}`}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors"
                            onClick={() => setShowResults(false)}
                        >
                            <img src={product.image} alt={product.title} className="w-10 h-10 rounded-md object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{product.title}</p>
                              <p className="text-xs text-muted-foreground truncate capitalize">{product.category}</p>
                            </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No products found
                  </div>
                )}
              </div>
            )}
          </div>

          <Button variant="ghost" size="icon" onClick={() => {
            const isDark = document.documentElement.classList.contains('dark');
            setTheme(isDark ? "light" : "dark");
          }}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { iconName: string }
>(({ className, title, children, iconName, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <HeaderLink
          ref={ref}
          href={href!}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2 text-sm font-medium leading-none">
            <DynamicIcon name={iconName} className="h-4 w-4 text-primary" />
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
            {children}
          </p>
        </HeaderLink>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (Icons as any)[name] || Icons.Circle;
  return <Icon className={className} />;
}
