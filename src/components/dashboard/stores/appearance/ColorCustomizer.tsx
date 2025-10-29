'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RefreshCw, Palette } from 'lucide-react';

interface ColorConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  error?: string;
  success?: string;
}

interface ColorCustomizerProps {
  colors: ColorConfig;
  onColorsChange: (colors: ColorConfig) => void;
}

const colorPresets = [
  {
    name: 'Blue Ocean',
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#06b6d4',
      background: '#ffffff',
      text: '#1f2937',
    }
  },
  {
    name: 'Forest Green',
    colors: {
      primary: '#059669',
      secondary: '#6b7280',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#1f2937',
    }
  },
  {
    name: 'Sunset Orange',
    colors: {
      primary: '#ea580c',
      secondary: '#64748b',
      accent: '#eab308',
      background: '#ffffff',
      text: '#1f2937',
    }
  },
  {
    name: 'Purple Dream',
    colors: {
      primary: '#7c3aed',
      secondary: '#6b7280',
      accent: '#ec4899',
      background: '#ffffff',
      text: '#1f2937',
    }
  },
  {
    name: 'Dark Mode',
    colors: {
      primary: '#3b82f6',
      secondary: '#9ca3af',
      accent: '#f59e0b',
      background: '#111827',
      text: '#f9fafb',
    }
  },
];

export function ColorCustomizer({ colors, onColorsChange }: ColorCustomizerProps) {
  const handleColorChange = (colorKey: keyof ColorConfig, value: string) => {
    onColorsChange({
      ...colors,
      [colorKey]: value,
    });
  };

  const applyPreset = (preset: typeof colorPresets[0]) => {
    onColorsChange({
      ...colors,
      ...preset.colors,
    });
  };

  const resetToDefaults = () => {
    onColorsChange({
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#1f2937',
    });
  };

  return (
    <div className="space-y-6">
      {/* Color Presets */}
      <div>
        <Label className="text-base font-medium mb-3 block">Color Presets</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {colorPresets.map((preset) => (
            <Button
              key={preset.name}
              variant="outline"
              className="h-auto p-3 justify-start"
              onClick={() => applyPreset(preset)}
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: preset.colors.primary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: preset.colors.secondary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: preset.colors.accent }}
                  />
                </div>
                <span className="text-sm font-medium">{preset.name}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-base font-medium">Custom Colors</Label>
          <Button variant="ghost" size="sm" onClick={resetToDefaults}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Primary Color */}
          <div className="space-y-2">
            <Label htmlFor="primary-color">Primary Color</Label>
            <div className="flex gap-2">
              <div 
                className="w-10 h-10 rounded border-2 border-gray-200 flex-shrink-0"
                style={{ backgroundColor: colors.primary }}
              />
              <Input
                id="primary-color"
                type="color"
                value={colors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="flex-1"
              />
            </div>
            <Input
              type="text"
              value={colors.primary}
              onChange={(e) => handleColorChange('primary', e.target.value)}
              placeholder="#3b82f6"
              className="text-sm"
            />
          </div>

          {/* Secondary Color */}
          <div className="space-y-2">
            <Label htmlFor="secondary-color">Secondary Color</Label>
            <div className="flex gap-2">
              <div 
                className="w-10 h-10 rounded border-2 border-gray-200 flex-shrink-0"
                style={{ backgroundColor: colors.secondary }}
              />
              <Input
                id="secondary-color"
                type="color"
                value={colors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="flex-1"
              />
            </div>
            <Input
              type="text"
              value={colors.secondary}
              onChange={(e) => handleColorChange('secondary', e.target.value)}
              placeholder="#64748b"
              className="text-sm"
            />
          </div>

          {/* Accent Color */}
          <div className="space-y-2">
            <Label htmlFor="accent-color">Accent Color</Label>
            <div className="flex gap-2">
              <div 
                className="w-10 h-10 rounded border-2 border-gray-200 flex-shrink-0"
                style={{ backgroundColor: colors.accent }}
              />
              <Input
                id="accent-color"
                type="color"
                value={colors.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                className="flex-1"
              />
            </div>
            <Input
              type="text"
              value={colors.accent}
              onChange={(e) => handleColorChange('accent', e.target.value)}
              placeholder="#f59e0b"
              className="text-sm"
            />
          </div>

          {/* Background Color */}
          <div className="space-y-2">
            <Label htmlFor="background-color">Background Color</Label>
            <div className="flex gap-2">
              <div 
                className="w-10 h-10 rounded border-2 border-gray-200 flex-shrink-0"
                style={{ backgroundColor: colors.background }}
              />
              <Input
                id="background-color"
                type="color"
                value={colors.background}
                onChange={(e) => handleColorChange('background', e.target.value)}
                className="flex-1"
              />
            </div>
            <Input
              type="text"
              value={colors.background}
              onChange={(e) => handleColorChange('background', e.target.value)}
              placeholder="#ffffff"
              className="text-sm"
            />
          </div>

          {/* Text Color */}
          <div className="space-y-2">
            <Label htmlFor="text-color">Text Color</Label>
            <div className="flex gap-2">
              <div 
                className="w-10 h-10 rounded border-2 border-gray-200 flex-shrink-0"
                style={{ backgroundColor: colors.text }}
              />
              <Input
                id="text-color"
                type="color"
                value={colors.text}
                onChange={(e) => handleColorChange('text', e.target.value)}
                className="flex-1"
              />
            </div>
            <Input
              type="text"
              value={colors.text}
              onChange={(e) => handleColorChange('text', e.target.value)}
              placeholder="#1f2937"
              className="text-sm"
            />
          </div>
        </div>
      </div>

      {/* Color Preview */}
      <div>
        <Label className="text-base font-medium mb-3 block">Preview</Label>
        <div 
          className="p-6 rounded-lg border-2"
          style={{ 
            backgroundColor: colors.background,
            color: colors.text,
            borderColor: colors.secondary 
          }}
        >
          <h3 
            className="text-lg font-semibold mb-2"
            style={{ color: colors.primary }}
          >
            Store Preview
          </h3>
          <p className="mb-4">
            This is how your store will look with the selected colors.
          </p>
          <div className="flex gap-2">
            <button 
              className="px-4 py-2 rounded text-white font-medium"
              style={{ backgroundColor: colors.primary }}
            >
              Primary Button
            </button>
            <button 
              className="px-4 py-2 rounded border font-medium"
              style={{ 
                borderColor: colors.secondary,
                color: colors.secondary 
              }}
            >
              Secondary Button
            </button>
            <button 
              className="px-4 py-2 rounded text-white font-medium"
              style={{ backgroundColor: colors.accent }}
            >
              Accent Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}