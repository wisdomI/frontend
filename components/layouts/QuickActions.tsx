import Button from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import PostServiceModal from '@/components/ui/modal/ServiceRequestmodal';
import { PlusOutlined, FileSearchOutlined, CalendarOutlined, EyeFilled, UnorderedListOutlined, ShopOutlined, UserOutlined } from '@ant-design/icons';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ButtonLoader } from '@/components/ui/Loader';

const QuickActions = () => {
  const { user, isAuthenticated, loading } = useAuthContext();
  const router = useRouter();

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
      // For vendors, redirect to their service offerings or portfolio
      router.push('/vendor/services');
      return;
    }

    // For clients, the modal will handle the rest
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

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-2 grid-rows-2 gap-3 flex-1">
        {/* Post a Service Request Button / Add Services Button */}
        {isAuthenticated ? (
          isClient ? (
            <PostServiceModal 
              trigger={
                <Button className="bg-event-blue text-white p-4 rounded-lg flex flex-col items-center justify-center hover:bg-event-blue-hover h-full min-h-[100px] transition-all duration-200 shadow-md hover:shadow-lg w-full">
                  <span className="mb-2 inline-flex items-center justify-center w-10 h-10 rounded-md" style={{ backgroundColor: '#E5EFFB' }}>
                    <PlusOutlined className="text-xl text-[#032D71]" />
                  </span>
                  <span className="text-xs font-medium text-center leading-tight px-2">
                    Post Service Request
                  </span>
                </Button>
              }
            />
          ) : isVendor ? (
            <Button 
              onClick={handlePostServiceRequest}
              className="bg-event-blue text-white p-4 rounded-lg flex flex-col items-center justify-center hover:bg-event-blue-hover h-full min-h-[100px] transition-all duration-200 shadow-md hover:shadow-lg w-full"
            >
              <span className="mb-2 inline-flex items-center justify-center w-10 h-10 rounded-md" style={{ backgroundColor: '#E5EFFB' }}>
                <ShopOutlined className="text-xl text-[#032D71]" />
              </span>
              <span className="text-xs font-medium text-center leading-tight px-2">
                Add Services
              </span>
            </Button>
          ) : (
            <PostServiceModal 
              trigger={
                <Button className="bg-event-blue text-white p-4 rounded-lg flex flex-col items-center justify-center hover:bg-event-blue-hover h-full min-h-[100px] transition-all duration-200 shadow-md hover:shadow-lg w-full">
                  <span className="mb-2 inline-flex items-center justify-center w-10 h-10 rounded-md" style={{ backgroundColor: '#E5EFFB' }}>
                    <PlusOutlined className="text-xl text-[#032D71]" />
                  </span>
                  <span className="text-xs font-medium text-center leading-tight px-2">
                    Post Service Request
                  </span>
                </Button>
              }
            />
          )
        ) : (
          <Button 
            onClick={handlePostServiceRequest}
            className="bg-event-blue text-white p-4 rounded-lg flex flex-col items-center justify-center hover:bg-event-blue-hover h-full min-h-[100px] transition-all duration-200 shadow-md hover:shadow-lg w-full"
          >
            <span className="mb-2 inline-flex items-center justify-center w-10 h-10 rounded-md" style={{ backgroundColor: '#E5EFFB' }}>
              <PlusOutlined className="text-xl text-[#032D71]" />
            </span>
            <span className="text-xs font-medium text-center leading-tight px-2">
              <ButtonLoader loading={loading} loadingText="Loading...">
                Login to Continue
              </ButtonLoader>
            </span>
          </Button>
        )}

        {/* Manage all Posts/Requests Button */}
        <Button 
          onClick={handleManagePosts}
          className="bg-event-blue text-white p-4 rounded-lg flex flex-col items-center justify-center hover:bg-event-blue-hover h-full min-h-[100px] transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
        >
          <div className="relative mb-2">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-md" style={{ backgroundColor: '#E5EFFB' }}>
              <FileSearchOutlined className="text-xl text-[#032D71]" />
            </span>
            {/* Notification Badge - only show for clients with pending requests */}
            {isClient && isAuthenticated && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px]">
                3
              </div>
            )}
          </div>
          <span className="text-xs font-medium text-center leading-tight px-2">
            {isAuthenticated ? (
              isClient ? 'My Requests' : isVendor ? 'Service Requests' : 'Manage Posts'
            ) : (
              'Manage Posts'
            )}
          </span>
        </Button>

        {/* Manage all Bookings Button */}
        <Button 
          onClick={handleManageBookings}
          className="bg-event-blue text-white p-4 rounded-lg flex flex-col items-center justify-center hover:bg-event-blue-hover h-full min-h-[100px] transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
        >
          <span className="mb-2 inline-flex items-center justify-center w-10 h-10 rounded-md" style={{ backgroundColor: '#E5EFFB' }}>
            <Image 
              src="/images/tabler_brand-booking.svg" 
              alt="Manage Bookings" 
              width={20}
              height={20}
            />
          </span>
          <span className="text-xs font-medium text-center leading-tight px-2">
            {isAuthenticated ? (
              isClient ? 'My Bookings' : isVendor ? 'Vendor Bookings' : 'Bookings'
            ) : (
              'Manage Bookings'
            )}
          </span>
        </Button>

        {/* View all Favourites/Portfolio Button */}
        <Button 
          onClick={handleViewFavourites}
          className="bg-event-blue text-white p-4 rounded-lg flex flex-col items-center justify-center hover:bg-event-blue-hover h-full min-h-[100px] transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
        >
          <span className="mb-2 inline-flex items-center justify-center w-10 h-10 rounded-md" style={{ backgroundColor: '#E5EFFB' }}>
            <EyeFilled className="text-xl text-[#032D71]" />
          </span>
          <span className="text-xs font-medium text-center leading-tight px-2">
            {isAuthenticated ? (
              isClient ? 'My Favourites' : isVendor ? 'My Portfolio' : 'Favourites'
            ) : (
              'Browse Services'
            )}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;