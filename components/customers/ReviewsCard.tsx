import React from "react";
import { CheckCircleFilled, CustomerServiceFilled } from "@ant-design/icons";
import { Edit2Icon, Eye, MessageCircle, Star, Trash2, User } from "lucide-react";
import Image from "next/image";
import { EventRequestProps } from "@/types/directrequesttypes"; // <-- from your types.ts



interface ReviewsCardProps extends EventRequestProps {
  onEdit: () => void;
}
const ReviewsCard: React.FC<EventRequestProps> = ({
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
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      {/* Main Content - Two Columns */}
      <div className=" flex  flex-col gap-4 ">
        {/* Left Column */}
        <div className="space-y-4 w-full  ">
          {/* Event Image */}
          <div className="flex items-center flex-row  mb-4 border-event-blue border-b-[4px] ">
          <div className="w-[222px] h-[155px] aspect-square rounded-lg overflow-hidden  mr-4 mb-4">
            <img
             src={images?.[0] ?? "/images/places.jpg"} // first image
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full  ">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6 ">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">
                   {organizer?.initials ?? "NA"}
                  </span>
                </div>
                <span className="font-medium text-gray-800 underline">
                {organizer?.name ?? "Unknown Organizer"}
                </span>
              </div>
              <span className="text-md text-gray-500 font-heading">
                {postedTime}
              </span>
            </div>

            <div className="flex items-center justify-between ">
              <h2 className="text-xl font-bold font-heading text-gray-900 mb-4">
                {title}
              </h2>
              <div className="flex items-center gap-3">
                <button className="text-white bg-event-blue rounded-md border-event-blue border p-1"
                 onClick={onEdit} >
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button className="text-event-blue  bg-yellow border rounded-md p-1">
                  <CustomerServiceFilled className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Total Visit
          <div className="flex justify-between items-center py-4 ">
            <span className="font-medium text-gray-700">Total Visit</span>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-event-blue">
              <CheckCircleFilled className="text-white text-[16px] font-medium inline-block" />
              <span className="text-white text-[16px] font-sans font-medium">
                {totalVisits}
              </span>
            </div>
          </div> */}

          {/* Rating
          <div className="space-y-6">
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
          </div> */}

          {/* Viewed Status
          <button className="w-full flex items-center justify-center gap-2 bg-event-blue text-white px-4 py-2 my-4 rounded-lg font-medium transition-colors">
            <Eye className="w-5 h-5" />
            {viewedStatus}
          </button> */}

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
        </div>

        {/* Right Column */}
        

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

          <div className="py-3 border-b border-gray-100 flex justify-between items-start">
            <div className="flex justify-between items-start mb-3">
              <span className="font-medium text-gray-600 font-sans">Services Needed:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {services.map((service, i) => (
                <span
                  key={i}
                  className="bg-event-blue text-white text-sm px-4 py-2 rounded-lg"
                >
                  {service}
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
              <span className="font-medium font-sans text-gray-600">
                Additional Information
              </span>
            </div>
            <p className="text-gray-600 font-normal font-sans leading-relaxed">
              {additionalInfo}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsCard;