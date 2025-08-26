'use client';

import React, { useState } from 'react';
import { Upload, X, FileText, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SupportHistory } from '@/components/customers/SupportHistory';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { SupportTicket } from '@/types/message';
import { ClockCircleOutlined, DeleteOutlined } from '@ant-design/icons';

const HelpSupportComponent = () => {
  const [formData, setFormData] = useState<SupportTicket>({
    category: '',
    issueType: '',
    eventVendor: '',
    eventPlanner: '',
    description: '',
    attachments: []
  });

  const [isDragOver, setIsDragOver] = useState(false);
const [showSupportHistory, setShowSupportHistory] = useState(false);
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files).filter(file => {
      // Limit file size to 10MB
      return file.size <= 10 * 1024 * 1024;
    });
    
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newFiles]
    }));
  };

  const handleRemoveFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Support ticket submitted:', formData);
    
    // Reset form
    setFormData({
      category: '',
      issueType: '',
      eventVendor: '',
      eventPlanner: '',
      description: '',
      attachments: []
    });
    
    alert('Support ticket submitted successfully!');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="  mt-0 mb-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 font-heading ">Help & Support</h1>
        

          
        <Button  className="text-white font-heading flex items-center gap-1bg-event-blue hover:bg-blue-900 px-2 py-2"
        // onClick={() => setShowSupportHistory(true)}
         >
          <ClockCircleOutlined className=" h-5 w-5 " />
          View Support History
        </Button>
        
      </div>

      {/* Form */}
      <Card>
        <CardContent className="p-6 shadow-none ">
          <h2 className="text-lg font-semibold  font-heading text-event-blue mb-6">Send us a message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category */}
            <div>
              <Label htmlFor="category" className="text-md font-semibold font-heading text-gray-800">
                Category
              </Label>
              <Select value={formData.category} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, category: value }))
              }>
                <SelectTrigger className="mt-1 font-sans font-normal ">
                  <SelectValue placeholder="Dispute" />
                </SelectTrigger>
                <SelectContent className="font-sans font-semibold text-md text-gray-800  ">
                  <SelectItem value="enquiry ">Enquiry </SelectItem>
                  <SelectItem value="dispute">Dispute</SelectItem>
                  <SelectItem value="services ">Services</SelectItem>
                  <SelectItem value="vendors">Vendors</SelectItem>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="general">General Inquiry</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Issue Type */}
            <div>
              <Label htmlFor="issueType" className="text-md font-semibold font-heading text-gray-800">
                Issue Type
              </Label>
              <Select value={formData.issueType} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, issueType: value }))
              }>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Payment Issue" />
                </SelectTrigger>
                <SelectContent className="font-sans font-semibold text-md text-gray-800  ">
                  <SelectItem value="payment">Payment Issue</SelectItem>
                  <SelectItem value="service">Service Quality</SelectItem>
                  <SelectItem value="cancellation">Cancellation</SelectItem>
                  <SelectItem value="refund">Refund Request</SelectItem>
                  <SelectItem value="contract">Contract Dispute</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Select Event/Vendor */}
            <div>
              <Label htmlFor="eventVendor" className="text-md  font-semibold font-heading text-gray-800">
                Select Event/Vendor <span className="text-gray-400">(Optional)</span>
              </Label>
              <Select value={formData.eventVendor} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, eventVendor: value }))
              }>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="UK Cakes & Cream - Catering" />
                </SelectTrigger>
                <SelectContent className="font-sans font-semibold text-md text-gray-800  ">
                  <SelectItem value="uk-cakes-cream">UK Cakes & Cream - Catering</SelectItem>
                  <SelectItem value="royal-venues">Royal Venues - Venue</SelectItem>
                  <SelectItem value="melody-sounds">Melody Sounds - DJ</SelectItem>
                  <SelectItem value="perfect-shots">Perfect Shots - Photography</SelectItem>
                  <SelectItem value="bloom-flowers">Bloom & Flowers - Decoration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Select Event Planner */}
            <div>
              <Label htmlFor="eventPlanner" className="text-md font-semibold  text-gray-800">
                Select Event Planner <span className="text-gray-400">(Optional)</span>
              </Label>
              <Select value={formData.eventPlanner} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, eventPlanner: value }))
              }>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Daniel Adebayo" />
                </SelectTrigger>
                <SelectContent className="font-sans font-semibold text-md text-gray-800    ">
                  <SelectItem value="daniel-adebayo">Daniel Adebayo</SelectItem>
                  <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="michael-brown">Michael Brown</SelectItem>
                  <SelectItem value="habeeb-planner">Habeeb Event Planner</SelectItem>
                  <SelectItem value="grace-events">Grace Events Co.</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* File Upload */}
            <div>
              {/* <Label className="text-md font-heading font-semibold  text-gray-800 mb-3 block">
                Attachments
              </Label> */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className="space-y-2">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Upload className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-md font-sans font-medium  text-gray-800">Choose a file or drag & drop it here</p>
                    <p className="text-sm  text-gray-500 mt-1">
                      JPEG, PNG, PDF, MP4 formats, up to 50MB
                    </p>
                  </div>
                  <Button 
                    type="button" 
                    className="bg-event-blue hover:bg-blue-900 mt-5 my-2 md:px-16 py-2 text-white font-heading"
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    Browse File
                  </Button>
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf,.mp4"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Uploaded Files */}
              {formData.attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-none rounded-lg">
                      <div className="flex items-center gap-3">
                        
                        <div>
                          <p className="text-md font-sans font-medium text-gray-600">{file.name}</p>
                          
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center gap-1"
                      >
                         <p className="text-md font-sans  text-gray-400">Size:{formatFileSize(file.size)}</p>
                        <DeleteOutlined className="h-5 w-5" />
                       
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="shadow-none">
              <Label htmlFor="description" className="text-md font-heading font-semibold text-gray-800">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter your message"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 min-h-[110px] resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end ">
              <Button 
                type="submit" 
                className="bg-event-blue hover:bg-blue-900 px-12 md:w-40  py-2"
              >
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

       {/* Conditionally render component */}
      {showSupportHistory && (
        <div className="mt-4">
          <SupportHistory />
        </div>
      )}
    </div>
  );
};

export default HelpSupportComponent;