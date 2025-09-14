'use client'

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaStar, FaRegStar } from 'react-icons/fa'
import { BsHeart } from 'react-icons/bs'
import { HiShare } from 'react-icons/hi2'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
// Using string paths for Next.js Image component
const vendorImage = '/images/vendor-img1.jpg'
const vendorImage2 = '/images/vendor-img2.jpg'

const services = [
  {
    id: "ruthie-bridal-makeovers",
    verified: true,
    title: "Bridal Make Up Artists",
    vendorName: "Ruthie Bridal Makeovers",
    rating: 3,
    reviews: 120,
    location: "Abuja, Nigeria",
    status: "Top Rated"
  },
  {
    id: "opes-event-decor",
    verified: true,
    title: "Wedding Hall Decoration / Backdrops",
    vendorName: "Ope's Event Decor",
    rating: 4,
    reviews: 20,
    location: "Victoria Island, Lagos",
    status: "Most Booked"
  },
  {
    id: "uk-cakes-cream",
    verified: true,
    title: "Book us for all types of Event Cakes",
    vendorName: "UK Cakes & Cream",
    rating: 5,
    reviews: 50,
    location: "Victoria Island, Lagos",
    status: "Best Valued"
  },
  {
    id: "elite-photography",
    verified: true,
    title: "Professional Wedding Photography",
    vendorName: "Elite Photography Studio",
    rating: 4,
    reviews: 85,
    location: "Ikoyi, Lagos",
    status: "Rising Star"
  },
  {
    id: "royal-catering",
    verified: true,
    title: "Premium Event Catering Services",
    vendorName: "Royal Catering Company",
    rating: 5,
    reviews: 150,
    location: "Victoria Island, Lagos",
    status: "Top Rated"
  },
  {
    id: "sound-system-pro",
    verified: true,
    title: "Professional Sound & Lighting",
    vendorName: "Sound System Pro",
    rating: 4,
    reviews: 75,
    location: "Surulere, Lagos",
    status: "Most Booked"
  },
  {
    id: "floral-designs",
    verified: true,
    title: "Elegant Floral Arrangements",
    vendorName: "Floral Designs by Sarah",
    rating: 5,
    reviews: 95,
    location: "Garki, Abuja",
    status: "Best Valued"
  },
  {
    id: "luxury-transport",
    verified: true,
    title: "Luxury Wedding Transportation",
    vendorName: "Luxury Transport Services",
    rating: 4,
    reviews: 60,
    location: "Maitama, Abuja",
    status: "Rising Star"
  },
  {
    id: "event-planning",
    verified: true,
    title: "Complete Event Planning Services",
    vendorName: "Perfect Events Nigeria",
    rating: 5,
    reviews: 200,
    location: "Victoria Island, Lagos",
    status: "Top Rated"
  },
  {
    id: "dj-services",
    verified: true,
    title: "Professional DJ Services",
    vendorName: "DJ Master Pro",
    rating: 4,
    reviews: 110,
    location: "Lekki, Lagos",
    status: "Most Booked"
  },
  {
    id: "venue-rental",
    verified: true,
    title: "Premium Event Venues",
    vendorName: "Grand Venue Solutions",
    rating: 5,
    reviews: 180,
    location: "Asokoro, Abuja",
    status: "Best Valued"
  },
  {
    id: "security-services",
    verified: true,
    title: "Event Security Services",
    vendorName: "Secure Events Ltd",
    rating: 4,
    reviews: 45,
    location: "Wuse 2, Abuja",
    status: "Rising Star"
  },
  {
    id: "videography",
    verified: true,
    title: "Wedding Videography Services",
    vendorName: "Cinematic Moments",
    rating: 5,
    reviews: 130,
    location: "Victoria Island, Lagos",
    status: "Top Rated"
  },
  {
    id: "decorations",
    verified: true,
    title: "Event Decorations & Setup",
    vendorName: "Decor Masters",
    rating: 4,
    reviews: 90,
    location: "Ikeja, Lagos",
    status: "Most Booked"
  },
  {
    id: "catering-services",
    verified: true,
    title: "Gourmet Catering Services",
    vendorName: "Chef's Delight Catering",
    rating: 5,
    reviews: 160,
    location: "Garki, Abuja",
    status: "Best Valued"
  }
];

const PopularServices: React.FC = () => {
  const router = useRouter();
  const [viewType, setViewType] = useState<'list' | 'grid'>('grid');

  const handleSeeMore = () => {
    router.push('/services/popular');
  };

  const handleTitleClick = () => {
    router.push('/services');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) =>
      i < rating ? (
        <FaStar key={i} className="text-yellow-400" />
      ) : (
        <FaRegStar key={i} className="text-gray-300" />
      )
    );
  };

  const ServiceCard = ({ service, viewType }: { service: typeof services[0], viewType: 'list' | 'grid' }) => {
    const [current, setCurrent] = useState(0)
    const images = [vendorImage, vendorImage2, vendorImage]

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrent(prev => (prev + 1) % images.length)
      }, 3000)
      return () => clearInterval(interval)
    }, [images.length])

      return (
      <div className={`bg-white shadow-md rounded-2xl hover:shadow-lg transition-shadow ${
        viewType === 'grid' ? 'w-full max-w-sm mx-auto' : 'w-full'
      }`}>
        {/* Image Section */}
        <div className={`relative ${viewType === 'grid' ? 'w-full' : 'w-32 sm:w-40 md:w-48 flex-shrink-0'}`}>
          <div className={`relative ${viewType === 'grid' ? 'h-36 w-full' : 'h-20 sm:h-24 md:h-28 w-full'}`}>
            <Image
              src={images[current]}
              alt={service.title}
              fill
              className={`object-cover ${viewType === 'grid' ? 'rounded-t-2xl' : 'rounded-l-2xl'}`}
              priority
            />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    current === index ? 'bg-event-blue' : 'bg-white'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {service.verified && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-event-blue text-white text-xs px-6 py-1 rounded-md">
              <svg
                width="17"
                height="16"
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
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M10.9335 6.47998L8.45753 9.77998C8.41751 9.83346 8.36649 9.87772 8.30789 9.90978C8.2493 9.94183 8.18451 9.96094 8.1179 9.96581C8.05129 9.97068 7.98441 9.96119 7.92178 9.93798C7.85915 9.91478 7.80223 9.8784 7.75486 9.83131L6.26953 8.34465"
                  stroke="#191919"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                  </svg>
              Verified
            </div>
          )}
          
          {/* Status Badge */}
          {service.status && (
            <div className="absolute top-2 right-2 bg-event-blue text-white text-xs px-3 py-1 rounded-md">
              {service.status}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className={`flex gap-3 p-4 w-full ${
          viewType === 'grid' ? 'flex-col' : 'flex-row items-start'
        }`}>
          {viewType === 'grid' ? (
            // Grid View Layout
            <>
              <div className="flex gap-2 items-center justify-between">
                <h3 className="text-lg font-bold">{service.title}</h3>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.0332 9.85713H22.2492C22.2725 9.78807 22.2846 9.71573 22.2852 9.64284L22.2835 9.69855L22.2852 9.61284L22.2766 9.53741L22.262 9.47141L22.2526 9.43884L22.2157 9.35141L18.7812 2.9117L18.7349 2.83713C18.6751 2.75466 18.5967 2.68756 18.5059 2.64136C18.4152 2.59517 18.3147 2.57119 18.2129 2.57141H13.7129C13.8546 2.57136 13.9924 2.61815 14.1048 2.70449C14.2171 2.79083 14.2978 2.91189 14.3343 3.04884L16.0486 9.47741C16.0818 9.60265 16.0765 9.735 16.0332 9.85713Z"
                    fill="#616161"
                  />
                  <path
                    d="M16.0332 9.85713H22.2492C22.2725 9.78807 22.2846 9.71573 22.2852 9.64284L22.2835 9.69855L22.2852 9.61284L22.2766 9.53741L22.262 9.47141L22.2526 9.43884L22.2157 9.35141L18.7812 2.9117L18.7349 2.83713C18.6751 2.75466 18.5967 2.68756 18.5059 2.64136C18.4152 2.59517 18.3147 2.57119 18.2129 2.57141H13.7129C13.8546 2.57136 13.9924 2.61815 14.1048 2.70449C14.2171 2.79083 14.2978 2.91189 14.3343 3.04884L16.0486 9.47741C16.0818 9.60265 16.0765 9.735 16.0332 9.85713Z"
                    fill="url(#paint0_linear_899_30759)"
                  />
                  <path
                    d="M7.96451 9.85713C7.92122 9.735 7.91584 9.60265 7.94908 9.47741L9.66337 3.04884C9.69984 2.91189 9.78054 2.79083 9.89293 2.70449C10.0053 2.61815 10.1431 2.57136 10.2848 2.57141H5.78565L5.69823 2.57741C5.59748 2.5912 5.50145 2.62869 5.418 2.6868C5.33456 2.74491 5.26609 2.82199 5.21823 2.9117L1.78965 9.34027L1.76651 9.38913L1.73737 9.47141L1.7288 9.5057L1.7168 9.5897V9.69855L1.73651 9.81084L1.75365 9.85713H7.96451Z"
                    fill="#9F9F9F"
                  />
                  <path
                    d="M7.96451 9.85713C7.92122 9.735 7.91584 9.60265 7.94908 9.47741L9.66337 3.04884C9.69984 2.91189 9.78054 2.79083 9.89293 2.70449C10.0053 2.61815 10.1431 2.57136 10.2848 2.57141H5.78565L5.69823 2.57741C5.59748 2.5912 5.50145 2.62869 5.418 2.6868C5.33456 2.74491 5.26609 2.82199 5.21823 2.9117L1.78965 9.34027L1.76651 9.38913L1.73737 9.47141L1.7288 9.5057L1.7168 9.5897V9.69855L1.73651 9.81084L1.75365 9.85713H7.96451Z"
                    fill="url(#paint1_linear_899_30759)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_899_30759"
                      x1="13.7129"
                      y1="2.57141"
                      x2="22.2492"
                      y2="9.85713"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0.533" stopColor="#FF6CE8" stopOpacity="0" />
                      <stop offset="1" stopColor="#FF6CE8" />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_899_30759"
                      x1="5.78565"
                      y1="2.57141"
                      x2="7.96451"
                      y2="9.85713"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0.533" stopColor="#FF6CE8" stopOpacity="0" />
                      <stop offset="1" stopColor="#FF6CE8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-event-blue font-semibold text-sm">{service.vendorName}</p>
                <div className="flex items-center gap-2 text-white text-xs">
                  <button className="text-base p-1.5 bg-event-blue rounded-lg">
                    <IoChatbubbleEllipsesOutline />
                  </button>
                  <button className="p-2 bg-event-blue rounded-lg">
                    <BsHeart />
                  </button>
                  <button className="p-2 bg-event-blue rounded-lg">
                    <HiShare />
                  </button>
                </div>
              </div>
              <hr></hr>
              <div className="flex items-center gap-1 text-light-gray text-sm font-bold">
                Rating: <div className="flex items-center gap-1">{renderStars(service.rating)}</div>
                ({service.reviews}){' '}
              </div>
              <p className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                <HiOutlineLocationMarker /> {service.location}
              </p>
              
              {/* View Details Button */}
              <div className="mt-4">
                <button 
                  className="w-full bg-event-blue text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer relative z-10"
                  onClick={() => {
                    console.log('Button clicked for service:', service.id);
                    router.push(`/vendor/${service.id}`);
                  }}
                >
                  <span>View Details</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            // List View Layout
            <>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <h3 className="text-base sm:text-lg font-bold truncate">{service.title}</h3>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-shrink-0"
                  >
                    <path
                      d="M16.0332 9.85713H22.2492C22.2725 9.78807 22.2846 9.71573 22.2852 9.64284L22.2835 9.69855L22.2852 9.61284L22.2766 9.53741L22.262 9.47141L22.2526 9.43884L22.2157 9.35141L18.7812 2.9117L18.7349 2.83713C18.6751 2.75466 18.5967 2.68756 18.5059 2.64136C18.4152 2.59517 18.3147 2.57119 18.2129 2.57141H13.7129C13.8546 2.57136 13.9924 2.61815 14.1048 2.70449C14.2171 2.79083 14.2978 2.91189 14.3343 3.04884L16.0486 9.47741C16.0818 9.60265 16.0765 9.735 16.0332 9.85713Z"
                      fill="#616161"
                    />
                    <path
                      d="M16.0332 9.85713H22.2492C22.2725 9.78807 22.2846 9.71573 22.2852 9.64284L22.2835 9.69855L22.2852 9.61284L22.2766 9.53741L22.262 9.47141L22.2526 9.43884L22.2157 9.35141L18.7812 2.9117L18.7349 2.83713C18.6751 2.75466 18.5967 2.68756 18.5059 2.64136C18.4152 2.59517 18.3147 2.57119 18.2129 2.57141H13.7129C13.8546 2.57136 13.9924 2.61815 14.1048 2.70449C14.2171 2.79083 14.2978 2.91189 14.3343 3.04884L16.0486 9.47741C16.0818 9.60265 16.0765 9.735 16.0332 9.85713Z"
                      fill="url(#paint0_linear_899_30759)"
                    />
                    <path
                      d="M7.96451 9.85713C7.92122 9.735 7.91584 9.60265 7.94908 9.47741L9.66337 3.04884C9.69984 2.91189 9.78054 2.79083 9.89293 2.70449C10.0053 2.61815 10.1431 2.57136 10.2848 2.57141H5.78565L5.69823 2.57741C5.59748 2.5912 5.50145 2.62869 5.418 2.6868C5.33456 2.74491 5.26609 2.82199 5.21823 2.9117L1.78965 9.34027L1.76651 9.38913L1.73737 9.47141L1.7288 9.5057L1.7168 9.5897V9.69855L1.73651 9.81084L1.75365 9.85713H7.96451Z"
                      fill="#9F9F9F"
                    />
                    <path
                      d="M7.96451 9.85713C7.92122 9.735 7.91584 9.60265 7.94908 9.47741L9.66337 3.04884C9.69984 2.91189 9.78054 2.79083 9.89293 2.70449C10.0053 2.61815 10.1431 2.57136 10.2848 2.57141H5.78565L5.69823 2.57741C5.59748 2.5912 5.50145 2.62869 5.418 2.6868C5.33456 2.74491 5.26609 2.82199 5.21823 2.9117L1.78965 9.34027L1.76651 9.38913L1.73737 9.47141L1.7288 9.5057L1.7168 9.5897V9.69855L1.73651 9.81084L1.75365 9.85713H7.96451Z"
                      fill="url(#paint1_linear_899_30759)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_899_30759"
                        x1="13.7129"
                        y1="2.57141"
                        x2="22.2492"
                        y2="9.85713"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0.533" stopColor="#FF6CE8" stopOpacity="0" />
                        <stop offset="1" stopColor="#FF6CE8" />
                      </linearGradient>
                      <linearGradient
                        id="paint1_linear_899_30759"
                        x1="5.78565"
                        y1="2.57141"
                        x2="7.96451"
                        y2="9.85713"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0.533" stopColor="#FF6CE8" stopOpacity="0" />
                        <stop offset="1" stopColor="#FF6CE8" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <p className="text-event-blue font-semibold text-xs sm:text-sm truncate">{service.vendorName}</p>
                  <div className="flex items-center gap-1 sm:gap-2 text-white text-xs">
                    <button className="text-xs sm:text-base p-1 sm:p-1.5 bg-event-blue rounded-lg">
                      <IoChatbubbleEllipsesOutline />
                    </button>
                    <button className="p-1 sm:p-2 bg-event-blue rounded-lg">
                      <BsHeart />
                    </button>
                    <button className="p-1 sm:p-2 bg-event-blue rounded-lg">
                      <HiShare />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 text-light-gray text-xs sm:text-sm font-bold">
                    Rating: <div className="flex items-center gap-1">{renderStars(service.rating)}</div>
                    ({service.reviews})
                  </div>
                  <p className="flex items-center gap-1 text-gray-500 text-xs sm:text-sm">
                    <HiOutlineLocationMarker /> {service.location}
                  </p>
                </div>
              </div>
              
              {/* View Details Button for List View */}
              <div className="flex-shrink-0 mt-2 sm:mt-0">
                <button 
                  className="w-full sm:w-auto bg-event-blue text-white py-2 px-3 sm:px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer relative z-10 text-xs sm:text-sm"
                  onClick={() => {
                    console.log('Button clicked for service:', service.id);
                    router.push(`/vendor/${service.id}`);
                  }}
                >
                  <span>View Details</span>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 bg-gradient-to-r from-gray-100 to-blue-50 rounded-xl shadow-sm max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <div 
            onClick={handleTitleClick}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer select-none"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTitleClick();
              }
            }}
          >
            {/* Flame Icon */}
            <div className="flex items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C12 2 8 6 8 10C8 12.5 9.5 14 12 14C14.5 14 16 12.5 16 10C16 6 12 2 12 2Z" fill="#FF6B35"/>
                <path d="M12 2C12 2 8 6 8 10C8 12.5 9.5 14 12 14C14.5 14 16 12.5 16 10C16 6 12 2 12 2Z" fill="#FFA500"/>
                <path d="M12 6C12 6 10 8 10 10C10 11 10.5 11.5 12 11.5C13.5 11.5 14 11 14 10C14 8 12 6 12 6Z" fill="#FFD700"/>
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-800">Popular Services</h2>
          </div>
          
          {/* View Toggle Controls - Beside the title */}
          <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => setViewType('list')}
              className={`px-3 py-2 flex items-center space-x-1 transition-colors ${
                viewType === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="6" width="18" height="2" rx="1" fill="currentColor"/>
                <rect x="3" y="11" width="18" height="2" rx="1" fill="currentColor"/>
                <rect x="3" y="16" width="18" height="2" rx="1" fill="currentColor"/>
              </svg>
            </button>
            <button
              onClick={() => setViewType('grid')}
              className={`px-3 py-2 flex items-center space-x-1 transition-colors ${
                viewType === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor"/>
                <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor"/>
                <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor"/>
                <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Right - See More Link */}
        <button
          onClick={handleSeeMore}
          className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
        >
          See more
        </button>
      </div>

      {/* Services Grid */}
      <div className={`${
        viewType === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'flex flex-col gap-4'
      }`}>
        {services.slice(0, 3).map((service) => (
          <ServiceCard key={service.id} service={service} viewType={viewType} />
        ))}
      </div>

    </div>
  );
};

export default PopularServices;