import React from 'react';
import { Hero } from '@/components/marketing/Hero';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { SurfaceQuality } from '@/components/marketing/SurfaceQuality';

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero with infinite image slider on right */}
      <Hero />

      {/* 2. How it works: 6 numbered steps in two-column layout */}
      <HowItWorks />

      {/* 3. Surface Quality: Stamped panel inspection overview */}
      <SurfaceQuality />
    </div>
  );
};

export default Home;
