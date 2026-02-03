'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'How it Works', href: '/how-it-works' },
    { name: 'Blog', href: '/blog' },
    { name: 'News', href: '/news' },
    { name: 'Our Team', href: '/team' },
    { name: 'Investors', href: '/investors' },
    { name: 'Help & Support', href: '/support' },
    { name: 'Mediakit', href: '/mediakit' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Careers', href: '/careers' },
    { name: 'Admin Portal', href: '/admin/auth/login' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Payment Policy', href: '/payment-policy' },
    { name: 'Vendor Agreement', href: '/vendor-agreement' },
    { name: 'Client Agreement', href: '/client-agreement' },
    { name: 'Event Insurance', href: '/event-insurance' },
    { name: 'Safety Guidelines', href: '/safety-guidelines' },
    { name: 'Dispute Resolution', href: '/dispute-resolution' },
    { name: 'Terms & Condition', href: '/terms' },
    { name: 'Refunds & Claims policy', href: '/refunds-claims' },
    { name: 'Cookie Policy', href: '/cookie-policy' },
  ];

  return (
    <footer className="bg-brand-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          {/* Use a 12-col grid so the left side can be wider */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-12">
            {/* Left Section - wider (spans 5 of 12 on large screens) */}
            <div className="lg:col-span-5">
              {/* Logo as text "Event hub" */}
              <Link href="/" className="block mb-6">
                <h2 className="text-2xl font-bold text-white">Event hub</h2>
              </Link>

              <div className="text-sm leading-relaxed font-raleway max-w-md">
                <p className="mb-4">
                  Event Hub is a trusted digital marketplace in Nigeria that simplifies discovering, verifying, booking,
                  and coordinating event service providers like caterers, photographers, decorators, and wedding dress vendors.
                </p>
                <p className="mb-4">
                  It offers seamless service discovery, secure payments, trusted reviews, verified profiles, and transparent
                  communication—all in one app.
                </p>
              </div>

              {/* Contact Info: horizontal / side-by-side */}
              <div className="mt-6">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-white" />
                    <span className="text-sm">hello@eventhub.ng</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-white" />
                    <span className="text-sm">+234 809 123 4567</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-white" />
                    <span className="text-sm">Lagos, Nigeria</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links (narrower) */}
            <div className="lg:col-span-2">
              <h3 className="font-semibold mb-4 font-raleway">Quick Links</h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm hover:text-gray-300 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Information (narrower) */}
            <div className="lg:col-span-2">
              <h3 className="font-semibold mb-4 font-raleway">Legal Information</h3>
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm hover:text-gray-300 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter (spans remaining 3 cols) */}
            <div className="lg:col-span-3">
              <h3 className="font-semibold mb-3 font-raleway">Subscribe Newsletter</h3>
              <p className="text-sm mb-6 font-raleway">Get the latest Vendor update & Event tips</p>

              {/* Newsletter form: white rounded input + yellow pill Subscribe button */}
              <form onSubmit={(e) => e.preventDefault()} className="mb-8">
                <div className="flex w-full max-w-md bg-white rounded-md overflow-hidden shadow-sm">
                  <input
                    type="email"
                    aria-label="Email address"
                    placeholder="Enter email address"
                    className="flex-1 px-3 sm:px-4 py-3 text-gray-700 placeholder-gray-400 border-none outline-none text-sm min-w-0"
                  />
                  <button
                    type="submit"
                    className="px-4 sm:px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold text-sm whitespace-nowrap flex-shrink-0"
                  >
                    Subscribe
                  </button>
                </div>
              </form>

              {/* Social Media Icons */}
              <div className="flex items-center space-x-4">
                <Link href="https://www.facebook.com/eventhubglobal" target="_blank" rel="noopener noreferrer" className="w-5 h-5 flex items-center justify-center hover:opacity-80 transition-opacity">
                  <Image 
                    src="/images/facebook.svg"
                    alt="Facebook"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="https://www.instagram.com/eventhubglobal" target="_blank" rel="noopener noreferrer" className="w-5 h-5 flex items-center justify-center hover:opacity-80 transition-opacity">
                  <Image 
                    src="/images/instagram.svg"
                    alt="Instagram"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="https://x.com/eventhubglobal" target="_blank" rel="noopener noreferrer" className="w-5 h-5 flex items-center justify-center hover:opacity-80 transition-opacity">
                  <Image 
                    src="/images/twitter.svg"
                    alt="X (Twitter)"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                  <span className="sr-only">X (Twitter)</span>
                </Link>
                <Link href="https://www.tiktok.com/@eventhubglobal" target="_blank" rel="noopener noreferrer" className="w-5 h-5 flex items-center justify-center hover:opacity-80 transition-opacity">
                  <Image 
                    src="/images/tiktok-icon.svg"
                    alt="TikTok"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                  <span className="sr-only">TikTok</span>
                </Link>
                <Link href="https://www.youtube.com/@eventhubglobal" target="_blank" rel="noopener noreferrer" className="w-5 h-5 flex items-center justify-center hover:opacity-80 transition-opacity">
                  <Image 
                    src="/images/youtube-icon.svg"
                    alt="YouTube"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                  <span className="sr-only">YouTube</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer - Copyright */}
        <div className="border-t border-brand-800 py-6">
          <div className="text-center">
            <div className="text-sm">
              © 2025. EventHub. All right reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/*
// New Footer Implementation (Commented Out)
// import { Instagram, Linkedin, Facebook } from 'lucide-react';

export default function FooterNew() {
  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Mediakits', href: '/mediakit' },
    { name: 'Join Our Team', href: '/careers' },
  ];

  const clientLinks = [
    { name: 'Open Account', href: '/auth/register?type=client' },
    { name: 'Client Agreement', href: '/client-agreement' },
    { name: 'Frequently Asked Questions', href: '/faq' },
  ];

  const vendorLinks = [
    { name: 'Open Account', href: '/auth/register?type=vendor' },
    { name: 'Vendor Agreement', href: '/vendor-agreement' },
    { name: 'Frequently Asked Questions', href: '/faq' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Refund Policy', href: '/refund-policy' },
    { name: 'Termination', href: '/termination' },
    { name: 'Dispute Resolution', href: '/dispute-resolution' },
    { name: 'Payment Policy', href: '/payment-policy' },
    { name: 'Terms & Condition', href: '/terms' },
  ];

  return (
    <footer className="bg-[#002866] text-white pt-8 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* White Card Section - More Compact * /}
        <div className="bg-white rounded-[24px] p-6 md:p-10 mb-8 text-gray-900 max-w-6xl mx-auto shadow-xl">
          
          {/* Logo * /}
          <div className="mb-6">
            <Link href="/" className="inline-block">
              <Image 
                src="/images/primary-logo 3.png" 
                alt="Event Hub" 
                width={40} 
                height={40}
                className="h-8 w-auto object-contain"
              />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
            
            {/* Company Links * /}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-[#002866]">COMPANY</h3>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-gray-600 hover:text-[#002866] transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Client Links * /}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-[#002866]">FOR CLIENTS</h3>
              <ul className="space-y-3">
                {clientLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-gray-600 hover:text-[#002866] transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Vendor Links * /}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-[#002866]">FOR VENDOR</h3>
              <ul className="space-y-3">
                {vendorLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-gray-600 hover:text-[#002866] transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subscribe Section * /}
            <div>
              <h3 className="text-sm font-bold mb-2 text-[#002866]">Subscribe to Event hub & to Get Events Update</h3>
              <p className="text-xs text-gray-500 mb-4">Get guides for events planning directly from our experts</p>
              
              <form onSubmit={(e) => e.preventDefault()} className="flex bg-[#F0F2F5] rounded-lg overflow-hidden p-1">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-sm text-gray-700 placeholder-gray-400 min-w-0"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className="bg-[#002866] text-white px-4 py-2 rounded-md text-xs font-medium hover:bg-blue-900 transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Section inside Card * /}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col lg:flex-row justify-between items-end lg:items-center gap-6">
            
            {/* Left: QR and Apps * /}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              {/* QR Code Placeholder * /}
              <div className="bg-white p-1 border border-gray-200 rounded-lg shadow-sm w-20 h-20 flex items-center justify-center shrink-0">
                <Image 
                  src="/images/image.png" 
                  alt="QR Code" 
                  width={70} 
                  height={70}
                  className="object-contain"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                 {/* Google Play Button * /}
                 <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors shadow-sm w-36">
                  <Image src="/google.svg" alt="Google Play" width={20} height={20} />
                  <div className="text-left">
                    <div className="text-[9px] text-gray-500 leading-tight">Coming soon</div>
                    <div className="text-xs font-semibold text-gray-900 leading-tight">Google Play</div>
                  </div>
                </button>

                {/* App Store Button * /}
                <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors shadow-sm w-36">
                  <Image src="/apple.svg" alt="App Store" width={20} height={20} />
                  <div className="text-left">
                    <div className="text-[9px] text-gray-500 leading-tight">Coming soon</div>
                    <div className="text-xs font-semibold text-gray-900 leading-tight">App Store</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Right: Socials and Legal * /}
            <div className="flex flex-col items-start lg:items-end gap-4 w-full lg:w-auto">
              {/* Social Icons * /}
              <div className="flex items-center gap-3">
                <Link href="#" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#002866] hover:text-white hover:border-[#002866] transition-all">
                  <Instagram size={16} />
                </Link>
                <Link href="#" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#002866] hover:text-white hover:border-[#002866] transition-all">
                  <Linkedin size={16} />
                </Link>
                <Link href="#" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#002866] hover:text-white hover:border-[#002866] transition-all">
                  <Facebook size={16} />
                </Link>
              </div>

              {/* Legal Links * /}
              <div className="flex flex-wrap justify-start lg:justify-end gap-x-4 gap-y-2 text-[10px] text-gray-500">
                {legalLinks.map((link) => (
                  <Link key={link.name} href={link.href} className="hover:text-[#002866] transition-colors whitespace-nowrap">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Text * /}
        <div className="max-w-6xl mx-auto space-y-4">
          <p className="text-xs text-gray-300 leading-relaxed">
            EventHub is a centralized platform that allows clients, planners, vendors, guests, and corporate users to plan, manage, and execute events in one place. Clients can self-manage or hire verified planners, while vendors list services, manage bookings, bid on requests, deliver work, and receive secure escrow payments.
          </p>
          
          <div className="text-xs text-gray-400">
            © 2025 Event Hub Limited. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
*/