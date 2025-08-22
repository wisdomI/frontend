// import React, { useState } from 'react';
// import Link from 'next/link';
// import { ChevronDownIcon, Bars3Icon, FunnelIcon } from '@heroicons/react/20/solid';
// import ServiceRequestmodal from '../ui/modal/ServiceRequestmodal';

// import { 
//   UserGroupIcon, 
//   MusicalNoteIcon, 
//   HomeIcon, 
//   CameraIcon, 
//   PaintBrushIcon, 
//   ShoppingBagIcon, 
//   TruckIcon 
// } from '@heroicons/react/20/solid';
// import { Funnel } from 'lucide-react';

// const icons = {
//   catering: <UserGroupIcon className="h-5 w-5" />, 
//   entertainment: <MusicalNoteIcon className="h-5 w-5" />, 
//   rentals: <HomeIcon className="h-5 w-5" />, 
//   media: <CameraIcon className="h-5 w-5" />,
//   beauty: <PaintBrushIcon className="h-5 w-5" />, 
//   fashion: <ShoppingBagIcon className="h-5 w-5" />, 
//   materials: <ShoppingBagIcon className="h-5 w-5" />,
//   logistics: <TruckIcon className="h-5 w-5" />,
// };

// // Placeholder for missing icons (using existing ones as fallback)
// const placeholderIcon = <ShoppingBagIcon className="h-5 w-5" />;

// const menuItems = [
//   {
//     label: 'Catering & Drinks',
//     icon: icons.catering,
//     subMenu: [
//       { label: 'Local/Continental Dishes', route: '/categories/catering/local-continental' },
//       { label: 'Small Chops', route: '/categories/catering/small-chops' },
//       { label: 'Cocktails & Traditional Drinks', route: '/categories/catering/cocktails' },
//       { label: 'Palm Wine & Traditional Drinks', route: '/categories/catering/palm-wine' },
//       { label: 'Cakes', route: '/categories/catering/cakes' },
//       { label: 'Dessert/Candy Table Setup', route: '/categories/catering/dessert' },
//     ],
//   },
//   {
//     label: 'Entertainment',
//     icon: icons.entertainment,
//     subMenu: [
//       { label: 'DJs', route: '/categories/entertainment/djs' },
//       { label: 'MCs/Hosts/Comedians', route: '/categories/entertainment/mcs' },
//       { label: 'Live Bands & Musicians', route: '/categories/entertainment/live-bands' },
//       { label: 'Cultural Dance Troupes', route: '/categories/entertainment/dance-troupes' },
//       { label: 'Hype Men/Women', route: '/categories/entertainment/hype-men' },
//       { label: 'Fireworks/Special Effects', route: '/categories/entertainment/fireworks' },
//     ],
//   },
//   {
//     label: 'Event Rentals & Equipment',
//     icon: icons.rentals,
//     subMenu: [
//       { label: 'Chairs/Tables/Tents', route: '/categories/rentals/chairs-tables' },
//       { label: 'Cooling/Ventilation Systems', route: '/categories/rentals/cooling' },
//       { label: 'Sound Systems/Speakers', route: '/categories/rentals/sound-systems' },
//       { label: 'Lighting & LED Screens', route: '/categories/rentals/lighting' },
//       { label: 'Stage/Backdrops', route: '/categories/rentals/stage' },
//       { label: 'Generators/Power Supply', route: '/categories/rentals/generators' },
//     ],
//   },
//   {
//     label: 'Decoration & Setup',
//     icon: placeholderIcon, // Fallback for missing decoration icon
//     subMenu: [
//       { label: 'Balloon Decor Artists', route: '/categories/decoration/balloon' },
//       { label: 'Floral Designers', route: '/categories/decoration/floral' },
//       { label: 'Event Stylists (e.g., themed parties)', route: '/categories/decoration/stylists' },
//       { label: 'Aisle & Backdrop Creators', route: '/categories/decoration/aisle-backdrop' },
//     ],
//   },
//   {
//     label: 'Media & Content',
//     icon: icons.media,
//     subMenu: [
//       { label: 'Photographers', route: '/categories/media/photographers' },
//       { label: 'Videographers', route: '/categories/media/videographers' },
//       { label: 'Photo Booths Services', route: '/categories/media/photo-booths' },
//       { label: 'Instant Photo Printing (polaroid-style)', route: '/categories/media/instant-printing' },
//     ],
//   },
//   {
//     label: 'Beauty & Grooming',
//     icon: icons.beauty,
//     subMenu: [
//       { label: 'Makeup Artists/Hairstylists', route: '/categories/beauty/makeup-hairstylists' },
//       { label: 'Henna/Tattoo Artists', route: '/categories/beauty/henna-tattoo' },
//       { label: 'Spa/Pamper Mobile Services', route: '/categories/beauty/spa-mobile' },
//     ],
//   },
//   {
//     label: 'Event Support Services',
//     icon: placeholderIcon, // Fallback for missing support icon
//     subMenu: [
//       { label: 'Ushers/Hostesses', route: '/categories/support/ushers' },
//       { label: 'Bouncers/Security Services', route: '/categories/support/bouncers' },
//       { label: 'Cleaners/Waste Management', route: '/categories/support/cleaners' },
//       { label: 'Protocol & Usher Services', route: '/categories/support/protocol' },
//     ],
//   },
//   {
//     label: 'Fashion & Styling',
//     icon: icons.fashion,
//     subMenu: [
//       { label: 'Tailors/Seamstresses', route: '/categories/fashion/tailors' },
//       { label: 'Fashion Designers', route: '/categories/fashion/designers' },
//       { label: 'Accessories Vendors (beads, jewelry)', route: '/categories/fashion/accessories' },
//     ],
//   },
//   {
//     label: 'Vendors for Event Materials',
//     icon: icons.materials,
//     subMenu: [
//       { label: 'Fabric Sellers', route: '/categories/materials/fabric' },
//       { label: 'Party Favors/Souvenirs', route: '/categories/materials/party-favors' },
//       { label: 'Invitation Cards/Design & Print', route: '/categories/materials/invitations' },
//     ],
//   },
//   {
//     label: 'Kids & Special Fun Vendors',
//     icon: placeholderIcon, // Fallback for missing kids icon
//     subMenu: [
//       { label: 'Bouncy Castles/Inflatables', route: '/categories/kids/bouncy-castles' },
//       { label: 'Clowns/Magicians', route: '/categories/kids/clowns' },
//       { label: 'Games Coordinators', route: '/categories/kids/games' },
//       { label: 'Cotton Candy/Popcorn Machines', route: '/categories/kids/candy-machines' },
//     ],
//   },
//   {
//     label: 'Logistics & Miscellaneous',
//     icon: icons.logistics,
//     subMenu: [
//       { label: 'Event Planners/Coordinators', route: '/categories/logistics/planners' },
//       { label: 'Vendor Transport/Logistics Services', route: '/categories/logistics/transport' },
//       { label: 'On-the-day Coordinators/Day Managers', route: '/categories/logistics/day-managers' },
//       { label: 'Chauffer Services', route: '/categories/logistics/chauffer' },
//       { label: 'Caravan/Marquee Rentals', route: '/categories/logistics/caravan' },
//       { label: 'Custom Gift Makers', route: '/categories/logistics/custom-gifts' },
//     ],
//   },
// ];

// const FilterComponent: React.FC = () => {
//   const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [selectedDate, setSelectedDate] = useState<string>('');

//   const categories = menuItems.map(item => item.label);

//   return (
//     <div className="bg-dark-blue text-white p-4 rounded-xl shadow-lg mt-4">
//       <h3 className="text-md font-heading mb-4">Filters</h3>
//       <div className="space-y-4">
//         {/* Category Filter */}
//         <div>
//           <label className="block font-sans mb-2">Category</label>
//           <select
//             value={selectedCategory || ''}
//             onChange={(e) => setSelectedCategory(e.target.value || null)}
//             className="w-full p-2 bg-white text-dark-blue rounded-lg"
//           >
//             <option value="">All Categories</option>
//             {categories.map((category) => (
//               <option key={category} value={category}>{category}</option>
//             ))}
//           </select>
//         </div>

//         {/* Price Range Filter */}
//         <div>
//           <label className="block text-sm font-sans mb-2">Price Range ($)</label>
//           <input
//             type="range"
//             min="0"
//             max="1000"
//             value={priceRange.max}
//             onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
//             className="w-full"
//           />
//           <div className="flex justify-between text-sm mt-2">
//             <span>Min: $0</span>
//             <span>Max: ${priceRange.max}</span>
//           </div>
//         </div>

//         {/* Date Filter */}
//         <div>
//           <label className="block text-sm font-sans mb-2">Date</label>
//           <input
//             type="date"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//             className="w-full p-2 bg-white text-dark-blue rounded-lg"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// const Sidebar: React.FC = () => {
//   const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const handleToggle = (label: string) => {
//     setOpenMenus((prev) => ({
//       ...Object.fromEntries(Object.entries(prev).map(([k]) => [k, false])), // Close others
//       [label]: !prev[label],
//     }));
//   };

//   const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

//   return (
//     <section className="px-2">
//       <div className="flex flex-row justify-between items-center mt-6">
//         <div
//           className="mx-2 bg-event-blue p-2 rounded-xl cursor-pointer"
//           onClick={toggleMenu}
//         >
//           <Bars3Icon className="h-6 w-6 text-white" />
//         </div>
//         <h2 className="text-2xl font-bold text-center md:text-[30px] font-sans text-gray-700">Category</h2>
//         <div
//           className="mx-2 bg-event-blue p-2 rounded-xl cursor-pointer"
//           onClick={toggleFilter}
//         >
//           < FunnelIcon className="h-6 w-6 text-white" />
//         </div>
//       </div>
//       <aside
//         className={`h-fit w-64 bg-event-blue text-white flex flex-col p-4 shadow-lg rounded-3xl overflow-y-auto mt-6 ${
//           isMenuOpen ? 'block' : 'hidden md:block'
//         }`}
//         style={{ minHeight: 'calc(100vh - 2rem)' }}
//       >
//         <nav className="container flex-1">
//           <ul>
//             {menuItems.map((item) => (
//               <li key={item.label} className="mb-1">
//                 <div
//                   className="flex items-center justify-between cursor-pointer px-4 py-3 rounded-xl hover:bg-event-blue-hover transition-colors"
//                   onClick={() => handleToggle(item.label)}
//                 >
//                   <div className="flex items-center">
//                     {item.icon || placeholderIcon}
//                     <span className="ml-3 font-medium text-white">{item.label}</span>
//                   </div>
//                   {item.subMenu.length > 0 && (
//                     <ChevronDownIcon
//                       className={`h-5 w-5 text-white transition-transform ${
//                         openMenus[item.label] ? 'rotate-180' : ''
//                       }`}
//                     />
//                   )}
//                 </div>
//                 {item.subMenu.length > 0 && openMenus[item.label] && (
//                   <ul className="ml-6 mt-2 space-y-1">
//                     {item.subMenu.map((sub) => (
//                       <li key={sub.label}>
//                         <Link
//                           href={sub.route}
//                           className="block border-t border-t-slate-600 px-4 py-2 text-sm text-gray-200 hover:text-yellow transition-colors"
//                         >
//                           {sub.label}
//                         </Link>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </nav>
//       </aside>
//       {isFilterOpen && <FilterComponent />}
//       <div className="p-2 bg-[#fec240] rounded-2xl font-bold md:mt-10">
//         <ServiceRequestmodal />
//       </div>
//     </section>
//   );
// };

// export default Sidebar;




import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, 
  Menu, 
  Filter,
  Users, 
  Music, 
  Home, 
  Camera, 
  Palette, 
  ShoppingBag, 
  Truck,
  Sparkles,
  Headphones,
  Baby
} from 'lucide-react';

import ServiceRequestmodal from '../ui/modal/ServiceRequestmodal';
// const ServiceRequestmodal = () => (
//   <button className="w-full text-center py-2 text-black">
//     Request Service
//   </button>
// );

const icons = {
  catering: <Users className="h-5 w-5" />, 
  entertainment: <Music className="h-5 w-5" />, 
  rentals: <Home className="h-5 w-5" />, 
  media: <Camera className="h-5 w-5" />,
  beauty: <Palette className="h-5 w-5" />, 
  fashion: <ShoppingBag className="h-5 w-5" />, 
  materials: <ShoppingBag className="h-5 w-5" />,
  logistics: <Truck className="h-5 w-5" />,
  decoration: <Sparkles className="h-5 w-5" />,
  support: <Headphones className="h-5 w-5" />,
  kids: <Baby className="h-5 w-5" />,
};

// Placeholder for missing icons (using existing ones as fallback)
const placeholderIcon = <ShoppingBag className="h-5 w-5" />;

const menuItems = [
  {
    label: 'Catering & Drinks',
    icon: icons.catering,
    subMenu: [
      { label: 'Caterers (Local & Continental Dishes)', route: '/categories/catering' },
      { label: 'Small Chops Vendors' , route: '/categories/catering/small-chops' },
      { label: 'Cocktails & Mocktail Services', route: '/categories/catering/cocktails' },
      { label: 'Palm Wine & Traditional Drinks Vendors', route: '/categories/catering/palm-wine' },
      { label: 'Mobile Bar Services', route: '/categories/bar services' },
      { label: 'Cake Bakers', route: '/categories/cakes' },
      { label: 'Dessert/Candy Table Setup', route: '/categories/catering/dessert' },
    ],
  },
  {
    label: 'Entertainment',
    icon: icons.entertainment,
    subMenu: [
      { label: 'DJs', route: '/categories/entertainment/djs' },
      { label: 'MCs/Comperes', route: '/categories/entertainment/mcs' },
      { label: 'Live Bands/Traditional Musicians', route: '/categories/entertainment/live-bands' },
      { label: 'Cultural Dance Troupes', route: '/categories/entertainment/' },
      { label: 'Hype Men/Women', route: '/categories/entertainment/hype-men' },
      { label: 'Fireworks & Special Effects', route: '/categories/entertainment/fireworks' },
    ],
  },
  {
    label: 'Event Rentals & Equipment',
    icon: icons.rentals,
    subMenu: [
      { label: 'Chairs/Tables/Tents', route: '/categories/rentals/chairs-tables' },
      { label: 'Cooling/Ventilation Systems', route: '/categories/rentals/cooling' },
      { label: 'Sound Systems/Speakers', route: '/categories/rentals/sound-systems' },
      { label: 'Lighting & LED Screens', route: '/categories/rentals/lighting' },
      { label: 'Stage/Backdrops', route: '/categories/rentals/stage' },
      { label: 'Generators/Power Supply', route: '/categories/rentals/generators' },
    ],
  },
  {
    label: 'Decoration & Setup',
    icon: icons.decoration,
    subMenu: [
      { label: 'Event Decorators', route: '/categories/decoration' },
      { label: 'Ballon Decor Artistes', route: '/categories/decorators' },
      { label: 'Floral Designers', route: '/categories/decoration/floral' },
         { label: 'Aisle & Backdrop Creators', route: '/categories/decoration/aisle-backdrop' },
      { label: 'Event Stylists (e.g., themed parties)', route: '/categories/decoration/stylists' },
   
    ],
  },
  {
    label: 'Media & Content',
    icon: icons.media,
    subMenu: [
      { label: 'Photographers', route: '/categories/media/photographers' },
      { label: 'Videographers', route: '/categories/media/videographers' },
      { label: 'Photo Booths Services', route: '/categories/media/photo-booths' },
      { label: 'Instant Photo Printing (polaroid-style)', route: '/categories/media/instant-printing' },
    ],
  },
  {
    label: 'Beauty & Grooming',
    icon: icons.beauty,
    subMenu: [
      { label: 'Makeup Artists/Hairstylists', route: '/categories/beauty/makeup-hairstylists' },
      { label: 'Henna/Tattoo Artists', route: '/categories/beauty/henna-tattoo' },
      { label: 'Spa/Pamper Mobile Services', route: '/categories/beauty/spa-mobile' },
    ],
  },
  {
    label: 'Event Support Services',
    icon: icons.support,
    subMenu: [
      {lable: 'Event Planners/Cordinators', route: '/categories/event' },
      { label: 'Ushers/Hostesses', route: '/categories/support/ushers' },
      { label: 'Bouncers/Security Services', route: '/categories/support/bouncers' },
      { label: 'Protocol & Usher Services', route: '/categories/support/protocol' },
      { label: 'Parking Assistants', route: '/categories/support/protocol' },
      { label: 'Cleaners/Waste Management', route: '/categories/support/cleaners' },
      
    ],
  },
  {
    label: 'Fashion & Styling',
    icon: icons.fashion,
    subMenu: [
      { label: 'Tailors/Seamstresses', route: '/categories/fashion/tailors' },
      { label: 'Fashion Designers', route: '/categories/fashion/designers' },
      { label: 'Accessories Vendors (beads, jewelry)', route: '/categories/fashion/accessories' },
    ],
  },
  {
    label: 'Vendors for Event Materials',
    icon: icons.materials,
    subMenu: [
      { label: 'Fabric Sellers', route: '/categories/materials/fabric' },
      { label: 'Party Favors/Souvenirs', route: '/categories/materials/party-favors' },
      { label: 'Invitation Cards/Design & Print', route: '/categories/materials/invitations' },
    ],
  },
  {
    label: 'Kids & Special Fun Vendors',
    icon: icons.kids,
    subMenu: [
      { label: 'Bouncy Castles/Inflatables', route: '/categories/kids/bouncy-castles' },
      { label: 'Clowns/Magicians', route: '/categories/kids/clowns' },
      { label: 'Games Coordinators', route: '/categories/kids/games' },
      { label: 'Cotton Candy/Popcorn Machines', route: '/categories/kids/candy-machines' },
    ],
  },
  {
    label: 'Venue Providers',
    icon: icons.fashion,
    subMenu: [
      { label: 'Hall Rentage ', route: '/categories/Venue/Hall' },
      { label: 'Canopy Installations', route: '/categories/canopy' },
      { label: 'Accessories', route: '/categories/venues/accessories' },
    ],
  },
  {
    label: 'Logistics & Miscellaneous',
    icon: icons.logistics,
    subMenu: [
      { label: 'Event Planners/Coordinators', route: '/categories/logistics/planners' },
      { label: 'Vendor Transport/Logistics Services', route: '/categories/logistics/transport' },
      { label: 'On-the-day Coordinators/Day Managers', route: '/categories/logistics/day-managers' },
      { label: 'Chauffer Services', route: '/categories/logistics/chauffer' },
      { label: 'Caravan/Marquee Rentals', route: '/categories/logistics/caravan' },
      { label: 'Custom Gift Makers', route: '/categories/logistics/custom-gifts' },
    ],
  }, 
];

const FilterComponent: React.FC = () => {
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const categories = menuItems.map(item => item.label);

  return (
    <div className="bg-event-blue text-white p-2 rounded-xl shadow-lg ">
      <h3 className="text-md font-semibold mb-4 text-[32px]">Filters</h3>
      <div className="space-y-4">
        {/* Category Filter */}
        <div>
          <label className="block mb-2  text-[20px]">Category</label>
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="w-full p-2 bg-white text-blue-900 rounded-lg"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm mb-2">Price Range ($)</label>
          <input
            type="range"
            min="0"
            max="1000"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-sm mt-2">
            <span>Min: $0</span>
            <span>Max: ${priceRange.max}</span>
          </div>
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-sm mb-2">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2 bg-white text-blue-900 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

interface FloatingSubmenuProps {
  items: { label: string; route: string }[];
  position: { top: number; left: number };
  onClose: () => void;
}

const FloatingSubmenu: React.FC<FloatingSubmenuProps> = ({ items, position, onClose }) => {
  const submenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (submenuRef.current && !submenuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={submenuRef}
      className="fixed z-50 font-semibold bg-event-blue font-sans text-white rounded-xl shadow-2xl border border-event-blue min-w-[280px] max-w-[390px] backdrop-blur-sm  mx-4"
      style={{
        top: position.top,
        left: position.left,
        animation: 'slideInRight 0.2s ease-out'
      }}
    >
      <div className="p-4">
        {items.map((item, index) => (
          <Link
            key={item.label}
            href={item.route}
            className="block px-4 py-3 text-[16px] font-heading tracking-tight   font-bold text-[#fff] hover:text-yellow  border-b-1  transition-all duration-200 border-b  border-[#69797f] last:border-b-0"
            onClick={onClose}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

const Sidebar: React.FC = () => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [submenuPosition, setSubmenuPosition] = useState({ top: 0, left: 0 });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleMenuClick = (label: string, event: React.MouseEvent) => {
    const menuElement = menuRefs.current[label];
    if (menuElement) {
      const rect = menuElement.getBoundingClientRect();
      setSubmenuPosition({
        top: rect.top,
        left: rect.right + 8, // 8px gap from the main menu
      });
    }
    
    setActiveSubmenu(activeSubmenu === label ? null : label);
  };

  const closeSubmenu = () => {
    setActiveSubmenu(null);
  };

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <section className="px-2">
      <div className="flex flex-row justify-between items-center">
        <div
          className="mx-2 bg-event-blue p-2 rounded-xl cursor-pointer hover:bg-event-blue transition-colors"
          onClick={toggleMenu}
        >
          <Menu className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-[18px] font-bold text-center md:text-[26px] text-gray-700 font-heading">Category</h2>
        <div
          className="mx-2 bg-event-blue p-2 rounded-xl cursor-pointer hover:bg-blue-900 transition-colors"
          onClick={toggleFilter}
        >
          <Filter className="h-6 w-6 text-white" />
        </div>
      </div>
      
      <aside
        className={`h-fit w-fit bg-event-blue  text-white flex flex-col p-2 shadow-lg rounded-2xl overflow-y-auto mt-4 transition-all duration-300 ${
          isMenuOpen ? 'block' : 'hidden md:block'
        }`}
        style={{ minHeight: 'calc(80vh - 3rem)' }}
      >
        <nav className="container flex-1 ">
          <ul>
            {menuItems.map((item) => (
              <li key={item.label} className="mb-1 group ">
                <div
                  ref={(el) => (menuRefs.current[item.label] = el)}
                  className="flex items-center justify-between border-b last:border-b-0 border-spacing-x-0 border-[#69797f] hover:text-yellow cursor-pointer px-2 py-3 group  hover:bg-event-blue-hover transition-colors "
                  onClick={(e) => handleMenuClick(item.label, e)}
                >
                  <div className="flex items-center hover:text-yellow">
                    {item.icon || placeholderIcon}
                    <span className="ml-3 font-medium text-white hover:text-yellow">{item.label}</span>
                  </div>
                  {item.subMenu.length > 0 && (
                    <ChevronRight
                      className={`h-5 w-5 text-white transition-transform hover:text-yellow ${
                        activeSubmenu === item.label ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Floating Submenu */}
      {activeSubmenu && (
        <FloatingSubmenu
          items={menuItems.find(item => item.label === activeSubmenu)?.subMenu || []}
          position={submenuPosition}
          onClose={closeSubmenu}
        />
      )}

      {isFilterOpen && <FilterComponent />}
      
      <div className="p-2 bg-yellow-400 rounded-2xl font-bold md:mt-6">
        <ServiceRequestmodal />
      </div>
    </section>
  );
};

export default Sidebar;