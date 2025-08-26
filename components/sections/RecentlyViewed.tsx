
"use client";

import React, { useState } from "react";
import VendorCard from "../ui/modal/VendorsCard";
import { services } from "@/data/services";

const RecentlyViewed = () => {
  const allServices = services; 
  const [visibleCount, setVisibleCount] = useState(3); 
  const maxLoadPerClick = 10; 

  const handleSeeMore = () => {
    const newCount = visibleCount + maxLoadPerClick;
    setVisibleCount(newCount > allServices.length ? allServices.length : newCount); // Limit to total length
  };

  const handleSeeLess = () => {
    setVisibleCount(4);
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
    <section className="mb-8 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold font-heading text-gray-700">Recently Viewed</h3>
        <div className="flex gap-2">
          {visibleCount < allServices.length && (
            <button
              onClick={handleSeeMore}
              className="text-sm text-blue-600 font-semibold hover:underline focus:outline-none"
            >
              See more
            </button>
          )}
          {visibleCount > 4 && (
            <button
              onClick={handleSeeLess}
              className="text-sm text-gray-600 hover:underline focus:outline-none"
            >
              See less
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recentServices.map((service, index) => (
          <VendorCard
            key={index}
            verified={true}
            image={service.image || "./images/image.png"}
            title={service.title || "Vendor Title"}
            vendorName={service.vendorName || "Vendor Name"}
            rating={service.rating || 4.5}
            reviews={typeof service.reviews === "number" ? service.reviews : 0}
            location={service.location || "Location"}
          />
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;
