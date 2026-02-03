import QuickActions from '@/components/layouts/QuickActions'; 
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { PlusOutlined, FileSearchOutlined, EyeFilled, ShopOutlined } from '@ant-design/icons';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import PostServiceModal from '@/components/ui/modal/ServiceRequestmodal';
import { useLandingPageData } from '@/hooks/useLandingPageData';
import { Meeting } from '@/types/api';
import { ButtonLoader } from '@/components/ui/Loader';

const HeroBanner = () => {
  const { user, isAuthenticated, loading } = useAuthContext();
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<any>(null);
  
  // Fetch landing page data
  const { upcomingEvents, loading: dataLoading, error: dataError } = useLandingPageData();

  // Helper function to get user role
  const getUserRole = () => {
    if (!user) return null;
    return user.accountType || null;
  };

  const isClient = getUserRole() === 'individual' || getUserRole() === 'business';
  const isVendor = getUserRole() === 'vendor';

  const handlePostServiceRequest = () => {
    if (!isAuthenticated) {
      // For visitors, redirect to login but keep them on the main page
      router.push('/auth/login?redirect=' + encodeURIComponent('/'));
      return;
    }

    if (isVendor) {
      router.push('/vendor/services');
      return;
    }
  };

  const handleManagePosts = () => {
    if (!isAuthenticated) {
      // For visitors, redirect to login but keep them on the main page
      router.push('/auth/login?redirect=' + encodeURIComponent('/'));
      return;
    }

    if (isClient) {
      router.push('/client/dashboard');
    } else if (isVendor) {
      router.push('/vendor/service-requests');
    } else {
      router.push('/service-requests');
    }
  };

  const handleManageBookings = () => {
    if (!isAuthenticated) {
      // For visitors, redirect to login but keep them on the main page
      router.push('/auth/login?redirect=' + encodeURIComponent('/'));
      return;
    }

    if (isClient) {
      router.push('/client/booking');
    } else if (isVendor) {
      router.push('/vendor/manage-bookings');
    } else {
      router.push('/booking');
    }
  };

  const handleViewFavourites = () => {
    // For visitors, show all services instead of favorites
    router.push('/services');
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };

  // Slider settings for responsiveness
  const sliderSettings: any = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
    beforeChange: (oldIndex: number, newIndex: number) => {
      setCurrentSlide(newIndex);
    },
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
          arrows: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
        },
      },
    ],
  };

  // Transform API data to slides format
  const slides = upcomingEvents.map((event: Meeting) => ({
    title: event.title || 'Event',
    description: event.description || 'Join us for an exciting event!',
    date: event.meetingDate ? new Date(event.meetingDate).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric' 
    }) : 'TBD',
    time: `${event.startTime || 'TBD'} - ${event.endTime || 'TBD'}`,
    location: event.location || 'Venue TBD',
    address: event.location || 'Location details coming soon',
    discount: 'Limited seats available! Book now to secure your spot.',
    image: '/images/image.png', // Default image since events don't have images in API
    circularImage: '/images/image.png',
    eventId: event.id
  }));

  // Fallback slides if no events are available
  const fallbackSlides = [
    {
      title: 'Photographer Workshop',
      description: 'Learn professional photography techniques from industry experts.',
      date: 'Coming Soon',
      time: 'TBD',
      location: 'EventHub Academy',
      address: 'Online & In-person sessions available',
      discount: 'Early Bird Discount 10% - Limited seats available!',
      image: '/images/image.png',
      circularImage: '/images/image.png',
    },
    {
      title: 'Event Planning Seminar',
      description: 'Master the art of event planning with our comprehensive seminar.',
      date: 'Coming Soon',
      time: 'TBD',
      location: 'EventHub Academy',
      address: 'Online & In-person sessions available',
      discount: 'Early Bird Discount 15% - Limited seats available!',
      image: '/images/image.png',
      circularImage: '/images/image.png',
    },
    {
      title: 'Catering Masterclass',
      description: 'Discover culinary excellence with our expert catering workshop.',
      date: 'Coming Soon',
      time: 'TBD',
      location: 'EventHub Academy',
      address: 'Online & In-person sessions available',
      discount: 'Early Bird Discount 20% - Limited seats available!',
      image: '/images/image.png',
      circularImage: '/images/image.png',
    },
  ];

  // Use API data if available, otherwise use fallback
  const displaySlides = slides.length > 0 ? slides : fallbackSlides;

  return (
    <>
      <style jsx global>{`
        .slick-dots-custom .slick-active div {
          background-color: #032D71 !important;
          width: 24px !important;
          height: 8px !important;
          border-radius: 4px !important;
        }
        .slick-dots-custom div {
          width: 8px !important;
          height: 8px !important;
          border-radius: 50% !important;
          background-color: #ffffff !important;
          border: 1px solid #d1d5db !important;
          transition: all 0.3s ease !important;
        }
        .slick-dots-custom div:hover {
          background-color: #f3f4f6 !important;
        }
        .slick-dots {
          position: static !important;
          margin-top: 16px !important;
          display: flex !important;
          flex-direction: row !important;
          justify-content: center !important;
          align-items: center !important;
          list-style: none !important;
          padding: 0 !important;
          width: 100% !important;
        }
        .slick-dots li {
          margin: 0 4px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .slick-dots li button {
          border: none !important;
          background: transparent !important;
          padding: 0 !important;
          cursor: pointer !important;
        }
        .slick-dots li button:before {
          display: none !important;
        }
        .slick-dots-custom {
          display: flex !important;
          flex-direction: row !important;
          justify-content: center !important;
          align-items: center !important;
          width: 100% !important;
          margin: 16px 0 0 0 !important;
          padding: 0 !important;
          list-style: none !important;
        }
        .slick-dots-custom li {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          margin: 0 4px !important;
        }
        
        /* Remove reserved space for arrows when arrows are disabled */
        .slick-slider {
          margin: 0 !important;
          padding: 0 !important;
        }
        .slick-list {
          margin: 0 !important;
          padding: 0 !important;
        }
        .slick-track {
          margin: 0 !important;
          padding: 0 !important;
        }
        .slick-slide {
          margin: 0 !important;
          padding: 0 !important;
        }
        .slick-arrow {
          display: none !important;
        }
        .slick-prev, .slick-next {
          display: none !important;
        }
        
        /* Ensure slick slider breaks completely out of parent constraints */
        .slick-initialized .slick-list {
          position: relative !important;
          display: block !important;
          overflow: hidden !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .slick-initialized .slick-track {
          position: relative !important;
          top: 0 !important;
          left: 0 !important;
          display: block !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .slick-loading .slick-slide {
          visibility: hidden !important;
        }
        .slick-initialized .slick-slide {
          display: block !important;
          height: auto !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Force mobile slider to true edge-to-edge */
        @media (max-width: 767px) {
          .slick-slider {
            position: relative !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>
      
      {/* Mobile: Full-width edge-to-edge carousel */}
      <section className="md:hidden">
        <div
          className="w-full"
          style={{
            position: 'relative',
            left: '50%',
            right: '50%',
            marginLeft: '-50vw',
            marginRight: '-50vw',
            width: '100vw'
          }}
        >
          <Slider ref={sliderRef} {...sliderSettings}>
            {displaySlides.map((slide, index) => (
              <div key={index} className="relative">
                <div className="relative h-72 md:h-80">
                  <Image 
                    src={slide.image}
                    alt={slide.title} 
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
        
        {/* Interactive dots for mobile */}
        <div className="flex justify-center mt-4 px-4">
          <div className="flex space-x-2">
            {displaySlides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-2 transition-all duration-300 cursor-pointer hover:opacity-80 ${
                  index === currentSlide ? 'bg-event-blue w-6 rounded-full' : 'bg-white border border-gray-300 w-2 rounded-full'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Mobile Quick Actions Below - In one line */}
        <div className="mx-4 sm:mx-6 lg:mx-8 mt-6">
          <div className="flex gap-2 sm:gap-3 justify-center">
            {/* Post a Service Request Button */}
            <div className="flex-1 max-w-[80px] sm:max-w-[90px]">
              {isAuthenticated ? (
                <PostServiceModal 
                  trigger={
                    <Button className="bg-blue-900 text-white p-2 rounded-lg flex flex-col items-center justify-center hover:bg-blue-800 h-20 transition-all duration-200 shadow-md hover:shadow-lg w-full">
                      <PlusOutlined className="text-lg mb-1 text-white" />
                      <span className="text-[9px] font-medium text-center leading-tight whitespace-nowrap">
                        Post Request
                      </span>
                    </Button>
                  }
                />
              ) : (
                <Button 
                  onClick={handlePostServiceRequest}
                  className="bg-blue-900 text-white p-2 rounded-lg flex flex-col items-center justify-center hover:bg-blue-800 h-20 transition-all duration-200 shadow-md hover:shadow-lg w-full"
                >
                  <PlusOutlined className="text-lg mb-1 text-white" />
                  <span className="text-[9px] font-medium text-center leading-tight whitespace-nowrap">
                    <ButtonLoader loading={loading} loadingText="Loading...">
                      Login
                    </ButtonLoader>
                  </span>
                </Button>
              )}
            </div>

            {/* Manage all Posts Button */}
            <div className="flex-1 max-w-[80px] sm:max-w-[90px]">
              <Button className="bg-blue-900 text-white p-2 rounded-lg flex flex-col items-center justify-center hover:bg-blue-800 h-20 transition-all duration-200 shadow-md hover:shadow-lg w-full">
                <div className="relative mb-1">
                  <FileSearchOutlined className="text-lg text-white" />
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    3
                  </div>
                </div>
                <span className="text-[9px] font-medium text-center leading-tight whitespace-nowrap">
                  Manage Posts
                </span>
              </Button>
            </div>

            {/* Manage all Bookings Button */}
            <div className="flex-1 max-w-[80px] sm:max-w-[90px]">
              <Button className="bg-blue-900 text-white p-2 rounded-lg flex flex-col items-center justify-center hover:bg-blue-800 h-20 transition-all duration-200 shadow-md hover:shadow-lg w-full">
                <Image 
                  src="/images/tabler_brand-booking-inactive.svg" 
                  alt="Manage Bookings" 
                  width={18}
                  height={18}
                  className="mb-1"
                />
                <span className="text-[9px] font-medium text-center leading-tight whitespace-nowrap">
                  Bookings
                </span>
              </Button>
            </div>

            {/* View all Favourites Button */}
            <div className="flex-1 max-w-[80px] sm:max-w-[90px]">
              <Button className="bg-blue-900 text-white p-2 rounded-lg flex flex-col items-center justify-center hover:bg-blue-800 h-20 transition-all duration-200 shadow-md hover:shadow-lg w-full">
                <EyeFilled className="text-lg mb-1 text-white" />
                <span className="text-[9px] font-medium text-center leading-tight whitespace-nowrap">
                  Favourites
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Desktop/Tablet: Grid layout with carousel + sidebar */}
      <section className="mb-6 lg:mb-8 pt-0 hidden md:block">
        {/* Add spacing to align with sidebar blue container */}
        <div className="mb-0">
          <div className="flex items-center justify-between h-16">
            {/* Empty space to match sidebar header height */}
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 lg:gap-6 items-start">
          {/* Main Slider Section */}
          <div className="md:col-span-full lg:col-span-3">
            <div className="h-48 md:h-56 lg:h-64 xl:h-72">
              <Slider ref={sliderRef} {...sliderSettings}>
                {displaySlides.map((slide, index) => (
                  <div key={index} className="relative">
                    <div className="relative h-48 md:h-56 lg:h-64 xl:h-72">
                      <Image 
                        src={slide.image}
                        alt={slide.title} 
                        fill
                        sizes="(max-width: 1023px) 100vw, (max-width: 1200px) 75vw, 50vw"
                        className="object-cover rounded-xl"
                      />
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
            {/* Interactive dots outside slider container */}
            <div className="flex justify-center mt-4">
              <div className="flex space-x-2">
                {displaySlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`h-2 transition-all duration-300 cursor-pointer hover:opacity-80 ${
                      index === currentSlide ? 'bg-event-blue w-6 rounded-full' : 'bg-white border border-gray-300 w-2 rounded-full'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Quick Actions Section */}
          <div className="md:col-span-full mt-6 lg:col-span-1 lg:mt-0">
            <div className="hidden lg:block h-48 md:h-56 lg:h-64 xl:h-72">  
              <QuickActions />
            </div>
            <div className="lg:hidden">
              <div className="flex gap-3 justify-center">
                {/* Quick Actions - Single Line */}
                <div className="flex gap-3">
                  {/* Post Service */}
                  {isAuthenticated ? (
                    isClient ? (
                      <PostServiceModal 
                        trigger={
                          <div className="bg-blue-900 text-white p-3 rounded-lg flex items-center hover:bg-blue-800 cursor-pointer">
                            <PlusOutlined className="text-lg mr-2" />
                            <span className="text-sm font-medium">Post Request</span>
                          </div>
                        }
                      />
                    ) : isVendor ? (
                      <div 
                        onClick={handlePostServiceRequest}
                        className="bg-blue-900 text-white p-3 rounded-lg flex items-center hover:bg-blue-800 cursor-pointer"
                      >
                        <ShopOutlined className="text-lg mr-2" />
                        <span className="text-sm font-medium">Add Services</span>
                      </div>
                    ) : (
                      <PostServiceModal 
                        trigger={
                          <div className="bg-blue-900 text-white p-3 rounded-lg flex items-center hover:bg-blue-800 cursor-pointer">
                            <PlusOutlined className="text-lg mr-2" />
                            <span className="text-sm font-medium">Post Request</span>
                          </div>
                        }
                      />
                    )
                  ) : (
                    <div 
                      onClick={handlePostServiceRequest}
                      className="bg-blue-900 text-white p-3 rounded-lg flex items-center hover:bg-blue-800 cursor-pointer"
                    >
                      <PlusOutlined className="text-lg mr-2" />
                      <span className="text-sm font-medium">Login to Continue</span>
                    </div>
                  )}

                  {/* Manage Posts */}
                  <div 
                    onClick={handleManagePosts}
                    className="bg-blue-900 text-white p-3 rounded-lg flex items-center hover:bg-blue-800 cursor-pointer"
                  >
                    <FileSearchOutlined className="text-lg mr-2" />
                    <span className="text-sm font-medium">
                      {isAuthenticated ? (
                        isClient ? 'My Requests' : isVendor ? 'Service Requests' : 'Manage Posts'
                      ) : (
                        'Manage Posts'
                      )}
                    </span>
                  </div>

                  {/* Manage Bookings */}
                  <div 
                    onClick={handleManageBookings}
                    className="bg-blue-900 text-white p-3 rounded-lg flex items-center hover:bg-blue-800 cursor-pointer"
                  >
                    <Image src="/images/tabler_brand-booking-inactive.svg" alt="" width={18} height={18} className="mr-2" />
                    <span className="text-sm font-medium">
                      {isAuthenticated ? (
                        isClient ? 'My Bookings' : isVendor ? 'Vendor Bookings' : 'Bookings'
                      ) : (
                        'Bookings'
                      )}
                    </span>
                  </div>

                  {/* Favourites */}
                  <div 
                    onClick={handleViewFavourites}
                    className="bg-blue-900 text-white p-3 rounded-lg flex items-center hover:bg-blue-800 cursor-pointer"
                  >
                    <EyeFilled className="text-lg mr-2" />
                    <span className="text-sm font-medium">
                      {isAuthenticated ? (
                        isClient ? 'Favourites' : isVendor ? 'Portfolio' : 'Favourites'
                      ) : (
                        'Browse Services'
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroBanner;