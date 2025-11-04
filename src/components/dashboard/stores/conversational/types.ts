export type StoreType = "EXTERNAL" | "INTERNAL";

export type Step =
  | "select-type"
  | "confirm-type"
  | "store-category"
  | "store-name"
  | "confirm-subdomain"
  | "edit-subdomain"
  | "store-description"
  | "store-logo"
  | "store-cover"
  | "store-hero-image"
  | "hero-headline"
  | "hero-tagline"
  | "store-email"
  | "store-phone"
  | "store-location"
  | "store-hours"
  | "theme-selection"
  | "review"
  | "complete";

export interface Message {
  id: string;
  type: "bot" | "user";
  content: string;
  component?: React.ReactNode;
  timestamp: Date;
}

export interface ThemeTemplate {
  id: number;
  name: string;
  description?: string;
  preview?: string;
  category: string;
  isPremium: boolean;
  isDefault: boolean;
  price?: number;
  rating: number;
  downloads: number;
  tags: string[];
  isActive: boolean;
}

export interface StoreData {
  storeType?: StoreType;
  storeName?: string;
  storeDescription?: string;
  storeLogo?: string;
  storeCoverPhoto?: string;
  storeHeroImage?: string;
  storeHeroHeadline?: string;
  storeHeroTagline?: string;
  email?: string;
  phone?: string;
  storeAddress?: string;
  storeLocationState?: string;
  storeLocationCity?: string;
  storeTimeOpen?: string;
  storeTimeClose?: string;
  weekOpen?: string;
  weekClose?: string;
  storeCategoryId?: number;
  subdomain?: string;
  selectedTheme?: ThemeTemplate;
}

export interface LocationFormData {
  address: string;
  state: string;
  city: string;
}

export interface HoursFormData {
  openTime: string;
  closeTime: string;
  weekOpen: string;
  weekClose: string;
}

export interface ConversationalBuilderProps {
  initialStoreType?: StoreType | null;
  onComplete?: (data: StoreData) => void;
  onSwitchToForm?: () => void;
}
