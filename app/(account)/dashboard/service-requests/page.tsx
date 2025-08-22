// app/(account)/dashboard/direct-request/DirectRequestClient.tsx
'use client';

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ServiceCard from '@/components/ui/ServiceCard';
import { selectMenuItem } from '@/store/dashboardSlice';
import Navbar from '@/components/customers/Headerswitch';
import { mockRequests } from '@/data/directrequest';
import { EventRequestProps } from '@/types/directrequesttypes';
import { useState } from 'react';
import EditDirectRequestModal from '@/components/customers/DirectRequestEditForm';
import ServiceRequestCard from '@/components/customers/ServiceRequest';
export default function DirectRequestClient() {

const [requests, setRequests] = useState<EventRequestProps[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<EventRequestProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = (request: EventRequestProps) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleSave = (updatedRequest: EventRequestProps) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === updatedRequest.id ? updatedRequest : r))
    );

  }
  const dispatch = useDispatch();

  useEffect(() => {
    // Sync Redux state with current page
    dispatch(
      selectMenuItem({
        view: 'direct-request',
        breadcrumb: { label: ' Service Request', path: '/dashboard/service-request' },
      })
    );
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#fff]">
      <section className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">
            <Navbar activePage="/direct-request" onPageChange={() => {}} />
        </h1>
        <div className=" bg-gray-50 p-4 space-y-6 ">
         {
         requests.map((event) => (
        <ServiceRequestCard
         key={event.id} 
         {...event}
          // onEdit={() => handleEditClick(event)}
         
         />
      ))}
      <EditDirectRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        requestData={selectedRequest}
        onSave={handleSave}
      />
        </div>
      </section>
    </div>
  );
}
       