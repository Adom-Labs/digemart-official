import apiClient from './client';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  subject?: string;
  phone?: string;
}

export interface ContactResponse {
  data: {
    id: number;
    name: string;
    email: string;
    message: string;
    subject?: string;
    phone?: string;
    status: string;
    priority: string;
    isRead: boolean;
    adminResponse?: string;
    respondedAt?: string;
    respondedBy?: number;
    createdAt: string;
    updatedAt: string;
  }
  statusCode: number
}

export const contactApi = {
  submitContact: async (
    data: ContactFormData
  ): Promise<ContactResponse> => {
    const response = await apiClient.post('/contact', data);
    return response.data;
  },
};
