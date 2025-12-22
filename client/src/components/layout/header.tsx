import { Link, useLocation } from "wouter";
import { Search, ShoppingBag, Menu, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";
import { CATEGORIES } from "@/lib/mockData";

export function Header() {
  const { setTheme } = useTheme();
  const [location, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app this would search
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="flex flex-col gap-4 mt-8">
              <Link href="/" className="text-lg font-medium">Ana Sayfa</Link>
              <div className="text-sm font-semibold text-muted-foreground mt-4">Kategoriler</div>
              {CATEGORIES.map(cat => (
                <Link key={cat.id} href={`/category/${cat.id}`} className="text-sm hover:text-primary transition-colors">
                  {cat.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/">
          <a className="flex items-center gap-2">
            <img src="/assets/logo.png" alt="SecondStore" className="h-8 md:h-10 object-contain" />
          </a>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/">
            <a className={`text-sm font-medium transition-colors hover:text-primary ${location === '/' ? 'text-primary' : ''}`}>
              Ana Sayfa
            </a>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm font-medium">
                Kategoriler
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              {CATEGORIES.map((cat) => (
                <DropdownMenuItem key={cat.id} onClick={() => setLocation(`/category/${cat.id}`)}>
                  {cat.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/products">
            <a className={`text-sm font-medium transition-colors hover:text-primary ${location === '/products' ? 'text-primary' : ''}`}>
              Tüm Ürünler
            </a>
          </Link>
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 md:gap-4 flex-1 md:flex-none justify-end">
          <form onSubmit={handleSearch} className="hidden lg:block relative w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Ürün ara..." className="pl-9 bg-secondary/50 border-transparent focus:bg-background focus:border-primary/50 transition-all rounded-full" />
          </form>

          <Button variant="ghost" size="icon" onClick={() => {
            // Toggle theme logic needs to read current state, simple implementation for now
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
