import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Contact() {
  const whatsappNumber = "+41788664492";
  const whatsappMessage = encodeURIComponent("Hello! I have a question about SecondStore.ch");

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have questions? We're here to help! Reach out to us via WhatsApp for the fastest response.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-2xl border p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className="text-muted-foreground">
                      Fritz-Oppliger-Strasse 18<br />
                      2504 Biel, Switzerland
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone / WhatsApp</h3>
                    <a 
                      href={`tel:+41788664492`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      +41 78 866 44 92
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a 
                      href="mailto:info@secondstore.ch"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      info@secondstore.ch
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Working Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 09:00 - 18:00<br />
                      Saturday: 10:00 - 16:00<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-4">
                  For the fastest response, contact us via WhatsApp:
                </p>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Chat on WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-2xl border overflow-hidden h-[400px] lg:h-full min-h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2717.7459847462984!2d7.2431!3d47.1344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478e19f1c2e7c1a7%3A0x1234567890abcdef!2sFritz-Oppliger-Strasse%2018%2C%202504%20Biel%2C%20Switzerland!5e0!3m2!1sen!2sch!4v1703350000000!5m2!1sen!2sch"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SecondStore Location"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-2xl border border-primary/20 p-6">
              <h3 className="font-bold text-lg mb-2">Visit Our Store</h3>
              <p className="text-sm text-muted-foreground">
                Come visit us to see our products in person! We're located in the heart of Biel, 
                easily accessible by public transport and with parking available nearby.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
