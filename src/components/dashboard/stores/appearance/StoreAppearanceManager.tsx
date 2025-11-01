'use client';

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, RefreshCw } from 'lucide-react';
import { Store } from '@/lib/api/hooks/stores';
import { ThemeTemplateSelector } from '../ThemeTemplateSelector';
import { ColorCustomizer } from './ColorCustomizer';
import { TypographySettings } from './TypographySettings';
import { CustomCSSEditor } from './CustomCSSEditor';
import { LivePreview } from './LivePreview';
import { toast } from 'react-hot-toast';

interface StoreAppearanceManagerProps {
  store: Store;
}

export function StoreAppearanceManager({ store }: StoreAppearanceManagerProps) {
  const [activeTab, setActiveTab] = useState('templates');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Theme configuration state
  const [themeConfig, setThemeConfig] = useState(store.themeConfig || {
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#1f2937',
    },
    typography: {
      fontFamily: 'Inter',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
      },
    },
    template: 'modern',
    templateId: 1,
    darkModeEnabled: false,
  });

  const handleThemeChange = (newConfig: any) => {
    setThemeConfig({ ...themeConfig, ...newConfig });
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement API call to update store theme
      // await updateStoreTheme(store.id, themeConfig);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHasChanges(false);
      toast.success('Theme updated successfully!');
    } catch (error) {
      toast.error('Failed to update theme. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setThemeConfig(store.themeConfig || {
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#f59e0b',
        background: '#ffffff',
        text: '#1f2937',
      },
      typography: {
        fontFamily: 'Inter',
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
        },
      },
      template: 'modern',
      darkModeEnabled: false,
    });
    setHasChanges(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Customization Panel */}
      <div className="lg:col-span-2 space-y-6">
        {/* Save Actions */}
        {hasChanges && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-orange-800">Unsaved Changes</p>
                  <p className="text-sm text-orange-600">You have unsaved changes to your store appearance.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Customization Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="custom">Custom CSS</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <ThemeTemplateSelector
                  selectedThemeId={themeConfig.templateId}
                  onThemeSelect={(theme) => handleThemeChange({ 
                    template: theme.name,
                    templateId: theme.id 
                  })}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="colors" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Color Customization</CardTitle>
              </CardHeader>
              <CardContent>
                <ColorCustomizer
                  colors={themeConfig.colors}
                  onColorsChange={(colors) => handleThemeChange({ colors })}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="typography" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Typography Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <TypographySettings
                  typography={themeConfig.typography}
                  onTypographyChange={(typography) => handleThemeChange({ typography })}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Custom CSS</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomCSSEditor
                  customCss={themeConfig.customCss || ''}
                  onCustomCssChange={(customCss) => handleThemeChange({ customCss })}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Live Preview */}
      <div className="lg:col-span-1">
        <div className="sticky top-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <LivePreview store={store} themeConfig={themeConfig} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}