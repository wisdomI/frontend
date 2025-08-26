import React, { useState, useEffect } from "react";
import { X, Upload, Trash2 } from "lucide-react";
import { EventRequestProps } from "@/types/directrequesttypes";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestData: EventRequestProps | null;
  onSave: (updatedData: EventRequestProps) => void;
  modalTitle?: string;
}

const EditDirectRequestModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  requestData,
  onSave,

}) => {
  const [formData, setFormData] = useState<EventRequestProps | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    if (requestData) {
      setFormData(requestData);
    }
  }, [requestData]);

  if (!isOpen || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Handle different field types
    let processedValue: any = value;

    if (name === 'guests') {
      processedValue = parseInt(value) || 0;
    }

    setFormData({
      ...formData,
      [name]: processedValue,
    });
  };

  const handleServiceRemove = (index: number) => {
    if (formData) {
      const updatedServices = formData.services.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        services: updatedServices,
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  const modalTitle = requestData?.title ? `Edit "${requestData.title}"` : 'Edit Request';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{modalTitle}</h2>
            <p className="text-gray-600 mt-1">Kindly fill in your Event details</p>
          </div>
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={onClose}
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Event Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-event-blue"
                  placeholder="Baby Linda's Birthday Party"
                />
              </div>

              {/* Event Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type
                </label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-event-blue"
                >
                  <option value="Social Event (Wedding, Birthday)">Social Event (Wedding, Birthday)</option>
                  <option value="Corporate Event">Corporate Event</option>
                  <option value="Conference">Conference</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>

              {/* Event Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Date
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-event-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-event-blue"
                    />
                  </div>
                </div>
              </div>

              {/* Event Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Location
                </label>
                <select
                  name="eventLocation"
                  value={formData.eventLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-event-blue"
                >
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Port Harcourt">Port Harcourt</option>
                  <option value="Kano">Kano</option>
                </select>
              </div>

              {/* Event City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event City <span className="text-gray-400">(Select the City you will like to Host your event)</span>
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-event-blue"
                >
                  <option value="Surulere">Surulere</option>
                  <option value="Victoria Island">Victoria Island</option>
                  <option value="Ikeja">Ikeja</option>
                  <option value="Lekki">Lekki</option>
                </select>
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Guests
                </label>
                <input
                  name="guests"
                  type="number"
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-event-blue"
                  placeholder="Enter no. of Guests"
                />
              </div>

              {/* Services Needed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Services Needed
                </label>
                <div className="flex flex-wrap gap-2">
                  {formData.services.map((service, index) => (
                    <span
                      key={index}
                      className="bg-event-blue text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      {service}
                      <button
                        onClick={() => handleServiceRemove(index)}
                        className="text-white hover:text-red-200 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                  <button className="border-2 border-dashed border-gray-300 px-4 py-2 rounded-lg text-gray-500 hover:border-event-blue hover:text-event-blue transition-colors">
                    + Add Service
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Budget Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range
                </label>
                <input
                  name="budget"
                  value={Array.isArray(formData.budget) ? `₦${formData.budget[0].toLocaleString()} - ₦${formData.budget[1].toLocaleString()}` : formData.budget}
                  onChange={(e) => {
                    // For now, just store as string - you can parse it later if needed
                    setFormData({
                      ...formData,
                      budget: e.target.value as any
                    });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-event-blue"
                  placeholder="e.g ₦100,000 - ₦200,000"
                />
              </div>

              {/* File Upload */}
              <div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Choose a file or drag & drop it here</p>
                  <p className="text-sm text-gray-400 mb-4">JPEG, PNG, PDF, and MP4 formats, up to 50MB</p>
                  <label className="bg-event-blue text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-event-blue-hover transition-colors">
                    Browse File
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                    placeholder="Enter number of guests"
                    min="1"
                    required
                  />
                </div>

                {/* Uploaded Files */}
                {selectedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            Size: {(file.size / 1024 / 1024).toFixed(1)}MB
                          </span>
                          <button
                            onClick={() => setSelectedFiles(files => files.filter((_, i) => i !== index))}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-event-blue"
                  placeholder="We need milky flavoured cake and some Cherry as toppings"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="button"
              onClick={handleSave}
              className="w-full bg-event-blue text-white py-4 rounded-lg font-semibold text-lg hover:bg-event-blue-hover transition-colors"
            >
              Request Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDirectRequestModal;
 