'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface TypographyConfig {
  fontFamily: string;
  headingFont?: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
  };
}

interface TypographySettingsProps {
  typography: TypographyConfig;
  onTypographyChange: (typography: TypographyConfig) => void;
}

const fontOptions = [
  { value: 'Inter', label: 'Inter', category: 'Sans Serif' },
  { value: 'Roboto', label: 'Roboto', category: 'Sans Serif' },
  { value: 'Open Sans', label: 'Open Sans', category: 'Sans Serif' },
  { value: 'Lato', label: 'Lato', category: 'Sans Serif' },
  { value: 'Poppins', label: 'Poppins', category: 'Sans Serif' },
  { value: 'Montserrat', label: 'Montserrat', category: 'Sans Serif' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro', category: 'Sans Serif' },
  { value: 'Nunito', label: 'Nunito', category: 'Sans Serif' },
  { value: 'Playfair Display', label: 'Playfair Display', category: 'Serif' },
  { value: 'Merriweather', label: 'Merriweather', category: 'Serif' },
  { value: 'Lora', label: 'Lora', category: 'Serif' },
  { value: 'Crimson Text', label: 'Crimson Text', category: 'Serif' },
  { value: 'Fira Code', label: 'Fira Code', category: 'Monospace' },
  { value: 'JetBrains Mono', label: 'JetBrains Mono', category: 'Monospace' },
];

const fontSizePresets = [
  {
    name: 'Compact',
    sizes: {
      xs: '0.7rem',
      sm: '0.8rem',
      base: '0.9rem',
      lg: '1rem',
      xl: '1.1rem',
    }
  },
  {
    name: 'Default',
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    }
  },
  {
    name: 'Large',
    sizes: {
      xs: '0.8rem',
      sm: '0.95rem',
      base: '1.1rem',
      lg: '1.25rem',
      xl: '1.4rem',
    }
  },
  {
    name: 'Extra Large',
    sizes: {
      xs: '0.9rem',
      sm: '1rem',
      base: '1.2rem',
      lg: '1.4rem',
      xl: '1.6rem',
    }
  },
];

export function TypographySettings({ typography, onTypographyChange }: TypographySettingsProps) {
  const handleFontChange = (field: keyof TypographyConfig, value: string) => {
    onTypographyChange({
      ...typography,
      [field]: value,
    });
  };

  const handleFontSizeChange = (size: keyof TypographyConfig['fontSize'], value: string) => {
    onTypographyChange({
      ...typography,
      fontSize: {
        ...typography.fontSize,
        [size]: value,
      },
    });
  };

  const applyFontSizePreset = (preset: typeof fontSizePresets[0]) => {
    onTypographyChange({
      ...typography,
      fontSize: preset.sizes,
    });
  };

  const resetToDefaults = () => {
    onTypographyChange({
      fontFamily: 'Inter',
      headingFont: 'Inter',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
      },
    });
  };

  const getFontStyle = (fontFamily: string) => ({
    fontFamily: `"${fontFamily}", sans-serif`,
  });

  return (
    <div className="space-y-6">
      {/* Font Selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-base font-medium">Font Selection</Label>
          <Button variant="ghost" size="sm" onClick={resetToDefaults}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Body Font */}
          <div className="space-y-2">
            <Label>Body Font</Label>
            <Select 
              value={typography.fontFamily} 
              onValueChange={(value) => handleFontChange('fontFamily', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    <div className="flex items-center justify-between w-full">
                      <span style={getFontStyle(font.value)}>{font.label}</span>
                      <span className="text-xs text-gray-500 ml-2">{font.category}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Heading Font */}
          <div className="space-y-2">
            <Label>Heading Font</Label>
            <Select 
              value={typography.headingFont || typography.fontFamily} 
              onValueChange={(value) => handleFontChange('headingFont', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    <div className="flex items-center justify-between w-full">
                      <span style={getFontStyle(font.value)}>{font.label}</span>
                      <span className="text-xs text-gray-500 ml-2">{font.category}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Font Size Presets */}
      <div>
        <Label className="text-base font-medium mb-3 block">Font Size Presets</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {fontSizePresets.map((preset) => (
            <Button
              key={preset.name}
              variant="outline"
              size="sm"
              onClick={() => applyFontSizePreset(preset)}
              className="text-xs"
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Font Sizes */}
      <div>
        <Label className="text-base font-medium mb-3 block">Custom Font Sizes</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm">Extra Small (xs)</Label>
            <Select 
              value={typography.fontSize.xs} 
              onValueChange={(value) => handleFontSizeChange('xs', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.7rem">0.7rem</SelectItem>
                <SelectItem value="0.75rem">0.75rem</SelectItem>
                <SelectItem value="0.8rem">0.8rem</SelectItem>
                <SelectItem value="0.85rem">0.85rem</SelectItem>
                <SelectItem value="0.9rem">0.9rem</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Small (sm)</Label>
            <Select 
              value={typography.fontSize.sm} 
              onValueChange={(value) => handleFontSizeChange('sm', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.8rem">0.8rem</SelectItem>
                <SelectItem value="0.875rem">0.875rem</SelectItem>
                <SelectItem value="0.9rem">0.9rem</SelectItem>
                <SelectItem value="0.95rem">0.95rem</SelectItem>
                <SelectItem value="1rem">1rem</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Base</Label>
            <Select 
              value={typography.fontSize.base} 
              onValueChange={(value) => handleFontSizeChange('base', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.9rem">0.9rem</SelectItem>
                <SelectItem value="1rem">1rem</SelectItem>
                <SelectItem value="1.1rem">1.1rem</SelectItem>
                <SelectItem value="1.2rem">1.2rem</SelectItem>
                <SelectItem value="1.25rem">1.25rem</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Large (lg)</Label>
            <Select 
              value={typography.fontSize.lg} 
              onValueChange={(value) => handleFontSizeChange('lg', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1rem">1rem</SelectItem>
                <SelectItem value="1.125rem">1.125rem</SelectItem>
                <SelectItem value="1.25rem">1.25rem</SelectItem>
                <SelectItem value="1.4rem">1.4rem</SelectItem>
                <SelectItem value="1.5rem">1.5rem</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Extra Large (xl)</Label>
            <Select 
              value={typography.fontSize.xl} 
              onValueChange={(value) => handleFontSizeChange('xl', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1.1rem">1.1rem</SelectItem>
                <SelectItem value="1.25rem">1.25rem</SelectItem>
                <SelectItem value="1.4rem">1.4rem</SelectItem>
                <SelectItem value="1.6rem">1.6rem</SelectItem>
                <SelectItem value="1.75rem">1.75rem</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Typography Preview */}
      <div>
        <Label className="text-base font-medium mb-3 block">Preview</Label>
        <div className="p-6 border rounded-lg space-y-4">
          <h1 
            className="font-bold"
            style={{
              fontFamily: `"${typography.headingFont || typography.fontFamily}", sans-serif`,
              fontSize: typography.fontSize.xl,
            }}
          >
            Store Heading (XL)
          </h1>
          <h2 
            className="font-semibold"
            style={{
              fontFamily: `"${typography.headingFont || typography.fontFamily}", sans-serif`,
              fontSize: typography.fontSize.lg,
            }}
          >
            Section Title (Large)
          </h2>
          <p 
            style={{
              fontFamily: `"${typography.fontFamily}", sans-serif`,
              fontSize: typography.fontSize.base,
            }}
          >
            This is regular body text that shows how your content will appear with the selected typography settings. (Base)
          </p>
          <p 
            className="text-gray-600"
            style={{
              fontFamily: `"${typography.fontFamily}", sans-serif`,
              fontSize: typography.fontSize.sm,
            }}
          >
            This is smaller text used for captions and secondary information. (Small)
          </p>
          <p 
            className="text-gray-500"
            style={{
              fontFamily: `"${typography.fontFamily}", sans-serif`,
              fontSize: typography.fontSize.xs,
            }}
          >
            Extra small text for fine print and labels. (XS)
          </p>
        </div>
      </div>
    </div>
  );
}