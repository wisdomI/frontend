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

const InlineFilterComponent: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['entertainment', 'beauty-grooming', 'event-support', 'kids-special-fun']);
  const [selectedBudget, setSelectedBudget] = useState<string[]>(['50000-99000', '1000000-1999000', '2000000+']);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [startDate, setStartDate] = useState('12/05/2023');
  const [endDate, setEndDate] = useState('23/06/2023');
  const [budgetRange, setBudgetRange] = useState([20, 50]);

  const categories = [
    { id: 'catering-drinks', label: 'Catering & Drinks' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'event-rentals', label: 'Event Rentals & Equipment' },
    { id: 'decoration-setup', label: 'Decoration and Setup' },
    { id: 'media-content', label: 'Media & Content' },
    { id: 'beauty-grooming', label: 'Beauty & Grooming' },
    { id: 'event-support', label: 'Event Support Services' },
    { id: 'fashion-styling', label: 'Fashion & Styling' },
    { id: 'vendors-materials', label: 'Vendors for Event Materials' },
    { id: 'kids-special-fun', label: 'Kids & Special Fun Vendors' },
    { id: 'hotels-restaurants', label: 'Hotels & Restaurants' },
    { id: 'gifts-registry', label: 'Gifts Registry' },
    { id: 'logistics-misc', label: 'Logistics & Miscellaneous' },
    { id: 'content-creators', label: 'Content Creators' }
  ];

  const budgetOptions = [
    { id: '20000-49000', label: '₦20,000 - ₦49,000' },
    { id: '50000-99000', label: '₦50,000 - ₦99,000' },
    { id: '100000-299000', label: '₦100,000 - ₦299,000' },
    { id: '300000-599000', label: '₦300,000 - ₦599,000' },
    { id: '600000-999000', label: '₦600,000 - ₦999,000' },
    { id: '1000000-1999000', label: '₦1,000,000 - ₦1,999,000' },
    { id: '2000000+', label: '> ₦2,000,000' }
  ];

  const filterOptions = [
    { id: 'top-rated', label: 'Top Rated' },
    { id: 'rising-stars', label: 'Rising Stars' },
    { id: 'best-valued', label: 'Best Valued' },
    { id: 'most-booked', label: 'Most Booked' }
  ];

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleBudgetToggle = (budgetId: string) => {
    setSelectedBudget(prev =>
      prev.includes(budgetId)
        ? prev.filter(id => id !== budgetId)
        : [...prev, budgetId]
    );
  };

  return (
    <div className="bg-white rounded-lg p-4 space-y-6 max-h-[calc(80vh-8rem)] overflow-y-auto">
      {/* Category Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-medium text-gray-800">Category</h3>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.id)}
                onChange={() => handleCategoryToggle(category.id)}
                className="w-4 h-4 text-event-blue border-gray-300 rounded focus:ring-event-blue"
              />
              <span className="text-sm font-sans text-gray-700">{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Budget Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-medium text-gray-800">Budget</h3>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        <div className="space-y-2 mb-4">
          {budgetOptions.map((budget) => (
            <label key={budget.id} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBudget.includes(budget.id)}
                onChange={() => handleBudgetToggle(budget.id)}
                className="w-4 h-4 text-event-blue border-gray-300 rounded focus:ring-event-blue"
              />
              <span className="text-sm font-sans text-gray-700">{budget.label}</span>
            </label>
          ))}
        </div>

        {/* Budget Range Slider */}
        <div className="mt-4">
          <div className="flex justify-between text-xs font-sans text-gray-500 mb-2">
            <span>20m</span>
            <span>50m</span>
          </div>
          <div className="flex justify-between text-xs font-sans text-gray-500 mb-3">
            <span>our mins</span>
            <span>4a mins</span>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={budgetRange[0]}
              onChange={(e) => setBudgetRange([parseInt(e.target.value), budgetRange[1]])}
              className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={budgetRange[1]}
              onChange={(e) => setBudgetRange([budgetRange[0], parseInt(e.target.value)])}
              className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Select Filter Options */}
      <div>
        <h3 className="font-heading font-medium text-gray-800 mb-3">Select Filter Options</h3>
        <div className="grid grid-cols-2 gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              className="px-3 py-2 text-sm font-sans border border-gray-300 rounded-lg hover:border-event-blue hover:text-event-blue transition-colors text-gray-700"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Location Section */}
      <div>
        <h3 className="font-heading font-medium text-gray-800 mb-3">Location</h3>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-event-blue text-sm font-sans"
        >
          <option value="">Select Location</option>
          <option value="lagos">Lagos</option>
          <option value="abuja">Abuja</option>
          <option value="kano">Kano</option>
          <option value="ibadan">Ibadan</option>
          <option value="port-harcourt">Port Harcourt</option>
        </select>
      </div>

      {/* Availability Section */}
      <div>
        <h3 className="font-heading font-medium text-gray-800 mb-3">Availability</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-sans text-gray-600 mb-1">Start Date</label>
            <div className="relative">
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-event-blue text-sm font-sans"
              />
              <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-sans text-gray-600 mb-1">End Date</label>
            <div className="relative">
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-event-blue text-sm font-sans"
              />
              <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
        className={`h-fit w-64 ${isFilterOpen ? 'bg-white' : 'bg-event-blue'} ${isFilterOpen ? 'text-gray-800' : 'text-white'} flex flex-col ${isFilterOpen ? 'p-0' : 'p-2'} shadow-lg rounded-2xl overflow-y-auto mt-4 transition-all duration-300 ${
          isMenuOpen ? 'block' : 'hidden md:block'
        }`}
        style={{ minHeight: 'calc(80vh - 3rem)' }}
      >
        <nav className="container flex-1">
          {!isFilterOpen ? (
            <ul>
              {menuItems.map((item) => (
                <li key={item.label} className="mb-1 group">
                  <div
                    ref={(el) => (menuRefs.current[item.label] = el)}
                    className="flex items-center justify-between border-b last:border-b-0 border-spacing-x-0 border-[#69797f] hover:text-yellow cursor-pointer px-2 py-3 group hover:bg-event-blue-hover transition-colors"
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
          ) : (
            <div className="h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-2xl">
                <h3 className="text-gray-800 font-semibold text-lg font-heading">Filter</h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-8 h-8 rounded-lg bg-event-blue text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  ×
                </button>
              </div>
              <InlineFilterComponent />
            </div>
          )}
        </nav>
      </aside>

      {/* Floating Submenu */}
      {activeSubmenu && !isFilterOpen && (
        <FloatingSubmenu
          items={menuItems.find(item => item.label === activeSubmenu)?.subMenu || []}
          position={submenuPosition}
          onClose={closeSubmenu}
        />
      )}
      
      <div className="p-2 bg-yellow-400 rounded-2xl font-bold md:mt-6">
        <ServiceRequestmodal />
      </div>
    </section>
  );
};

export default Sidebar;