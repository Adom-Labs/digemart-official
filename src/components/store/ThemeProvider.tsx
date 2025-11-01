'use client';

import React, { useEffect, ReactNode } from 'react';
import { StoreTheme } from '@/lib/api/store-themes';

interface ThemeProviderProps {
  theme?: StoreTheme | Record<string, any>;
  children: ReactNode;
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  useEffect(() => {
    if (!theme) return;

    const root = document.documentElement;

    // Apply theme colors as CSS custom properties
    if (theme.colors) {
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--store-color-${key}`, value as string);
      });
    }

    // Apply typography
    if (theme.typography) {
      if (theme.typography.fontFamily) {
        root.style.setProperty('--store-font-family', theme.typography.fontFamily);
      }
      if (theme.typography.headingFont) {
        root.style.setProperty('--store-heading-font', theme.typography.headingFont);
      }
      if (theme.typography.fontSize) {
        Object.entries(theme.typography.fontSize).forEach(([size, value]) => {
          root.style.setProperty(`--store-font-size-${size}`, value as string);
        });
      }
    }

    // Apply custom CSS
    if (theme.customCss) {
      const styleId = 'store-custom-css';
      let styleElement = document.getElementById(styleId) as HTMLStyleElement;
      
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      
      styleElement.textContent = theme.customCss;
    }

    // Cleanup function
    return () => {
      // Remove custom CSS when component unmounts
      const styleElement = document.getElementById('store-custom-css');
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, [theme]);

  return (
    <div 
      className="store-theme-wrapper"
      style={{
        '--store-primary': theme?.colors?.primary || '#3B82F6',
        '--store-secondary': theme?.colors?.secondary || '#64748B',
        '--store-accent': theme?.colors?.accent || '#F59E0B',
        '--store-background': theme?.colors?.background || '#FFFFFF',
        '--store-text': theme?.colors?.text || '#1F2937',
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}