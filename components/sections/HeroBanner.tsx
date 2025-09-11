import QuickActions from '@/components/layouts/QuickActions'; 
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HeroBanner = () => {
  // Slider settings for responsiveness
  const sliderSettings: any = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    dotsClass: "slick-dots-custom",
    
    customPaging: (i: number) => (
      <div className={`h-2 transition-all duration-300 ${
        i === 0 ? 'bg-blue-900 w-6 rounded-full' : 'bg-white border border-gray-300 w-2 rounded-full'
      }`}></div>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
  };

  // Array of slide data 
  const slides = [
    {
      title: 'Photographer Workshop',
      description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet.',
      date: 'October 28',
      time: '15:00 - 17:00',
      location: 'Studio Name',
      address: '123, Street Warriors, New York City, St 34567',
      discount: 'Early Bird Discount 10% Valid until 1 October',
      image: '/images/image.png',
      circularImage: '/images/image.png',
    },
    {
      title: 'Event Planning Seminar',
      description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet.',
      date: 'November 5',
      time: '10:00 - 12:00',
      location: 'Event Hall',
      address: '456 Event Lane, Los Angeles, CA 90001',
      discount: 'Early Bird Discount 15% Valid until 1 November',
      image: '/images/image.png',
      circularImage: '/images/image.png',
    },
    {
      title: 'Catering Masterclass',
      description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet.',
      date: 'December 10',
      time: '14:00 - 16:00',
      location: 'Culinary Institute',
      address: '789 Chef Road, Chicago, IL 60601',
      discount: 'Early Bird Discount 20% Valid until 1 December',
      image: '/images/image.png',
      circularImage: '/images/image.png',
    },
  ];

  return (
    <>
      <style jsx global>{`
        .slick-dots-custom .slick-active div {
          background-color: #1e3a8a !important;
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
      `}</style>
      
      <section className="mt-8 mb-12 pt-0">
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
          {/* Main Slider Section */}
          <div className="lg:col-span-3 order-1 lg:order-1">
            <Slider {...sliderSettings}>
              {slides.map((slide, index) => (
                <div key={index} className="relative">
                  <div className="relative h-64 md:h-80 lg:h-96 xl:h-[400px]">
                    <img 
                      src={slide.image}
                      alt={slide.title} 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
          
          {/* Quick Actions Section */}
          <div className="lg:col-span-1 order-2 lg:order-2">
            <div className="h-full">
              <QuickActions />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroBanner;