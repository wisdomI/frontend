'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  ChevronDownIcon,
  HeartIcon,
  ShareIcon,
  EyeIcon,
  StarIcon,
  MapPinIcon,
  CalendarIcon,
  LinkIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { serviceAPI, ratingAPI, profileAPI, portfolioAPI, authAPI } from '@/lib/api'
import type { ServiceOffering } from '@/types/api'
import { useAuthContext } from '@/contexts/AuthContext'
import DirectServiceRequestModal from '@/components/ui/modals/DirectServiceRequestModal'
import { trackServiceView } from '@/hooks/useLandingPageData'

type Props = { params: { serviceId: string } }

export default function ServiceDetailsPage({ params }: Props) {
  const router = useRouter()
  const { serviceId } = params
  const { user, isAuthenticated } = useAuthContext()
  const [service, setService] = useState<ServiceOffering | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Modal states
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false)

  // Page section data
  const [reviewsData, setReviewsData] = useState<any[]>([])
  const [ratingStats, setRatingStats] = useState<any | null>(null)
  const [recommendationsData, setRecommendationsData] = useState<any[]>([])
  const [vendorProfile, setVendorProfile] = useState<any | null>(null)
  const [vendorUser, setVendorUser] = useState<any | null>(null)
  const [portfolios, setPortfolios] = useState<any[]>([])
  const [vendorServices, setVendorServices] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        // Try to get the specific service by ID first
        const res = await serviceAPI.getById(serviceId)
        setService(res.data.data)
        
        // Track service view for recently viewed functionality
        trackServiceView(serviceId)
      } catch (e: any) {
        // If getById fails (e.g., requires auth), try to find it in the public list
        if (e?.response?.status === 401 || e?.response?.status === 403) {
          try {
            console.log('🔍 Service getById requires auth, trying to find in public list...')
            const allServicesRes = await serviceAPI.getAll({ limit: 100 })
            const allServices = allServicesRes.data.data || []
            const foundService = allServices.find(s => s.id === serviceId)
            
            if (foundService) {
              setService(foundService)
              // Track service view for recently viewed functionality
              trackServiceView(serviceId)
            } else {
              setError('Service not found')
            }
          } catch (fallbackError: any) {
            setError('Service not available to public users')
          }
        } else {
          setError(e?.response?.data?.message || 'Failed to load service')
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [serviceId])

  // Fetch reviews, stats and recommendations once service loads
  useEffect(() => {
    const fetchExtras = async () => {
      if (!service) return
      const vendorId = service.userId
      const categoryIds = service.categoryIds || []
      try {
        const [reviewsRes, statsRes, allServicesRes, profileRes, userRes, portfolioRes] = await Promise.all([
          vendorId ? ratingAPI.getByReviewee(vendorId).catch(() => ({ data: { data: [] } })) : Promise.resolve({ data: { data: [] } }),
          vendorId ? ratingAPI.getStats(vendorId).catch(() => ({ data: { data: null } })) : Promise.resolve({ data: { data: null } }),
          serviceAPI.getAll({ limit: 50 }).catch(() => ({ data: { data: [] } })),
          vendorId ? profileAPI.getById(vendorId).catch(() => ({ data: { data: null } })) : Promise.resolve({ data: { data: null } }),
          vendorId ? authAPI.getById(vendorId).catch(() => ({ data: { data: null } })) : Promise.resolve({ data: { data: null } }),
          vendorId ? portfolioAPI.getUserPortfolios(vendorId).catch(() => ({ data: { data: [] } })) : Promise.resolve({ data: { data: [] } })
        ])

        const rawReviews: any[] = reviewsRes?.data?.data || []
        const mappedReviews = rawReviews.map((r: any, idx: number) => {
          // Extract reviewer info - could be in reviewer object or Reviewer object
          const reviewer = r.reviewer || r.Reviewer
          const reviewerProfile = r.reviewerProfile || r.ReviewerProfile || reviewer?.Profile || reviewer?.profile
          
          return {
            id: r.id || idx,
            reviewer: reviewer?.businessName || 
                     (reviewer?.firstName && reviewer?.lastName
                       ? `${reviewer.firstName} ${reviewer.lastName}`
                       : reviewer?.firstName || reviewer?.lastName || 'Client'),
            date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '',
            rating: r.rating || 0,
            review: r.review || r.comment || '',
            // Try multiple sources for avatar: reviewer's profile picture, embedded profile, or fallback
            avatar: reviewerProfile?.displayPicture || 
                   reviewer?.displayPicture || 
                   reviewer?.profilePicture || 
                   '/images/vendor-img1.jpg'
          }
        })
        setReviewsData(mappedReviews)

        setRatingStats(statsRes?.data?.data || null)

        const allServices: any[] = allServicesRes?.data?.data || []
        const vendorOwnServices = allServices.filter((s: any) => s.userId === vendorId)
        setVendorServices(vendorOwnServices)

        const portfoliosData: any[] = portfolioRes?.data?.data || []
        setPortfolios(portfoliosData)

        setVendorProfile(profileRes?.data?.data || null)
        setVendorUser(userRes?.data?.data || null)

        const filteredByCategory = categoryIds.length > 0
          ? allServices.filter((s: any) => Array.isArray(s.categoryIds) && s.categoryIds.some((id: string) => categoryIds.includes(id)))
          : allServices
        const rec = filteredByCategory
          .filter((s: any) => s.id !== service.id && s.userId !== vendorId)
          .slice(0, 8)
          .map((s: any, i: number) => {
            // Extract vendor info from service's embedded User/Profile data
            const sUser = s.User || s.user
            const sProfile = s.Profile || s.profile
            
            return {
              id: s.id || `rec-${i}`,
              title: s.serviceName,
              vendor: sUser?.businessName || 
                     (sUser?.firstName && sUser?.lastName 
                       ? `${sUser.firstName} ${sUser.lastName}` 
                       : 'Vendor'),
              image: Array.isArray(s.mediaUrl) && s.mediaUrl.length > 0 ? s.mediaUrl[0] : '/images/client-img.png',
              rating: s.averageRating || 0,
              ratingCount: s.totalReviews || 0,
              location: [sProfile?.city, sProfile?.country].filter(Boolean).join(', ') || 
                       sUser?.businessAddress || 
                       'Location not specified',
              description: s.description,
              verified: !!(sUser?.isVerified || sUser?.isEmailVerified)
            }
          })
        setRecommendationsData(rec)
      } catch (e) {
        // Silently ignore - sections will gracefully show placeholders
      }
    }
    fetchExtras()
  }, [service])

  // Handle Check Availability
  const handleCheckAvailability = () => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=' + encodeURIComponent(`/services/${serviceId}`))
      return
    }
    setShowAvailabilityModal(true)
  }

  // Request Service handled by PostServiceModal trigger


  // Service request submission handled by global modal flow


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading service...</div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Service not found'}</p>
          <button onClick={() => router.back()} className="px-4 py-2 rounded bg-blue-600 text-white">Go Back</button>
        </div>
      </div>
    )
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIconSolid
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  // Use actual service/vendor data from API
  const firstPortfolioImage = portfolios[0]?.mediaUrl?.[0]
  
  // Check both the embedded User data from service and the separately fetched user data
  const embeddedUser: any = (service as any)?.User || (service as any)?.user
  const embeddedProfile: any = (service as any)?.Profile || (service as any)?.profile
  
  // Debug logging to verify backend data structure
  console.log('🔍 Service Detail Page - Data Structure:', {
    hasEmbeddedUser: !!embeddedUser,
    hasEmbeddedProfile: !!embeddedProfile,
    hasVendorUser: !!vendorUser,
    hasVendorProfile: !!vendorProfile,
    embeddedProfilePicture: embeddedProfile?.displayPicture,
    vendorProfilePicture: vendorProfile?.displayPicture,
    embeddedUserPicture: embeddedUser?.displayPicture,
    serviceKeys: Object.keys(service || {}),
  })
  
  const vendorData = {
    vendorName: (
      embeddedUser?.businessName || 
      vendorUser?.businessName || 
      (embeddedUser?.firstName && embeddedUser?.lastName 
        ? `${embeddedUser.firstName} ${embeddedUser.lastName}` 
        : undefined) ||
      (vendorUser?.firstName && vendorUser?.lastName 
        ? `${vendorUser.firstName} ${vendorUser.lastName}` 
        : undefined)
    ) || 'Vendor',
    category: service.serviceName || '',
    mainImage: (Array.isArray(service.mediaUrl) && service.mediaUrl.length > 0 ? service.mediaUrl[0] : (firstPortfolioImage || '/images/vendor-img1.jpg')),
    verified: !!(embeddedUser?.isVerified || vendorUser?.isEmailVerified),
    description: embeddedProfile?.bio || vendorProfile?.bio || service.description || '',
    website: undefined as string | undefined,
    location: [
      embeddedProfile?.city || vendorProfile?.city, 
      embeddedProfile?.country || vendorProfile?.country
    ].filter(Boolean).join(', ') || embeddedUser?.businessAddress || vendorUser?.businessAddress || '',
    locationDetails: undefined as string | undefined,
    availability: undefined as string | undefined
  }
  
  // Prioritize display picture from backend in this order:
  // 1. Embedded Profile from service response
  // 2. Separately fetched profile
  // 3. Embedded User from service response
  // 4. Fallback to default image
  const vendorAvatar = (
    embeddedProfile?.displayPicture ||
    vendorProfile?.displayPicture ||
    embeddedUser?.displayPicture ||
    '/images/vendor-img1.jpg'
  )

  // Build services offered grid using vendor's own services (including current)
  const servicesData = [service, ...vendorServices.filter((s: any) => s.id !== service.id)].slice(0, 4).map((s: any) => ({
    id: s.id,
    title: s.serviceName,
    image: Array.isArray(s.mediaUrl) && s.mediaUrl.length > 0 ? s.mediaUrl[0] : '/images/client-img.png',
    description: s.description
  }))

  // Prepare portfolio rows per project, each row shows up to 4 images
  const portfolioRows = portfolios.map((p: any) => ({
    title: p.projectTitle,
    description: p.description,
    images: (Array.isArray(p.mediaUrl) ? p.mediaUrl : []).slice(0, 4)
  })).filter((row: any) => row.images.length > 0)

  const ratingPercent = ratingStats?.averageRating
    ? Math.round((ratingStats.averageRating / 5) * 100)
    : 60

  // Build small set of thumbnails for the left-side gallery
  const allPortfolioImages: string[] = portfolios.flatMap((p: any) => Array.isArray(p.mediaUrl) ? p.mediaUrl : [])
  const thumbnailImages: string[] = Array.isArray(service.mediaUrl) && service.mediaUrl.length > 0
    ? (service.mediaUrl as string[]).slice(0, 4)
    : allPortfolioImages.slice(0, 4)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Security Reminder Banner */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-blue-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">
              Security Reminder: EventHub will never ask you to make payments outside the platform. Only complete transactions through our secure system.
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="text-sm text-gray-500">
            <span>Category</span>
            <span className="mx-2">&gt;</span>
            <span>Services</span>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-700">{service.serviceName}</span>
          </nav>
        </div>

        {/* Page Title & Actions */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-gray-900">{service.serviceName}</h1>
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <HeartIcon className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ShareIcon className="w-5 h-5 text-gray-600" />
              </button>
              {ratingStats?.averageRating && ratingStats.averageRating >= 4 ? (
                <button className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
                  <StarIcon className="h-4 w-4" />
                  <span>Top Rated</span>
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Main Vendor Showcase */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Left Side - Main Image Gallery */}
              <div className="lg:col-span-2">
                <div className="flex gap-4">
                  {/* Main Image */}
                  <div className="flex-1 relative">
                    <Image 
                      src={vendorData.mainImage} 
                      alt={vendorData.vendorName}
                      width={600}
                      height={400}
                      className="w-full h-80 object-cover rounded-xl"
                    />
                    {vendorData.verified && (
                      <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full flex items-center space-x-1">
                        <StarIconSolid className="h-4 w-4" />
                        <span className="text-sm font-medium">Verified</span>
                      </div>
                    )}
                    
                    {/* Social Media Icons */}
                    <div className="absolute bottom-4 left-4 flex space-x-2">
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-sm">
                        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                        </svg>
                      </button>
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-sm">
                        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                        </svg>
                      </button>
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-sm">
                        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail Images */}
                  <div className="flex flex-col space-y-2">
                    {thumbnailImages.map((image: string, index: number) => (
                      <Image 
                        key={index}
                        src={image} 
                        alt={`Portfolio ${index + 1}`}
                        width={96}
                        height={96}
                        className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Vendor Info */}
              <div className="space-y-4 sm:space-y-6">
                {/* Profile Header */}
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-200">
                    <Image 
                      src={vendorAvatar}
                      alt={vendorData.vendorName}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{vendorData.vendorName}</h2>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 leading-relaxed">{vendorData.description}</p>

                {/* Website Link */}
                {vendorData.website ? (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <LinkIcon className="h-5 w-5" />
                    <a href={`https://${vendorData.website}`} className="hover:underline text-sm">
                      {vendorData.website}
                    </a>
                  </div>
                ) : null}

                {/* Location */}
                {vendorData.location ? (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPinIcon className="h-5 w-5" />
                    <span>{vendorData.location}</span>
                    {vendorData.locationDetails ? (
                      <span className="text-gray-500 text-sm">{vendorData.locationDetails}</span>
                    ) : null}
                  </div>
                ) : null}

                {/* Availability */}
                {vendorData.availability ? (
                  <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">{vendorData.availability}</span>
                  </div>
                ) : null}

                {/* Action Buttons */}
                <div className="space-y-2 sm:space-y-3">
                  <button 
                    onClick={handleCheckAvailability}
                    className="w-full bg-white border border-gray-300 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Check Availability</span>
                  </button>
                  <DirectServiceRequestModal
                    trigger={(
                      <button id="request-service-trigger" 
                        className="w-full bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                      >
                        <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Request Service</span>
                      </button>
                    )}
                    service={service}
                    vendorId={service?.userId}
                    serviceId={service?.id}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Portfolio Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Business Portfolio</h3>
            {portfolioRows.length > 0 ? (
              <>
                {portfolioRows.map((row, idx) => (
                  <div key={idx} className="mb-8">
                    {row.title ? (
                      <p className="text-gray-600 mb-4">{row.title}</p>
                    ) : null}
                    <div className="grid grid-cols-4 gap-4 mb-3">
                      {row.images.map((image: string, index: number) => (
                        <Image
                          key={`${idx}-${index}`}
                          src={image}
                          alt={`Portfolio ${idx * 4 + index + 1}`}
                          width={220}
                          height={220}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                    {row.description ? (
                      <p className="text-gray-700 text-sm">{row.description}</p>
                    ) : null}
                  </div>
                ))}
              </>
            ) : (
              <div className="py-6 text-center text-gray-500">No portfolio items yet.</div>
            )}
          </div>
        </div>

        {/* Services Offered Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Services Offered</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {servicesData.map((service) => (
                <div 
                  key={service.id} 
                  className="space-y-4 cursor-pointer"
                  onClick={() => {
                    // Track service view for recently viewed functionality
                    trackServiceView(service.id)
                    // Navigate to service details page
                    router.push(`/services/${service.id}`)
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      router.push(`/services/${service.id}`)
                    }
                  }}
                >
                  <Image 
                    src={service.image} 
                    alt={service.title}
                    width={300}
                    height={160}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">{service.title}</h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{service.description}</p>
                    <button
                      className="inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                      onClick={(e) => { e.stopPropagation(); router.push(`/services/${service.id}`) }}
                    >
                      View Pricing
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Verified Reviews & Ratings Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Verified Reviews & Ratings</h3>
              {ratingStats?.averageRating ? (
                <span className="text-gray-600">({Math.round((ratingStats.averageRating / 5) * 100)}%)</span>
              ) : null}
            </div>
            {reviewsData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviewsData.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Image 
                        src={review.avatar} 
                        alt={review.reviewer}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900">{review.reviewer}</h4>
                        <p className="text-gray-500 text-sm">{review.date}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{review.review}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Rating:</span>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-gray-500">No reviews yet.</div>
            )}
          </div>
        </div>

        {/* Recommended for you Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Recommended for you</h3>
            {recommendationsData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendationsData.map((item) => (
                  <div 
                    key={item.id} 
                    className="space-y-4 cursor-pointer"
                    onClick={() => {
                      // Track service view for recently viewed functionality
                      trackServiceView(item.id)
                      // Navigate to service details page
                      router.push(`/services/${item.id}`)
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        trackServiceView(item.id)
                        router.push(`/services/${item.id}`)
                      }
                    }}
                  >
                    <div className="relative">
                      <Image 
                        src={item.image} 
                        alt={item.title}
                        width={300}
                        height={160}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      {item.verified && (
                        <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded-full flex items-center space-x-1">
                          <CheckIcon className="h-3 w-3" />
                          <span className="text-xs font-medium">Verified</span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 flex flex-col space-y-1 opacity-0 hover:opacity-100 transition-opacity">
                        <button className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-sm">
                          <EyeIcon className="h-3 w-3 text-gray-600" />
                        </button>
                        <button className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-sm">
                          <ShareIcon className="h-3 w-3 text-gray-600" />
                        </button>
                        <button className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-sm">
                          <HeartIcon className="h-3 w-3 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                      <p className="text-blue-600 font-medium text-sm">{item.vendor}</p>
                      <p className="text-gray-600 text-xs line-clamp-3">{item.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          {renderStars(item.rating)}
                          <span className="text-gray-500 text-xs">({item.ratingCount})</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-500 text-xs">
                        <MapPinIcon className="h-3 w-3 mr-1" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-gray-500">No recommendations available.</div>
            )}
          </div>
        </div>

        
      </div>

      {/* Availability Modal */}
      {showAvailabilityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Check Availability</h3>
              <button
                onClick={() => setShowAvailabilityModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                Contact the vendor directly to check their availability for your event date.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Available:</strong> {vendorData.availability}
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  <strong>Location:</strong> {vendorData.location}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAvailabilityModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <DirectServiceRequestModal
                  trigger={(
                    <button
                      onClick={() => setShowAvailabilityModal(false)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Request Service
                    </button>
                  )}
                  service={service}
                  vendorId={service?.userId}
                  serviceId={service?.id}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Service handled by global modal */}
    </div>
  )
}
