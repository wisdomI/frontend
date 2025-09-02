"use client";

import { useState } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import EventTypeSelect from "../../ui/select/EventTypeSelect";
import ServiceTypeSelect from "../../ui/select/ServiceTypeSelect";
import LocationSelect from "../../ui/select/LocationSelect";
import CitySelect from "../../ui/select/CitySelect";
import YesNoSelect from "../../ui/select/YesNoSelect";
import CustomCalendar from "../../ui/calendar/CustomCalendar";
import SuccessModal from "../../ui/modal/SuccessNotificationModal";

interface ServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ServiceRequestModal({ isOpen, onClose }: ServiceRequestModalProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    eventTitle: "",
    eventType: "",
    startDate: "",
    endDate: "",
    eventLocation: "",
    eventCity: "",
    servicesNeeded: [] as string[],
    numberOfGuests: "",
    budgetRange: "",
    additionalInfo: "",
    eventPlanner: "no",
    selectedPlanner: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  if (!isOpen) return null;

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.eventTitle.trim() !== "" &&
      formData.eventType !== "" &&
      formData.startDate !== "" &&
      formData.endDate !== "" &&
      formData.eventLocation !== "" &&
      formData.eventCity !== "" &&
      formData.servicesNeeded.length > 0 &&
      formData.numberOfGuests !== "" &&
      formData.budgetRange.trim() !== "" &&
      formData.additionalInfo.trim() !== ""
    );
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  // Handle file deletion
  const handleFileDelete = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = () => {
    if (isFormValid()) {
      console.log("Form submitted:", { ...formData, files: selectedFiles });
      onClose();
      setShowSuccess(true);
      // Reset form
      setFormData({
        eventTitle: "",
        eventType: "",
        startDate: "",
        endDate: "",
        eventLocation: "",
        eventCity: "",
        servicesNeeded: [],
        numberOfGuests: "",
        budgetRange: "",
        additionalInfo: "",
        eventPlanner: "no",
        selectedPlanner: "",
      });
      setSelectedFiles([]);
    }
  };

  // Handle closing success modal
  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-md">
        <div className="bg-[#f8f8f8] rounded-lg shadow-xl w-[900px] max-h-[94vh] overflow-y-auto relative mx-2 px-6">
          {/* Header */}
          <div className="flex items-start justify-between p-4 sm:p-6">
            <div className="flex-1 pr-2 mt-4">
              <h1 className="text-[32px] sm:text-md text-[#4c4c4c] font-bold font-heading">
                Request Service
              </h1>
              <p className="text-[24px] font-heading sm:text-md text-[#4c4c4c] mt-4">
                Kindly fill in your Event details
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-event-blue h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold hover:opacity-90 flex-shrink-0 mt-2"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Event Title */}
              <div>
                <label className="block text-[20px] font-semibold font-heading text-[#4c4c4c] mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  placeholder="Enter Event Title"
                  value={formData.eventTitle}
                  onChange={(e) => handleInputChange("eventTitle", e.target.value)}
                  className="w-full px-3 py-2 shadow-sm rounded-md bg-[#fff] focus:outline-none focus:ring-1 font-normal font-sans placeholder:font-sans placeholder:font-normal placeholder:text-[#a5a0a0] text-[#a5a0a0]"
                />
              </div>

              {/* Event Type */}
              <div>
                <label className="block text-[20px] font-semibold font-heading text-[#4c4c4c] mb-1">
                  Event Type
                </label>
                <EventTypeSelect
                  value={formData.eventType}
                  onChange={(value) => handleInputChange("eventType", value)}
                  placeholder="Select Event Type"
                />
              </div>

              {/* Event Date */}
              <div>
                <label className="block text-[20px] font-semibold font-heading text-[#4c4c4c] mb-1">
                  Event Date
                </label>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="flex-1">
                    <CustomCalendar
                      value={formData.startDate}
                      onChange={(date) => handleInputChange("startDate", date)}
                      placeholder="Select Start Date"
                      label="Start Date"
                    />
                  </div>
                  <div className="flex-1">
                    <CustomCalendar
                      value={formData.endDate}
                      onChange={(date) => handleInputChange("endDate", date)}
                      placeholder="Select End Date"
                      label="End Date"
                    />
                  </div>
                </div>
              </div>

              {/* Event Location */}
              <div>
                <label className="block text-[20px] font-semibold font-heading text-[#4c4c4c] mb-1">
                  Event Location
                </label>
                <LocationSelect
                  value={formData.eventLocation}
                  onChange={(value) => {
                    handleInputChange("eventLocation", value);
                    if (formData.eventCity) {
                      handleInputChange("eventCity", "");
                    }
                  }}
                  placeholder="Select State"
                />
              </div>

              {/* Event City */}
              <div>
                <label className="block text-[20px] font-semibold font-heading text-[#4c4c4c] mb-1">
                  Event City
                  <span className="text-[16px] font-normal text-gray-500 mb-1 font-sans">
                    (Select the City you will like to Host your event)
                  </span>
                </label>
                <CitySelect
                  value={formData.eventCity}
                  onChange={(value) => handleInputChange("eventCity", value)}
                  selectedState={formData.eventLocation}
                  placeholder="Select City"
                />
              </div>

              {/* Services Needed */}
              <div>
                <label className="block text-[20px] font-semibold font-heading text-[#4c4c4c] mb-1">
                  Services Needed
                </label>
                <ServiceTypeSelect
                  selectedServices={formData.servicesNeeded}
                  onChange={(services) => handleInputChange("servicesNeeded", services)}
                  placeholder="Select Services"
                />
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block text-[20px] font-semibold font-heading text-[#4c4c4c] mb-1">
                  Number of Guests
                </label>
                <input
                  type="number"
                  placeholder="Enter no. of Guests"
                  value={formData.numberOfGuests}
                  onChange={(e) => handleInputChange("numberOfGuests", e.target.value)}
                  className="w-full px-3 py-2 shadow-sm rounded-md bg-[#fff] focus:outline-none focus:ring-1 font-normal font-sans placeholder:font-sans placeholder:font-normal placeholder:text-[#a5a0a0] text-[#a5a0a0]"
                />
              </div>

              <div>
                <label className="block text-[20px] font-semibold font-heading text-[#4c4c4c] mb-1">
                  Budget Range
                </label>
                <input
                  type="text"
                  placeholder="e.g N100,000 - N200,000"
                  value={formData.budgetRange}
                  onChange={(e) => handleInputChange("budgetRange", e.target.value)}
                  className="w-full px-3 py-2 shadow-sm rounded-md bg-[#fff] focus:outline-none focus:ring-1 font-thin placeholder:font-normal placeholder:text-sans placeholder:text-[#a5a0a0] text-[#a5a0a0]"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* File Upload */}
              <div>
                <div className="border-1 border-dashed border-gray-300 bg-[#fff] rounded-md p-6 text-center">
                  <label className="block text-[16px] font-normal font-sans text-[#4c4c4c] mb-1">
                    Choose a file or drag & drop it here
                  </label>
                  <p className="text-xs font-normal text-gray-200 mb-3 font-sans">
                    JPEG, PNG, PDF, and MP4 formats, up to 50MB
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf,.mp4"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="bg-event-blue font-normal font-sans mt-4 text-white px-4 py-2 rounded-md hover:bg-event-blue-hover transition-colors cursor-pointer"
                  >
                    Browse File
                  </label>
                </div>
                {selectedFiles.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center font-sans font-normal justify-between p-2 bg-gray-50 rounded-md">
                        <div className="text-sm text-gray-700">
                          {file.name}
                        </div>
                        <button
                          onClick={() => handleFileDelete(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <span className="text-gray-500 font-normal font-sans mx-2">Size: {(file.size / 1024).toFixed(1)}KB</span>
                          <DeleteOutlined className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div>
                <label className="block text-[20px] font-semibold font-heading text-[#4c4c4c] mb-1">
                  Additional Information
                </label>
                <textarea
                  placeholder="Enter here"
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-[#fff] focus:outline-none focus:ring-1 font-normal font-sans placeholder:font-sans placeholder:font-normal placeholder:text-[#a5a0a0] text-[#a5a0a0]"
                  rows={5}
                ></textarea>
              </div>

              {/* Event Planner */}
              <div>
                <label className="block text-[16px] font-semibold font-heading text-[#4c4c4c] mb-1">
                  Would you like an Event planner to organize your event?
                </label>
                <YesNoSelect
                  value={formData.eventPlanner}
                  onChange={(value) => handleInputChange("eventPlanner", value)}
                  placeholder="Select Option"
                />
              </div>

              {/* Select Planner */}
              <div>
                <label className="block text-[16px] font-semibold font-heading text-[#4c4c4c] mb-1">
                  Would you like AI to suggest Event Planners that can organize your event?
                </label>
                <YesNoSelect
                  value={formData.selectedPlanner}
                  onChange={(value) => handleInputChange("selectedPlanner", value)}
                  placeholder="Select Option"
                  yesLabel="Yes"
                  noLabel="No"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 mb-4 sm:mb-6 mx-4 sm:mx-8 flex justify-center items-center">
            <button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className={`w-full py-2 font-sans font-semibold rounded-lg transition-colors mb-4 ${isFormValid()
                ? 'bg-event-blue text-white hover:bg-blue-900'
                : 'bg-gray-400 text-gray-100 cursor-not-allowed'
                }`}
            >
              Request Service
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal isOpen={showSuccess} onClose={handleCloseSuccess} />
    </>
  );
}