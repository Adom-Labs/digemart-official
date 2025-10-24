"use server";

import { createServerClient } from "@/lib/api/server-client";


export async function getStoreBySubdomain(subdomain: string) {
  try {
    const serverClient = await createServerClient();
    const response = await serverClient.get(`/stores/subdomain/${subdomain}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching store by subdomain:", error);
    throw new Error("Store not found");
  }
}

export async function getStoreProducts(
  subdomain: string,
  params: {
    page?: number;
    limit?: number;
    category?: string;
    featured?: boolean;
    search?: string;
  } = {}
) {
  try {
    // First get the store to get its ID
    const store = await getStoreBySubdomain(subdomain);

    const serverClient = await createServerClient();
    const response = await serverClient.get(`/products`, {
      params: {
        storeId: store.id,
        ...params,
      },
    });

    return {
      data: response.data.data.products,
      meta: response.data.meta,
    };
  } catch (error) {
    console.error("Error fetching store products:", error);
    return { data: [], meta: { total: 0, page: 1, limit: 12, totalPages: 0 } };
  }
}

export async function getStoreReviews(subdomain: string, limit = 5) {
  try {
    const store = await getStoreBySubdomain(subdomain);

    const serverClient = await createServerClient();
    const response = await serverClient.get(`/reviews/store/${store.id}`, {
      params: { limit },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching store reviews:", error);
    return { data: [] };
  }
}

export async function getStoreCategories(subdomain: string) {
  try {
    const store = await getStoreBySubdomain(subdomain);

    const serverClient = await createServerClient();
    const response = await serverClient.get(`/categories`, {
      params: {
        storeId: store.id,
        categoryType: "PRODUCT",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching store categories:", error);
    return { data: [] };
  }
}
