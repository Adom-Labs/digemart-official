import React from 'react';
import Link from 'next/link';
import { StoreSubdomainData } from '@/lib/api/subdomain';

interface StoreFooterProps {
  store: StoreSubdomainData;
  footerStyle?: 'simple' | 'detailed' | 'minimal' | 'newsletter';
}

export function StoreFooter({ store, footerStyle = 'detailed' }: StoreFooterProps) {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    'Shop': [
      { name: 'All Products', href: '/products' },
      { name: 'Categories', href: '/categories' },
      { name: 'New Arrivals', href: '/products?filter=new' },
      { name: 'Sale', href: '/products?filter=sale' },
    ],
    'Support': [
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns', href: '/returns' },
    ],
    'Company': [
      { name: 'About Us', href: '/about' },
      { name: 'Our Story', href: '/story' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
    ],
  };

  if (footerStyle === 'minimal') {
    return (
      <footer 
        className="border-t py-8"
        style={{ borderColor: 'var(--store-color-primary, #3B82F6)20' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p 
              className="text-sm"
              style={{ color: 'var(--store-color-secondary, #64748B)' }}
            >
              © {currentYear} {store.storeName}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer 
      className="border-t"
      style={{ 
        borderColor: 'var(--store-color-primary, #3B82F6)20',
        backgroundColor: 'var(--store-color-background, #FFFFFF)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Store Info */}
          <div className="space-y-4">
            <h3 
              className="text-lg font-semibold"
              style={{ 
                color: 'var(--store-color-text, #1F2937)',
                fontFamily: 'var(--store-heading-font, var(--store-font-family, inherit))'
              }}
            >
              {store.storeName}
            </h3>
            
            {store.storeDescription && (
              <p 
                className="text-sm"
                style={{ color: 'var(--store-color-secondary, #64748B)' }}
              >
                {store.storeDescription}
              </p>
            )}
            
            {/* Social Links */}
            {store.socialLinks && Object.keys(store.socialLinks).length > 0 && (
              <div className="flex space-x-4">
                {Object.entries(store.socialLinks).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:opacity-75 transition-opacity"
                  >
                    <span className="sr-only">{platform}</span>
                    <div className="h-5 w-5 bg-gray-400 rounded"></div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h4 
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: 'var(--store-color-text, #1F2937)' }}
              >
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm hover:opacity-75 transition-opacity"
                      style={{ color: 'var(--store-color-secondary, #64748B)' }}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div 
          className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center"
          style={{ borderColor: 'var(--store-color-primary, #3B82F6)20' }}
        >
          <p 
            className="text-sm"
            style={{ color: 'var(--store-color-secondary, #64748B)' }}
          >
            © {currentYear} {store.storeName}. All rights reserved.
          </p>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="text-sm hover:opacity-75 transition-opacity"
              style={{ color: 'var(--store-color-secondary, #64748B)' }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm hover:opacity-75 transition-opacity"
              style={{ color: 'var(--store-color-secondary, #64748B)' }}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}