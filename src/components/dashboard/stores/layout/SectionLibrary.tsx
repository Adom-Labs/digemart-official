'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Image, 
  Package, 
  MessageSquare as MessageSquote, 
  Megaphone, 
  FileText, 
  Plus,
  Play,
  Grid3X3,
  Star,
  Users
} from 'lucide-react';

interface SectionTemplate {
  type: 'hero' | 'products' | 'testimonials' | 'cta' | 'about' | 'custom';
  component: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  props: Record<string, any>;
  visible: boolean;
}

interface SectionLibraryProps {
  onSectionAdd: (section: Omit<SectionTemplate, 'id' | 'order'>) => void;
}

const sectionTemplates: SectionTemplate[] = [
  // Hero Sections
  {
    type: 'hero',
    component: 'BannerHero',
    name: 'Banner Hero',
    description: 'Large banner with background image and call-to-action',
    icon: <Image className="w-5 h-5" />,
    props: {
      title: 'Welcome to Our Store',
      subtitle: 'Discover amazing products',
      backgroundImage: '',
      ctaText: 'Shop Now',
      ctaLink: '/products',
      overlay: true,
    },
    visible: true,
  },
  {
    type: 'hero',
    component: 'CarouselHero',
    name: 'Carousel Hero',
    description: 'Rotating banner with multiple slides',
    icon: <Grid3X3 className="w-5 h-5" />,
    props: {
      slides: [
        {
          title: 'Featured Collection',
          subtitle: 'New arrivals this season',
          backgroundImage: '',
          ctaText: 'Explore',
          ctaLink: '/collections/new',
        }
      ],
      autoplay: true,
      interval: 5000,
    },
    visible: true,
  },
  {
    type: 'hero',
    component: 'VideoHero',
    name: 'Video Hero',
    description: 'Hero section with background video',
    icon: <Play className="w-5 h-5" />,
    props: {
      title: 'Experience Our Brand',
      subtitle: 'Watch our story unfold',
      videoUrl: '',
      posterImage: '',
      ctaText: 'Learn More',
      ctaLink: '/about',
    },
    visible: true,
  },
  {
    type: 'hero',
    component: 'MinimalHero',
    name: 'Minimal Hero',
    description: 'Clean, text-focused hero section',
    icon: <FileText className="w-5 h-5" />,
    props: {
      title: 'Simple. Beautiful. Effective.',
      subtitle: 'Quality products for modern living',
      ctaText: 'Get Started',
      ctaLink: '/products',
      backgroundColor: '#f8fafc',
    },
    visible: true,
  },

  // Product Sections
  {
    type: 'products',
    component: 'ProductGrid',
    name: 'Product Grid',
    description: 'Grid layout for showcasing products',
    icon: <Package className="w-5 h-5" />,
    props: {
      title: 'Featured Products',
      subtitle: 'Handpicked items just for you',
      limit: 8,
      columns: 4,
      showFilters: true,
      showSorting: true,
      category: '',
    },
    visible: true,
  },
  {
    type: 'products',
    component: 'ProductCarousel',
    name: 'Product Carousel',
    description: 'Horizontal scrolling product showcase',
    icon: <Grid3X3 className="w-5 h-5" />,
    props: {
      title: 'Trending Now',
      subtitle: 'Popular items this week',
      limit: 12,
      autoplay: false,
      showArrows: true,
      showDots: true,
    },
    visible: true,
  },
  {
    type: 'products',
    component: 'ProductList',
    name: 'Product List',
    description: 'Vertical list view for products',
    icon: <FileText className="w-5 h-5" />,
    props: {
      title: 'All Products',
      subtitle: 'Browse our complete collection',
      limit: 20,
      showImages: true,
      showDescriptions: true,
      pagination: true,
    },
    visible: true,
  },

  // Content Sections
  {
    type: 'about',
    component: 'AboutSection',
    name: 'About Section',
    description: 'Tell your brand story',
    icon: <Users className="w-5 h-5" />,
    props: {
      title: 'About Our Store',
      content: 'We are passionate about bringing you the best products...',
      image: '',
      imagePosition: 'right',
      backgroundColor: '#ffffff',
    },
    visible: true,
  },
  {
    type: 'testimonials',
    component: 'TestimonialSection',
    name: 'Testimonials',
    description: 'Customer reviews and feedback',
    icon: <MessageSquote className="w-5 h-5" />,
    props: {
      title: 'What Our Customers Say',
      testimonials: [
        {
          name: 'John Doe',
          review: 'Amazing products and great service!',
          rating: 5,
          image: '',
        }
      ],
      layout: 'grid',
      showRatings: true,
    },
    visible: true,
  },
  {
    type: 'cta',
    component: 'CTASection',
    name: 'Call to Action',
    description: 'Encourage specific user actions',
    icon: <Megaphone className="w-5 h-5" />,
    props: {
      title: 'Ready to Get Started?',
      subtitle: 'Join thousands of satisfied customers',
      ctaText: 'Shop Now',
      ctaLink: '/products',
      backgroundColor: '#3b82f6',
      textColor: '#ffffff',
    },
    visible: true,
  },

  // Custom Section
  {
    type: 'custom',
    component: 'CustomSection',
    name: 'Custom HTML',
    description: 'Add custom HTML content',
    icon: <FileText className="w-5 h-5" />,
    props: {
      title: 'Custom Section',
      html: '<div class="p-8 text-center"><h2>Custom Content</h2><p>Add your own HTML here</p></div>',
    },
    visible: true,
  },
];

export function SectionLibrary({ onSectionAdd }: SectionLibraryProps) {
  const groupedSections = sectionTemplates.reduce((acc, section) => {
    if (!acc[section.type]) {
      acc[section.type] = [];
    }
    acc[section.type].push(section);
    return acc;
  }, {} as Record<string, SectionTemplate[]>);

  const sectionGroups = [
    { key: 'hero', label: 'Hero Sections', icon: <Image className="w-4 h-4" /> },
    { key: 'products', label: 'Product Sections', icon: <Package className="w-4 h-4" /> },
    { key: 'about', label: 'Content Sections', icon: <FileText className="w-4 h-4" /> },
    { key: 'testimonials', label: 'Social Proof', icon: <Star className="w-4 h-4" /> },
    { key: 'cta', label: 'Call to Action', icon: <Megaphone className="w-4 h-4" /> },
    { key: 'custom', label: 'Custom', icon: <Plus className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-gray-700 mb-3">
        Section Library
      </div>
      
      {sectionGroups.map((group) => {
        const sections = groupedSections[group.key] || [];
        if (sections.length === 0) return null;

        return (
          <div key={group.key} className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wide">
              {group.icon}
              {group.label}
            </div>
            
            <div className="space-y-2">
              {sections.map((section, index) => (
                <Card 
                  key={`${section.type}-${index}`}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                        {section.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 mb-1">
                          {section.name}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">
                          {section.description}
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full h-7 text-xs"
                          onClick={() => onSectionAdd(section)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Section
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}