import { motion } from "framer-motion";
import { ShoppingCart, Building2 } from "lucide-react";
import { StoreType } from "../types";

interface StoreTypeSelectorProps {
  onSelect: (type: StoreType) => void;
}

export const StoreTypeSelector = ({ onSelect }: StoreTypeSelectorProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex justify-start"
  >
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
      <button
        onClick={() => onSelect("EXTERNAL")}
        className="group relative overflow-hidden rounded-xl border-2 border-border bg-card p-6 text-left transition-all hover:border-primary hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <ShoppingCart className="w-8 h-8 text-primary mb-3" />
        <div className="font-semibold text-base mb-1">E-commerce Store</div>
        <div className="text-xs text-muted-foreground">
          Sell products online with a full storefront
        </div>
      </button>

      <button
        onClick={() => onSelect("INTERNAL")}
        className="group relative overflow-hidden rounded-xl border-2 border-border bg-card p-6 text-left transition-all hover:border-primary hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Building2 className="w-8 h-8 text-primary mb-3" />
        <div className="font-semibold text-base mb-1">Business Listing</div>
        <div className="text-xs text-muted-foreground">
          Get discovered locally by customers
        </div>
      </button>
    </div>
  </motion.div>
);
