/**
 * Store Theme API Services
 * Handles theme configuration and customization
 */

import apiClient from "./client";

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  error?: string;
  success?: string;
}

export interface ThemeTypography {
  fontFamily: string;
  headingFont?: string;
  fontSize: Record<string, string>;
}

export interface StoreTheme {
  colors?: ThemeColors;
  typography?: ThemeTypography;
  customCss?: string;
  template?: string;
  darkModeEnabled?: boolean;
}

export interface ThemeTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  category: "modern" | "classic" | "minimal" | "bold";
  isPremium: boolean;
}

export const storeThemeApi = {
  /**
   * Get available theme templates
   */
  getThemeTemplates: async (): Promise<ThemeTemplate[]> => {
    // For now, return predefined templates
    // In the future, this could be a backend endpoint
    return [
      {
        id: "modern-blue",
        name: "Modern Blue",
        description: "Clean and professional with blue accents",
        preview: "/theme-previews/modern-blue.jpg",
        colors: {
          primary: "#3B82F6",
          secondary: "#64748B",
          accent: "#F59E0B",
          background: "#FFFFFF",
          text: "#1F2937",
        },
        typography: {
          fontFamily: "Inter, sans-serif",
          headingFont: "Inter, sans-serif",
          fontSize: {
            xs: "12px",
            sm: "14px",
            base: "16px",
            lg: "18px",
            xl: "20px",
          },
        },
        category: "modern",
        isPremium: false,
      },
      {
        id: "elegant-purple",
        name: "Elegant Purple",
        description: "Sophisticated design with purple tones",
        preview: "/theme-previews/elegant-purple.jpg",
        colors: {
          primary: "#8B5CF6",
          secondary: "#6B7280",
          accent: "#F59E0B",
          background: "#FAFAFA",
          text: "#111827",
        },
        typography: {
          fontFamily: "Poppins, sans-serif",
          headingFont: "Playfair Display, serif",
          fontSize: {
            xs: "12px",
            sm: "14px",
            base: "16px",
            lg: "18px",
            xl: "20px",
          },
        },
        category: "classic",
        isPremium: true,
      },
      {
        id: "minimal-green",
        name: "Minimal Green",
        description: "Clean and minimal with green accents",
        preview: "/theme-previews/minimal-green.jpg",
        colors: {
          primary: "#10B981",
          secondary: "#6B7280",
          accent: "#F59E0B",
          background: "#FFFFFF",
          text: "#374151",
        },
        typography: {
          fontFamily: "System UI, sans-serif",
          fontSize: {
            xs: "12px",
            sm: "14px",
            base: "16px",
            lg: "18px",
            xl: "20px",
          },
        },
        category: "minimal",
        isPremium: false,
      },
    ];
  },

  /**
   * Update store theme
   */
  updateStoreTheme: async (
    storeId: number,
    theme: StoreTheme
  ): Promise<void> => {
    const response = await apiClient.patch(`/stores/${storeId}/theme`, theme);
    return response.data;
  },

  /**
   * Get store theme
   */
  getStoreTheme: async (storeId: number): Promise<StoreTheme> => {
    const response = await apiClient.get(`/stores/${storeId}`);
    return response.data.themeConfig || {};
  },

  /**
   * Preview theme (client-side only)
   */
  previewTheme: (theme: StoreTheme): void => {
    const root = document.documentElement;

    // Apply theme colors as CSS custom properties
    if (theme.colors) {
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--theme-${key}`, value);
      });
    }

    // Apply typography
    if (theme.typography) {
      if (theme.typography.fontFamily) {
        root.style.setProperty(
          "--theme-font-family",
          theme.typography.fontFamily
        );
      }
      if (theme.typography.headingFont) {
        root.style.setProperty(
          "--theme-heading-font",
          theme.typography.headingFont
        );
      }
    }

    // Apply custom CSS
    if (theme.customCss) {
      const existingStyle = document.getElementById("theme-preview-css");
      if (existingStyle) {
        existingStyle.remove();
      }

      const style = document.createElement("style");
      style.id = "theme-preview-css";
      style.textContent = theme.customCss;
      document.head.appendChild(style);
    }
  },

  /**
   * Reset theme preview
   */
  resetThemePreview: (): void => {
    const root = document.documentElement;
    const themeProperties = [
      "--theme-primary",
      "--theme-secondary",
      "--theme-accent",
      "--theme-background",
      "--theme-text",
      "--theme-font-family",
      "--theme-heading-font",
    ];

    themeProperties.forEach((prop) => {
      root.style.removeProperty(prop);
    });

    const previewStyle = document.getElementById("theme-preview-css");
    if (previewStyle) {
      previewStyle.remove();
    }
  },
};
