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
    
    customPaging: (i: number) => (
      <div className="w-2 h-2 rounded-full bg-white/50 transition-all duration-300"></div>
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
          background-color: #ffffff !important;
          width: 24px !important;
          border-radius: 12px !important;
        }
        .slick-dots-custom div {
          width: 8px !important;
          height: 8px !important;
          border-radius: 50% !important;
          background-color: rgba(255, 255, 255, 0.5) !important;
          transition: all 0.3s ease !important;
        }
        .slick-dots-custom div:hover {
          background-color: rgba(255, 255, 255, 0.8) !important;
        }
        .slick-dots {
          bottom: 10px !important;
          position: absolute !important;
        }
        .slick-dots li {
          margin: 0 4px !important;
        }
        .slick-dots li button:before {
          font-size: 12px !important;
        }
      `}</style>
      <section className="mb-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Slider Section */}
          <div className="lg:col-span-3 order-1 lg:order-1">
            <div className="relative rounded-xl overflow-hidden shadow-xl pb-4">
              <Slider {...sliderSettings}>
                {slides.map((slide, index) => (
                  <div key={index} className="relative">
                    <div className="relative h-64 md:h-80 lg:h-96 xl:h-[400px]">
                      <img 
                        src={slide.image}
                        alt={slide.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
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