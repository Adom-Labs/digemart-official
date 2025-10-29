/**
 * Store Content API Services
 * Handles store layout and content management
 */

import apiClient from "./client";

export interface PageSection {
  id: string;
  type: "hero" | "products" | "testimonials" | "cta" | "about" | "custom";
  component: string;
  props: Record<string, any>;
  order: number;
  visible: boolean;
}

export interface LayoutSettings {
  heroType?: "banner" | "carousel" | "video" | "minimal" | "split";
  productGridType?: "grid" | "masonry" | "list" | "carousel";
  headerStyle?: "classic" | "modern" | "minimal" | "centered";
  footerStyle?: "simple" | "detailed" | "minimal" | "newsletter";
  gridColumns?: number;
  showSidebar?: boolean;
  showSearch?: boolean;
  showCart?: boolean;
}

export interface GlobalSettings {
  showHeader?: boolean;
  showFooter?: boolean;
  showSidebar?: boolean;
  headerPosition?: "fixed" | "static" | "sticky";
  maxWidth?: number;
}

export interface StoreLayout {
  sections?: PageSection[];
  layout?: LayoutSettings;
  globalSettings?: GlobalSettings;
  template?: string;
}

export interface ComponentTemplate {
  id: string;
  name: string;
  description: string;
  type: PageSection["type"];
  component: string;
  defaultProps: Record<string, any>;
  preview: string;
  category: string;
}

export const storeContentApi = {
  /**
   * Get store layout configuration
   */
  getStoreLayout: async (storeId: number): Promise<StoreLayout> => {
    const response = await apiClient.get(`/stores/${storeId}`);
    return response.data.layoutConfig || {};
  },

  /**
   * Update store layout
   */
  updateStoreLayout: async (
    storeId: number,
    layout: StoreLayout
  ): Promise<void> => {
    const response = await apiClient.patch(`/stores/${storeId}/layout`, layout);
    return response.data;
  },

  /**
   * Get available component templates
   */
  getComponentTemplates: async (): Promise<ComponentTemplate[]> => {
    // For now, return predefined templates
    // In the future, this could be a backend endpoint
    return [
      {
        id: "banner-hero",
        name: "Banner Hero",
        description: "Large banner with title, subtitle, and call-to-action",
        type: "hero",
        component: "BannerHero",
        defaultProps: {
          title: "Welcome to Our Store",
          subtitle: "Discover amazing products",
          ctaText: "Shop Now",
          ctaLink: "/products",
          backgroundImage: "",
        },
        preview: "/component-previews/banner-hero.jpg",
        category: "hero",
      },
      {
        id: "carousel-hero",
        name: "Carousel Hero",
        description: "Rotating carousel with multiple slides",
        type: "hero",
        component: "CarouselHero",
        defaultProps: {
          slides: [
            {
              title: "Slide 1",
              subtitle: "Description",
              image: "",
              ctaText: "Learn More",
              ctaLink: "#",
            },
          ],
          autoPlay: true,
          interval: 5000,
        },
        preview: "/component-previews/carousel-hero.jpg",
        category: "hero",
      },
      {
        id: "product-grid",
        name: "Product Grid",
        description: "Grid layout for displaying products",
        type: "products",
        component: "ProductGrid",
        defaultProps: {
          title: "Featured Products",
          limit: 8,
          columns: 4,
          showFilters: false,
          category: "",
        },
        preview: "/component-previews/product-grid.jpg",
        category: "products",
      },
      {
        id: "testimonials",
        name: "Customer Testimonials",
        description: "Display customer reviews and testimonials",
        type: "testimonials",
        component: "TestimonialsSection",
        defaultProps: {
          title: "What Our Customers Say",
          limit: 6,
          layout: "grid",
        },
        preview: "/component-previews/testimonials.jpg",
        category: "social-proof",
      },
      {
        id: "cta-section",
        name: "Call to Action",
        description: "Prominent call-to-action section",
        type: "cta",
        component: "CTASection",
        defaultProps: {
          title: "Ready to Get Started?",
          description: "Join thousands of satisfied customers",
          ctaText: "Get Started",
          ctaLink: "/contact",
          backgroundColor: "#3B82F6",
        },
        preview: "/component-previews/cta-section.jpg",
        category: "conversion",
      },
      {
        id: "about-section",
        name: "About Us",
        description: "Information about the store",
        type: "about",
        component: "AboutSection",
        defaultProps: {
          title: "About Our Store",
          content: "Tell your story here...",
          image: "",
          layout: "side-by-side",
        },
        preview: "/component-previews/about-section.jpg",
        category: "content",
      },
    ];
  },

  /**
   * Create a new page section
   */
  createSection: async (
    storeId: number,
    section: Omit<PageSection, "id">
  ): Promise<PageSection> => {
    // Generate a unique ID for the section
    const id = `section-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const newSection = { ...section, id };

    // Get current layout
    const currentLayout = await storeContentApi.getStoreLayout(storeId);
    const sections = currentLayout.sections || [];

    // Add new section
    sections.push(newSection);

    // Update layout
    await storeContentApi.updateStoreLayout(storeId, {
      ...currentLayout,
      sections,
    });

    return newSection;
  },

  /**
   * Update a page section
   */
  updateSection: async (
    storeId: number,
    sectionId: string,
    updates: Partial<PageSection>
  ): Promise<void> => {
    // Get current layout
    const currentLayout = await storeContentApi.getStoreLayout(storeId);
    const sections = currentLayout.sections || [];

    // Find and update section
    const sectionIndex = sections.findIndex((s) => s.id === sectionId);
    if (sectionIndex === -1) {
      throw new Error("Section not found");
    }

    sections[sectionIndex] = { ...sections[sectionIndex], ...updates };

    // Update layout
    await storeContentApi.updateStoreLayout(storeId, {
      ...currentLayout,
      sections,
    });
  },

  /**
   * Delete a page section
   */
  deleteSection: async (storeId: number, sectionId: string): Promise<void> => {
    // Get current layout
    const currentLayout = await storeContentApi.getStoreLayout(storeId);
    const sections = currentLayout.sections || [];

    // Remove section
    const filteredSections = sections.filter((s) => s.id !== sectionId);

    // Update layout
    await storeContentApi.updateStoreLayout(storeId, {
      ...currentLayout,
      sections: filteredSections,
    });
  },

  /**
   * Reorder sections
   */
  reorderSections: async (
    storeId: number,
    sectionIds: string[]
  ): Promise<void> => {
    // Get current layout
    const currentLayout = await storeContentApi.getStoreLayout(storeId);
    const sections = currentLayout.sections || [];

    // Reorder sections based on provided order
    const reorderedSections = sectionIds.map((id, index) => {
      const section = sections.find((s) => s.id === id);
      if (!section) throw new Error(`Section ${id} not found`);
      return { ...section, order: index };
    });

    // Update layout
    await storeContentApi.updateStoreLayout(storeId, {
      ...currentLayout,
      sections: reorderedSections,
    });
  },
};
