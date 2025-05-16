// src/app/developments/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { developments } from '@/data/developments';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const development = developments.find(d => d.id === params.slug);
  
  if (!development) {
    return {
      title: 'Development Not Found | PROP.ie',
    };
  }
  
  return {
    title: `${development.name} | PROP.ie`,
    description: `Discover ${development.name} - ${development.description} in ${development.location}. Premium sustainable homes by PROP.ie.`,
  };
}

export default function DevelopmentPage({ params }: { params: { slug: string } }) {
  const development = developments.find(d => d.id === params.slug);
  
  if (!development) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-white">
      <div className="relative bg-[#2B5273] h-64">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-white">{development.name}</h1>
          <p className="mt-4 text-xl text-white/80">{development.description} • {development.location}</p>
        </div>
      </div>
      
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Here you would add development specific content */}
          <p>Development details coming soon.</p>
        </div>
      </section>
    </div>
  );
}