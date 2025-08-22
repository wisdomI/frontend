import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Button from '../ui/button';
import { PlusOutlined, FileSearchOutlined, CalendarOutlined, EyeFilled } from '@ant-design/icons';

const HeroWithActions = () => {
  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    customPaging: () => (
      <div className="w-2 h-2 rounded-full bg-blue-900 transition-all duration-300"></div>
    ),
  };

  // Slides
  const slides = [
    { image: '/images/image.png', title: 'Photographer Workshop' },
    { image: '/images/place1.jpg', title: 'Event Place' },
    { image: '/images/cake2.jpg', title: 'Cake Showcase' },
  ];

  // Quick actions
  const actions = [
    { icon: <EyeFilled />, label: 'View client request' },
    { icon: <PlusOutlined />, label: 'Post a Service Request' },
    { icon: <FileSearchOutlined />, label: 'Manage all Posts' },
    { icon: <CalendarOutlined />, label: 'Manage all Bookings' },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-6  mb-6">
      {/* Hero Banner */}
      <div className="md:col-span-3 mt-2 ">
        <Slider {...sliderSettings} className="mt-4">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="relative rounded-xl overflow-hidden h-56 md:h-68 w-full"
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Quick Actions */}
      <>
     
      <div className="md:col-span-1 flex flex-col w-full h-auto gap-4">
         <h2 className="text-2xl font-bold font-heading text-gray-700 ">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 ">
          {actions.map((action, idx) => (
            <Button
              key={idx}
              className="bg-dark-blue text-white p-6 rounded-xl flex flex-col items-center justify-center hover:bg-event-blue-hover "
            >
              <span className="bg-white text-dark-blue p-3 rounded-xl mb-2 text-lg">
                {action.icon}
              </span>
              {action.label}
            </Button>
          ))}
        </div>
      </div>
      </>
    </section>
  );
};

export default HeroWithActions;
