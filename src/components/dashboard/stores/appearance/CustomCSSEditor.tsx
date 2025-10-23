'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Code, Eye, EyeOff, RefreshCw, Copy, Check } from 'lucide-react';

interface CustomCSSEditorProps {
  customCss: string;
  onCustomCssChange: (css: string) => void;
}

const cssTemplates = [
  {
    name: 'Custom Button Styles',
    css: `/* Custom button styles */
.custom-button {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 12px 24px;
  font-weight: 600;
  transition: transform 0.2s ease;
}

.custom-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}`
  },
  {
    name: 'Card Hover Effects',
    css: `/* Card hover animations */
.product-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.product-card img {
  transition: transform 0.3s ease;
}

.product-card:hover img {
  transform: scale(1.05);
}`
  },
  {
    name: 'Custom Typography',
    css: `/* Custom typography styles */
.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.section-subtitle {
  font-size: 1.25rem;
  color: #6b7280;
  font-weight: 400;
  letter-spacing: 0.025em;
}`
  },
  {
    name: 'Loading Animations',
    css: `/* Loading and animation effects */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.loading-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}`
  }
];

export function CustomCSSEditor({ customCss, onCustomCssChange }: CustomCSSEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  const handleTemplateInsert = (template: typeof cssTemplates[0]) => {
    const newCss = customCss ? `${customCss}\n\n${template.css}` : template.css;
    onCustomCssChange(newCss);
  };

  const handleTemplateCopy = async (template: typeof cssTemplates[0]) => {
    try {
      await navigator.clipboard.writeText(template.css);
      setCopiedTemplate(template.name);
      setTimeout(() => setCopiedTemplate(null), 2000);
    } catch (error) {
      console.error('Failed to copy CSS:', error);
    }
  };

  const clearCSS = () => {
    onCustomCssChange('');
  };

  const formatCSS = () => {
    // Basic CSS formatting - in a real app, you might use a proper CSS formatter
    const formatted = customCss
      .replace(/\s*{\s*/g, ' {\n  ')
      .replace(/;\s*/g, ';\n  ')
      .replace(/\s*}\s*/g, '\n}\n\n')
      .replace(/,\s*/g, ',\n')
      .trim();
    onCustomCssChange(formatted);
  };

  return (
    <div className="space-y-6">
      {/* CSS Templates */}
      <div>
        <Label className="text-base font-medium mb-3 block">CSS Templates</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cssTemplates.map((template) => (
            <Card key={template.name} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{template.name}</h4>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTemplateCopy(template)}
                      className="h-8 w-8 p-0"
                    >
                      {copiedTemplate === template.name ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTemplateInsert(template)}
                      className="h-8 px-2 text-xs"
                    >
                      Insert
                    </Button>
                  </div>
                </div>
                <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-hidden">
                  {template.css.split('\n').slice(0, 3).join('\n')}
                  {template.css.split('\n').length > 3 && '\n...'}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CSS Editor */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-base font-medium">Custom CSS Code</Label>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={formatCSS} disabled={!customCss}>
              <Code className="w-4 h-4 mr-2" />
              Format
            </Button>
            <Button variant="ghost" size="sm" onClick={clearCSS} disabled={!customCss}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? (
                <EyeOff className="w-4 h-4 mr-2" />
              ) : (
                <Eye className="w-4 h-4 mr-2" />
              )}
              {showPreview ? 'Hide' : 'Show'} Preview
            </Button>
          </div>
        </div>

        <Textarea
          value={customCss}
          onChange={(e) => onCustomCssChange(e.target.value)}
          placeholder="/* Add your custom CSS here */
.my-custom-class {
  /* Your styles */
}"
          className="min-h-[300px] font-mono text-sm"
          style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
        />

        <div className="mt-2 text-xs text-gray-500">
          <p>
            <strong>Tips:</strong> Use CSS classes and selectors to customize your store's appearance.
            Changes will be applied to your live store when saved.
          </p>
        </div>
      </div>

      {/* CSS Preview */}
      {showPreview && customCss && (
        <div>
          <Label className="text-base font-medium mb-3 block">CSS Preview</Label>
          <Card>
            <CardContent className="p-4">
              <div className="bg-gray-50 p-4 rounded">
                <style dangerouslySetInnerHTML={{ __html: customCss }} />
                <div className="space-y-4">
                  <div className="custom-button">Custom Button</div>
                  <div className="product-card bg-white p-4 border rounded">
                    <img 
                      src="https://via.placeholder.com/200x150" 
                      alt="Sample" 
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                    <h3 className="font-semibold">Sample Product Card</h3>
                    <p className="text-gray-600 text-sm">Hover to see effects</p>
                  </div>
                  <h1 className="hero-title">Hero Title</h1>
                  <p className="section-subtitle">Section Subtitle</p>
                  <div className="fade-in-up">Animated Element</div>
                  <div className="loading-pulse bg-blue-100 p-2 rounded">Pulsing Element</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CSS Guidelines */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 mb-2">CSS Guidelines</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use specific class names to avoid conflicts with existing styles</li>
            <li>• Test your CSS thoroughly before applying to your live store</li>
            <li>• Consider mobile responsiveness when adding custom styles</li>
            <li>• Avoid using !important unless absolutely necessary</li>
            <li>• Keep performance in mind - avoid heavy animations on mobile</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}