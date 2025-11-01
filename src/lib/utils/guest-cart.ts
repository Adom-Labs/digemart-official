/**
 * Guest Cart Utilities
 * Handles localStorage persistence for anonymous users
 */

export interface GuestCartItem {
  productId: number;
  quantity: number;
  storeId: number;
  addedAt: string;
}

export interface GuestCart {
  storeId: number;
  items: GuestCartItem[];
  updatedAt: string;
}

const GUEST_CART_KEY = "digemart_guest_cart";
const GUEST_CART_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Get all guest carts from localStorage
 */
export function getGuestCarts(): GuestCart[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(GUEST_CART_KEY);
    if (!stored) return [];

    const carts: GuestCart[] = JSON.parse(stored);
    const now = Date.now();

    // Filter out expired carts
    const validCarts = carts.filter((cart) => {
      const cartAge = now - new Date(cart.updatedAt).getTime();
      return cartAge < GUEST_CART_EXPIRY;
    });

    // Update localStorage if we filtered out expired carts
    if (validCarts.length !== carts.length) {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(validCarts));
    }

    return validCarts;
  } catch (error) {
    console.error("Error reading guest carts:", error);
    return [];
  }
}

/**
 * Get guest cart for specific store
 */
export function getGuestCart(storeId: number): GuestCart | null {
  const carts = getGuestCarts();
  return carts.find((cart) => cart.storeId === storeId) || null;
}

/**
 * Add item to guest cart
 */
export function addToGuestCart(
  storeId: number,
  productId: number,
  quantity: number
): void {
  const carts = getGuestCarts();
  const existingCartIndex = carts.findIndex((cart) => cart.storeId === storeId);

  if (existingCartIndex >= 0) {
    const cart = carts[existingCartIndex];
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        quantity,
        storeId,
        addedAt: new Date().toISOString(),
      });
    }

    cart.updatedAt = new Date().toISOString();
  } else {
    // Create new cart for store
    carts.push({
      storeId,
      items: [
        {
          productId,
          quantity,
          storeId,
          addedAt: new Date().toISOString(),
        },
      ],
      updatedAt: new Date().toISOString(),
    });
  }

  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(carts));
}

/**
 * Update guest cart item quantity
 */
export function updateGuestCartItem(
  storeId: number,
  productId: number,
  quantity: number
): void {
  const carts = getGuestCarts();
  const cartIndex = carts.findIndex((cart) => cart.storeId === storeId);

  if (cartIndex >= 0) {
    const cart = carts[cartIndex];
    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex >= 0) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        cart.items.splice(itemIndex, 1);
      } else {
        // Update quantity
        cart.items[itemIndex].quantity = quantity;
      }

      cart.updatedAt = new Date().toISOString();

      // Remove cart if no items left
      if (cart.items.length === 0) {
        carts.splice(cartIndex, 1);
      }

      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(carts));
    }
  }
}

/**
 * Remove item from guest cart
 */
export function removeFromGuestCart(storeId: number, productId: number): void {
  updateGuestCartItem(storeId, productId, 0);
}

/**
 * Clear guest cart for specific store
 */
export function clearGuestCart(storeId: number): void {
  const carts = getGuestCarts();
  const filteredCarts = carts.filter((cart) => cart.storeId !== storeId);
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(filteredCarts));
}

/**
 * Clear all guest carts
 */
export function clearAllGuestCarts(): void {
  localStorage.removeItem(GUEST_CART_KEY);
}

/**
 * Get guest cart item count for specific store
 */
export function getGuestCartItemCount(storeId: number): number {
  const cart = getGuestCart(storeId);
  return cart
    ? cart.items.reduce((total, item) => total + item.quantity, 0)
    : 0;
}

/**
 * Get total guest cart items across all stores
 */
export function getTotalGuestCartItems(): number {
  const carts = getGuestCarts();
  console.log(carts);

  return (carts || []).reduce(
    (total, cart) =>
      total +
      (cart.items || []).reduce((cartTotal, item) => cartTotal + item.quantity, 0),
    0
  );
}

/**
 * Merge guest cart with user cart after authentication
 * Returns the guest cart items to be synced with backend
 */
export function getGuestCartForSync(storeId: number): GuestCartItem[] {
  const cart = getGuestCart(storeId);
  return cart ? cart.items : [];
}
