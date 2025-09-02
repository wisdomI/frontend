// app/(account)/dashboard/direct-request/DirectRequestClient.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import ServiceCard from '@/components/ui/ServiceCard';
import { selectMenuItem } from '@/store/dashboardSlice';
import Navbar from '@/components/customers/Headerswitch';
import { mockRequests } from '@/data/directrequest';
import { EventRequestProps } from '@/types/directrequesttypes';

import EditDirectRequestModal from '@/components/customers/DirectRequestEditForm';
import ServiceRequestCard from '@/components/customers/ServiceRequest';
export default function ServiceRequestClient() {
  const [requests, setRequests] = useState<EventRequestProps[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<EventRequestProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleEditClick = (request: EventRequestProps) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleSave = (updatedRequest: EventRequestProps) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === updatedRequest.id ? updatedRequest : r))
    );
  };

  const handleServiceDelete = (requestId: string, serviceIndex: number) => {
    setRequests((prev) =>
      prev.map((request) => {
        if (request.id === requestId) {
          const updatedServices = request.services.filter((_, index) => index !== serviceIndex);
          return { ...request, services: updatedServices };
        }
        return request;
      })
    );
  };

  const handleViewOffers = (request: EventRequestProps) => {
    router.push(`/dashboard/service-requests/offers?title=${encodeURIComponent(request.title)}&id=${request.id}`);
  };

  useEffect(() => {
    // Sync Redux state with current page
    dispatch(
      selectMenuItem({
        view: 'service-requests',
        breadcrumb: { label: 'Service Requests', path: '/dashboard/service-requests' },
      })
    );
  }, [dispatch]);

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Page Header */}
      {/* <h1 className="text-[20px] font-semibold font-heading text-gray-900 mb-4">Manage all Posts</h1> */}
      
      {/* Header Switch Navigation */}
      <Navbar activePage="/service-requests" onPageChange={() => {}} />
      
      {/* Content Area */}
      <div className="space-y-6">
        {requests.map((event) => (
          <ServiceRequestCard
            key={event.id} 
            {...event}
            onEdit={() => handleEditClick(event)}
            onServiceDelete={(serviceIndex) => handleServiceDelete(event.id, serviceIndex)}
            onViewOffers={() => handleViewOffers(event)}
          />
        ))}
        
        <EditDirectRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          requestData={selectedRequest}
          onSave={handleSave}
          modalTitle="Edit Service Request Post"
        />
      </div>
    </div>
  );
}
       