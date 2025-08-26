// app/(account)/dashboard/direct-request/DirectRequestClient.tsx
'use client';

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import DirectRequestCard from '@/components/customers/DirectRequest';
import { selectMenuItem } from '@/store/dashboardSlice';
import Navbar from '@/components/customers/Headerswitch';
import { mockRequests } from '@/data/directrequest';
import { EventRequestProps } from '@/types/directrequesttypes';
import { useState } from 'react';
import EditDirectRequestModal from '@/components/customers/DirectRequestEditForm';
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
  const dispatch = useDispatch();

  useEffect(() => {
    // Sync Redux state with current page
    dispatch(
      selectMenuItem({
        view: 'direct-request',
        breadcrumb: { label: 'Direct Requests', path: '/dashboard/direct-request' },
      })
    );
  }, [dispatch]);

  return (
    <div className=" container min-h-screen bg-[#fff]">
      <section className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">
            <Navbar activePage="/direct-request" onPageChange={() => {}} />
        </h1>
        <div className=" p-4 space-y-6 ">
         {
         requests.map((event) => (
        <DirectRequestCard
         key={event.id} 
         {...event}
         onEdit={() => handleEditClick(event)}
         onServiceDelete={(serviceIndex) => handleServiceDelete(event.id, serviceIndex)}
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
       