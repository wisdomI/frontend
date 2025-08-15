
import React, { useState } from "react";
import PopularServiceCard from "../ui/modals/PopularServiceCard";
import { ArrowRight } from "lucide-react";
import { ToggleButton, ToggleButtonGroup, Box } from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";

const services = [
  {
    image: "./images/image.png",
    title: "Haircut & Styling",
    description: "Professional haircut and beard grooming services.",
  },
  {
    image: "./images/image.png",
    title: "Spa & Massage",
    description: "Relaxing spa treatment for body and mind.",
  },
  {
    image: "./images/image.png",
    title: "Premium Car Wash",
    description: "Full service interior & exterior cleaning.",
  },
];

const PopularServices: React.FC = () => {
  const [viewMode, setViewMode] = useState<"horizontal" | "vertical">("horizontal");

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: "horizontal" | "vertical" | null
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4">
        <h2 className="text-lg font-semibold text-gray-800">Popular Services</h2>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
            aria-label="view mode"
          >
            <ToggleButton value="horizontal" aria-label="list view">
              <ViewListIcon />
            </ToggleButton>
            <ToggleButton value="vertical" aria-label="grid view">
              <ViewModuleIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          
        </Box>
        </div>
        <button className="flex items-center text-sm text-blue-600 hover:underline ml-2">
            See more
            <ArrowRight size={16} className="ml-1" />
          </button>
      </div>

      {/* Cards */}
      <div
        className={
          viewMode === "horizontal"
            ? "space-y-3"
            : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        }
      >
        {services.map((service, index) => (
          <PopularServiceCard
            key={index}
            image={service.image}
            title={service.title}
            description={service.description}
            layout={viewMode}
          />
        ))}
      </div>
    </div>
  );
};

export default PopularServices;