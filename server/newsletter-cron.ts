import cron from "node-cron";
import { storage } from "./storage";
import { sendBulkNewsletter } from "./email";

export function startNewsletterCron() {
  cron.schedule("0 10 */2 * *", async () => {
    console.log("[Newsletter] Running scheduled newsletter job...");
    
    try {
      const recentProducts = await storage.getRecentProducts(2);
      
      if (recentProducts.length === 0) {
        console.log("[Newsletter] No new products in the last 2 days. Skipping email.");
        return;
      }

      const subscribers = await storage.getActiveNewsletterSubscribers();
      
      if (subscribers.length === 0) {
        console.log("[Newsletter] No active subscribers. Skipping email.");
        return;
      }

      const emails = subscribers.map(s => s.email);
      console.log(`[Newsletter] Sending newsletter to ${emails.length} subscribers about ${recentProducts.length} new products...`);
      
      const result = await sendBulkNewsletter(emails, recentProducts);
      
      console.log(`[Newsletter] Newsletter sent. Success: ${result.success}, Failed: ${result.failed}`);
    } catch (error) {
      console.error("[Newsletter] Error running newsletter job:", error);
    }
  });

  console.log("[Newsletter] Newsletter cron job scheduled to run every 2 days at 10:00 AM");
}
