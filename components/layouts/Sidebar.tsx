'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import PostServiceModal from '../ui/modal/ServiceRequestmodal'
import FilterModal from '../ui/modals/FilterModal'
import {
  CakeIcon,
  UserGroupIcon,
  HomeIcon,
  FlagIcon,
  CameraIcon,
  PaintBrushIcon,
  ShoppingBagIcon,
  TruckIcon,
  ArchiveBoxIcon,
  PencilIcon,
  ChevronRightIcon,
  PlusIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/solid'

const icons = {
  catering: <CakeIcon className="h-6 w-6" />,
  entertainment: <UserGroupIcon className="h-6 w-6" />,
  rentals: <HomeIcon className="h-6 w-6" />,
  decoration: <FlagIcon className="h-6 w-6" />,
  media: <CameraIcon className="h-6 w-6" />,
  beauty: <PaintBrushIcon className="h-6 w-6" />,
  support: <UserGroupIcon className="h-6 w-6" />,
  fashion: <ShoppingBagIcon className="h-6 w-6" />,
  logistics: <TruckIcon className="h-6 w-6" />,
  venue: <HomeIcon className="h-6 w-6" />,
  materials: <ArchiveBoxIcon className="h-6 w-6" />,
  kids: <UserGroupIcon className="h-6 w-6" />,
  content: <CameraIcon className="h-6 w-6" />,
}

const menuItems = [
  {
    label: 'Catering & Drinks',
    icon: icons.catering,
    route: '/services/catering',
    subMenu: [
      {
        label: 'Local/Continental Dishes',
        route: '/categories/catering/local-continental',
      },
      { label: 'Small Chops', route: '/categories/catering/small-chops' },
      {
        label: 'Cocktails & Traditional Drinks',
        route: '/categories/catering/cocktails',
      },
      {
        label: 'Palm Wine & Traditional Drinks',
        route: '/categories/catering/palm-wine',
      },
      { label: 'Cakes', route: '/categories/catering/cakes' },
      {
        label: 'Dessert/Candy Table Setup',
        route: '/categories/catering/dessert',
      },
    ],
  },
  {
    label: 'Entertainment',
    icon: icons.entertainment,
    route: '/services/entertainment',
    subMenu: [
      { label: 'DJs', route: '/categories/entertainment/djs' },
      { label: 'MCs/Hosts/Comedians', route: '/categories/entertainment/mcs' },
      {
        label: 'Live Bands & Musicians',
        route: '/categories/entertainment/live-bands',
      },
      {
        label: 'Cultural Dance Troupes',
        route: '/categories/entertainment/dance-troupes',
      },
      { label: 'Hype Men/Women', route: '/categories/entertainment/hype-men' },
      {
        label: 'Fireworks/Special Effects',
        route: '/categories/entertainment/fireworks',
      },
    ],
  },
  {
    label: 'Rentals & Equipment',
    icon: icons.rentals,
    route: '/services/rentals',
    subMenu: [
      {
        label: 'Chairs/Tables/Tents',
        route: '/categories/rentals/chairs-tables',
      },
      {
        label: 'Cooling/Ventilation Systems',
        route: '/categories/rentals/cooling',
      },
      {
        label: 'Sound Systems/Speakers',
        route: '/categories/rentals/sound-systems',
      },
      {
        label: 'Lighting & LED Screens',
        route: '/categories/rentals/lighting',
      },
      { label: 'Stage/Backdrops', route: '/categories/rentals/stage' },
      {
        label: 'Generators/Power Supply',
        route: '/categories/rentals/generators',
      },
    ],
  },
  {
    label: 'Decoration and Setup',
    icon: icons.decoration,
    route: '/services/decoration',
    subMenu: [
      {
        label: 'Balloon Decor Artists',
        route: '/categories/decoration/balloon',
      },
      { label: 'Floral Designers', route: '/categories/decoration/floral' },
      {
        label: 'Event Stylists (e.g., themed parties)',
        route: '/categories/decoration/stylists',
      },
      {
        label: 'Aisle & Backdrop Creators',
        route: '/categories/decoration/aisle-backdrop',
      },
    ],
  },
  {
    label: 'Media & Content',
    icon: icons.media,
    route: '/services/media',
    subMenu: [
      { label: 'Photographers', route: '/categories/media/photographers' },
      { label: 'Videographers', route: '/categories/media/videographers' },
      {
        label: 'Photo Booths Services',
        route: '/categories/media/photo-booths',
      },
      {
        label: 'Instant Photo Printing (polaroid-style)',
        route: '/categories/media/instant-printing',
      },
    ],
  },
  {
    label: 'Beauty & Grooming',
    icon: icons.beauty,
    route: '/services/beauty',
    subMenu: [
      {
        label: 'Makeup Artists/Hairstylists',
        route: '/categories/beauty/makeup-hairstylists',
      },
      {
        label: 'Henna/Tattoo Artists',
        route: '/categories/beauty/henna-tattoo',
      },
      {
        label: 'Spa/Pamper Mobile Services',
        route: '/categories/beauty/spa-mobile',
      },
    ],
  },
  {
    label: 'Event Support Services',
    icon: icons.support,
    route: '/services/support',
    subMenu: [
      { label: 'Ushers/Hostesses', route: '/categories/support/ushers' },
      {
        label: 'Bouncers/Security Services',
        route: '/categories/support/bouncers',
      },
      {
        label: 'Cleaners/Waste Management',
        route: '/categories/support/cleaners',
      },
      {
        label: 'Protocol & Usher Services',
        route: '/categories/support/protocol',
      },
    ],
  },
  {
    label: 'Fashion & Styling',
    icon: icons.fashion,
    route: '/services/fashion',
    subMenu: [
      { label: 'Tailors/Seamstresses', route: '/categories/fashion/tailors' },
      { label: 'Fashion Designers', route: '/categories/fashion/designers' },
      {
        label: 'Accessories Vendors (beads, jewelry)',
        route: '/categories/fashion/accessories',
      },
    ],
  },
  {
    label: 'Logistics & Miscellaneous',
    icon: icons.logistics,
    route: '/services/logistics',
    subMenu: [
      {
        label: 'Event Planners/Coordinators',
        route: '/categories/logistics/planners',
      },
      {
        label: 'Vendor Transport/Logistics Services',
        route: '/categories/logistics/transport',
      },
      {
        label: 'On-the-day Coordinators/Day Managers',
        route: '/categories/logistics/day-managers',
      },
      { label: 'Chauffer Services', route: '/categories/logistics/chauffer' },
      {
        label: 'Caravan/Marquee Rentals',
        route: '/categories/logistics/caravan',
      },
      {
        label: 'Custom Gift Makers',
        route: '/categories/logistics/custom-gifts',
      },
    ],
  },
  {
    label: 'Venue Providers',
    icon: icons.venue,
    route: '/services/venue',
    subMenu: [
      { label: 'Event Venues', route: '/categories/venue/venues' },
      { label: 'Event Halls', route: '/categories/venue/halls' },
      { label: 'Outdoor Spaces', route: '/categories/venue/outdoor' },
      {
        label: 'Banquet & Conference Rooms',
        route: '/categories/venue/banquet',
      },
    ],
  },
  {
    label: 'Event Materials',
    icon: icons.materials,
    route: '/services/materials',
    subMenu: [
      { label: 'Fabric Sellers', route: '/categories/materials/fabric' },
      {
        label: 'Party Favors/Souvenirs',
        route: '/categories/materials/party-favors',
      },
      {
        label: 'Invitation Cards/Design & Print',
        route: '/categories/materials/invitations',
      },
    ],
  },
  {
    label: 'Kids & Special Fun Vendors',
    icon: icons.kids,
    route: '/services/kids',
    subMenu: [
      {
        label: 'Bouncy Castles/Inflatables',
        route: '/categories/kids/bouncy-castles',
      },
      { label: 'Clowns/Magicians', route: '/categories/kids/clowns' },
      { label: 'Games Coordinators', route: '/categories/kids/games' },
      {
        label: 'Cotton Candy/Popcorn Machines',
        route: '/categories/kids/candy-machines',
      },
    ],
  },
  {
    label: 'Content Creators',
    icon: icons.content,
    route: '/services/content',
    subMenu: [
      { label: 'Bloggers', route: '/categories/content/bloggers' },
      {
        label: 'Social Media Influencers',
        route: '/categories/content/social-media',
      },
      {
        label: 'Video Producers',
        route: '/categories/content/video-producers',
      },
      { label: 'Podcasters', route: '/categories/content/podcasters' },
    ],
  },
]

const Sidebar: React.FC = () => {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({})
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const pathname = usePathname()

  const handleToggle = (label: string) => {
    setOpenMenus(prev => ({
      ...Object.fromEntries(Object.entries(prev).map(([k, v]) => [k, false])), // Close others
      [label]: !prev[label],
    }))
  }

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  // Check if a menu item or its submenu is active
  const isActive = (item: any) => {
    if (pathname === item.route) return true
    return item.subMenu.some((sub: any) => pathname === sub.route)
  }

  // Check if a submenu item is active
  const isSubMenuActive = (subRoute: string) => {
    return pathname === subRoute
  }

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={toggleMobileSidebar}
        className="md:hidden fixed top-20 left-4 z-50 bg-[#0B2E6F] text-white p-2 rounded-lg shadow-lg"
      >
        {isMobileOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 flex-shrink-0 transition-all duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:relative md:block
        fixed md:static top-0 left-0 z-50 md:z-auto
        h-screen md:h-full md:max-h-full md:overflow-y-auto
      `}>
        {isFilterModalOpen ? (
          <FilterModal 
            isOpen={isFilterModalOpen} 
            onClose={() => setIsFilterModalOpen(false)} 
          />
        ) : (
          <div className="flex flex-col h-full md:h-full">
          {/* Header Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              {/* Left - Empty space */}
              <div></div>
              
              {/* Center - Category Title */}
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 font-raleway">Category</h2>
              
              {/* Right - Filter Icon */}
              <button 
                onClick={() => setIsFilterModalOpen(true)}
                className="bg-blue-900 text-white p-3 rounded-lg hover:bg-blue-800 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Blue container with service categories */}
          <div className="bg-[#0B2E6F] rounded-xl p-3 md:p-4 flex-1 md:flex-none overflow-hidden">
            <nav>
              <ul className="space-y-0.5 md:space-y-1">
                {menuItems.map((item, index) => {
                  const active = isActive(item)
                  return (
                    <li key={item.label}>
                      <div
                        className={`flex items-center justify-between px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors cursor-pointer ${
                          active
                            ? 'bg-yellow-400 text-blue-900' 
                            : index === 0 && !active
                            ? 'text-white hover:bg-blue-800'
                            : 'text-white hover:bg-blue-800'
                        }`}
                        onClick={() => handleToggle(item.label)}
                      >
                        <div className="flex items-center space-x-2 md:space-x-3">
                          <div className={`${active ? 'text-blue-900' : 'text-white'}`}>
                            {React.cloneElement(item.icon, {
                              className: `h-5 w-5 md:h-6 md:w-6 ${active ? 'text-blue-900' : 'text-white'}`,
                            })}
                          </div>
                          <span className="font-medium text-sm md:text-base">
                            {item.label}
                          </span>
                        </div>
                        {item.subMenu.length > 0 && (
                          <ChevronRightIcon 
                            className={`h-4 w-4 md:h-5 md:w-5 transition-transform ${
                              openMenus[item.label] ? 'rotate-90' : ''
                            } ${active ? 'text-blue-900' : 'text-white'}`} 
                          />
                        )}
                      </div>
                      {item.subMenu.length > 0 && openMenus[item.label] && (
                        <ul className="ml-4 md:ml-6 mt-1 md:mt-2 space-y-0.5 md:space-y-1">
                          {item.subMenu.map(sub => (
                            <li key={sub.label}>
                              <Link
                                href={sub.route}
                                className={`block px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg transition-colors ${
                                  isSubMenuActive(sub.route)
                                    ? 'bg-blue-700 text-white'
                                    : 'text-gray-200 hover:bg-blue-700 hover:text-white'
                                }`}
                                onClick={() => setIsMobileOpen(false)}
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>

          {/* Post Service Request button outside the blue container */}
          <div className="mt-3 md:mt-4">
            <PostServiceModal />
          </div>
        </div>
        )}
      </aside>
    </>
  )
}

export default Sidebar
