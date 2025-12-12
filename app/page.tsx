'use client'

import React from 'react';
import HeroBanner from '@/components/sections/HeroBanner';
import RecentlyViewed from '@/components/sections/RecentlyViewed';
import WhyChooseEventHub from '@/components/sections/WhyChooseUs';
import PopularServices from '@/components/sections/PopularServices';

export default function HomePage() {
  return (
    <>
      <HeroBanner/>
      <div className="pt-3 sm:pt-4 lg:pt-5 pb-4">
        <div className="space-y-6 sm:space-y-8">
          <WhyChooseEventHub/>
          <RecentlyViewed/>
          <PopularServices/>
        </div>
      </div>
    </>
  );
}