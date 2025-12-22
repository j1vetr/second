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
import { CATEGORIES } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import React from "react";

export function Header() {
  const { setTheme } = useTheme();
  const [location] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app this would search
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
              <Link href="/" className="text-lg font-medium">Home</Link>
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
        <Link href="/">
          <a className="flex items-center gap-2">
            <img src="/assets/logo.png" alt="SecondStore" className="h-12 md:h-16 object-contain" />
          </a>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/">
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), location === '/' && "text-primary")}>
                    Home
                  </NavigationMenuLink>
                </Link>
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
                <Link href="/products">
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), location === '/products' && "text-primary")}>
                    All Products
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 md:gap-4 flex-1 md:flex-none justify-end">
          <form onSubmit={handleSearch} className="hidden lg:block relative w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search products..." className="pl-9 bg-secondary/50 border-transparent focus:bg-background focus:border-primary/50 transition-all rounded-full" />
          </form>

          <Button variant="ghost" size="icon" onClick={() => {
            const isDark = document.documentElement.classList.contains('dark');
            setTheme(isDark ? "light" : "dark");
          }}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Link href="/admin">
             <Button variant="outline" size="sm" className="hidden md:flex">
               Admin
             </Button>
          </Link>
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
        <Link href={href!}>
          <a
            ref={ref}
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
          </a>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (Icons as any)[name] || Icons.Circle;
  return <Icon className={className} />;
}

