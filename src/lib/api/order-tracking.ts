import client from "./client";
import type {
  OrderTrackingTimeline,
  CreateTrackingData,
  UpdateTrackingData,
  GuestTrackingRequest,
  OrderTrackingEvent,
} from "./hooks/order-tracking";

export const orderTrackingApi = {
  // Get order tracking timeline for authenticated users
  async getOrderTracking(orderId: number): Promise<OrderTrackingTimeline> {
    const response = await client.get(`/orders/${orderId}/tracking`);
    return response.data;
  },

  // Add tracking information to order (store owners/admins)
  async addOrderTracking(
    orderId: number,
    data: CreateTrackingData
  ): Promise<OrderTrackingEvent> {
    const response = await client.post(`/orders/${orderId}/tracking`, data);
    return response.data;
  },

  // Update tracking information (store owners/admins)
  async updateOrderTracking(
    trackingId: number,
    data: UpdateTrackingData
  ): Promise<OrderTrackingEvent> {
    const response = await client.patch(`/orders/tracking/${trackingId}`, data);
    return response.data;
  },

  // Get guest order tracking timeline
  async getGuestOrderTracking(
    request: GuestTrackingRequest
  ): Promise<OrderTrackingTimeline> {
    const response = await client.post("/orders/guest/tracking", request);
    return response.data;
  },

  // Get store orders with tracking (for store owners)
  async getStoreOrders(storeId: number): Promise<OrderTrackingTimeline[]> {
    const response = await client.get(`/orders/store/${storeId}`);
    return response.data.data;
  },

  // Get user order history with tracking
  async getOrderHistory(): Promise<OrderTrackingTimeline[]> {
    const response = await client.get("/orders/my-orders");
    return response.data.data;
  },

  // Get order details with tracking
  async getOrderWithTracking(orderId: number): Promise<OrderTrackingTimeline> {
    const response = await client.get(`/orders/${orderId}`);
    return response.data;
  },

  // Lookup guest order
  async lookupGuestOrder(
    orderId: number,
    email: string
  ): Promise<OrderTrackingTimeline> {
    const response = await client.post("/orders/guest/lookup", {
      orderId,
      email,
    });
    return response.data;
  },
};
