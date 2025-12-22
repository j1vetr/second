import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <span className="text-[150px] md:text-[200px] font-bold leading-none gradient-text">
              404
            </span>
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                y: [0, -5, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="absolute -top-4 -right-4 md:-top-8 md:-right-8"
            >
              <Search className="w-12 h-12 md:w-16 md:h-16 text-primary" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-muted-foreground mb-8 text-base md:text-lg">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto gap-2 rounded-xl h-12 px-6" data-testid="button-go-home">
              <Home className="w-5 h-5" />
              Go Home
            </Button>
          </Link>
          <Link href="/products">
            <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 rounded-xl h-12 px-6" data-testid="button-browse-products">
              <Search className="w-5 h-5" />
              Browse Products
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12"
        >
          <button 
            onClick={() => window.history.back()}
            className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
            data-testid="button-go-back"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back to previous page
          </button>
        </motion.div>
      </div>
    </div>
  );
}
