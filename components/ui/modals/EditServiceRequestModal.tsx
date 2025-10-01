'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CloudArrowUpIcon, TrashIcon } from '@heroicons/react/24/solid';

interface ServiceRequest {
  id: number;
  title: string;
  image: string;
  postedTime: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  totalVisits: number;
  numberOfGuests: number;
  servicesNeeded: string[];
  budget: string;
  additionalInfo: string;
  offersCount: number;
}

interface EditServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceRequest: ServiceRequest | null;
  onSave: (updatedRequest: ServiceRequest) => void;
}

const EditServiceRequestModal: React.FC<EditServiceRequestModalProps> = ({ 
  isOpen, 
  onClose, 
  serviceRequest, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    eventTitle: '',
    eventType: '',
    startDate: '',
    endDate: '',
    eventLocation: '',
    eventCity: '',
    servicesNeeded: [] as string[],
    numberOfGuests: '',
    budgetRange: '',
    additionalInformation: '',
    eventPlanner: 'Yes',
    aiSuggestion: 'No',
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate form with existing data when modal opens
  useEffect(() => {
    if (serviceRequest && isOpen) {
      // Parse the existing data to populate the form
      const eventTypeMap: { [key: string]: string } = {
        'Social Event (Wedding, Birthday)': 'Social Event (Wedding, Birthday)',
        'Corporate Event': 'Corporate Event',
        'Birthday Party': 'Birthday Party',
        'Wedding': 'Wedding',
        'Anniversary': 'Anniversary',
        'Graduation': 'Graduation',
        'Other': 'Other'
      };

      const locationMap: { [key: string]: string } = {
        'Surulere, Lagos State': 'lagos',
        'Victoria Island, Lagos': 'lagos',
        'Ikoyi, Lagos': 'lagos',
        'Lekki, Lagos': 'lagos',
        'Maitama, Abuja': 'abuja',
        'Asokoro, Abuja': 'abuja'
      };

      const cityMap: { [key: string]: string } = {
        'Surulere, Lagos State': 'surulere',
        'Victoria Island, Lagos': 'victoria-island',
        'Ikoyi, Lagos': 'ikoyi',
        'Lekki, Lagos': 'lekki',
        'Maitama, Abuja': 'maitama',
        'Asokoro, Abuja': 'asokoro'
      };

      setFormData({
        eventTitle: serviceRequest.title,
        eventType: eventTypeMap[serviceRequest.eventType] || serviceRequest.eventType,
        startDate: '12/05/2025', // Default dates as shown in image
        endDate: '23/05/2025',
        eventLocation: locationMap[serviceRequest.eventLocation] || 'lagos',
        eventCity: cityMap[serviceRequest.eventLocation] || 'surulere',
        servicesNeeded: serviceRequest.servicesNeeded,
        numberOfGuests: serviceRequest.numberOfGuests.toString(),
        budgetRange: serviceRequest.budget,
        additionalInformation: serviceRequest.additionalInfo,
        eventPlanner: 'Yes',
        aiSuggestion: 'No',
      });
    }
  }, [serviceRequest, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceAdd = (service: string) => {
    if (service && !formData.servicesNeeded.includes(service)) {
      setFormData(prev => ({
        ...prev,
        servicesNeeded: [...prev.servicesNeeded, service]
      }));
    }
  };

  const handleServiceRemove = (serviceToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      servicesNeeded: prev.servicesNeeded.filter(service => service !== serviceToRemove)
    }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files).filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'].includes(file.type);
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB
      return isValidType && isValidSize;
    });
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isFormValid = () => {
    return formData.eventTitle.trim() !== '' &&
           formData.eventType !== '' &&
           formData.startDate !== '' &&
           formData.endDate !== '' &&
           formData.eventLocation !== '' &&
           formData.eventCity !== '' &&
           formData.servicesNeeded.length > 0 &&
           formData.numberOfGuests !== '' &&
           formData.budgetRange !== '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid() || !serviceRequest) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create updated service request
    const updatedRequest: ServiceRequest = {
      ...serviceRequest,
      title: formData.eventTitle,
      eventType: formData.eventType,
      numberOfGuests: parseInt(formData.numberOfGuests),
      servicesNeeded: formData.servicesNeeded,
      budget: formData.budgetRange,
      additionalInfo: formData.additionalInformation,
    };
    
    onSave(updatedRequest);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen || !serviceRequest) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex-1 pr-2">
            <h1 className="text-2xl font-bold text-gray-800">
              Edit Service Request Post
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Kindly fill in your Event details
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-blue-600 h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold hover:opacity-90 flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Event Details */}
            <div className="space-y-6">
              {/* Event Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  name="eventTitle"
                  value={formData.eventTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Enter Event Title"
                  required
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
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                >
                  <option value="">Select</option>
                  <option value="Social Event (Wedding, Birthday)">Social Event (Wedding, Birthday)</option>
                  <option value="Corporate Event">Corporate Event</option>
                  <option value="Birthday Party">Birthday Party</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Graduation">Graduation</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Event Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                    />
                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                    />
                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
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
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                >
                  <option value="">Select State</option>
                  <option value="lagos">Lagos</option>
                  <option value="abuja">Abuja</option>
                  <option value="kano">Kano</option>
                  <option value="rivers">Rivers</option>
                  <option value="oyo">Oyo</option>
                </select>
              </div>

              {/* Event City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event City
                </label>
                <p className="text-xs text-gray-500 mb-2">(Select the City you will like to Host your event)</p>
                <select
                  name="eventCity"
                  value={formData.eventCity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                >
                  <option value="">Select City</option>
                  <option value="surulere">Surulere</option>
                  <option value="victoria-island">Victoria Island</option>
                  <option value="ikoyi">Ikoyi</option>
                  <option value="lekki">Lekki</option>
                  <option value="maitama">Maitama</option>
                  <option value="asokoro">Asokoro</option>
                </select>
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Guests
                </label>
                <select
                  name="numberOfGuests"
                  value={formData.numberOfGuests}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                >
                  <option value="">Select</option>
                  {Array.from({ length: 50 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num.toString()}>{num}</option>
                  ))}
                </select>
              </div>

              {/* Services Needed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Services Needed
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.servicesNeeded.map((service, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                      {service}
                      <button 
                        type="button"
                        onClick={() => handleServiceRemove(service)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleServiceAdd(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="">Add Service</option>
                  <option value="Small Chop Vendors">Small Chop Vendors</option>
                  <option value="Cake Bakers">Cake Bakers</option>
                  <option value="Photography">Photography</option>
                  <option value="Decoration">Decoration</option>
                  <option value="Music & Entertainment">Music & Entertainment</option>
                  <option value="Makeup & Beauty">Makeup & Beauty</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Catering">Catering</option>
                </select>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range
                </label>
                <input
                  type="text"
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="e.g N100,000 - N200,000"
                  required
                />
              </div>
            </div>

            {/* Right Column - File Upload & Additional Information */}
            <div className="space-y-6">
              {/* File Upload Section */}
              <div>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">Choose a file or drag & drop it here</p>
                  <p className="text-xs text-gray-500 mb-4">JPEG, PNG, PDF, and MP4 formats, up to 50MB</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse File
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".jpeg,.jpg,.png,.pdf,.mp4"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500">Size: {formatFileSize(file.size)}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Mock existing files as shown in image */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700">Cake Image.jpeg</span>
                      <span className="text-xs text-gray-500">Size: 854kb</span>
                    </div>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700">Cake Image.jpeg</span>
                      <span className="text-xs text-gray-500">Size: 854kb</span>
                    </div>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information
                </label>
                <textarea
                  name="additionalInformation"
                  value={formData.additionalInformation}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                  placeholder="Enter here"
                />
              </div>

              {/* Event Planner Question */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Would you like an Event planner to organize your event?
                </label>
                <select
                  name="eventPlanner"
                  value={formData.eventPlanner}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Event Timeline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Timeline
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.startDate}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        readOnly
                      />
                      <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">End Date</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.endDate}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        readOnly
                      />
                      <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className={`w-full max-w-md py-4 rounded-lg font-medium transition-colors ${
                isFormValid() && !isSubmitting
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating Request...
                </div>
              ) : (
                'Request Service'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditServiceRequestModal;
