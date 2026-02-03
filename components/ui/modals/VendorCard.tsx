'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { FaStar, FaRegStar } from 'react-icons/fa'
import { BsHeart } from 'react-icons/bs'
import { HiShare } from 'react-icons/hi2'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import vendorImage from '../../../public/images/vendor-img1.jpg'
import vendorImage2 from '../../../public/images/vendor-img2.jpg'

type VendorCardProps = {
  id: string
  verified: boolean
  title: string
  vendorName: string
  rating: number
  reviews: number
  location: string
  view?: string
}

const VendorCard: React.FC<VendorCardProps> = ({
  id,
  verified,
  title,
  vendorName,
  rating,
  reviews,
  location,
  view
}) => {
  const router = useRouter()
  
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) =>
      i < rating ? (
        <FaStar key={i} className="text-yellow-400" />
      ) : (
        <FaRegStar key={i} className="text-gray-300" />
      )
    )
  }

  const [current, setCurrent] = useState(0)
  const images = [vendorImage, vendorImage2, vendorImage] 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="flex">
        {/* Image Section - Left Side */}
        <div className="relative w-80 h-56 flex-shrink-0">
          <Image
            src={images[current]}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          
          {/* Image carousel indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <span
                key={index}
                className={`w-2 h-2 rounded-full ${
                  current === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Verified Badge - Top Left */}
          {verified && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-event-blue text-white text-xs px-3 py-1.5 rounded-full font-medium">
              <svg
                width="14"
                height="14"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.71012 1.38266C7.80506 1.26421 7.92541 1.16861 8.06226 1.10291C8.19911 1.03722 8.34898 1.00311 8.50078 1.00311C8.65259 1.00311 8.80245 1.03722 8.9393 1.10291C9.07616 1.16861 9.1965 1.26421 9.29145 1.38266L10.2314 2.55266C10.3382 2.68526 10.4765 2.78884 10.6338 2.85386C10.7911 2.91887 10.9623 2.94322 11.1314 2.92466L12.6228 2.76266C12.7734 2.74641 12.9258 2.76416 13.0687 2.81458C13.2116 2.86501 13.3413 2.94684 13.4484 3.05404C13.5555 3.16124 13.6371 3.29109 13.6874 3.43403C13.7376 3.57697 13.7552 3.72936 13.7388 3.87999L13.5761 5.37066C13.5577 5.53996 13.5823 5.71117 13.6475 5.86847C13.7128 6.02577 13.8166 6.1641 13.9494 6.27066L15.1181 7.20999C15.2366 7.30493 15.3322 7.42528 15.3979 7.56213C15.4636 7.69899 15.4977 7.84885 15.4977 8.00066C15.4977 8.15246 15.4636 8.30232 15.3979 8.43918C15.3322 8.57603 15.2366 8.69638 15.1181 8.79132L13.9488 9.73132C13.816 9.83782 13.7123 9.97603 13.647 10.1332C13.5818 10.2904 13.5572 10.4615 13.5754 10.6307L13.7388 12.122C13.7549 12.2726 13.737 12.425 13.6866 12.5678C13.6361 12.7107 13.5543 12.8404 13.4471 12.9475C13.34 13.0546 13.2102 13.1363 13.0673 13.1867C12.9244 13.2371 12.7721 13.2548 12.6214 13.2387L11.1301 13.0767C10.9609 13.0582 10.7897 13.0826 10.6324 13.1478C10.4751 13.2129 10.3367 13.3166 10.2301 13.4493L9.29145 14.6173C9.19665 14.736 9.07635 14.8318 8.93948 14.8976C8.80261 14.9635 8.65267 14.9977 8.50078 14.9977C8.3489 14.9977 8.19896 14.9635 8.06209 14.8976C7.92521 14.8318 7.80492 14.736 7.71012 14.6173L6.77145 13.448C6.66489 13.3151 6.52657 13.2113 6.36926 13.1461C6.21196 13.0808 6.04075 13.0562 5.87145 13.0747L4.38012 13.2373C4.22948 13.2537 4.0771 13.236 3.93419 13.1857C3.79128 13.1353 3.66148 13.0536 3.55434 12.9464C3.4472 12.8393 3.36545 12.7095 3.31511 12.5666C3.26477 12.4237 3.24712 12.2713 3.26345 12.1207L3.42545 10.6293C3.44382 10.4602 3.41931 10.2891 3.35418 10.132C3.28905 9.9748 3.1854 9.83656 3.05278 9.72999L1.88345 8.79132C1.765 8.69638 1.6694 8.57603 1.60371 8.43918C1.53801 8.30232 1.50391 8.15246 1.50391 8.00066C1.50391 7.84885 1.53801 7.69899 1.60371 7.56213C1.6694 7.42528 1.765 7.30493 1.88345 7.20999L3.05278 6.27066C3.18562 6.1641 3.28947 6.02577 3.35472 5.86847C3.41997 5.71117 3.44453 5.53996 3.42612 5.37066L3.26278 3.87999C3.24634 3.7293 3.26391 3.57685 3.31421 3.43385C3.3645 3.29086 3.44624 3.16097 3.55339 3.05375C3.66054 2.94654 3.79038 2.86473 3.93334 2.81435C4.07631 2.76397 4.22875 2.7463 4.37945 2.76266L5.87078 2.92466C6.03997 2.94322 6.2111 2.91887 6.3684 2.85386C6.52569 2.78884 6.66408 2.68526 6.77078 2.55266L7.71012 1.38266Z"
                  fill="#FFEF5E"
                />
                <path
                  d="M3.55412 12.9467C3.44699 12.8395 3.36526 12.7096 3.31496 12.5667C3.26465 12.4237 3.24705 12.2713 3.26345 12.1207L3.42545 10.6293C3.44382 10.4602 3.41931 10.2891 3.35418 10.132C3.28905 9.9748 3.1854 9.83656 3.05278 9.72999L1.88345 8.79132C1.765 8.69638 1.6694 8.57603 1.60371 8.43918C1.53801 8.30232 1.50391 8.15246 1.50391 8.00066C1.50391 7.84885 1.53801 7.69899 1.60371 7.56213C1.6694 7.42528 1.765 7.30493 1.88345 7.20999L3.05278 6.27066C3.18562 6.1641 3.28947 6.02577 3.35472 5.86847C3.41997 5.71117 3.44453 5.53996 3.42612 5.37066L3.26278 3.87999C3.24634 3.7293 3.26391 3.57685 3.31421 3.43385C3.3645 3.29086 3.44624 3.16097 3.55339 3.05375C3.66054 2.94654 3.79038 2.86473 3.93334 2.81435C4.07631 2.76397 4.22875 2.7463 4.37945 2.76266L5.87078 2.92466C6.03997 2.94322 6.2111 2.91887 6.3684 2.85386C6.52569 2.78884 6.66408 2.68526 6.77078 2.55266L7.70945 1.38266C7.80439 1.26421 7.92474 1.16861 8.06159 1.10291C8.19845 1.03722 8.34831 1.00311 8.50012 1.00311C8.65192 1.00311 8.80178 1.03722 8.93864 1.10291C9.07549 1.16861 9.19584 1.26421 9.29078 1.38266L10.2308 2.55266C10.3375 2.68526 10.4759 2.78884 10.6332 2.85386C10.7905 2.91887 10.9616 2.94322 11.1308 2.92466L12.6221 2.76266C12.7729 2.74624 12.9255 2.7639 13.0686 2.81432C13.2117 2.86474 13.3416 2.94665 13.4488 3.05399L3.55412 12.9467Z"
                  fill="#FFF9BF"
                />
                <path
                  d="M7.71012 1.38266C7.80506 1.26421 7.92541 1.16861 8.06226 1.10291C8.19911 1.03722 8.34898 1.00311 8.50078 1.00311C8.65259 1.00311 8.80245 1.03722 8.9393 1.10291C9.07616 1.16861 9.1965 1.26421 9.29145 1.38266L10.2314 2.55266C10.3382 2.68526 10.4765 2.78884 10.6338 2.85386C10.7911 2.91887 10.9623 2.94322 11.1314 2.92466L12.6228 2.76266C12.7734 2.74641 12.9258 2.76416 13.0687 2.81458C13.2116 2.86501 13.3413 2.94684 13.4484 3.05404C13.5555 3.16124 13.6371 3.29109 13.6874 3.43403C13.7376 3.57697 13.7552 3.72936 13.7388 3.87999L13.5761 5.37066C13.5577 5.53996 13.5823 5.71117 13.6475 5.86847C13.7128 6.02577 13.8166 6.1641 13.9494 6.27066L15.1181 7.20999C15.2366 7.30493 15.3322 7.42528 15.3979 7.56213C15.4636 7.69899 15.4977 7.84885 15.4977 8.00066C15.4977 8.15246 15.4636 8.30232 15.3979 8.43918C15.3322 8.57603 15.2366 8.69638 15.1181 8.79132L13.9488 9.73132C13.816 9.83782 13.7123 9.97603 13.647 10.1332C13.5818 10.2904 13.5572 10.4615 13.5754 10.6307L13.7388 12.122C13.7549 12.2726 13.737 12.425 13.6866 12.5678C13.6361 12.7107 13.5543 12.8404 13.4471 12.9475C13.34 13.0546 13.2102 13.1363 13.0673 13.1867C12.9244 13.2371 12.7721 13.2548 12.6214 13.2387L11.1301 13.0767C10.9609 13.0582 10.7897 13.0826 10.6324 13.1478C10.4751 13.2129 10.3367 13.3166 10.2301 13.4493L9.29145 14.6173C9.19665 14.736 9.07635 14.8318 8.93948 14.8976C8.8026 14.9635 8.65267 14.9977 8.50078 14.9977C8.3489 14.9977 8.19896 14.9635 8.06209 14.8976C7.92521 14.8318 7.80492 14.736 7.71012 14.6173L6.77145 13.448C6.66489 13.3151 6.52657 13.2113 6.36926 13.1461C6.21196 13.0808 6.04075 13.0562 5.87145 13.0747L4.38012 13.2373C4.22948 13.2537 4.0771 13.236 3.93419 13.1857C3.79128 13.1353 3.66148 13.0536 3.55434 12.9464C3.4472 12.8393 3.36545 12.7095 3.31511 12.5666C3.26477 12.4237 3.24712 12.2713 3.26345 12.1207L3.42545 10.6293C3.44382 10.4602 3.41931 10.2891 3.35418 10.132C3.28906 9.9748 3.1854 9.83656 3.05278 9.72999L1.88345 8.79132C1.765 8.69638 1.6694 8.57603 1.60371 8.43918C1.53801 8.30232 1.50391 8.15246 1.50391 8.00066C1.50391 7.84885 1.53801 7.69899 1.60371 7.56213C1.6694 7.42528 1.765 7.30493 1.88345 7.20999L3.05278 6.27066C3.18562 6.1641 3.28947 6.02577 3.35472 5.86847C3.41997 5.71117 3.44453 5.53996 3.42612 5.37066L3.26278 3.87999C3.24634 3.7293 3.26391 3.57685 3.31421 3.43385C3.3645 3.29086 3.44624 3.16097 3.55339 3.05375C3.66054 2.94654 3.79038 2.86473 3.93334 2.81435C4.07631 2.76397 4.22875 2.7463 4.37945 2.76266L5.87078 2.92466C6.03997 2.94322 6.2111 2.91887 6.3684 2.85386C6.52569 2.78884 6.66408 2.68526 6.77078 2.55266L7.71012 1.38266Z"
                  stroke="#191919"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.9335 6.47998L8.45753 9.77998C8.41751 9.83346 8.36649 9.87772 8.30789 9.90978C8.2493 9.94183 8.18451 9.96094 8.1179 9.96581C8.05129 9.97068 7.98441 9.96119 7.92178 9.93798C7.85915 9.91478 7.80223 9.8784 7.75486 9.83131L6.26953 8.34465"
                  stroke="#191919"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Verified
            </div>
          )}

          {/* Best Valued Badge - Top Right */}
          <div className="absolute top-3 right-3 bg-event-blue text-white text-xs px-3 py-1.5 rounded-full font-medium">
            Best Valued
          </div>
        </div>

        {/* Content Section - Right Side */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          {/* Top Section: Title and Action Icons */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start justify-between pr-4 flex-1">
              <h3 className="text-xl font-bold text-gray-900 flex-1">{title}</h3>
              <div className="ml-2 flex-shrink-0">
                <Image 
                  src="/Diamond.svg" 
                  alt="Diamond" 
                  width={16} 
                  height={16}
                  className="w-4 h-4"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-event-blue text-white rounded-lg hover:bg-event-blue-hover transition-colors">
                <IoChatbubbleEllipsesOutline className="w-4 h-4" />
              </button>
              <button className="p-2 bg-event-blue text-white rounded-lg hover:bg-event-blue-hover transition-colors">
                <BsHeart className="w-4 h-4" />
              </button>
              <button className="p-2 bg-event-blue text-white rounded-lg hover:bg-event-blue-hover transition-colors">
                <HiShare className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Middle Section: Vendor Name */}
          <p className="text-blue-600 font-semibold text-sm mb-4">{vendorName}</p>

          {/* Bottom Section: Rating, Location, and View Details Button */}
          <div className="space-y-3">
            {/* Rating */}
            <div className="flex items-center gap-2 text-gray-600 text-sm font-semibold">
              <span>Rating:</span>
              <div className="flex items-center gap-1">
                {renderStars()}
              </div>
              <span className="text-gray-500">({reviews})</span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <HiOutlineLocationMarker className="w-4 h-4" />
              <span>{location}</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorCard