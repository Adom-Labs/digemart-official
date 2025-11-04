import { motion } from "framer-motion";
import {
  Store,
  ShoppingBag,
  Shirt,
  Laptop,
  Home,
  Utensils,
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

interface CategorySelectorProps {
  categories: Category[];
  onSelect: (category: Category) => void;
}

const getCategoryIcon = (slug: string) => {
  switch (slug) {
    case "electronics":
      return Laptop;
    case "fashion":
      return Shirt;
    case "food":
      return Utensils;
    case "home":
      return Home;
    default:
      return ShoppingBag;
  }
};

export const CategorySelector = ({
  categories,
  onSelect,
}: CategorySelectorProps) => {
  // Show first 6 categories or all if less
  const displayCategories = categories.slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="grid grid-cols-2 gap-3 max-w-lg">
        {displayCategories.map((category) => {
          const Icon = getCategoryIcon(category.slug);
          return (
            <button
              key={category.id}
              onClick={() => onSelect(category)}
              className="group relative overflow-hidden rounded-xl border-2 border-border bg-card p-4 text-left transition-all hover:border-primary hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Icon className="w-6 h-6 text-primary mb-2" />
              <div className="font-semibold text-sm mb-1">{category.name}</div>
              {category.description && (
                <div className="text-xs text-muted-foreground line-clamp-2">
                  {category.description}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};
