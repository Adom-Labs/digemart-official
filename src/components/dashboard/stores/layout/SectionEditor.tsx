'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { X, Save } from 'lucide-react';

interface PageSection {
  id: string;
  type: 'hero' | 'products' | 'testimonials' | 'cta' | 'about' | 'custom';
  component: string;
  props: Record<string, any>;
  order: number;
  visible: boolean;
}

interface SectionEditorProps {
  section: PageSection;
  onSave: (updates: Partial<PageSection>) => void;
  onCancel: () => void;
}

export function SectionEditor({ section, onSave, onCancel }: SectionEditorProps) {
  const [props, setProps] = useState(section.props);
  const [visible, setVisible] = useState(section.visible);

  const handlePropChange = (key: string, value: any) => {
    setProps(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave({ props, visible });
  };

  const renderPropEditor = (key: string, value: any, type?: string) => {
    const commonProps = {
      id: key,
      value: value || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        handlePropChange(key, e.target.value),
    };

    switch (type || typeof value) {
      case 'boolean':
        return (
          <Switch
            checked={value || false}
            onCheckedChange={(checked) => handlePropChange(key, checked)}
          />
        );
      
      case 'number':
        return (
          <Input
            {...commonProps}
            type="number"
            onChange={(e) => handlePropChange(key, parseInt(e.target.value) || 0)}
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            rows={4}
          />
        );
      
      case 'color':
        return (
          <div className="flex gap-2">
            <Input
              {...commonProps}
              type="color"
              className="w-16"
            />
            <Input
              {...commonProps}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        );
      
      case 'select':
        const options = getSelectOptions(key, section.type);
        return (
          <Select value={value || ''} onValueChange={(val) => handlePropChange(key, val)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      default:
        return <Input {...commonProps} />;
    }
  };

  const getSelectOptions = (key: string, sectionType: string) => {
    const optionsMap: Record<string, Array<{value: string, label: string}>> = {
      imagePosition: [
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
        { value: 'top', label: 'Top' },
        { value: 'bottom', label: 'Bottom' },
      ],
      layout: [
        { value: 'grid', label: 'Grid' },
        { value: 'list', label: 'List' },
        { value: 'carousel', label: 'Carousel' },
      ],
      columns: [
        { value: '2', label: '2 Columns' },
        { value: '3', label: '3 Columns' },
        { value: '4', label: '4 Columns' },
        { value: '6', label: '6 Columns' },
      ],
    };
    
    return optionsMap[key] || [];
  };

  const getSectionFields = () => {
    const commonFields = [
      { key: 'title', label: 'Title', type: 'string' },
      { key: 'subtitle', label: 'Subtitle', type: 'string' },
    ];

    const typeSpecificFields: Record<string, Array<{key: string, label: string, type: string}>> = {
      hero: [
        ...commonFields,
        { key: 'backgroundImage', label: 'Background Image URL', type: 'string' },
        { key: 'ctaText', label: 'Button Text', type: 'string' },
        { key: 'ctaLink', label: 'Button Link', type: 'string' },
        { key: 'overlay', label: 'Show Overlay', type: 'boolean' },
        { key: 'backgroundColor', label: 'Background Color', type: 'color' },
      ],
      products: [
        ...commonFields,
        { key: 'limit', label: 'Number of Products', type: 'number' },
        { key: 'columns', label: 'Columns', type: 'select' },
        { key: 'showFilters', label: 'Show Filters', type: 'boolean' },
        { key: 'showSorting', label: 'Show Sorting', type: 'boolean' },
        { key: 'category', label: 'Category Filter', type: 'string' },
      ],
      about: [
        ...commonFields,
        { key: 'content', label: 'Content', type: 'textarea' },
        { key: 'image', label: 'Image URL', type: 'string' },
        { key: 'imagePosition', label: 'Image Position', type: 'select' },
        { key: 'backgroundColor', label: 'Background Color', type: 'color' },
      ],
      testimonials: [
        ...commonFields,
        { key: 'layout', label: 'Layout', type: 'select' },
        { key: 'showRatings', label: 'Show Ratings', type: 'boolean' },
      ],
      cta: [
        ...commonFields,
        { key: 'ctaText', label: 'Button Text', type: 'string' },
        { key: 'ctaLink', label: 'Button Link', type: 'string' },
        { key: 'backgroundColor', label: 'Background Color', type: 'color' },
        { key: 'textColor', label: 'Text Color', type: 'color' },
      ],
      custom: [
        { key: 'title', label: 'Section Title', type: 'string' },
        { key: 'html', label: 'Custom HTML', type: 'textarea' },
      ],
    };

    return typeSpecificFields[section.type] || commonFields;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Edit {section.component}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Visibility Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="visible">Section Visible</Label>
              <Switch
                id="visible"
                checked={visible}
                onCheckedChange={setVisible}
              />
            </div>

            {/* Dynamic Fields */}
            {getSectionFields().map(field => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>{field.label}</Label>
                {renderPropEditor(field.key, props[field.key], field.type)}
              </div>
            ))}

            {/* Special handling for testimonials */}
            {section.type === 'testimonials' && (
              <div className="space-y-4">
                <Label>Testimonials</Label>
                <div className="space-y-3">
                  {(props.testimonials || []).map((testimonial: any, index: number) => (
                    <Card key={index} className="p-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Name</Label>
                          <Input
                            value={testimonial.name || ''}
                            onChange={(e) => {
                              const newTestimonials = [...(props.testimonials || [])];
                              newTestimonials[index] = { ...testimonial, name: e.target.value };
                              handlePropChange('testimonials', newTestimonials);
                            }}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Rating</Label>
                          <Input
                            type="number"
                            min="1"
                            max="5"
                            value={testimonial.rating || 5}
                            onChange={(e) => {
                              const newTestimonials = [...(props.testimonials || [])];
                              newTestimonials[index] = { ...testimonial, rating: parseInt(e.target.value) };
                              handlePropChange('testimonials', newTestimonials);
                            }}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">Review</Label>
                          <Textarea
                            value={testimonial.review || ''}
                            onChange={(e) => {
                              const newTestimonials = [...(props.testimonials || [])];
                              newTestimonials[index] = { ...testimonial, review: e.target.value };
                              handlePropChange('testimonials', newTestimonials);
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newTestimonials = [
                        ...(props.testimonials || []),
                        { name: '', review: '', rating: 5, image: '' }
                      ];
                      handlePropChange('testimonials', newTestimonials);
                    }}
                  >
                    Add Testimonial
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <div className="p-6 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
}