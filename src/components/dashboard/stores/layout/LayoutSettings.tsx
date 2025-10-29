'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface LayoutConfig {
  sections: any[];
  layout: {
    heroType: 'banner' | 'carousel' | 'video' | 'minimal' | 'split';
    productGridType: 'grid' | 'masonry' | 'list' | 'carousel';
    headerStyle: 'classic' | 'modern' | 'minimal' | 'centered';
    footerStyle: 'simple' | 'detailed' | 'minimal' | 'newsletter';
    gridColumns: number;
    showSidebar: boolean;
    showSearch: boolean;
    showCart: boolean;
  };
  globalSettings: {
    showHeader: boolean;
    showFooter: boolean;
    headerPosition: 'fixed' | 'static' | 'sticky';
    maxWidth: number;
  };
}

interface LayoutSettingsProps {
  layoutConfig: LayoutConfig;
  onLayoutChange: (config: Partial<LayoutConfig>) => void;
}

export function LayoutSettings({ layoutConfig, onLayoutChange }: LayoutSettingsProps) {
  const handleLayoutUpdate = (key: string, value: any) => {
    onLayoutChange({
      layout: {
        ...layoutConfig.layout,
        [key]: value,
      },
    });
  };

  const handleGlobalSettingsUpdate = (key: string, value: any) => {
    onLayoutChange({
      globalSettings: {
        ...layoutConfig.globalSettings,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-gray-700 mb-3">
        Layout Settings
      </div>

      {/* Global Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Global Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-header" className="text-sm">Show Header</Label>
            <Switch
              id="show-header"
              checked={layoutConfig.globalSettings.showHeader}
              onCheckedChange={(checked) => handleGlobalSettingsUpdate('showHeader', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-footer" className="text-sm">Show Footer</Label>
            <Switch
              id="show-footer"
              checked={layoutConfig.globalSettings.showFooter}
              onCheckedChange={(checked) => handleGlobalSettingsUpdate('showFooter', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Header Position</Label>
            <Select
              value={layoutConfig.globalSettings.headerPosition}
              onValueChange={(value) => handleGlobalSettingsUpdate('headerPosition', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="static">Static</SelectItem>
                <SelectItem value="sticky">Sticky</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Max Width (px)</Label>
            <div className="space-y-2">
              <Slider
                value={[layoutConfig.globalSettings.maxWidth]}
                onValueChange={([value]) => handleGlobalSettingsUpdate('maxWidth', value)}
                min={800}
                max={1600}
                step={50}
                className="w-full"
              />
              <div className="text-xs text-gray-500 text-center">
                {layoutConfig.globalSettings.maxWidth}px
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Header & Navigation */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Header & Navigation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Header Style</Label>
            <Select
              value={layoutConfig.layout.headerStyle}
              onValueChange={(value) => handleLayoutUpdate('headerStyle', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="centered">Centered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-search" className="text-sm">Show Search</Label>
            <Switch
              id="show-search"
              checked={layoutConfig.layout.showSearch}
              onCheckedChange={(checked) => handleLayoutUpdate('showSearch', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-cart" className="text-sm">Show Cart</Label>
            <Switch
              id="show-cart"
              checked={layoutConfig.layout.showCart}
              onCheckedChange={(checked) => handleLayoutUpdate('showCart', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-sidebar" className="text-sm">Show Sidebar</Label>
            <Switch
              id="show-sidebar"
              checked={layoutConfig.layout.showSidebar}
              onCheckedChange={(checked) => handleLayoutUpdate('showSidebar', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Hero Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Hero Type</Label>
            <Select
              value={layoutConfig.layout.heroType}
              onValueChange={(value) => handleLayoutUpdate('heroType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="banner">Banner</SelectItem>
                <SelectItem value="carousel">Carousel</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="split">Split</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Product Display */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Product Display</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Product Grid Type</Label>
            <Select
              value={layoutConfig.layout.productGridType}
              onValueChange={(value) => handleLayoutUpdate('productGridType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="masonry">Masonry</SelectItem>
                <SelectItem value="list">List</SelectItem>
                <SelectItem value="carousel">Carousel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Grid Columns</Label>
            <div className="space-y-2">
              <Slider
                value={[layoutConfig.layout.gridColumns]}
                onValueChange={([value]) => handleLayoutUpdate('gridColumns', value)}
                min={2}
                max={6}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-gray-500 text-center">
                {layoutConfig.layout.gridColumns} columns
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Footer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Footer Style</Label>
            <Select
              value={layoutConfig.layout.footerStyle}
              onValueChange={(value) => handleLayoutUpdate('footerStyle', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">Simple</SelectItem>
                <SelectItem value="detailed">Detailed</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}