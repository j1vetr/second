import nodemailer from "nodemailer";
import type { Product } from "@shared/schema";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendNewsletterEmail(
  recipientEmail: string,
  products: Product[]
): Promise<boolean> {
  const productListHtml = products
    .map(
      (product) => `
      <tr>
        <td style="padding: 15px; border-bottom: 1px solid #eee;">
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="120" style="vertical-align: top;">
                <img src="${product.image}" alt="${product.title}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;" />
              </td>
              <td style="padding-left: 15px; vertical-align: top;">
                <h3 style="margin: 0 0 8px 0; color: #333; font-size: 16px;">${product.title}</h3>
                <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
                  ${product.condition === 'new' ? '🆕 New' : '♻️ Used'}
                </p>
                ${product.price ? `
                  <p style="margin: 0; font-weight: bold; color: #f97316; font-size: 18px;">
                    ${product.discountPrice 
                      ? `<span style="text-decoration: line-through; color: #999; font-size: 14px;">CHF ${parseFloat(product.price).toFixed(2)}</span> CHF ${parseFloat(product.discountPrice).toFixed(2)}`
                      : `CHF ${parseFloat(product.price).toFixed(2)}`
                    }
                  </p>
                ` : ''}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `
    )
    .join("");

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <tr>
          <td style="padding: 30px; text-align: center; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">SecondStore.ch</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">New Products Just Arrived!</p>
          </td>
        </tr>
        
        <tr>
          <td style="padding: 30px;">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 22px;">Check Out Our Latest Products 🎉</h2>
            <p style="color: #666; margin: 0 0 25px 0; line-height: 1.6;">
              We've added some amazing new items to our collection. Take a look at what's new!
            </p>
            
            <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
              ${productListHtml}
            </table>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://secondstore.ch/products" style="display: inline-block; padding: 14px 35px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                View All Products
              </a>
            </div>
          </td>
        </tr>
        
        <tr>
          <td style="padding: 25px; background-color: #f8f8f8; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #999; margin: 0 0 10px 0; font-size: 12px;">
              You're receiving this email because you subscribed to SecondStore.ch newsletter.
            </p>
            <p style="color: #999; margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} SecondStore.ch | Developed by TOOV
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"SecondStore.ch" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: "🆕 New Products at SecondStore.ch!",
      html: emailHtml,
    });
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${recipientEmail}:`, error);
    return false;
  }
}

export async function sendBulkNewsletter(
  emails: string[],
  products: Product[]
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const email of emails) {
    const sent = await sendNewsletterEmail(email, products);
    if (sent) {
      success++;
    } else {
      failed++;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return { success, failed };
}
