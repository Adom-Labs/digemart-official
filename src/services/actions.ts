import { apiRequest, ApiResponse } from "@/lib/api-request";
import { API_ROUTES } from "@/lib/routes";
import { FeaturedData } from "@/lib/types";

export async function getFeatured(): Promise<ApiResponse<FeaturedData>> {
  return apiRequest<FeaturedData>(API_ROUTES.featured);
}
