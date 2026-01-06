import type { Product, Category, Offer, InsertProduct, InsertCategory, InsertOffer, CampaignPopup, InsertCampaignPopup } from "@shared/schema";

const API_BASE = "/api";

// Categories API
export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE}/categories`);
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
}

export async function createCategory(category: InsertCategory): Promise<Category> {
  const response = await fetch(`${API_BASE}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(category),
  });
  if (!response.ok) throw new Error("Failed to create category");
  return response.json();
}

export async function updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category> {
  const response = await fetch(`${API_BASE}/categories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(category),
  });
  if (!response.ok) throw new Error("Failed to update category");
  return response.json();
}

export async function deleteCategory(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/categories/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete category");
}

// Products API
export async function getProducts(params?: { category?: string; featured?: boolean }): Promise<Product[]> {
  const queryParams = new URLSearchParams();
  if (params?.category) queryParams.append("category", params.category);
  if (params?.featured) queryParams.append("featured", "true");
  
  const url = `${API_BASE}/products${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
}

export async function getProduct(id: string): Promise<Product> {
  const response = await fetch(`${API_BASE}/products/${id}`);
  if (!response.ok) throw new Error("Failed to fetch product");
  return response.json();
}

export async function getSoldProducts(category?: string): Promise<Product[]> {
  const queryParams = new URLSearchParams({ sold: "true" });
  if (category) queryParams.append("category", category);
  
  const response = await fetch(`${API_BASE}/products?${queryParams.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch sold products");
  return response.json();
}

export async function getAdminProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE}/admin/products`);
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
}

export async function createProduct(product: InsertProduct): Promise<Product> {
  const response = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error("Failed to create product");
  return response.json();
}

export async function updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product> {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error("Failed to update product");
  return response.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete product");
}

// Offers API
export async function getOffers(productId?: string): Promise<Offer[]> {
  const url = productId 
    ? `${API_BASE}/offers?productId=${productId}`
    : `${API_BASE}/offers`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch offers");
  return response.json();
}

export async function createOffer(offer: InsertOffer): Promise<Offer> {
  const response = await fetch(`${API_BASE}/offers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(offer),
  });
  if (!response.ok) throw new Error("Failed to create offer");
  return response.json();
}

export async function updateOfferStatus(id: string, status: "pending" | "accepted" | "rejected"): Promise<Offer> {
  const response = await fetch(`${API_BASE}/offers/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error("Failed to update offer status");
  return response.json();
}

export async function deleteOffer(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/offers/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete offer");
}

// Newsletter API
import type { NewsletterSubscriber } from "@shared/schema";

export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  const response = await fetch(`${API_BASE}/newsletter`);
  if (!response.ok) throw new Error("Failed to fetch subscribers");
  return response.json();
}

export async function subscribeToNewsletter(email: string): Promise<NewsletterSubscriber> {
  const response = await fetch(`${API_BASE}/newsletter/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to subscribe");
  }
  return response.json();
}

export async function updateNewsletterSubscriber(id: string, isActive: boolean): Promise<NewsletterSubscriber> {
  const response = await fetch(`${API_BASE}/newsletter/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive }),
  });
  if (!response.ok) throw new Error("Failed to update subscriber");
  return response.json();
}

export async function deleteNewsletterSubscriber(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/newsletter/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete subscriber");
}

// Campaign Popup API
export async function getCampaignPopups(): Promise<CampaignPopup[]> {
  const response = await fetch(`${API_BASE}/admin/campaign-popups`);
  if (!response.ok) throw new Error("Failed to fetch campaign popups");
  return response.json();
}

export async function getCampaignPopup(id: string): Promise<CampaignPopup> {
  const response = await fetch(`${API_BASE}/admin/campaign-popups/${id}`);
  if (!response.ok) throw new Error("Failed to fetch campaign popup");
  return response.json();
}

export async function getActiveCampaignPopup(): Promise<CampaignPopup | null> {
  const response = await fetch(`${API_BASE}/campaign-popup/active`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Failed to fetch active campaign popup");
  return response.json();
}

export async function createCampaignPopup(popup: InsertCampaignPopup): Promise<CampaignPopup> {
  const response = await fetch(`${API_BASE}/admin/campaign-popups`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(popup),
  });
  if (!response.ok) throw new Error("Failed to create campaign popup");
  return response.json();
}

export async function updateCampaignPopup(id: string, popup: Partial<InsertCampaignPopup>): Promise<CampaignPopup> {
  const response = await fetch(`${API_BASE}/admin/campaign-popups/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(popup),
  });
  if (!response.ok) throw new Error("Failed to update campaign popup");
  return response.json();
}

export async function deleteCampaignPopup(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/admin/campaign-popups/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete campaign popup");
}
