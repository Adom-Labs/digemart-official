"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GripVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Settings,
} from "lucide-react";
import { SectionEditor } from "./SectionEditor";

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
    heroType: string;
    productGridType: string;
    headerStyle: string;
    footerStyle: string;
    gridColumns: number;
    showSidebar: boolean;
    showSearch: boolean;
    showCart: boolean;
  };
  globalSettings: {
    showHeader: boolean;
    showFooter: boolean;
    headerPosition: string;
    maxWidth: number;
  };
}

interface PageBuilderProps {
  sections: PageSection[];
  layoutConfig: LayoutConfig;
  previewMode: "desktop" | "mobile";
  onSectionUpdate: (sectionId: string, updates: Partial<PageSection>) => void;
  onSectionDelete: (sectionId: string) => void;
  onSectionReorder: (sections: PageSection[]) => void;
}

export function PageBuilder({
  sections,
  layoutConfig,
  previewMode,
  onSectionUpdate,
  onSectionDelete,
  onSectionReorder,
}: PageBuilderProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);

  const sortedSections = [...(sections || [])].sort(
    (a, b) => a.order - b.order
  );

  const handleSectionMove = (sectionId: string, direction: "up" | "down") => {
    const currentIndex = sortedSections.findIndex((s) => s.id === sectionId);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === sortedSections.length - 1)
    ) {
      return;
    }

    const newSections = [...sortedSections];
    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;

    [newSections[currentIndex], newSections[targetIndex]] = [
      newSections[targetIndex],
      newSections[currentIndex],
    ];

    onSectionReorder(newSections);
  };

  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    setDraggedSection(sectionId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault();

    if (!draggedSection || draggedSection === targetSectionId) {
      setDraggedSection(null);
      return;
    }

    const draggedIndex = sortedSections.findIndex(
      (s) => s.id === draggedSection
    );
    const targetIndex = sortedSections.findIndex(
      (s) => s.id === targetSectionId
    );

    const newSections = [...sortedSections];
    const [draggedItem] = newSections.splice(draggedIndex, 1);
    newSections.splice(targetIndex, 0, draggedItem);

    onSectionReorder(newSections);
    setDraggedSection(null);
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case "hero":
        return "🎯";
      case "products":
        return "📦";
      case "testimonials":
        return "💬";
      case "cta":
        return "📢";
      case "about":
        return "📄";
      case "custom":
        return "⚙️";
      default:
        return "📄";
    }
  };

  const getSectionPreview = (section: PageSection) => {
    const { props } = section;

    switch (section.type) {
      case "hero":
        return (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded">
            <h2 className="text-lg font-bold">{props.title || "Hero Title"}</h2>
            <p className="text-sm opacity-90">
              {props.subtitle || "Hero subtitle"}
            </p>
          </div>
        );
      case "products":
        return (
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold mb-2">{props.title || "Products"}</h3>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white h-16 rounded border"></div>
              ))}
            </div>
          </div>
        );
      case "about":
        return (
          <div className="bg-white p-4 rounded border">
            <h3 className="font-semibold mb-2">{props.title || "About Us"}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {props.content || "About section content..."}
            </p>
          </div>
        );
      case "testimonials":
        return (
          <div className="bg-yellow-50 p-4 rounded">
            <h3 className="font-semibold mb-2">
              {props.title || "Testimonials"}
            </h3>
            <div className="text-sm text-gray-600">
              ⭐⭐⭐⭐⭐ Customer reviews
            </div>
          </div>
        );
      case "cta":
        return (
          <div
            className="p-4 rounded text-white text-center"
            style={{ backgroundColor: props.backgroundColor || "#3b82f6" }}
          >
            <h3 className="font-semibold">{props.title || "Call to Action"}</h3>
            <button className="mt-2 px-4 py-1 bg-white text-gray-900 rounded text-sm">
              {props.ctaText || "Click Here"}
            </button>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold">{section.component}</h3>
            <p className="text-sm text-gray-600">Custom section</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Preview Container */}
      <div
        className={`border-2 border-dashed border-gray-300 rounded-lg transition-all ${
          previewMode === "mobile" ? "max-w-sm mx-auto" : "w-full"
        }`}
      >
        {sortedSections.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="font-medium mb-2">No sections added yet</h3>
            <p className="text-sm">
              Add sections from the library to start building your page
            </p>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {sortedSections.map((section, index) => (
              <div
                key={section.id}
                className={`relative group ${
                  !section.visible ? "opacity-50" : ""
                } ${draggedSection === section.id ? "opacity-50" : ""}`}
                draggable
                onDragStart={(e) => handleDragStart(e, section.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, section.id)}
              >
                {/* Section Preview */}
                <Card className="relative overflow-hidden">
                  <CardContent className="p-0">
                    {/* Section Controls Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all z-10">
                      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-7 w-7 p-0"
                          onClick={() =>
                            onSectionUpdate(section.id, {
                              visible: !section.visible,
                            })
                          }
                        >
                          {section.visible ? (
                            <Eye className="w-3 h-3" />
                          ) : (
                            <EyeOff className="w-3 h-3" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-7 w-7 p-0"
                          onClick={() => setEditingSection(section.id)}
                        >
                          <Settings className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-7 w-7 p-0"
                          onClick={() => onSectionDelete(section.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Drag Handle */}
                      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-1">
                          <GripVertical className="w-4 h-4 text-gray-600 cursor-move" />
                          <span className="text-xs bg-white px-1 rounded">
                            {getSectionIcon(section.type)} {section.component}
                          </span>
                        </div>
                      </div>

                      {/* Move Buttons */}
                      <div className="absolute bottom-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-6 w-6 p-0"
                          onClick={() => handleSectionMove(section.id, "up")}
                          disabled={index === 0}
                        >
                          <ChevronUp className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-6 w-6 p-0"
                          onClick={() => handleSectionMove(section.id, "down")}
                          disabled={index === sortedSections.length - 1}
                        >
                          <ChevronDown className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Section Content Preview */}
                    <div className="p-2">{getSectionPreview(section)}</div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section Editor Modal */}
      {editingSection && (
        <SectionEditor
          section={sortedSections.find((s) => s.id === editingSection)!}
          onSave={(updates) => {
            onSectionUpdate(editingSection, updates);
            setEditingSection(null);
          }}
          onCancel={() => setEditingSection(null)}
        />
      )}
    </div>
  );
}
