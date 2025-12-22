import { motion } from "framer-motion";
import { Link } from "wouter";
import * as Icons from "lucide-react";

interface CategoryCardProps {
  id: string;
  name: string;
  iconName: string;
}

export function CategoryCard({ id, name, iconName }: CategoryCardProps) {
  // Dynamically get icon component
  const Icon = (Icons as any)[iconName] || Icons.Box;

  return (
    <Link href={`/category/${id}`}>
      <motion.a
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex flex-col items-center justify-center p-6 bg-card border rounded-xl hover:border-primary/50 hover:bg-secondary/50 transition-colors cursor-pointer group h-full"
      >
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
          <Icon className="w-6 h-6" />
        </div>
        <span className="font-medium text-center group-hover:text-primary transition-colors">{name}</span>
      </motion.a>
    </Link>
  );
}
