import Button from '@/components/ui/Button';
import Link from 'next/link';
import PostServiceModal from '@/components/ui/modal/ServiceRequestmodal';
import { PlusOutlined, FileSearchOutlined, CalendarOutlined, EyeFilled, UnorderedListOutlined } from '@ant-design/icons';

const QuickActions = () => {
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 font-raleway">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3 flex-1">
        {/* Post a Service Request Button */}
        <div className="w-full">
          <PostServiceModal 
            trigger={
              <Button className="bg-blue-900 text-white p-4 rounded-lg flex flex-col items-center justify-center hover:bg-blue-800 h-36 transition-all duration-200 shadow-md hover:shadow-lg w-full">
                <PlusOutlined className="text-2xl mb-2 text-white" />
                <span className="text-xs font-medium text-center leading-tight">
                  Post a Service Request
                </span>
              </Button>
            }
          />
        </div>

        {/* Manage all Posts Button */}
        <Button className="bg-blue-900 text-white p-4 rounded-lg flex flex-col items-center justify-center hover:bg-blue-800 h-36 transition-all duration-200 shadow-md hover:shadow-lg">
          <div className="relative">
            <FileSearchOutlined className="text-2xl mb-2 text-white" />
            {/* Notification Badge */}
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              3
            </div>
          </div>
          <span className="text-xs font-medium text-center leading-tight">
            Manage all Posts
          </span>
        </Button>

        {/* Manage all Bookings Button */}
        <Button className="bg-blue-900 text-white p-4 rounded-lg flex flex-col items-center justify-center hover:bg-blue-800 h-36 transition-all duration-200 shadow-md hover:shadow-lg">
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2">
            <path d="M4.66602 21.0003V9.91699C4.66602 8.52461 5.21914 7.18925 6.2037 6.20468C7.18827 5.22012 8.52363 4.66699 9.91602 4.66699H18.0827C18.7721 4.66699 19.4548 4.80279 20.0918 5.06662C20.7287 5.33046 21.3075 5.71717 21.795 6.20468C22.2825 6.69219 22.6692 7.27094 22.933 7.9079C23.1969 8.54486 23.3327 9.22755 23.3327 9.91699V18.0837C23.3327 18.7731 23.1969 19.4558 22.933 20.0927C22.6692 20.7297 22.2825 21.3085 21.795 21.796C21.3075 22.2835 20.7287 22.6702 20.0918 22.934C19.4548 23.1979 18.7721 23.3337 18.0827 23.3337H6.99935C6.38051 23.3337 5.78702 23.0878 5.34943 22.6502C4.91185 22.2127 4.66602 21.6192 4.66602 21.0003Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.33203 14.0007H13.4154C14.0342 14.0007 14.6277 14.2465 15.0653 14.6841C15.5029 15.1217 15.7487 15.7151 15.7487 16.334C15.7487 16.9528 15.5029 17.5463 15.0653 17.9839C14.6277 18.4215 14.0342 18.6673 13.4154 18.6673H9.33203V10.5007C9.33203 10.1912 9.45495 9.89449 9.67374 9.67569C9.89253 9.4569 10.1893 9.33398 10.4987 9.33398H12.2487C12.8675 9.33398 13.461 9.57982 13.8986 10.0174C14.3362 10.455 14.582 11.0485 14.582 11.6673C14.582 12.2862 14.3362 12.8796 13.8986 13.3172C13.461 13.7548 12.8675 14.0007 12.2487 14.0007H10.4987M18.6654 18.6673H18.677" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-xs font-medium text-center leading-tight">
            Manage all Bookings
          </span>
        </Button>

        {/* View all Favourites Button */}
        <Button className="bg-blue-900 text-white p-4 rounded-lg flex flex-col items-center justify-center hover:bg-blue-800 h-36 transition-all duration-200 shadow-md hover:shadow-lg">
          <EyeFilled className="text-2xl mb-2 text-white" />
          <span className="text-xs font-medium text-center leading-tight">
            View all Favourites
          </span>
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;