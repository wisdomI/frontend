
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { PlusOutlined, CalendarOutlined, EyeFilled, WindowsFilled } from '@ant-design/icons';
import Link from 'next/link';
import { FileSearch2Icon } from 'lucide-react';
import { BsFillPersonLinesFill,BsLayoutTextWindowReverse } from 'react-icons/bs';
import { RiMenuSearchLine } from "react-icons/ri";

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
    { icon: < PlusOutlined className='w-6 h-6 flex items-center justify-center font-sans'/>, label: 'Post a Service Request', href: '/post-service' },
    { icon: < RiMenuSearchLine className='w-6 h-6 flex items-center justify-center' />, label: 'Manage all posts', href: '/manage-posts' },
    { icon: <BsLayoutTextWindowReverse className='w-6 h-6 flex items-center justify-center  '/>, label: 'Manage all Bookings', href: '/bookings' },
    { icon: <EyeFilled className='w-6 h-6 flex items-center justify-center'/>, label: 'View all Favorites', href: '/favorites' },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 mt-6">
      {/* Hero Banner - aligned with sidebar menu options */}
      <div className="md:col-span-3 mt-16">
        <Slider {...sliderSettings}>
          {slides.map((slide, index) => (
            <div
              key={index}
              className="relative rounded-xl overflow-hidden h-56 md:h-64 w-full"
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

      {/* Quick Actions - header aligned with sidebar header */}
      <div className="md:col-span-1 flex flex-col">
        <h2 className="text-[32px] font-semibold font-heading text-gray-700 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {actions.map((action, idx) => (
            <Link key={idx} href={action.href} className="block">
              <div className="bg-event-blue text-white  rounded-xl flex flex-col gap-2    items-center justify-center hover:bg-blue-900 transition-colors min-h-[120px] text-sm w-full cursor-pointer group">
                <div className=' flex flex-col items-center justify-center'>
                <p className='p-3 bg-white text-event-blue rounded-xl  font-bold '><span >
                  {action.icon}
                </span></p>
                <p className=' w-full text-center px-4 mx-auto'>{action.label}</p>
                </div>
                
              </div>
            </Link>
          ))}
        </div>
      </div>
     
    </section>
  );
};

export default HeroWithActions;
