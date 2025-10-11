'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import PostServiceModal from '../ui/modal/ServiceRequestmodal'
import FilterModal from '../ui/modals/FilterModal'
import { useFilterContext } from '@/contexts/FilterContext'
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
    categoryKey: 'catering',
    subMenu: [
      {
        label: 'Local/Continental Dishes',
        route: '/categories/catering/local-continental',
        subCategoryKey: 'local-continental',
      },
      { 
        label: 'Small Chops', 
        route: '/categories/catering/small-chops',
        subCategoryKey: 'small-chops',
      },
      {
        label: 'Cocktails & Traditional Drinks',
        route: '/categories/catering/cocktails',
        subCategoryKey: 'cocktails',
      },
      {
        label: 'Palm Wine & Traditional Drinks',
        route: '/categories/catering/palm-wine',
        subCategoryKey: 'palm-wine',
      },
      { 
        label: 'Cakes', 
        route: '/categories/catering/cakes',
        subCategoryKey: 'cakes',
      },
      {
        label: 'Dessert/Candy Table Setup',
        route: '/categories/catering/dessert',
        subCategoryKey: 'dessert',
      },
    ],
  },
  {
    label: 'Entertainment',
    icon: icons.entertainment,
    route: '/services/entertainment',
    categoryKey: 'entertainment',
    subMenu: [
      { 
        label: 'DJs', 
        route: '/categories/entertainment/djs',
        subCategoryKey: 'djs',
      },
      { 
        label: 'MCs/Hosts/Comedians', 
        route: '/categories/entertainment/mcs',
        subCategoryKey: 'mcs',
      },
      {
        label: 'Live Bands & Musicians',
        route: '/categories/entertainment/live-bands',
        subCategoryKey: 'live-bands',
      },
      {
        label: 'Cultural Dance Troupes',
        route: '/categories/entertainment/dance-troupes',
        subCategoryKey: 'dance-troupes',
      },
      { 
        label: 'Hype Men/Women', 
        route: '/categories/entertainment/hype-men',
        subCategoryKey: 'hype-men',
      },
      {
        label: 'Fireworks/Special Effects',
        route: '/categories/entertainment/fireworks',
        subCategoryKey: 'fireworks',
      },
    ],
  },
  {
    label: 'Rentals & Equipment',
    icon: icons.rentals,
    route: '/services/rentals',
    categoryKey: 'rentals',
    subMenu: [
      {
        label: 'Chairs/Tables/Tents',
        route: '/categories/rentals/chairs-tables',
        subCategoryKey: 'chairs-tables',
      },
      {
        label: 'Cooling/Ventilation Systems',
        route: '/categories/rentals/cooling',
        subCategoryKey: 'cooling',
      },
      {
        label: 'Sound Systems/Speakers',
        route: '/categories/rentals/sound-systems',
        subCategoryKey: 'sound-systems',
      },
      {
        label: 'Lighting & LED Screens',
        route: '/categories/rentals/lighting',
        subCategoryKey: 'lighting',
      },
      { 
        label: 'Stage/Backdrops', 
        route: '/categories/rentals/stage',
        subCategoryKey: 'stage',
      },
      {
        label: 'Generators/Power Supply',
        route: '/categories/rentals/generators',
        subCategoryKey: 'generators',
      },
    ],
  },
  {
    label: 'Decoration and Setup',
    icon: icons.decoration,
    route: '/services/decoration',
    categoryKey: 'decoration',
    subMenu: [
      {
        label: 'Balloon Decor Artists',
        route: '/categories/decoration/balloon',
        subCategoryKey: 'balloon',
      },
      { 
        label: 'Floral Designers', 
        route: '/categories/decoration/floral',
        subCategoryKey: 'floral',
      },
      {
        label: 'Event Stylists (e.g., themed parties)',
        route: '/categories/decoration/stylists',
        subCategoryKey: 'stylists',
      },
      {
        label: 'Aisle & Backdrop Creators',
        route: '/categories/decoration/aisle-backdrop',
        subCategoryKey: 'aisle-backdrop',
      },
    ],
  },
  {
    label: 'Media & Content',
    icon: icons.media,
    route: '/services/media',
    categoryKey: 'media',
    subMenu: [
      { 
        label: 'Photographers', 
        route: '/categories/media/photographers',
        subCategoryKey: 'photographers',
      },
      { 
        label: 'Videographers', 
        route: '/categories/media/videographers',
        subCategoryKey: 'videographers',
      },
      {
        label: 'Photo Booths Services',
        route: '/categories/media/photo-booths',
        subCategoryKey: 'photo-booths',
      },
      {
        label: 'Instant Photo Printing (polaroid-style)',
        route: '/categories/media/instant-printing',
        subCategoryKey: 'instant-printing',
      },
    ],
  },
  {
    label: 'Beauty & Grooming',
    icon: icons.beauty,
    route: '/services/beauty',
    categoryKey: 'beauty',
    subMenu: [
      {
        label: 'Makeup Artists/Hairstylists',
        route: '/categories/beauty/makeup-hairstylists',
        subCategoryKey: 'makeup-hairstylists',
      },
      {
        label: 'Henna/Tattoo Artists',
        route: '/categories/beauty/henna-tattoo',
        subCategoryKey: 'henna-tattoo',
      },
      {
        label: 'Spa/Pamper Mobile Services',
        route: '/categories/beauty/spa-mobile',
        subCategoryKey: 'spa-mobile',
      },
    ],
  },
  {
    label: 'Event Support Services',
    icon: icons.support,
    route: '/services/support',
    categoryKey: 'support',
    subMenu: [
      { 
        label: 'Ushers/Hostesses', 
        route: '/categories/support/ushers',
        subCategoryKey: 'ushers',
      },
      {
        label: 'Bouncers/Security Services',
        route: '/categories/support/bouncers',
        subCategoryKey: 'bouncers',
      },
      {
        label: 'Cleaners/Waste Management',
        route: '/categories/support/cleaners',
        subCategoryKey: 'cleaners',
      },
      {
        label: 'Protocol & Usher Services',
        route: '/categories/support/protocol',
        subCategoryKey: 'protocol',
      },
    ],
  },
  {
    label: 'Fashion & Styling',
    icon: icons.fashion,
    route: '/services/fashion',
    categoryKey: 'fashion',
    subMenu: [
      { 
        label: 'Tailors/Seamstresses', 
        route: '/categories/fashion/tailors',
        subCategoryKey: 'tailors',
      },
      { 
        label: 'Fashion Designers', 
        route: '/categories/fashion/designers',
        subCategoryKey: 'designers',
      },
      {
        label: 'Accessories Vendors (beads, jewelry)',
        route: '/categories/fashion/accessories',
        subCategoryKey: 'accessories',
      },
    ],
  },
  {
    label: 'Logistics & Miscellaneous',
    icon: icons.logistics,
    route: '/services/logistics',
    categoryKey: 'logistics',
    subMenu: [
      {
        label: 'Event Planners/Coordinators',
        route: '/categories/logistics/planners',
        subCategoryKey: 'planners',
      },
      {
        label: 'Vendor Transport/Logistics Services',
        route: '/categories/logistics/transport',
        subCategoryKey: 'transport',
      },
      {
        label: 'On-the-day Coordinators/Day Managers',
        route: '/categories/logistics/day-managers',
        subCategoryKey: 'day-managers',
      },
      { 
        label: 'Chauffer Services', 
        route: '/categories/logistics/chauffer',
        subCategoryKey: 'chauffer',
      },
      {
        label: 'Caravan/Marquee Rentals',
        route: '/categories/logistics/caravan',
        subCategoryKey: 'caravan',
      },
      {
        label: 'Custom Gift Makers',
        route: '/categories/logistics/custom-gifts',
        subCategoryKey: 'custom-gifts',
      },
    ],
  },
  {
    label: 'Venue Providers',
    icon: icons.venue,
    route: '/services/venue',
    categoryKey: 'venue',
    subMenu: [
      { 
        label: 'Event Venues', 
        route: '/categories/venue/venues',
        subCategoryKey: 'venues',
      },
      { 
        label: 'Event Halls', 
        route: '/categories/venue/halls',
        subCategoryKey: 'halls',
      },
      { 
        label: 'Outdoor Spaces', 
        route: '/categories/venue/outdoor',
        subCategoryKey: 'outdoor',
      },
      {
        label: 'Banquet & Conference Rooms',
        route: '/categories/venue/banquet',
        subCategoryKey: 'banquet',
      },
    ],
  },
  {
    label: 'Event Materials',
    icon: icons.materials,
    route: '/services/materials',
    categoryKey: 'materials',
    subMenu: [
      { 
        label: 'Fabric Sellers', 
        route: '/categories/materials/fabric',
        subCategoryKey: 'fabric',
      },
      {
        label: 'Party Favors/Souvenirs',
        route: '/categories/materials/party-favors',
        subCategoryKey: 'party-favors',
      },
      {
        label: 'Invitation Cards/Design & Print',
        route: '/categories/materials/invitations',
        subCategoryKey: 'invitations',
      },
    ],
  },
  {
    label: 'Kids & Special Fun Vendors',
    icon: icons.kids,
    route: '/services/kids',
    categoryKey: 'kids',
    subMenu: [
      {
        label: 'Bouncy Castles/Inflatables',
        route: '/categories/kids/bouncy-castles',
        subCategoryKey: 'bouncy-castles',
      },
      { 
        label: 'Clowns/Magicians', 
        route: '/categories/kids/clowns',
        subCategoryKey: 'clowns',
      },
      { 
        label: 'Games Coordinators', 
        route: '/categories/kids/games',
        subCategoryKey: 'games',
      },
      {
        label: 'Cotton Candy/Popcorn Machines',
        route: '/categories/kids/candy-machines',
        subCategoryKey: 'candy-machines',
      },
    ],
  },
  {
    label: 'Content Creators',
    icon: icons.content,
    route: '/services/content',
    categoryKey: 'content',
    subMenu: [
      { 
        label: 'Bloggers', 
        route: '/categories/content/bloggers',
        subCategoryKey: 'bloggers',
      },
      {
        label: 'Social Media Influencers',
        route: '/categories/content/social-media',
        subCategoryKey: 'social-media',
      },
      {
        label: 'Video Producers',
        route: '/categories/content/video-producers',
        subCategoryKey: 'video-producers',
      },
      { 
        label: 'Podcasters', 
        route: '/categories/content/podcasters',
        subCategoryKey: 'podcasters',
      },
    ],
  },
]

interface SidebarProps {
  isMobileOpen?: boolean
  onMobileToggle?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen: externalMobileOpen, onMobileToggle }) => {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({})
  const [internalMobileOpen, setInternalMobileOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false)
  const pathname = usePathname()
  const { setSelectedCategory, setSelectedSubCategory } = useFilterContext()
  
  // Use external mobile state if provided, otherwise use internal state
  const isMobileOpen = externalMobileOpen !== undefined ? externalMobileOpen : internalMobileOpen
  const setIsMobileOpen = onMobileToggle || setInternalMobileOpen

  const handleToggle = (label: string) => {
    setOpenMenus(prev => ({
      ...Object.fromEntries(Object.entries(prev).map(([k, v]) => [k, false])), // Close others
      [label]: !prev[label],
    }))
  }

  const handleCategoryClick = (categoryKey: string) => {
    setSelectedCategory(categoryKey)
    setSelectedSubCategory(null)
    setIsMobileOpen(false)
  }

  const handleSubCategoryClick = (subCategoryKey: string) => {
    setSelectedSubCategory(subCategoryKey)
    setIsMobileOpen(false)
  }

  const toggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setIsDesktopCollapsed((v) => !v)
    } else {
      setIsMobileOpen(!isMobileOpen)
    }
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
      {/* Mobile hamburger button (hidden on large displays) */}
      <button
        onClick={toggleSidebar}
        className={`md:hidden fixed top-20 z-[100] bg-[#0B2E6F] text-white p-2 rounded-lg shadow-lg transition-all duration-300 ${
          isMobileOpen ? 'left-[280px]' : 'left-4'
        }`}
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
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-[90]"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        flex-shrink-0 transition-all duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:relative md:block
        fixed md:static top-0 left-0 z-[95] md:z-auto
        h-screen md:h-full md:max-h-full md:overflow-y-auto
        md:ml-4 lg:ml-6
        w-64 ${isDesktopCollapsed ? 'md:w-12 lg:w-12' : 'md:w-64 lg:w-64'}
      `}>
        {isFilterModalOpen ? (
          <FilterModal 
            isOpen={isFilterModalOpen} 
            onClose={() => setIsFilterModalOpen(false)} 
          />
        ) : (
          <div className="flex flex-col h-full md:h-full">
          {/* Header Section */}
          <div className={`mb-4 ${isDesktopCollapsed ? 'md:mb-2 lg:mb-2' : 'lg:mb-6'}` }>
            <div className="flex items-center justify-between">
              {/* Left - Hamburger on large screens */}
              <button
                aria-label="Toggle categories"
                onClick={toggleSidebar}
                className="hidden md:inline-flex mr-3 bg-[#0B2E6F] text-white p-2 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
              
              {/* Center - Category Title */}
              <h2 className={`text-xl md:text-2xl font-semibold text-gray-800 font-asul ${isDesktopCollapsed ? 'hidden' : ''}`}>Category</h2>
              
              {/* Right - Filter Icon */}
              <button 
                onClick={() => setIsFilterModalOpen(true)}
                className={`bg-event-blue text-white p-3 rounded-lg hover:bg-event-blue-hover transition-colors duration-200 ${isDesktopCollapsed ? 'hidden' : ''}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Blue container with service categories - when desktop collapsed, show icons only */}
          <div className={`bg-[#0B2E6F] rounded-xl p-3 md:p-4 flex-1 md:flex-none overflow-hidden ${isDesktopCollapsed ? 'md:p-2 md:mt-1 lg:p-2 lg:mt-1' : ''}`}>
            {isDesktopCollapsed ? (
              <nav className="hidden md:block">
                <ul className="space-y-2">
                  {menuItems.map((item) => (
                    <li key={item.label}>
                      <div
                        className={`flex items-center justify-center py-2 rounded-lg transition-colors cursor-pointer ${
                          isActive(item) ? 'bg-event-blue text-yellow-400' : 'text-white hover:bg-event-blue-hover'
                        }`}
                        onClick={() => {
                          handleToggle(item.label)
                          if (item.categoryKey) {
                            handleCategoryClick(item.categoryKey)
                          }
                        }}
                        title={item.label}
                      >
                        {React.cloneElement(item.icon as any, {
                          className: `h-6 w-6 ${isActive(item) ? 'text-yellow-400' : 'text-white'}`,
                        })}
                      </div>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : (
              <nav>
                <ul className="space-y-0.5 md:space-y-1">
                  {menuItems.map((item) => {
                    const active = isActive(item)
                    return (
                      <li key={item.label}>
                        <div
                          className={`flex items-center justify-between px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors cursor-pointer ${
                            active
                              ? 'text-yellow-400 bg-event-blue' 
                              : 'text-white hover:bg-event-blue-hover'
                          }`}
                          onClick={() => {
                            handleToggle(item.label)
                            if (item.categoryKey) {
                              handleCategoryClick(item.categoryKey)
                            }
                          }}
                        >
                          <div className="flex items-center space-x-2 md:space-x-3">
                            <div className={`${active ? 'text-yellow-400' : 'text-white'}`}>
                              {React.cloneElement(item.icon as any, {
                                className: `h-5 w-5 md:h-6 md:w-6 ${active ? 'text-yellow-400' : 'text-white'}`,
                              })}
                            </div>
                            <span className="font-medium text-sm md:text-base font-raleway">
                              {item.label}
                            </span>
                          </div>
                          {item.subMenu.length > 0 && (
                            <ChevronRightIcon 
                              className={`h-4 w-4 md:h-5 md:w-5 transition-transform ${
                                openMenus[item.label] ? 'rotate-90' : ''
                              } ${active ? 'text-yellow-400' : 'text-white'}`} 
                            />
                          )}
                        </div>
                        {item.subMenu.length > 0 && openMenus[item.label] && (
                          <ul className="ml-4 md:ml-6 mt-1 md:mt-2 space-y-0.5 md:space-y-1">
                            {item.subMenu.map(sub => (
                              <li key={sub.label}>
                                <Link
                                  href={sub.route}
                                  className={`block px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg transition-colors font-raleway ${
                                    isSubMenuActive(sub.route)
                                      ? 'bg-event-blue text-yellow-400'
                                      : 'text-gray-200 hover:bg-event-blue-hover hover:text-white'
                                  }`}
                                  onClick={() => {
                                    setIsMobileOpen(false)
                                    if (sub.subCategoryKey) {
                                      handleSubCategoryClick(sub.subCategoryKey)
                                    }
                                  }}
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
            )}
          </div>

          {/* Post Service Request button outside the blue container - hidden when collapsed */}
          {!isDesktopCollapsed && (
            <div className="mt-3 md:mt-4">
              <PostServiceModal />
            </div>
          )}
        </div>
        )}
      </aside>
    </>
  )
}

export default Sidebar
