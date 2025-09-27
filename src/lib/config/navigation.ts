import { LucideIcon, Menu, Search, ShoppingCart, Store, X } from "lucide-react";
import { ROUTES } from "../routes";

export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
}

export const mainNavItems: NavItem[] = [
  {
    label: "Find Your Plug",
    href: ROUTES.FINDYOURPLUG,
  },
  {
    label: "How it Works",
    href: ROUTES.HOW_IT_WORKS,
  },

  {
    label: "Deals",
    href: "/deals",
  },
  {
    label: "Contact",
    href: ROUTES.CONTACT,
  },
];

export const navIcons = {
  Store,
  Search,
  ShoppingCart,
  Menu,
  X,
}; 
