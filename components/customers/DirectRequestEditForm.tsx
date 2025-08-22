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
      setFormData(requestData); // load card data into form
    }
  }, [requestData]);

  if (!isOpen || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-4">Edit Request</h2>

        {/* Form */}
        <div className="space-y-4">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Event Title"
          />

          <input
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Event Date"
          />

          <input
            name="eventLocation"
            value={formData.eventLocation}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Event Location"
          />

          <textarea
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Additional Info"
          />
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-event-blue text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDirectRequestModal;
 