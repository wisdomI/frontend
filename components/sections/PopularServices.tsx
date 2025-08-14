import React from "react";
import ServiceCard from "../ui/ServiceCard";
import { ArrowRight } from "lucide-react";

const services = [
  {
    image: "/images/haircut.jpg",
    title: "Haircut & Styling",
    description: "Professional haircut and beard grooming services."
  },
  {
    image: "/images/spa.jpg",
    title: "Spa & Massage",
    description: "Relaxing spa treatment for body and mind."
  },
  {
    image: "/images/car-wash.jpg",
    title: "Premium Car Wash",
    description: "Full service interior & exterior cleaning."
  }
];

const PopularServices: React.FC = () => {
  return (
    <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Popular Services</h2>
        <button className="flex items-center text-sm text-blue-600 hover:underline">
          See more
          <ArrowRight size={16} className="ml-1" />
        </button>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            image={service.image}
            title={service.title}
            description={service.description}
          />
        ))}
      </div>
    </div>
  );
};

export default PopularServices;
