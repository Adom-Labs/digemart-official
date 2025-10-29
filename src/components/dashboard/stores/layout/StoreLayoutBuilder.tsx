"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Save, RefreshCw, Plus, Monitor, Smartphone } from "lucide-react";
import { Store } from "@/lib/api/hooks/stores";
import { SectionLibrary } from "./SectionLibrary";
import { PageBuilder } from "./PageBuilder";
import { LayoutSettings } from "./LayoutSettings";
import { ResponsivePreview } from "./ResponsivePreview";
import { toast } from "react-hot-toast";

interface StoreLayoutBuilderProps {
  store: Store;
}

interface PageSection {
  id: string;
  type: "hero" | "products" | "testimonials" | "cta" | "about" | "custom";
  component: string;
  props: Record<string, any>;
  order: number;
  visible: boolean;
}

interface LayoutConfig {
  sections: PageSection[];
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
}

export function StoreLayoutBuilder({ store }: StoreLayoutBuilderProps) {
  const [activeTab, setActiveTab] = useState("builder");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop"
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Layout configuration state
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>(() => {
    const existingConfig = store.layoutConfig as LayoutConfig;
    const defaultSections = [
      {
        id: "hero-1",
        type: "hero" as const,
        component: "BannerHero",
        props: {
          title: store.storeName,
          subtitle: store.storeDescription,
          backgroundImage: store.storeCoverPhoto || "",
          ctaText: "Shop Now",
          ctaLink: "/products",
        },
        order: 0,
        visible: true,
      },
      {
        id: "products-1",
        type: "products" as const,
        component: "ProductGrid",
        props: {
          title: "Featured Products",
          limit: 8,
          showFilters: true,
        },
        order: 1,
        visible: true,
      },
    ];

    return {
      sections: existingConfig?.sections || defaultSections,
      layout: existingConfig?.layout || {
        heroType: "banner",
        productGridType: "grid",
        headerStyle: "modern",
        footerStyle: "detailed",
        gridColumns: 3,
        showSidebar: false,
        showSearch: true,
        showCart: true,
      },
      globalSettings: existingConfig?.globalSettings || {
        showHeader: true,
        showFooter: true,
        headerPosition: "sticky",
        maxWidth: 1200,
      },
    };
  });

  const handleLayoutChange = (newConfig: Partial<LayoutConfig>) => {
    setLayoutConfig({ ...layoutConfig, ...newConfig });
    setHasChanges(true);
  };

  const handleSectionAdd = (section: Omit<PageSection, "id" | "order">) => {
    const newSection: PageSection = {
      ...section,
      id: `${section.type}-${Date.now()}`,
      order: layoutConfig.sections.length,
    };

    handleLayoutChange({
      sections: [...layoutConfig.sections, newSection],
    });
  };

  const handleSectionUpdate = (
    sectionId: string,
    updates: Partial<PageSection>
  ) => {
    const updatedSections = layoutConfig.sections.map((section) =>
      section.id === sectionId ? { ...section, ...updates } : section
    );

    handleLayoutChange({ sections: updatedSections });
  };

  const handleSectionDelete = (sectionId: string) => {
    const updatedSections = layoutConfig.sections
      .filter((section) => section.id !== sectionId)
      .map((section, index) => ({ ...section, order: index }));

    handleLayoutChange({ sections: updatedSections });
  };

  const handleSectionReorder = (sections: PageSection[]) => {
    const reorderedSections = sections.map((section, index) => ({
      ...section,
      order: index,
    }));

    handleLayoutChange({ sections: reorderedSections });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement API call to update store layout
      // await updateStoreLayout(store.id, layoutConfig);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setHasChanges(false);
      toast.success("Layout updated successfully!");
    } catch (error) {
      toast.error("Failed to update layout. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    const existingConfig = store.layoutConfig as LayoutConfig;
    const defaultSections = [
      {
        id: "hero-1",
        type: "hero" as const,
        component: "BannerHero",
        props: {
          title: store.storeName,
          subtitle: store.storeDescription,
          backgroundImage: store.storeCoverPhoto || "",
          ctaText: "Shop Now",
          ctaLink: "/products",
        },
        order: 0,
        visible: true,
      },
      {
        id: "products-1",
        type: "products" as const,
        component: "ProductGrid",
        props: {
          title: "Featured Products",
          limit: 8,
          showFilters: true,
        },
        order: 1,
        visible: true,
      },
    ];

    setLayoutConfig({
      sections: existingConfig?.sections || defaultSections,
      layout: existingConfig?.layout || {
        heroType: "banner",
        productGridType: "grid",
        headerStyle: "modern",
        footerStyle: "detailed",
        gridColumns: 3,
        showSidebar: false,
        showSearch: true,
        showCart: true,
      },
      globalSettings: existingConfig?.globalSettings || {
        showHeader: true,
        showFooter: true,
        headerPosition: "sticky",
        maxWidth: 1200,
      },
    });
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Save Actions */}
      {hasChanges && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-orange-800">Unsaved Changes</p>
                <p className="text-sm text-orange-600">
                  You have unsaved changes to your store layout.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Layout"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Layout Builder Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel - Tools */}
        <div className="lg:col-span-1 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sections">Sections</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="sections" className="mt-4">
              <SectionLibrary onSectionAdd={handleSectionAdd} />
            </TabsContent>

            <TabsContent value="settings" className="mt-4">
              <LayoutSettings
                layoutConfig={layoutConfig}
                onLayoutChange={handleLayoutChange}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Center Panel - Page Builder */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Page Builder</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={previewMode === "desktop" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setPreviewMode("desktop")}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewMode === "mobile" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setPreviewMode("mobile")}
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <PageBuilder
                sections={layoutConfig.sections}
                layoutConfig={layoutConfig}
                previewMode={previewMode}
                onSectionUpdate={handleSectionUpdate}
                onSectionDelete={handleSectionDelete}
                onSectionReorder={handleSectionReorder}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ResponsivePreview
                  store={store}
                  layoutConfig={layoutConfig}
                  previewMode={previewMode}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
