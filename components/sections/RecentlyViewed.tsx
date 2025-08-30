
"use client";

import React, { useState } from "react";
import ServiceCard from "@/components/ui/ServiceCard";
import { mockRecentlyViewedServices } from "@/data/mockServices";

const RecentlyViewed = () => {
  const allServices = mockRecentlyViewedServices;
  const [visibleCount, setVisibleCount] = useState(3);
  const maxLoadPerClick = 3;

  const handleSeeMore = () => {
    const newCount = visibleCount + maxLoadPerClick;
    setVisibleCount(newCount > allServices.length ? allServices.length : newCount);
  };

  const handleSeeLess = () => {
    setVisibleCount(3);
  };

  const recentServices = allServices.slice(0, visibleCount);

  // Commented-out real API integration
  /*
  const [recentServices, setRecentServices] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/recently-viewed');
      const data = await response.json();
      setRecentServices(data.slice(0, visibleCount));
    };
    fetchData();
  }, [visibleCount]);

  const handleSeeMore = async () => {
    const response = await fetch('/api/recently-viewed');
    const data = await response.json();
    const newCount = visibleCount + maxLoadPerClick;
    setVisibleCount(newCount > data.length ? data.length : newCount);
    setRecentServices(data.slice(0, visibleCount + maxLoadPerClick));
  };
  */

  return (
    <section className="mb-8 mt-8"
    style={{
      background: 'radial-gradient(circle at bottom, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.02) 50%, transparent 100%)'
    }}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold font-heading text-gray-700">Recently Viewed</h3>
        <div className="flex gap-2">
          {visibleCount < allServices.length && (
            <button
              onClick={handleSeeMore}
              className="text-[18px]  text-gray-600  font-semibold  hover:underline  font-sans focus:outline-none"
            >
              See more
            </button>
          )}
          {visibleCount > 4 && (
            <button
              onClick={handleSeeLess}
              className="text-[18px] text-gray-600 hover:underline  font-semibold   font-sans focus:outline-none"
            >
              See less
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recentServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            layout="grid"
            showPrice={true}
          />
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;
