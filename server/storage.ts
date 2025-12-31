import { 
  type User, 
  type InsertUser,
  type Product,
  type InsertProduct,
  type Category,
  type InsertCategory,
  type Offer,
  type InsertOffer,
  type NewsletterSubscriber,
  type InsertNewsletterSubscriber,
  users,
  products,
  categories,
  offers,
  newsletterSubscribers,
  slugify
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, like, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Category methods
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  // Product methods
  getProducts(): Promise<Product[]>;
  getActiveProducts(): Promise<Product[]>;
  getSoldProducts(): Promise<Product[]>;
  getSoldProductsByCategory(categoryId: string): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  getActiveProductsByCategory(categoryId: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  generateUniqueSlug(title: string, excludeId?: string): Promise<string>;

  // Offer methods
  getOffers(): Promise<Offer[]>;
  getOffer(id: string): Promise<Offer | undefined>;
  getOffersByProduct(productId: string): Promise<Offer[]>;
  createOffer(offer: InsertOffer): Promise<Offer>;
  updateOfferStatus(id: string, status: "pending" | "accepted" | "rejected"): Promise<Offer | undefined>;
  deleteOffer(id: string): Promise<boolean>;

  // Newsletter methods
  getNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  getActiveNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  updateNewsletterSubscriber(id: string, isActive: boolean): Promise<NewsletterSubscriber | undefined>;
  deleteNewsletterSubscriber(id: string): Promise<boolean>;
  getRecentProducts(days: number): Promise<Product[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values(category)
      .returning();
    return newCategory;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updated] = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getActiveProducts(): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(and(eq(products.isActive, true), eq(products.isSold, false)))
      .orderBy(desc(products.createdAt));
  }

  async getSoldProducts(): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(and(eq(products.isActive, true), eq(products.isSold, true)))
      .orderBy(desc(products.createdAt));
  }

  async getSoldProductsByCategory(categoryId: string): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(and(
        eq(products.category, categoryId),
        eq(products.isActive, true),
        eq(products.isSold, true)
      ))
      .orderBy(desc(products.createdAt));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.slug, slug));
    return product || undefined;
  }

  async generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
    const baseSlug = slugify(title);
    if (!baseSlug) return `product-${Date.now()}`;
    
    const existingProducts = await db
      .select({ slug: products.slug, id: products.id })
      .from(products)
      .where(like(products.slug, `${baseSlug}%`));
    
    const existingSlugs = existingProducts
      .filter(p => !excludeId || p.id !== excludeId)
      .map(p => p.slug)
      .filter(Boolean) as string[];
    
    if (!existingSlugs.includes(baseSlug)) {
      return baseSlug;
    }
    
    let counter = 2;
    while (existingSlugs.includes(`${baseSlug}-${counter}`)) {
      counter++;
    }
    return `${baseSlug}-${counter}`;
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(eq(products.category, categoryId))
      .orderBy(desc(products.createdAt));
  }

  async getActiveProductsByCategory(categoryId: string): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(and(
        eq(products.category, categoryId),
        eq(products.isActive, true),
        eq(products.isSold, false)
      ))
      .orderBy(desc(products.createdAt));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(and(
        eq(products.featured, true),
        eq(products.isActive, true),
        eq(products.isSold, false)
      ))
      .orderBy(desc(products.createdAt));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const slug = await this.generateUniqueSlug(product.title);
    const [newProduct] = await db
      .insert(products)
      .values({ ...product, slug })
      .returning();
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const updateData: any = { ...product };
    if (product.title) {
      updateData.slug = await this.generateUniqueSlug(product.title, id);
    }
    const [updated] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Offer methods
  async getOffers(): Promise<Offer[]> {
    return await db.select().from(offers).orderBy(desc(offers.createdAt));
  }

  async getOffer(id: string): Promise<Offer | undefined> {
    const [offer] = await db.select().from(offers).where(eq(offers.id, id));
    return offer || undefined;
  }

  async getOffersByProduct(productId: string): Promise<Offer[]> {
    return await db
      .select()
      .from(offers)
      .where(eq(offers.productId, productId))
      .orderBy(desc(offers.createdAt));
  }

  async createOffer(offer: InsertOffer): Promise<Offer> {
    const [newOffer] = await db
      .insert(offers)
      .values(offer)
      .returning();
    return newOffer;
  }

  async updateOfferStatus(id: string, status: "pending" | "accepted" | "rejected"): Promise<Offer | undefined> {
    const [updated] = await db
      .update(offers)
      .set({ status })
      .where(eq(offers.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteOffer(id: string): Promise<boolean> {
    const result = await db.delete(offers).where(eq(offers.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Newsletter methods
  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt));
  }

  async getActiveNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.isActive, true))
      .orderBy(desc(newsletterSubscribers.createdAt));
  }

  async createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const [newSubscriber] = await db
      .insert(newsletterSubscribers)
      .values(subscriber)
      .returning();
    return newSubscriber;
  }

  async updateNewsletterSubscriber(id: string, isActive: boolean): Promise<NewsletterSubscriber | undefined> {
    const [updated] = await db
      .update(newsletterSubscribers)
      .set({ isActive })
      .where(eq(newsletterSubscribers.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteNewsletterSubscriber(id: string): Promise<boolean> {
    const result = await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getRecentProducts(days: number): Promise<Product[]> {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);
    return await db
      .select()
      .from(products)
      .where(and(
        eq(products.isActive, true),
        eq(products.isSold, false),
        gte(products.createdAt, dateThreshold)
      ))
      .orderBy(desc(products.createdAt));
  }
}

export const storage = new DatabaseStorage();
