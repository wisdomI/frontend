import QuickActions from '@/components/layouts/QuickActions'; 
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HeroBanner = () => {
  // Slider settings for responsiveness
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    
    customPaging: (i) => (
      <div className="w-2 h-2 rounded-full bg-blue-900 transition-all duration-300"></div>
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
          initialSlide: 1,
        },
      },
    ],
  };

  // Array of slide data 
  const slides = [
    {
      title: 'Photographer Workshop',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      dateLocation: 'October 28th - Studio Name',
      address: '1230 Main Street, New York City, NY 10001',
      discount: '10%',
      image: '/images/image.png', 
    },
    {
      title: 'Event Planning Seminar',
      description: 'Join us for an exciting seminar on event planning.',
      dateLocation: 'November 5th - Event Hall',
      address: '456 Event Lane, Los Angeles, CA 90001',
      discount: '15%',
      image: '/images/image.png',
    },
    {
      title: 'Catering Masterclass',
      description: 'Learn the art of catering with top chefs.',
      dateLocation: 'December 10th - Culinary Institute',
      address: '789 Chef Road, Chicago, IL 60601',
      discount: '20%',
      image: '/images/image.png', 
    },
  ];

  return (
    <>
      <style jsx global>{`
        .slick-dots-custom .slick-active div {
          background-color: #4169e1; /* Royal blue for active dot */
        }
        .slick-dots-custom div:hover {
          background-color: #1e90ff; /* Lighter blue for hover */
        }
      `}</style>
      <section className="mb-4 grid md:grid-cols-4 grid-cols-1 gap-4">
        <Slider {...sliderSettings} className='col-span-3'>
          {slides.map((slide, index) => (
            <div key={index} className="relative rounded-lg overflow-hidden h-56 md:h-72   col-span-2">
              <img 
                src={slide.image}
                alt={slide.title} 
                className="w-full h-full object-fit "
              />
            </div>
          ))}
        </Slider>
        <QuickActions />
      </section>
    </>
  );
};

export default HeroBanner;