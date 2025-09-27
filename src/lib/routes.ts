import { Chain } from "@rainbow-me/rainbowkit";

export const ROUTES = {
  CHAINS: (chain: Chain | undefined) =>
    `https://${
      chain?.id === 8453
        ? "basescan.org/tx/"
        : chain?.id === 11155111
        ? "sepolia."
        : ""
    }etherscan.io/tx/`,
  HOME: "/",
  DEALS: "/deals",
  FINDYOURPLUG: "/findyourplug",
  FINDYOURPLUG_DASHBOARD: "/findyourplug/dashboard",
  FINDYOURPLUG_ADD_STORE: "/findyourplug/dashboard/new-listing",
  FINDYOURPLUG_LISTINGS: "/findyourplug/dashboard/listings",
  FINDYOURPLUG_EDIT_STORE: (id: string) =>
    `/findyourplug/dashboard/listings/edit/${id}`,

  SIGNUP: "/signup",
  CONTACT: "/contact",
  HOW_IT_WORKS: "/how-it-works",
  PRIVACY_POLICY: "/privacy-policy",
  TERMS_AND_CONDITIONS: "/terms-and-conditions",
  CATEGORIES: "/findyourplug/categories",
  STORES: "/findyourplug/plugs",
  STORE: (storeUrl: string) => `/findyourplug/plugs/${storeUrl}`,
  PRODUCT: (storeUrl: string, productId: string) =>
    `/findyourplug/plugs/${storeUrl}/products/${productId}`,
  CATEGORY: (slug: string) => `/findyourplug/categories/${slug}`,
  LOGIN: "/findyourplug/login",
  REGISTER: "/findyourplug/register",
  EXTERNAL_LINK_TO_VENDORS: "https://vendor.digemart.com",
} as const;

// Define all API routes in one place
export const API_ROUTES = {
  featured: '/api/landing-page/main',
  plugs_landing: '/api/landing-page',
  contact: '/api/contact',
  products: {
    list: '/products',
    detail: (id: string) => `/products/${id}`,
    search: (query: string) => `/products/search?q=${query}`,
    getFeatured: (url: string) => `/api/products/featured/${url}`,
  },
  categories: {
    list: '/api/categories',
    store: "/api/categories?type=STORE",
    detail: (id: string) => `/api/categories/${id}`,
  },
  stores: {
    base: '/api/stores',
    list: '/api/stores',
    all: '/api/stores/all',
    listingsOverview: '/api/stores/listings/overview',
    listingByUrl: (storeUrl: string) => `/api/stores/listings/${storeUrl}`,
    detail: (id: string) => `/api/stores/${id}`,
    search: (query: string) => `/api/stores/search?q=${query}`,
    featuredStores: '/api/stores/featured-stores',
    topStores: '/api/stores/top-stores',
    featured: '/api/stores/featured',
    verified: '/api/stores/verified',
    status: '/api/stores/status',
    url: (url: string) => `/api/stores/url/${url}`,
    listings: '/api/stores/listings'
  },
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    socialLogin: '/api/auth/social-login',
  },
  search: {
    plugs: '/api/search/plugs',
    stores: '/api/search/stores',
    products: '/api/search/products',
  },
  userData: "/api/users/me",
  reviews: {
    base: '/api/reviews',
    myReviews: '/api/reviews/my-reviews',
    store: '/api/stores/reviews',
    product: '/api/products/reviews',
    
  }
} as const
