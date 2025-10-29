import React from 'react';

interface VideoHeroProps {
  videoUrl: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function VideoHero({ videoUrl, title, subtitle, ctaText, ctaLink }: VideoHeroProps) {
  return (
    <section className="relative h-96 md:h-[500px] bg-gray-900 flex items-center justify-center">
      <div className="text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Video Hero</h2>
        <p className="text-gray-300">Video hero implementation coming soon...</p>
        <div className="mt-4 text-sm text-gray-400">
          Video URL: {videoUrl}
        </div>
      </div>
    </section>
  );
}