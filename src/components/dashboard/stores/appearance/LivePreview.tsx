'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Monitor, Smartphone, Tablet, ExternalLink, RefreshCw } from 'lucide-react';
import { Store } from '@/lib/api/hooks/stores';

interface LivePreviewProps {
  store: Store;
  themeConfig: any;
}

export function LivePreview({ store, themeConfig }: LivePreviewProps) {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = useState(false);

  const getPreviewUrl = () => {
    if (store.subdomain) {
      return `${window.location.protocol}//${store.subdomain}.${window.location.host.split('.').slice(-2).join('.')}`;
    }
    return store.storeUrl || '#';
  };

  const getDeviceStyles = () => {
    switch (deviceMode) {
      case 'mobile':
        return { width: '375px', height: '600px' };
      case 'tablet':
        return { width: '768px', height: '600px' };
      default:
        return { width: '100%', height: '600px' };
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate refresh delay
    setTimeout(() => setIsLoading(false), 1000);
  };

  const openInNewTab = () => {
    const url = getPreviewUrl();
    if (url !== '#') {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-4">
      {/* Device Mode Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            variant={deviceMode === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setDeviceMode('desktop')}
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant={deviceMode === 'tablet' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setDeviceMode('tablet')}
          >
            <Tablet className="w-4 h-4" />
          </Button>
          <Button
            variant={deviceMode === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setDeviceMode('mobile')}
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={handleRefresh}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="ghost" size="sm" onClick={openInNewTab}>
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Preview Frame */}
      <div className="border rounded-lg overflow-hidden bg-gray-100">
        <div 
          className="mx-auto bg-white transition-all duration-300"
          style={getDeviceStyles()}
        >
          {getPreviewUrl() !== '#' ? (
            <iframe
              src={getPreviewUrl()}
              className="w-full h-full border-0"
              title="Store Preview"
              sandbox="allow-same-origin allow-scripts allow-forms"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Monitor className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Preview Not Available</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Set up a subdomain or store URL to see the live preview
                </p>
                <Button size="sm" variant="outline">
                  Configure Store URL
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Theme Preview */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Theme Preview</h4>
          <div 
            className="p-4 rounded border-2 space-y-3"
            style={{
              backgroundColor: themeConfig.colors?.background || '#ffffff',
              color: themeConfig.colors?.text || '#1f2937',
              borderColor: themeConfig.colors?.secondary || '#64748b',
              fontFamily: `"${themeConfig.typography?.fontFamily || 'Inter'}", sans-serif`,
            }}
          >
            <h3 
              className="text-lg font-semibold"
              style={{ 
                color: themeConfig.colors?.primary || '#3b82f6',
                fontFamily: `"${themeConfig.typography?.headingFont || themeConfig.typography?.fontFamily || 'Inter'}", sans-serif`,
              }}
            >
              {store.storeName}
            </h3>
            <p className="text-sm">
              {store.storeDescription || 'Your store description will appear here.'}
            </p>
            <div className="flex gap-2">
              <button 
                className="px-3 py-1 rounded text-white text-sm font-medium"
                style={{ backgroundColor: themeConfig.colors?.primary || '#3b82f6' }}
              >
                Shop Now
              </button>
              <button 
                className="px-3 py-1 rounded border text-sm font-medium"
                style={{ 
                  borderColor: themeConfig.colors?.secondary || '#64748b',
                  color: themeConfig.colors?.secondary || '#64748b'
                }}
              >
                Learn More
              </button>
              <button 
                className="px-3 py-1 rounded text-white text-sm font-medium"
                style={{ backgroundColor: themeConfig.colors?.accent || '#f59e0b' }}
              >
                Contact
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Preview updates automatically as you make changes</p>
        <p>• Use device buttons to test responsive design</p>
        <p>• Click the external link icon to open in a new tab</p>
      </div>
    </div>
  );
}