import Button from '@/components/ui/Button'; 
import { PlusOutlined, FileSearchOutlined, CalendarOutlined, EyeFilled } from '@ant-design/icons';

const QuickActions = () => {
  return (
    <>

   
    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
      {/* Post a Service Request Button */}
      <Button className="bg-blue-900 text-white p-6 rounded-lg flex flex-col items-center justify-center hover:bg-blue-800 md:h-30 sm:h-auto">
        <PlusOutlined className="text-2xl mb-2 text-[#032D71] hover:text-[#032D71] transition-colors duration-200 bg-white rounded-md p-2" />
        Post a Service Request
      </Button>

      {/* Manage all Posts Button */}
      <Button className="bg-blue-900 text-white p-6 rounded-lg flex flex-col items-center justify-center hover:bg-blue-800 md:h-30  sm:h-auto">
        <FileSearchOutlined className="text-2xl mb-2 text-[#032D71] hover:text-[#032D71] transition-colors duration-200 bg-white rounded-md p-2" />
        Manage all Posts
      </Button>

      {/* Manage all Bookings Button */}
      <Button className="bg-blue-900 text-white p-6 rounded-lg flex flex-col items-center justify-center hover:bg-blue-800 md:h-30 sm:h-auto">
        <CalendarOutlined className="text-2xl mb-2 text-[#032D71] hover:text-[#032D71] transition-colors duration-200 bg-white rounded-md p-2" />
        Manage all Bookings
      </Button>

      {/* View all Favourites Button */}
      <Button className="bg-blue-900 text-white p-6 rounded-lg flex flex-col items-center justify-center hover:bg-blue-800 md:h-30  sm:h-auto">
        <EyeFilled className="text-2xl mb-2 text-[#032D71] hover:text-[#032D71] transition-colors duration-200 bg-white rounded-md p-2" />
        View all Favourites
      </Button>
    </div>
    </>
  );
};

export default QuickActions;