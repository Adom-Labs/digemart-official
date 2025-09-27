import { ROUTES } from "../routes";

export interface SiteSearchItem {
  title: string;
  description: string;
  path: string;
  keywords: string[];
  category: "feature" | "page" | "tool" | "resource" | "store";
  icon?: string;
}

export const createStoreItem: SiteSearchItem = {
  title: "Create Your Online Store",
  description:
    "Launch your e-commerce presence with our easy-to-use store builder. Set up products, manage inventory, and start selling online in minutes.",
  path: "/create-store",
  keywords: [
    "store",
    "e-commerce",
    "online shop",
    "selling",
    "products",
    "business",
    "marketplace",
  ],
  category: "store",
  icon: "Store",
};

export const siteSearchData: SiteSearchItem[] = [
  {
    title: "Find Your Plug",
    description:
      "Discover and connect with local vendors in your area. Browse through categorized listings, find products, and support local businesses.",
    path: ROUTES.FINDYOURPLUG,
    keywords: [
      "local",
      "vendors",
      "products",
      "marketplace",
      "shopping",
      "nearby",
      "community",
    ],
    category: "feature",
    icon: "MapPin",
  },
  {
    title: "Business Directory",
    description:
      "Browse our comprehensive business directory. Find trusted partners, read reviews, and connect with businesses in your industry.",
    path: ROUTES.FINDYOURPLUG,
    keywords: [
      "businesses",
      "directory",
      "listings",
      "partners",
      "search",
      "categories",
      "local",
    ],
    category: "feature",
    icon: "Building2",
  },
  {
    title: "Performance Analytics",
    description:
      "Track your business metrics with our comprehensive analytics dashboard. Monitor growth, visitor statistics, and conversion data.",
    path: ROUTES.FINDYOURPLUG_DASHBOARD,
    keywords: [
      "analytics",
      "metrics",
      "statistics",
      "dashboard",
      "performance",
      "tracking",
      "insights",
    ],
    category: "tool",
    icon: "LineChart",
  },
  {
    title: "Business Deals",
    description:
      "Access exclusive discounts on business tools and services. Get notified about limited-time promotions tailored to your needs.",
    path: ROUTES.DEALS,
    keywords: [
      "deals",
      "discounts",
      "offers",
      "promotions",
      "savings",
      "special offers",
    ],
    category: "feature",
    icon: "Tag",
  },
  {
    title: "Store Management",
    description:
      "Manage your store, products, and orders from one central dashboard. Easy inventory management and order processing.",
    path: ROUTES.FINDYOURPLUG_DASHBOARD,
    keywords: [
      "management",
      "dashboard",
      "inventory",
      "orders",
      "products",
      "store",
    ],
    category: "tool",
    icon: "LayoutDashboard",
  },
  {
    title: "Featured Stores",
    description:
      "Explore our featured and top-rated stores. Discover unique products and trusted sellers in our marketplace.",
    path: ROUTES.STORES,
    keywords: [
      "stores",
      "featured",
      "marketplace",
      "sellers",
      "shopping",
      "trusted",
    ],
    category: "page",
    icon: "Store",
  },
  {
    title: "How It Works",
    description:
      "Learn how to start selling on Digemart. Step-by-step guide to creating and managing your online store.",
    path: ROUTES.HOW_IT_WORKS,
    keywords: [
      "guide",
      "tutorial",
      "selling",
      "store",
      "setup",
      "instructions",
    ],
    category: "page",
    icon: "HelpCircle",
  },
  {
    title: "Contact Sales",
    description:
      "Get in touch with our sales team. Learn more about our platform and how we can help grow your business.",
    path: ROUTES.CONTACT,
    keywords: [
      "contact",
      "sales",
      "support",
      "questions",
      "help",
      "information",
    ],
    category: "page",
    icon: "Phone",
  },
];
