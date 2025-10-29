/**
 * Order tracking utilities for generating order numbers and tracking URLs
 */

export interface OrderTrackingData {
  orderId: number;
  orderNumber: string;
  storeId: number;
  customerId?: number;
  guestEmail?: string;
  createdAt: Date;
}

export interface TrackingUrlOptions {
  includeAuth?: boolean;
  redirectUrl?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
}

/**
 * Generate a unique order number
 */
export function generateOrderNumber(storeId: number, orderId: number): string {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, "0");
  const day = String(new Date().getDate()).padStart(2, "0");

  // Format: ORD-YYYY-MM-DD-STORE-ID
  return `ORD-${year}${month}${day}-${storeId
    .toString()
    .padStart(3, "0")}-${orderId.toString().padStart(6, "0")}`;
}

/**
 * Parse order number to extract components
 */
export function parseOrderNumber(orderNumber: string): {
  year: number;
  month: number;
  day: number;
  storeId: number;
  orderId: number;
} | null {
  const pattern = /^ORD-(\d{4})(\d{2})(\d{2})-(\d{3})-(\d{6})$/;
  const match = orderNumber.match(pattern);

  if (!match) {
    return null;
  }

  return {
    year: parseInt(match[1]),
    month: parseInt(match[2]),
    day: parseInt(match[3]),
    storeId: parseInt(match[4]),
    orderId: parseInt(match[5]),
  };
}

/**
 * Generate tracking URL for an order
 */
export function generateTrackingUrl(
  orderNumber: string,
  storeSlug?: string,
  options: TrackingUrlOptions = {}
): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://digemart.com";

  // Use store-specific tracking if store slug is provided
  const trackingPath = storeSlug
    ? `/store/${storeSlug}/orders/track/${orderNumber}`
    : `/orders/track/${orderNumber}`;

  const url = new URL(trackingPath, baseUrl);

  // Add authentication parameters if needed
  if (options.includeAuth) {
    url.searchParams.set("auth", "required");
  }

  // Add redirect URL for after tracking
  if (options.redirectUrl) {
    url.searchParams.set("redirect", options.redirectUrl);
  }

  // Add UTM parameters for analytics
  if (options.utm) {
    if (options.utm.source)
      url.searchParams.set("utm_source", options.utm.source);
    if (options.utm.medium)
      url.searchParams.set("utm_medium", options.utm.medium);
    if (options.utm.campaign)
      url.searchParams.set("utm_campaign", options.utm.campaign);
  }

  return url.toString();
}

/**
 * Generate guest order tracking URL with email verification
 */
export function generateGuestTrackingUrl(
  orderNumber: string,
  email: string,
  storeSlug?: string,
  options: TrackingUrlOptions = {}
): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://digemart.com";

  const trackingPath = storeSlug
    ? `/store/${storeSlug}/orders/guest-track/${orderNumber}`
    : `/orders/guest-track/${orderNumber}`;

  const url = new URL(trackingPath, baseUrl);

  // Add email parameter for guest verification
  url.searchParams.set("email", email);

  // Add other options
  if (options.redirectUrl) {
    url.searchParams.set("redirect", options.redirectUrl);
  }

  if (options.utm) {
    if (options.utm.source)
      url.searchParams.set("utm_source", options.utm.source);
    if (options.utm.medium)
      url.searchParams.set("utm_medium", options.utm.medium);
    if (options.utm.campaign)
      url.searchParams.set("utm_campaign", options.utm.campaign);
  }

  return url.toString();
}

/**
 * Generate order receipt URL
 */
export function generateReceiptUrl(
  orderNumber: string,
  storeSlug?: string,
  format: "html" | "pdf" = "html"
): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://digemart.com";

  const receiptPath = storeSlug
    ? `/store/${storeSlug}/orders/receipt/${orderNumber}`
    : `/orders/receipt/${orderNumber}`;

  const url = new URL(receiptPath, baseUrl);

  if (format === "pdf") {
    url.searchParams.set("format", "pdf");
  }

  return url.toString();
}

/**
 * Generate customer support URL for an order
 */
export function generateSupportUrl(
  orderNumber: string,
  storeSlug?: string,
  issue?: string
): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://digemart.com";

  const supportPath = storeSlug ? `/store/${storeSlug}/support` : `/support`;

  const url = new URL(supportPath, baseUrl);

  // Pre-fill order number
  url.searchParams.set("order", orderNumber);

  // Pre-fill issue type if provided
  if (issue) {
    url.searchParams.set("issue", issue);
  }

  return url.toString();
}

/**
 * Validate order number format
 */
export function isValidOrderNumber(orderNumber: string): boolean {
  const pattern = /^ORD-\d{8}-\d{3}-\d{6}$/;
  return pattern.test(orderNumber);
}

/**
 * Format order number for display
 */
export function formatOrderNumber(orderNumber: string): string {
  if (!isValidOrderNumber(orderNumber)) {
    return orderNumber;
  }

  // Add visual separators for better readability
  return orderNumber.replace(/^(ORD)-(\d{8})-(\d{3})-(\d{6})$/, "$1-$2-$3-$4");
}

/**
 * Get order age in days
 */
export function getOrderAge(createdAt: Date | string): number {
  const orderDate =
    typeof createdAt === "string" ? new Date(createdAt) : createdAt;
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - orderDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Get estimated delivery date based on order date and shipping method
 */
export function getEstimatedDeliveryDate(
  orderDate: Date | string,
  shippingMethod: "standard" | "express" | "overnight" = "standard"
): Date {
  const baseDate =
    typeof orderDate === "string" ? new Date(orderDate) : orderDate;
  const deliveryDate = new Date(baseDate);

  // Add business days based on shipping method
  let businessDaysToAdd = 0;
  switch (shippingMethod) {
    case "overnight":
      businessDaysToAdd = 1;
      break;
    case "express":
      businessDaysToAdd = 2;
      break;
    case "standard":
    default:
      businessDaysToAdd = 5;
      break;
  }

  // Add business days (skip weekends)
  let daysAdded = 0;
  while (daysAdded < businessDaysToAdd) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);

    // Skip weekends (Saturday = 6, Sunday = 0)
    if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) {
      daysAdded++;
    }
  }

  return deliveryDate;
}

/**
 * Format delivery date for display
 */
export function formatDeliveryDate(date: Date | string): string {
  const deliveryDate = typeof date === "string" ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return deliveryDate.toLocaleDateString("en-US", options);
}

/**
 * Get order status color for UI display
 */
export function getOrderStatusColor(status: string): {
  bg: string;
  text: string;
  border: string;
} {
  switch (status.toUpperCase()) {
    case "PENDING":
    case "PENDING_PAYMENT":
      return {
        bg: "bg-yellow-50",
        text: "text-yellow-800",
        border: "border-yellow-200",
      };
    case "PROCESSING":
    case "CONFIRMED":
      return {
        bg: "bg-blue-50",
        text: "text-blue-800",
        border: "border-blue-200",
      };
    case "SHIPPED":
    case "IN_TRANSIT":
      return {
        bg: "bg-purple-50",
        text: "text-purple-800",
        border: "border-purple-200",
      };
    case "DELIVERED":
    case "COMPLETED":
      return {
        bg: "bg-green-50",
        text: "text-green-800",
        border: "border-green-200",
      };
    case "CANCELLED":
    case "REFUNDED":
      return {
        bg: "bg-red-50",
        text: "text-red-800",
        border: "border-red-200",
      };
    case "RETURNED":
      return {
        bg: "bg-orange-50",
        text: "text-orange-800",
        border: "border-orange-200",
      };
    default:
      return {
        bg: "bg-gray-50",
        text: "text-gray-800",
        border: "border-gray-200",
      };
  }
}

/**
 * Get human-readable order status
 */
export function getOrderStatusText(status: string): string {
  switch (status.toUpperCase()) {
    case "PENDING":
      return "Order Pending";
    case "PENDING_PAYMENT":
      return "Awaiting Payment";
    case "PROCESSING":
      return "Processing Order";
    case "CONFIRMED":
      return "Order Confirmed";
    case "SHIPPED":
      return "Shipped";
    case "IN_TRANSIT":
      return "In Transit";
    case "DELIVERED":
      return "Delivered";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    case "REFUNDED":
      return "Refunded";
    case "RETURNED":
      return "Returned";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }
}

/**
 * Check if order can be cancelled
 */
export function canCancelOrder(status: string): boolean {
  const cancellableStatuses = [
    "PENDING",
    "PENDING_PAYMENT",
    "PROCESSING",
    "CONFIRMED",
  ];
  return cancellableStatuses.includes(status.toUpperCase());
}

/**
 * Check if order can be returned
 */
export function canReturnOrder(
  status: string,
  deliveryDate?: Date | string
): boolean {
  if (status.toUpperCase() !== "DELIVERED") {
    return false;
  }

  if (!deliveryDate) {
    return false;
  }

  const delivered =
    typeof deliveryDate === "string" ? new Date(deliveryDate) : deliveryDate;
  const now = new Date();
  const daysSinceDelivery = Math.floor(
    (now.getTime() - delivered.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Allow returns within 14 days of delivery
  return daysSinceDelivery <= 14;
}

/**
 * Generate tracking event description
 */
export function generateTrackingEventDescription(
  status: string,
  location?: string,
  carrier?: string
): string {
  const baseDescription = getOrderStatusText(status);

  if (location && carrier) {
    return `${baseDescription} - ${location} (${carrier})`;
  } else if (location) {
    return `${baseDescription} - ${location}`;
  } else if (carrier) {
    return `${baseDescription} (${carrier})`;
  }

  return baseDescription;
}
