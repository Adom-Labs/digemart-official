import React from 'react';

interface AboutSectionProps {
  title?: string;
  content?: string;
  image?: string;
  layout?: 'side-by-side' | 'stacked';
}

export default function AboutSection({ 
  title = 'About Us', 
  content = 'Tell your story here...', 
  image, 
  layout = 'side-by-side' 
}: AboutSectionProps) {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <p className="text-gray-600">About Section implementation coming soon...</p>
          <div className="mt-4 text-sm text-gray-500">
            Layout: {layout}
          </div>
        </div>
      </div>
    </section>
  );
}