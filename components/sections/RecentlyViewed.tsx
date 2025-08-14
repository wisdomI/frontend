
"use client";

import React, { useState } from "react";
import VendorCard from "../ui/modal/VendorsCard";
import { services } from "@/data/services";

const RecentlyViewed = () => {
  const allServices = services; // Using mock data for demo
  const [visibleCount, setVisibleCount] = useState(4); // Start with 4 items
  const maxLoadPerClick = 10; // Maximum items to load per "See more" click

  const handleSeeMore = () => {
    const newCount = visibleCount + maxLoadPerClick;
    setVisibleCount(newCount > allServices.length ? allServices.length : newCount); // Limit to total length
  };

  const handleSeeLess = () => {
    setVisibleCount(4); // Collapse back to initial 4 items
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
    <section className="mb-8 mt-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Recently Viewed</h3>
        {visibleCount < allServices.length && (
          <button
            onClick={handleSeeMore}
            className="text-sm text-blue-900 hover:underline focus:outline-none"
          >
            See more
          </button>
        )}
        {visibleCount > 4 && (
          <button
            onClick={handleSeeLess}
            className="text-sm text-blue-900 hover:underline focus:outline-none ml-4"
          >
            See less
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {recentServices.map((service, index) => (
          <VendorCard
            key={index}
            verified={true}
            image={service.image || "./images/image.png"}
            title={service.title || "Vendor Title"}
            vendorName={service.vendorName || "Vendor Name"}
            rating={service.rating || 4.5}
            reviews={service.reviews || []}
            location={service.location || "Location"}
          />
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;
