import client from "./client";

export interface ThemeTemplate {
  id: number;
  name: string;
  slug: string;
  description?: string;
  category:
    | "business"
    | "creative"
    | "minimal"
    | "modern"
    | "ecommerce"
    | "portfolio";
  preview?: string;
  config: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
      error?: string;
      success?: string;
    };
    typography: {
      fontFamily: string;
      headingFont?: string;
      fontSize: {
        xs: string;
        sm: string;
        base: string;
        lg: string;
        xl: string;
      };
    };
    layout: {
      heroType: "banner" | "carousel" | "video" | "minimal" | "split";
      productGridType: "grid" | "masonry" | "list" | "carousel";
      headerStyle: "classic" | "modern" | "minimal" | "centered";
      footerStyle: "simple" | "detailed" | "minimal" | "newsletter";
      gridColumns: number;
      showSidebar: boolean;
      showSearch: boolean;
      showCart: boolean;
    };
    globalSettings: {
      showHeader: boolean;
      showFooter: boolean;
      headerPosition: "fixed" | "static" | "sticky";
      maxWidth: number;
    };
    sections: Array<{
      id: string;
      type: string;
      component: string;
      props: Record<string, any>;
      order: number;
      visible: boolean;
    }>;
    darkModeEnabled?: boolean;
    customCss?: string;
  };
  isActive: boolean;
  isDefault: boolean;
  isPremium: boolean;
  price?: number;
  downloads: number;
  rating: number;
  tags: string[];
  createdBy?: {
    id: number;
    name: string;
    image?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ThemeTemplateListResponse {
  data: ThemeTemplate[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ThemeTemplateQuery {
  search?: string;
  category?: string;
  isActive?: boolean;
  isPremium?: boolean;
  tags?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface CreateThemeTemplateData {
  name: string;
  description?: string;
  category: string;
  preview?: string;
  config: ThemeTemplate["config"];
  isActive?: boolean;
  isDefault?: boolean;
  isPremium?: boolean;
  price?: number;
  tags?: string[];
}

export interface UpdateThemeTemplateData
  extends Partial<CreateThemeTemplateData> {}

// Get all theme templates
export async function getThemeTemplates(
  params?: ThemeTemplateQuery
): Promise<ThemeTemplateListResponse> {
  const searchParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
  }

  const response = await client.get(`/themes?${searchParams.toString()}`);
  return response.data;
}

// Get theme template by ID
export async function getThemeTemplate(id: number): Promise<ThemeTemplate> {
  const response = await client.get(`/themes/${id}`);
  return response.data;
}

// Get theme template by slug
export async function getThemeTemplateBySlug(
  slug: string
): Promise<ThemeTemplate> {
  const response = await client.get(`/themes/slug/${slug}`);
  return response.data;
}

// Get default theme template
export async function getDefaultThemeTemplate(): Promise<ThemeTemplate> {
  const response = await client.get("/themes/default");
  return response.data;
}

// Create theme template (Admin only)
export async function createThemeTemplate(
  data: CreateThemeTemplateData
): Promise<ThemeTemplate> {
  const response = await client.post("/themes", data);
  return response.data;
}

// Update theme template (Admin only)
export async function updateThemeTemplate(
  id: number,
  data: UpdateThemeTemplateData
): Promise<ThemeTemplate> {
  const response = await client.patch(`/themes/${id}`, data);
  return response.data;
}

// Set theme as default (Admin only)
export async function setDefaultThemeTemplate(
  id: number
): Promise<ThemeTemplate> {
  const response = await client.patch(`/themes/${id}/set-default`);
  return response.data;
}

// Delete theme template (Admin only)
export async function deleteThemeTemplate(id: number): Promise<void> {
  await client.delete(`/themes/${id}`);
}

// Increment download count
export async function incrementThemeDownloads(id: number): Promise<void> {
  await client.post(`/themes/${id}/download`);
}

// Get theme categories
export function getThemeCategories() {
  return [
    {
      value: "business",
      label: "Business",
      description: "Professional themes for business stores",
    },
    {
      value: "creative",
      label: "Creative",
      description: "Artistic themes for creative professionals",
    },
    {
      value: "minimal",
      label: "Minimal",
      description: "Clean and simple designs",
    },
    {
      value: "modern",
      label: "Modern",
      description: "Contemporary and trendy themes",
    },
    {
      value: "ecommerce",
      label: "E-commerce",
      description: "Optimized for online selling",
    },
    {
      value: "portfolio",
      label: "Portfolio",
      description: "Showcase your work and projects",
    },
  ];
}
