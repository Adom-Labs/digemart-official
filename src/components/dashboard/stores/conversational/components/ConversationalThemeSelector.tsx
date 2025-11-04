import { motion } from "framer-motion";
import { Check, Crown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ThemeTemplate } from "../types";

interface ConversationalThemeSelectorProps {
  themes: ThemeTemplate[];
  selectedThemeId?: number;
  onSelect: (theme: ThemeTemplate) => void;
  onViewAll?: () => void;
}

export const ConversationalThemeSelector = ({
  themes,
  selectedThemeId,
  onSelect,
  onViewAll,
}: ConversationalThemeSelectorProps) => {
  // Show first 6 themes
  const displayThemes = themes.slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="bg-card border rounded-2xl p-4 max-w-2xl">
        <p className="text-sm text-muted-foreground mb-3">
          Choose a design theme for your store:
        </p>
        <div className="grid grid-cols-3 gap-3">
          {displayThemes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onSelect(theme)}
              className={`group relative rounded-lg border-2 transition-all hover:shadow-md ${
                selectedThemeId === theme.id
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {/* Selection Indicator */}
              {selectedThemeId === theme.id && (
                <div className="absolute top-1 right-1 z-10 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}

              {/* Preview Image */}
              <div className="aspect-video bg-muted rounded-t-lg overflow-hidden relative">
                {theme.preview ? (
                  <Image
                    src={theme.preview}
                    alt={theme.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Eye className="w-6 h-6" />
                  </div>
                )}

                {/* Badges */}
                {theme.isPremium && (
                  <div className="absolute top-1 left-1">
                    <span className="px-1.5 py-0.5 bg-purple-600 text-white text-[10px] rounded-full flex items-center">
                      <Crown className="w-2.5 h-2.5 mr-0.5" />
                      Pro
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-2">
                <p className="text-xs font-medium truncate">{theme.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {theme.category}
                </p>
              </div>
            </button>
          ))}
        </div>

        {onViewAll && (
          <Button
            variant="link"
            size="sm"
            onClick={onViewAll}
            className="mt-2 h-auto p-0 text-xs"
          >
            View all themes →
          </Button>
        )}
      </div>
    </motion.div>
  );
};
