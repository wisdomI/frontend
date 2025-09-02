import React from "react";
import { CheckCircleFilled } from "@ant-design/icons";
import { EditIcon, Eye, Star, Trash2, User } from "lucide-react";
import Image from "next/image";
import { EventRequestProps } from "@/types/directrequesttypes"; // <-- from your types.ts



interface DirectRequestCardProps extends EventRequestProps {
  onEdit: () => void;
  onServiceDelete?: (serviceIndex: number) => void;
}
const DirectRequestCard: React.FC<EventRequestProps> = ({
  id,
  title,
  postedTime,
  organizer,
  images,
  totalVisits,
  rating,
  ratingCount,
  viewedStatus,
  plannerAssigned,
  eventType,
  eventDate,
  eventLocation,
  guests,
  services,
  budget,
  additionalInfo,
  }, { onEdit, ...props }  )   => {


  return (
    <div className="bg-[#fff] border border-gray-200 rounded-xl shadow-sm p-6 mb-4">
      {/* Main Content - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 ">
        {/* Left Column */}
        <div className="space-y-4 col-span-1">
          {/* Event Image */}
          <div className="w-[237px] h-[235px] aspect-square rounded-lg overflow-hidden   mr-6 ">
            <img
             src={images?.[0] ?? "/images/places.jpg"} // first image
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Total Visit */}
          <div className="flex justify-between items-center  ">
            <span className="font-medium text-gray-700">Total Visit</span>
            <div className="flex items-center gap-2 px-4 py-1 rounded-xl bg-event-blue">
              <CheckCircleFilled className="text-white text-[16px] font-medium inline-block" />
              <span className="text-white text-[16px] font-sans font-medium">
                {totalVisits}
              </span>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <div className="flex justify-between items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700 font-sans">Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= rating ? "fill-yellow text-yellow" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-gray-700 font-sans font-medium">
                ({ratingCount})
              </span>
            </div>
          </div>

          {/* Viewed Status */}
          <button className="w-full flex items-center justify-center gap-2 bg-event-blue text-white px-4 py-1  rounded-lg font-medium transition-colors">
            <Eye className="w-5 h-5" />
            {viewedStatus}
          </button>

          {/* Event Planner Assigned */}
          {/* <div className="space-y-2 py-2 flex items-center justify-between flex-col">
            <span className="font-medium text-gray-700 font-sans">
              Event planner Assigned:
            </span>
            <button className="mt-0 w-full bg-yellow text-blue-900 px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors underline">
              <User className="w-5 h-5" />
              {plannerAssigned}
            </button>
          </div> */}
        </div>

        {/* Right Column */}
        <div className="col-span-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">
                   {organizer?.initials ?? "NA"}
                  </span>
                </div>
                <span className="font-semibold font-heading tetx-[18px]  text-event-blue underline">
                {organizer?.name ?? "Unknown Organizer"}
                </span>
              </div>
              <span className="text-md text-gray-500 font-heading">
                {postedTime}
              </span>
            </div>

            <div className="flex items-center justify-between border-event-blue border-b-[4px]">
              <h2 className="text-xl font-bold font-heading text-gray-900 mb-4">
                {title}
              </h2>
              <div className="flex items-center gap-3">
                <button className="text-white bg-event-blue rounded-md border-event-blue border p-1"
                 onClick={onEdit} >
                  <EditIcon className="w-4 h-4" />
                </button>
                <button className="text-red-500 border-red-500 border rounded-md p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="flex justify-between items-center py-1 border-b border-gray-100">
            <span className="font-medium text-gray-600 font-sans">Event Type:</span>
            <span className="font-normal text-gray-600 font-sans">{eventType}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-gray-100">
            <span className="font-medium text-gray-600 font-sans">Event Date:</span>
            <span className="font-normal text-gray-600 font-sans">{eventDate}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-gray-100">
            <span className="font-medium text-gray-600 font-sans">Event Location:</span>
            <span className="font-normal text-gray-600 font-sans">{eventLocation}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-gray-100">
            <span className="font-medium text-gray-600 font-sans">No. of Guests:</span>
            <span className="font-normal text-gray-600 font-sans">{guests}</span>
          </div>

          <div className="py-2 border-b border-gray-100 flex justify-between items-start">
            <div className="flex justify-between items-start mb-3">
              <span className="font-medium text-gray-600 font-sans">Services Needed:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {services.map((service, i) => (
                <span
                  key={i}
                  className="bg-event-blue text-white text-sm px-4 py-1 rounded-lg"
                >
                  {service}
                  {/* {onServiceDelete && (
                    <button
                      onClick={() => onServiceDelete(i)}
                      className="text-white hover:text-red-200 ml-1"
                    >
                      ×
                    </button>
                  )} */}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-gray-100">
            <span className="font-medium text-gray-600">Budget</span>
            <span className="text-gray-800 font-semibold">{budget}</span>
          </div>

          <div className="py-3 flex justify-between items-start">
            <div className="mb-2">
              <span className="font-medium font-sans text-gray-800">
                Additional Information
              </span>
            </div>
            <p className="text-gray-800 font-normal font-sans leading-relaxed">
              {additionalInfo}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectRequestCard;


//  <div className="flex justify-between items-start">
        
//         <div className="flex items-center gap-4 justify-between h-40">
//           <Image
//             src="/images/cake1.jpg" // replace with your actual logo
//             alt="logo"
//             width={120}
//             height={120}
//             className="rounded-full"
//           />
//           <span className="text-sm font-medium">SR Cakes & Cream</span>
//         </div>
//         <div className="flex items-center gap-3">
//           <span className="text-xs text-gray-500">Posted 17 hours ago</span>
//           <button className="text-red-500 hover:text-red-700">
//             <Trash2 className="w-4 h-4" />
//           </button>
//         </div>
//       </div> 

//       {/* Title */}
//       <h3 className="text-base font-semibold mt-2">Baby Linda’s Birthday Party</h3>

//       {/* Event Details */}
//       <div className="mt-3 text-sm text-gray-700">
//         <p>
//           <span className="font-medium">Event Type:</span> Social Event (Wedding, Birthday)
//         </p>
//         <p>
//           <span className="font-medium">Event Date:</span> 12th May, 2025
//         </p>
//         <p>
//           <span className="font-medium">Event Location:</span> Surulere, Lagos State
//         </p>
//         <p>
//           <span className="font-medium">No. of Guests:</span> 14
//         </p>
//       </div>

//       {/* Services */}
//       <div className="mt-3 flex flex-wrap gap-2">
//         <span className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full">
//           Small Chop Vendors
//         </span>
//         <span className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full">
//           Cake Bakers
//         </span>
//       </div>

//       {/* Budget */}
//       <p className="mt-3 text-sm text-gray-700">
//         <span className="font-medium">Budget:</span> ₦100,000 - ₦200,000
//       </p>

//       {/* Additional Info */}
//       <p className="mt-2 text-sm text-gray-600 italic">
//         We need milky flavoured cake and some Cherry as toppings
//       </p>

//       {/* Footer */}
//       <div className="mt-4 flex justify-between items-center">
//         <div className="flex items-center gap-2">
//           <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1.5 rounded-lg">
//             View all Offers
//           </button>
//           <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-lg">
//             120 Visits
//           </span>
//         </div>
//         <button className="bg-yellow-400 hover:bg-yellow-500 text-sm px-4 py-1.5 rounded-lg font-medium">
//           Esther Audu
//         </button>
//       </div> 