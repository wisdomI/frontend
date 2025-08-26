import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { EventRequestProps } from "@/types/directrequesttypes";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestData: EventRequestProps | null;
  onSave: (updatedData: EventRequestProps) => void;
}

const EditDirectRequestModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  requestData,
  onSave,
}) => {
  const [formData, setFormData] = useState<EventRequestProps | null>(null);

  useEffect(() => {
    if (requestData) {
      setFormData(requestData);
    }
  }, [requestData]);

  if (!isOpen || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'guests') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0,
      });
    } else if (name === 'budget') {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleServiceChange = (index: number, value: string) => {
    const updatedServices = [...formData.services];
    updatedServices[index] = value;
    setFormData({
      ...formData,
      services: updatedServices,
    });
  };

  const addService = () => {
    setFormData({
      ...formData,
      services: [...formData.services, ''],
    });
  };

  const removeService = (index: number) => {
    const updatedServices = formData.services.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      services: updatedServices,
    });
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-2xl font-bold text-gray-900">{modalTitle}</h2>
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - File Upload */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Images</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-event-blue transition-colors">
                  <div className="space-y-2">
                    <div className="text-gray-400">
                      <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-event-blue cursor-pointer hover:underline">
                        Click to upload
                      </span> or drag and drop
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>

              {/* Services Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Services Needed</h3>
                <div className="space-y-3">
                  {formData.services.map((service, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={service}
                        onChange={(e) => handleServiceChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                        placeholder="Enter service"
                      />
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addService}
                    className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-event-blue hover:text-event-blue transition-colors"
                  >
                    + Add Service
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Form Fields */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type *
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                    required
                  >
                    <option value="">Select event type</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Social Event">Social Event</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Location *
                  </label>
                  <input
                    type="text"
                    name="eventLocation"
                    value={formData.eventLocation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                    placeholder="Enter event location"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Guests *
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range *
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                    required
                  >
                    <option value="">Select budget range</option>
                    <option value="₦50,000 - ₦100,000">₦50,000 - ₦100,000</option>
                    <option value="₦100,000 - ₦200,000">₦100,000 - ₦200,000</option>
                    <option value="₦200,000 - ₦500,000">₦200,000 - ₦500,000</option>
                    <option value="₦500,000 - ₦1,000,000">₦500,000 - ₦1,000,000</option>
                    <option value="₦1,000,000+">₦1,000,000+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Information
                  </label>
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent resize-none"
                    placeholder="Any additional details about your event..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-event-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDirectRequestModal;
 