import Button from '@/components/ui/Button';
import Link from 'next/link';
import PostServiceModal from '@/components/ui/modal/ServiceRequestmodal';
import { PlusOutlined, FileSearchOutlined, CalendarOutlined, EyeFilled } from '@ant-design/icons';

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
          <CalendarOutlined className="text-2xl mb-2 text-white" />
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