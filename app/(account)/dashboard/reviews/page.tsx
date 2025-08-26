// 'use client';

// import React, { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import DirectRequestCard from '@/components/customers/DirectRequest';
// import { selectMenuItem } from '@/store/dashboardSlice';
// import Navbar from '@/components/customers/Headerswitch';
// import { mockRequests } from '@/data/directrequest';
// import { EventRequestProps } from '@/types/directrequesttypes';
// import { useState } from 'react';
// import EditDirectRequestModal from '@/components/customers/DirectRequestEditForm';
// export default function DirectRequestClient() {

// const [requests, setRequests] = useState<EventRequestProps[]>(mockRequests);
//   const [selectedRequest, setSelectedRequest] = useState<EventRequestProps | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleEditClick = (request: EventRequestProps) => {
//     setSelectedRequest(request);
//     setIsModalOpen(true);
//   };

//   const handleSave = (updatedRequest: EventRequestProps) => {
//     setRequests((prev) =>
//       prev.map((r) => (r.id === updatedRequest.id ? updatedRequest : r))
//     );

//   }
//   const dispatch = useDispatch();

//   useEffect(() => {
//     // Sync Redux state with current page
//     dispatch(
//       selectMenuItem({
//         view: 'direct-request',
//         breadcrumb: { label: 'Reviews & Ratings', path: '/dashboard/reviews' },
//       })
//     );
//   }, [dispatch]);

//   return (
//    <div className="  mt-0 mb-6 bg-white">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <h1 className="text-2xl font-semibold text-gray-800 font-heading ">Reviews & Ratings</h1>

//         </div>
//         </div>
//   );
// }
       
// app/(account)/dashboard/direct-request/DirectRequestClient.tsx
'use client';

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ReviewsCard from '@/components/customers/ReviewsCard';
import { selectMenuItem } from '@/store/dashboardSlice';
import Navbar from '@/components/customers/Headerswitch';
import { mockRequests } from '@/data/directrequest';
import { EventRequestProps } from '@/types/directrequesttypes';
import { useState } from 'react';

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
        breadcrumb: { label: 'Direct Requests', path: '/dashboard/direct-request' },
      })
    );
  }, [dispatch]);

  return (
    <div className="  mt-0 mb-6 bg-white">
      {/* Header */}
    <div className="flex items-center justify-between mb-8">
         <h1 className="text-2xl font-semibold text-gray-800 font-heading ">Reviews & Ratings</h1>
       </div>

       <div className=" bg-gray-50 p-4 space-y-6 ">
         {
         requests.map((event) => (
        <ReviewsCard
         key={event.id} 
         {...event}
          onEdit={() => handleEditClick(event)}
         
         />
      ))}
       </div>
        
        
      
        </div>
     
  );
}
       