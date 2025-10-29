import React from 'react';

interface CustomSectionProps {
  content?: string;
  className?: string;
}

export default function CustomSection({ content = '', className = '' }: CustomSectionProps) {
  if (!content) {
    return (
      <section className={`py-12 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <p className="text-gray-600">Custom Section - No content configured</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          dangerouslySetInnerHTML={{ __html: content }}
          className="prose prose-lg max-w-none"
        />
      </div>
    </section>
  );
}