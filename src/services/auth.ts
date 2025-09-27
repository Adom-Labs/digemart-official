import { apiRequest } from "@/lib/api-request";
import { API_ROUTES } from "@/lib/routes";

export const registerUser = async (userData: {
  email: string;
  name: string;
  password: string;
}) => {
  const response = await apiRequest(API_ROUTES.auth.register, {
    method: "POST",
    data: {
      ...userData,
      purpose: "ADD_BUSINESS",
    },
  });

  return response.data;
};
