import Link from 'next/link';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
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
    { icon: <EyeFilled />, label: 'View all Favourites', href: '/favorites' },
    { icon: <PlusOutlined />, label: 'Post a Service Request', href: '/post-service' },
    { icon: <FileSearchOutlined />, label: 'Manage all Posts', href: '/manage-posts' },
    { icon: <CalendarOutlined />, label: 'Manage all Bookings', href: '/manage-bookings' },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
        <h2 className="text-[32px] font-semibold font-heading text-gray-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, idx) => (
            <Link key={idx} href={action.href} className="block">
              <div className="bg-event-blue text-white p-4 rounded-xl flex flex-col items-center justify-center hover:bg-blue-700 transition-colors min-h-[120px] text-sm w-full cursor-pointer group">
                <span className="bg-white text-event-blue p-3 rounded-xl mb-3 text-lg group-hover:scale-105 transition-transform">
                  {action.icon}
                </span>
                <span className="text-center leading-tight font-medium">{action.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroWithActions;
