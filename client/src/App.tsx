/**
 * SecondStore.ch - Premium Marketplace
 * Developed by TOOV - https://toov.com.tr
 * All rights reserved.
 */

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Layout } from "@/components/layout/layout";

import { Home } from "@/pages/home";
import { ProductList } from "@/pages/product-list";
import { ProductDetail } from "@/pages/product-detail";
import { AdminDashboard } from "@/pages/admin-dashboard";
import { AdminProductEdit } from "@/pages/admin-product-edit";
import { AdminLogin } from "@/pages/admin-login";
import { HowItWorks } from "@/pages/how-it-works";
import { PrivacyPolicy } from "@/pages/privacy-policy";
import { TermsOfUse } from "@/pages/terms-of-use";
import { CookiePolicy } from "@/pages/cookie-policy";
import { Contact } from "@/pages/contact";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Admin routes without standard Layout */}
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admins" component={AdminDashboard} />
      <Route path="/admin/product/:id" component={AdminProductEdit} />
      
      {/* Public routes wrapped in Layout */}
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/products" component={ProductList} />
            <Route path="/category/:categoryId" component={ProductList} />
            <Route path="/product/:id" component={ProductDetail} />
            <Route path="/how-it-works" component={HowItWorks} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Route path="/terms-of-use" component={TermsOfUse} />
            <Route path="/cookie-policy" component={CookiePolicy} />
            <Route path="/contact" component={Contact} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="secondstore-theme">
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
