"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import SuccessModal from "./SuccessNotificationModal";

export default function PostServiceModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    eventTitle: "",
    eventType: "",
    startDate: "",
    endDate: "",
    eventLocation: "",
    eventCity: "",
    servicesNeeded: "",
    numberOfGuests: "",
    budgetRange: "",
    additionalInfo: "",
    eventPlanner: "no",
    selectedPlanner: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.eventTitle.trim() !== "" &&
      formData.eventType !== "" &&
      formData.startDate !== "" &&
      formData.endDate !== "" &&
      formData.eventLocation !== "" &&
      formData.eventCity !== "" &&
      formData.servicesNeeded !== "" &&
      formData.numberOfGuests !== "" &&
      formData.budgetRange.trim() !== "" &&
      formData.additionalInfo.trim() !== ""
    );
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
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
      // Here i will be sending data to the backend 
      setIsOpen(false);
      setShowSuccess(true);
      // Reset form
      setFormData({
        eventTitle: "",
        eventType: "",
        startDate: "",
        endDate: "",
        eventLocation: "",
        eventCity: "",
        servicesNeeded: "",
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
      <button
        onClick={() => setIsOpen(true)}
        className="block w-full bg-yellow-400 text-blue-900 font-semibold text-center py-3 rounded-lg hover:bg-yellow-500 transition-colors"
      >
        + Post Service Request
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-lg md:max-w-3xl lg:max-w-3xl max-h-[95vh] overflow-y-auto relative mx-2">
            
            {/* Header */}
            <div className="flex items-start justify-between p-4 sm:p-6 border-b border-gray-200">
              <div className="flex-1 pr-2">
                <h1 className="text-lg sm:text-xl font-bold text-gray-800">
                  Post a Service Request
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Kindly fill in your Event details
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-event-blue h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold hover:opacity-90 flex-shrink-0"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title
                  </label>
                                     <input
                     type="text"
                     placeholder="Enter Event Title"
                     value={formData.eventTitle}
                     onChange={(e) => handleInputChange("eventTitle", e.target.value)}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-700"
                   />
                </div>

                {/* Event Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type
                  </label>
                                     <select 
                     value={formData.eventType}
                     onChange={(e) => handleInputChange("eventType", e.target.value)}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-700"
                   >
                     <option value="">Select ▼</option>
                     <option value="wedding">Wedding</option>
                     <option value="birthday">Birthday</option>
                     <option value="corporate">Corporate</option>
                     <option value="other">Other</option>
                   </select>
                </div>

                {/* Event Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Date
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange("startDate", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-700"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange("endDate", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Event Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Location
                  </label>
                  <select 
                    value={formData.eventLocation}
                    onChange={(e) => handleInputChange("eventLocation", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-700"
                  >
                    <option value="">Select State ▼</option>
                    <option value="lagos">Lagos</option>
                    <option value="abuja">Abuja</option>
                    <option value="rivers">Rivers</option>
                  </select>
                </div>

                {/* Event City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event City
                  </label>
                  <p className="text-xs text-gray-500 mb-1">
                    (Select the City you will like to Host your event)
                  </p>
                  <select 
                    value={formData.eventCity}
                    onChange={(e) => handleInputChange("eventCity", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-700"
                  >
                    <option value="">Select City ▼</option>
                    <option value="lagos-island">Lagos Island</option>
                    <option value="victoria-island">Victoria Island</option>
                    <option value="ikeja">Ikeja</option>
                  </select>
                </div>

                {/* Services Needed */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Services Needed
                  </label>
                  <select 
                    value={formData.servicesNeeded}
                    onChange={(e) => handleInputChange("servicesNeeded", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-700"
                  >
                    <option value="">Select Services ▼</option>
                    <option value="catering">Catering</option>
                    <option value="photography">Photography</option>
                    <option value="venue">Venue</option>
                  </select>
                </div>

                {/* Number of Guests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    placeholder="Enter no. of Guests"
                    value={formData.numberOfGuests}
                    onChange={(e) => handleInputChange("numberOfGuests", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-700"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Budget Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget Range
                  </label>
                  <input
                    type="text"
                    placeholder="e.g N100,000 - N200,000"
                    value={formData.budgetRange}
                    onChange={(e) => handleInputChange("budgetRange", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-700"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose a file or drag & drop it here
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    JPEG, PNG, PDF, and MP4 formats, up to 50MB
                  </p>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
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
                      className="bg-event-blue text-white px-4 py-2 rounded-md hover:bg-event-blue-hover transition-colors cursor-pointer"
                    >
                      Browse File
                    </label>
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                          <div className="text-sm text-gray-700">
                            {file.name}{" "}
                            <span className="text-gray-500">Size: {(file.size / 1024).toFixed(1)}KB</span>
                          </div>
                          <button
                            onClick={() => handleFileDelete(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Icon icon="mdi:delete" className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Additional Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Information
                  </label>
                  <textarea
                    placeholder="Enter here"
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-700"
                    rows={3}
                  ></textarea>
                </div>

                {/* Event Planner */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Would you like an Event planner to organize your event?
                  </label>
                  <select 
                    value={formData.eventPlanner}
                    onChange={(e) => handleInputChange("eventPlanner", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-700"
                  >
                    <option value="no">No ▼</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>

                {/* Select Planner */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select an Event Planner
                  </label>
                  <select 
                    value={formData.selectedPlanner}
                    onChange={(e) => handleInputChange("selectedPlanner", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-700"
                  >
                    <option value="">Select Event Planner ▼</option>
                    <option value="habeeb">Habeeb Event Planner</option>
                    <option value="other">Other Planner</option>
                  </select>
                </div>

                {/* Submit */}
                
              </div>
             
            </div>
                         <div className="pt-2 mb-4 sm:mb-6 mx-4 sm:mx-8 flex justify-center items-center">
                   <button 
                     onClick={handleSubmit}
                     disabled={!isFormValid()}
                     className={`w-full py-3 rounded-lg font-medium transition-colors ${
                       isFormValid() 
                         ? 'bg-event-blue text-white hover:bg-blue-900' 
                         : 'bg-blue-900 text-gray-100 cursor-not-allowed'
                     }`}
                   >
                     Request Service
                   </button>
                 </div>
          </div>
        </div>
      )}
      
      {/* Success Modal */}
      <SuccessModal isOpen={showSuccess} onClose={handleCloseSuccess} />
    </>
  );
}
