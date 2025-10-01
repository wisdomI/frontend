import Button from '@/components/ui/Button';
import Link from 'next/link';
import PostServiceModal from '@/components/ui/modal/ServiceRequestmodal';
import { PlusOutlined, FileSearchOutlined, CalendarOutlined, EyeFilled, UnorderedListOutlined } from '@ant-design/icons';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const QuickActions = () => {
  const { user, isAuthenticated, loading } = useAuthContext();
  const router = useRouter();

  const handlePostServiceRequest = () => {
    if (!isAuthenticated) {
      // Redirect to login with a return URL
      router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    // TODO: Implement proper role-based authentication
    // For now, we'll allow any authenticated user to post service requests
    // In the future, this should check if user.role === 'client'
    
    // If authenticated, open the modal
    // This will be handled by the PostServiceModal component
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 font-raleway">Quick Actions</h3>
      <div className="grid grid-cols-2 grid-rows-2 gap-3 flex-1">
        {/* Post a Service Request Button */}
        {isAuthenticated ? (
          <PostServiceModal 
            trigger={
              <Button className="bg-event-blue text-white p-4 rounded-lg flex flex-col items-center justify-center hover:bg-event-blue-hover h-full min-h-[100px] transition-all duration-200 shadow-md hover:shadow-lg w-full">
                <PlusOutlined className="text-2xl mb-2 text-white" />
                <span className="text-xs font-medium text-center leading-tight px-2">
                  Post a Service Request
                </span>
              </Button>
            }
          />
        ) : (
          <Button 
            onClick={handlePostServiceRequest}
            className="bg-event-blue text-white p-4 rounded-lg flex flex-col items-center justify-center hover:bg-event-blue-hover h-full min-h-[100px] transition-all duration-200 shadow-md hover:shadow-lg w-full"
          >
            <PlusOutlined className="text-2xl mb-2 text-white" />
            <span className="text-xs font-medium text-center leading-tight px-2">
              {loading ? 'Loading...' : 'Login to Post Request'}
            </span>
          </Button>
        )}

        {/* Manage all Posts Button */}
        <Button className="bg-event-blue text-white p-4 rounded-lg flex flex-col items-center justify-center hover:bg-event-blue-hover h-full min-h-[100px] transition-all duration-200 shadow-md hover:shadow-lg">
          <div className="relative">
            <FileSearchOutlined className="text-2xl mb-2 text-white" />
            {/* Notification Badge */}
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px]">
              3
            </div>
          </div>
          <span className="text-xs font-medium text-center leading-tight px-2">
            Manage all Posts
          </span>
        </Button>

        {/* Manage all Bookings Button */}
        <Button className="bg-event-blue text-white p-4 rounded-lg flex flex-col items-center justify-center hover:bg-event-blue-hover h-full min-h-[100px] transition-all duration-200 shadow-md hover:shadow-lg">
          <img 
            src="/images/tabler_brand-booking-inactive.svg" 
            alt="Manage Bookings" 
            width="24" 
            height="24" 
            className="mb-2"
          />
          <span className="text-xs font-medium text-center leading-tight px-2">
            Manage all Bookings
          </span>
        </Button>

        {/* View all Favourites Button */}
        <Button className="bg-event-blue text-white p-4 rounded-lg flex flex-col items-center justify-center hover:bg-event-blue-hover h-full min-h-[100px] transition-all duration-200 shadow-md hover:shadow-lg">
          <EyeFilled className="text-2xl mb-2 text-white" />
          <span className="text-xs font-medium text-center leading-tight px-2">
            View all Favourites
          </span>
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;