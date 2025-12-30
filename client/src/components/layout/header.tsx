import { Link, useLocation } from "wouter";
import { Search, Menu, Sun, Moon, Globe } from "lucide-react";
import * as Icons from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getProducts } from "@/lib/api";
import type { Product, Category } from "@shared/schema";

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

function AnimatedPlaceholder({ products }: { products: Product[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  
  const placeholders = products.length > 0 
    ? products.slice(0, 5).map(p => p.title)
    : ["Modern Sofa", "iPhone 14 Pro", "Smart TV", "Garden Set", "Office Chair"];

  useEffect(() => {
    const currentPlaceholder = placeholders[currentIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentPlaceholder.length) {
          setDisplayText(currentPlaceholder.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % placeholders.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex, placeholders]);

  return (
    <span className="text-muted-foreground">
      {displayText}<span className="animate-pulse">|</span>
    </span>
  );
}

export function Header() {
  const { setTheme } = useTheme();
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: allProducts = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 0) {
      const results = allProducts.filter(product =>
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
    <header className="relative w-full border-b bg-background">
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
                Accueil
              </Link>
              <div className="text-sm font-semibold text-muted-foreground mt-4">Catégories</div>
              {categories.map(cat => (
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
            <img src="/assets/logo-light.png" alt="SecondStore" className="h-14 md:h-20 object-contain dark:hidden" />
            <img src="/assets/logo-dark.png" alt="SecondStore" className="h-14 md:h-20 object-contain hidden dark:block" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className={cn(navigationMenuTriggerStyle(), location === '/' && "text-primary")}>
            Accueil
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Catégories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {categories.map((cat) => (
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
            </NavigationMenuList>
          </NavigationMenu>

          <Link href="/products" className={cn(navigationMenuTriggerStyle(), location === '/products' && "text-primary")}>
            Tous les Produits
          </Link>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 md:gap-4 flex-1 md:flex-none justify-end">
          <div className="hidden lg:block relative w-[400px]" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                className={cn(
                  "w-full h-10 pl-10 pr-4 bg-secondary/50 border border-transparent rounded-full text-sm transition-all outline-none",
                  "focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
                  isFocused && "bg-background border-primary/50 ring-2 ring-primary/20"
                )}
                value={searchTerm}
                onChange={handleSearch}
                onFocus={() => { setIsFocused(true); if (searchTerm) setShowResults(true); }}
                data-testid="input-search"
              />
              {!isFocused && !searchTerm && (
                <div className="absolute left-10 top-1/2 -translate-y-1/2 text-sm pointer-events-none">
                  <AnimatedPlaceholder products={allProducts} />
                </div>
              )}
            </div>
            
            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-popover rounded-xl border shadow-lg overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                {searchResults.length > 0 ? (
                  <ul className="max-h-[300px] overflow-y-auto py-2">
                    {searchResults.map(product => (
                      <li key={product.id}>
                        <Link href={`/product/${product.id}`}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors"
                            onClick={() => { setShowResults(false); setSearchTerm(""); setIsFocused(false); }}
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
                ) : searchTerm.length > 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No products found
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="button-language">
                <Globe className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Change language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLanguage('fr')} className="cursor-pointer">
                <span className="mr-2">🇫🇷</span> Français
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('en')} className="cursor-pointer">
                <span className="mr-2">🇬🇧</span> English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('de')} className="cursor-pointer">
                <span className="mr-2">🇩🇪</span> Deutsch
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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

function showLangOverlay() {
  const overlay = document.getElementById('lang-overlay');
  if (overlay) {
    overlay.classList.add('active');
  }
}

function changeLanguage(lang: string) {
  try {
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectElement) {
      showLangOverlay();
      selectElement.value = lang;
      selectElement.dispatchEvent(new Event('change'));
      // Hide overlay after translation completes
      setTimeout(() => {
        const overlay = document.getElementById('lang-overlay');
        if (overlay) overlay.classList.remove('active');
      }, 800);
    } else {
      showLangOverlay();
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
      document.cookie = `googtrans=/en/${lang}; path=/; domain=${window.location.hostname}`;
      document.cookie = `googtrans=/en/${lang}; path=/`;
      setTimeout(() => {
        window.location.reload();
      }, 200);
    }
  } catch (error) {
    console.error('Language change error:', error);
    showLangOverlay();
    setTimeout(() => window.location.reload(), 200);
  }
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
