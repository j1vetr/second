import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertCategorySchema, insertOfferSchema, insertNewsletterSubscriberSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `product-${uniqueSuffix}${ext}`);
  },
});

// File filter for supported image types (iPhone & Android compatible)
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Supported formats:
  // iPhone: HEIC, HEIF, JPEG, PNG, GIF, TIFF, BMP
  // Android: JPEG, PNG, WebP, GIF, BMP
  const allowedMimes = [
    "image/jpeg",
    "image/jpg", 
    "image/png",
    "image/gif",
    "image/webp",
    "image/heic",
    "image/heif",
    "image/tiff",
    "image/bmp",
  ];
  
  const allowedExtensions = [
    ".jpg", ".jpeg", ".png", ".gif", ".webp", 
    ".heic", ".heif", ".tiff", ".tif", ".bmp"
  ];
  
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedMimes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Supported formats: JPEG, PNG, GIF, WebP, HEIC, HEIF, TIFF, BMP"));
  }
};

const upload = multer({
  storage: storage_multer,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
  },
});

async function optimizeImage(inputPath: string, outputPath: string): Promise<void> {
  await sharp(inputPath)
    .rotate() // Auto-rotate based on EXIF orientation data (fixes iPhone photos)
    .resize(1920, 1920, { 
      fit: 'inside', 
      withoutEnlargement: true 
    })
    .webp({ quality: 80 })
    .toFile(outputPath);
}

// Rotate an existing image by 90 degrees
async function rotateImage(imagePath: string, direction: 'left' | 'right'): Promise<void> {
  const degrees = direction === 'left' ? 270 : 90; // Use positive degrees for Sharp
  const tempPath = imagePath + '.tmp';
  
  // Read the image without auto-rotation to avoid EXIF interference
  const imageBuffer = fs.readFileSync(imagePath);
  
  await sharp(imageBuffer, { failOnError: false })
    .rotate(degrees) // Manual rotation - ignores EXIF since we're passing buffer
    .webp({ quality: 85 })
    .toFile(tempPath);
  
  // Replace original with rotated version
  fs.unlinkSync(imagePath);
  fs.renameSync(tempPath, imagePath);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Serve uploaded files with caching
  app.use("/uploads", (await import("express")).default.static(uploadsDir, {
    maxAge: '7d',
    etag: true,
    lastModified: true
  }));

  // Cache control middleware for API responses
  app.use('/api', (req, res, next) => {
    if (req.method === 'GET') {
      res.set('Cache-Control', 'public, max-age=60');
    }
    next();
  });

  // File Upload Route
  app.post("/api/upload", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      
      const originalPath = req.file.path;
      const originalFilename = req.file.filename;
      const webpFilename = originalFilename.replace(/\.[^.]+$/, '.webp');
      const webpPath = path.join(uploadsDir, webpFilename);
      
      try {
        await optimizeImage(originalPath, webpPath);
        
        if (originalPath !== webpPath && fs.existsSync(originalPath)) {
          fs.unlinkSync(originalPath);
        }
        
        const imageUrl = `/uploads/${webpFilename}`;
        res.json({ url: imageUrl, filename: webpFilename });
      } catch (optimizeError) {
        console.error("Error optimizing image, using original:", optimizeError);
        const imageUrl = `/uploads/${originalFilename}`;
        res.json({ url: imageUrl, filename: originalFilename });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // Image Rotation Route
  app.post("/api/rotate-image", async (req, res) => {
    try {
      const { imageUrl, direction } = req.body;
      
      if (!imageUrl || !direction) {
        return res.status(400).json({ error: "Image URL and direction required" });
      }
      
      if (direction !== 'left' && direction !== 'right') {
        return res.status(400).json({ error: "Direction must be 'left' or 'right'" });
      }
      
      // Security: Validate that imageUrl starts with /uploads/ and contains no path traversal
      if (!imageUrl.startsWith('/uploads/') || imageUrl.includes('..')) {
        return res.status(400).json({ error: "Invalid image URL" });
      }
      
      // Extract filename from URL (e.g., /uploads/image.webp -> image.webp)
      const filename = path.basename(imageUrl.replace(/^\/uploads\//, ''));
      const imagePath = path.resolve(uploadsDir, filename);
      
      // Security: Verify the resolved path is still within uploadsDir
      const resolvedUploadsDir = path.resolve(uploadsDir);
      if (!imagePath.startsWith(resolvedUploadsDir)) {
        return res.status(400).json({ error: "Invalid image path" });
      }
      
      if (!fs.existsSync(imagePath)) {
        return res.status(404).json({ error: "Image not found" });
      }
      
      await rotateImage(imagePath, direction);
      
      // Add cache buster to URL - use clean path
      const cleanUrl = `/uploads/${filename}`;
      const newUrl = `${cleanUrl}?v=${Date.now()}`;
      res.json({ success: true, url: newUrl });
    } catch (error) {
      console.error("Error rotating image:", error);
      res.status(500).json({ error: "Failed to rotate image" });
    }
  });

  // Categories Routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const category = await storage.getCategory(req.params.id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Error creating category:", error);
      res.status(500).json({ error: "Failed to create category" });
    }
  });

  app.patch("/api/categories/:id", async (req, res) => {
    try {
      const category = await storage.updateCategory(req.params.id, req.body);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCategory(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  // Products Routes (public - only active products)
  app.get("/api/products", async (req, res) => {
    try {
      const { category, featured } = req.query;
      
      let products;
      if (category) {
        products = await storage.getActiveProductsByCategory(category as string);
      } else if (featured === "true") {
        products = await storage.getFeaturedProducts();
      } else {
        products = await storage.getActiveProducts();
      }
      
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Admin Products Route (all products including inactive)
  app.get("/api/admin/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching all products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.post("/api/admin/migrate-slugs", async (req, res) => {
    try {
      const products = await storage.getProducts();
      let updated = 0;
      
      for (const product of products) {
        if (!product.slug) {
          const slug = await storage.generateUniqueSlug(product.title, product.id);
          await storage.updateProduct(product.id, { title: product.title } as any);
          updated++;
        }
      }
      
      res.json({ message: `Migration terminée. ${updated} produits mis à jour.`, updated });
    } catch (error) {
      console.error("Error migrating slugs:", error);
      res.status(500).json({ error: "Failed to migrate slugs" });
    }
  });

  app.get("/api/products/:idOrSlug", async (req, res) => {
    try {
      const param = req.params.idOrSlug;
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(param);
      
      let product;
      if (isUUID) {
        product = await storage.getProduct(param);
      } else {
        product = await storage.getProductBySlug(param);
      }
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.patch("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Offers Routes
  app.get("/api/offers", async (req, res) => {
    try {
      const { productId } = req.query;
      
      let offers;
      if (productId) {
        offers = await storage.getOffersByProduct(productId as string);
      } else {
        offers = await storage.getOffers();
      }
      
      res.json(offers);
    } catch (error) {
      console.error("Error fetching offers:", error);
      res.status(500).json({ error: "Failed to fetch offers" });
    }
  });

  app.get("/api/offers/:id", async (req, res) => {
    try {
      const offer = await storage.getOffer(req.params.id);
      if (!offer) {
        return res.status(404).json({ error: "Offer not found" });
      }
      res.json(offer);
    } catch (error) {
      console.error("Error fetching offer:", error);
      res.status(500).json({ error: "Failed to fetch offer" });
    }
  });

  app.post("/api/offers", async (req, res) => {
    try {
      const validatedData = insertOfferSchema.parse(req.body);
      const offer = await storage.createOffer(validatedData);
      res.status(201).json(offer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Error creating offer:", error);
      res.status(500).json({ error: "Failed to create offer" });
    }
  });

  app.patch("/api/offers/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      
      if (!["pending", "accepted", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }
      
      const offer = await storage.updateOfferStatus(req.params.id, status);
      if (!offer) {
        return res.status(404).json({ error: "Offer not found" });
      }
      res.json(offer);
    } catch (error) {
      console.error("Error updating offer status:", error);
      res.status(500).json({ error: "Failed to update offer status" });
    }
  });

  app.delete("/api/offers/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteOffer(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Offer not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting offer:", error);
      res.status(500).json({ error: "Failed to delete offer" });
    }
  });

  // Newsletter Routes
  app.get("/api/newsletter", async (req, res) => {
    try {
      const subscribers = await storage.getNewsletterSubscribers();
      res.json(subscribers);
    } catch (error) {
      console.error("Error fetching newsletter subscribers:", error);
      res.status(500).json({ error: "Failed to fetch subscribers" });
    }
  });

  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const validatedData = insertNewsletterSubscriberSchema.parse(req.body);
      const subscriber = await storage.createNewsletterSubscriber(validatedData);
      res.status(201).json(subscriber);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      if (error?.code === '23505') {
        return res.status(400).json({ error: "This email is already subscribed" });
      }
      console.error("Error subscribing to newsletter:", error);
      res.status(500).json({ error: "Failed to subscribe" });
    }
  });

  app.patch("/api/newsletter/:id", async (req, res) => {
    try {
      const { isActive } = req.body;
      const subscriber = await storage.updateNewsletterSubscriber(req.params.id, isActive);
      if (!subscriber) {
        return res.status(404).json({ error: "Subscriber not found" });
      }
      res.json(subscriber);
    } catch (error) {
      console.error("Error updating subscriber:", error);
      res.status(500).json({ error: "Failed to update subscriber" });
    }
  });

  app.delete("/api/newsletter/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteNewsletterSubscriber(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Subscriber not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      res.status(500).json({ error: "Failed to delete subscriber" });
    }
  });

  return httpServer;
}
