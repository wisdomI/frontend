import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDownIcon } from '@heroicons/react/20/solid'; 
import ServiceRequestmodal from '../ui/modal/ServiceRequestmodal';

import { 
  UserGroupIcon, 
  MusicalNoteIcon, 
  HomeIcon, 
  // PhotographIcon, 
  CameraIcon, 
  PaintBrushIcon, 
  // SupportIcon, 
  ShoppingBagIcon, 
  // EmojiHappyIcon, 
  TruckIcon 
} from '@heroicons/react/20/solid'; 

const icons = {
  catering: <UserGroupIcon className="h-5 w-5" />, 
  entertainment: <MusicalNoteIcon className="h-5 w-5" />, 
  rentals: <HomeIcon className="h-5 w-5" />, 
  // decoration: <PhotographIcon className="h-5 w-5" />, 
  media: <CameraIcon className="h-5 w-5" />,
  beauty: <PaintBrushIcon className="h-5 w-5" />, 
  // support: <SupportIcon className="h-5 w-5" />, 
  fashion: <ShoppingBagIcon className="h-5 w-5" />, 
  materials: <ShoppingBagIcon className="h-5 w-5" />,
  // kids: <EmojiHappyIcon className="h-5 w-5" />,
  logistics: <TruckIcon className="h-5 w-5" />,
};


const menuItems = [
  {
    label: 'Catering & Drinks',
    icon: icons.catering,
    subMenu: [
      { label: 'Local/Continental Dishes', route: '/categories/catering/local-continental' },
      { label: 'Small Chops', route: '/categories/catering/small-chops' },
      { label: 'Cocktails & Traditional Drinks', route: '/categories/catering/cocktails' },
      { label: 'Palm Wine & Traditional Drinks', route: '/categories/catering/palm-wine' },
      { label: 'Cakes', route: '/categories/catering/cakes' },
      { label: 'Dessert/Candy Table Setup', route: '/categories/catering/dessert' },
    ],
  },
  {
    label: 'Entertainment',
    icon: icons.entertainment,
    subMenu: [
      { label: 'DJs', route: '/categories/entertainment/djs' },
      { label: 'MCs/Hosts/Comedians', route: '/categories/entertainment/mcs' },
      { label: 'Live Bands & Musicians', route: '/categories/entertainment/live-bands' },
      { label: 'Cultural Dance Troupes', route: '/categories/entertainment/dance-troupes' },
      { label: 'Hype Men/Women', route: '/categories/entertainment/hype-men' },
      { label: 'Fireworks/Special Effects', route: '/categories/entertainment/fireworks' },
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
      { label: 'Balloon Decor Artists', route: '/categories/decoration/balloon' },
      { label: 'Floral Designers', route: '/categories/decoration/floral' },
      { label: 'Event Stylists (e.g., themed parties)', route: '/categories/decoration/stylists' },
      { label: 'Aisle & Backdrop Creators', route: '/categories/decoration/aisle-backdrop' },
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
      { label: 'Ushers/Hostesses', route: '/categories/support/ushers' },
      { label: 'Bouncers/Security Services', route: '/categories/support/bouncers' },
      { label: 'Cleaners/Waste Management', route: '/categories/support/cleaners' },
      { label: 'Protocol & Usher Services', route: '/categories/support/protocol' },
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

const Sidebar: React.FC = () => {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const handleToggle = (label: string) => {
    setOpenMenus((prev) => ({
      ...Object.fromEntries(Object.entries(prev).map(([k, v]) => [k, false])), // Close others
      [label]: !prev[label],
    }));
  };

  return (
    <aside
      className="h-full w-64 bg-event-blue text-white flex flex-col p-4 shadow-lg rounded-xl overflow-y-auto"
      style={{ minHeight: 'calc(100vh - 2rem)' }}
    >
      <nav className="flex-1">
        <h2 className="text-lg font-semibold mb-4 text-center text-white ">Category</h2>
        <ul>
          {menuItems.map((item) => (
            <li key={item.label} className="mb-1">
              <div
                className="flex items-center justify-between cursor-pointer px-4 py-3 rounded-xl hover:bg-event-blue-hover transition-colors"
                onClick={() => handleToggle(item.label)}
              >
                <div className="flex items-center">
                  {item.icon}
                  <span className="ml-3 font-medium text-white">{item.label}</span>
                </div>
                {item.subMenu.length > 0 && (
                  <ChevronDownIcon className={`h-5 w-5 text-white transition-transform ${openMenus[item.label] ? 'rotate-180' : ''}`} />
                )}
              </div>
              {item.subMenu.length > 0 && openMenus[item.label] && (
                <ul className="ml-6 mt-2 space-y-1">
                  {item.subMenu.map((sub) => (
                    <li key={sub.label}>
                      <Link
                        href={sub.route}
                        className="block px-4 py-2 text-sm text-gray-200 rounded-lg hover:bg-blue-700 hover:text-white transition-colors"
                      >
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t ">
       <ServiceRequestmodal/>
      </div>
    </aside>
  );
};

export default Sidebar;