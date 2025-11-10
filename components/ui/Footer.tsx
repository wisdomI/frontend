'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'How it Works', href: '/how-it-works' },
    { name: 'Blog & News', href: '/blog' },
    { name: 'Our Team', href: '/team' },
    { name: 'Investors', href: '/investors' },
    { name: 'Help & Support', href: '/support' },
    { name: 'Mediakit', href: '/mediakit' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Careers', href: '/careers' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Payment Policy', href: '/payment-policy' },
    { name: 'Vendor Agreement', href: '/vendor-agreement' },
    { name: 'Client Agreement', href: '/client-agreement' },
    { name: 'Dispute Resolution', href: '/dispute-resolution' },
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
              <Link href="/" className="block mb-6">
                <Image
                  src="/images/FooterLogo.png"
                  alt="EventHub Logo"
                  width={150}
                  height={50}
                  className=""
                  style={{ width: "auto", height: "auto" }}
                  priority
                />
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
                    <div className="p-2 rounded-full bg-white">
                      <Mail className="h-4 w-4 text-brand-900" />
                    </div>
                    <span className="text-sm">hello@eventhub.ng</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-full bg-white">
                      <Phone className="h-4 w-4 text-brand-900" />
                    </div>
                    <span className="text-sm">+234 809 123 4567</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-full bg-white">
                      <MapPin className="h-4 w-4 text-brand-900" />
                    </div>
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
                <Link href="https://www.facebook.com/eventhubglobal" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <Facebook className="h-5 w-5 text-white" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="https://www.instagram.com/eventhubglobal" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)' }}>
                  <Instagram className="h-5 w-5 text-white" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="https://x.com/eventhubglobal" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-black rounded flex items-center justify-center hover:bg-gray-800 transition-colors">
                  <Twitter className="h-5 w-5 text-white" />
                  <span className="sr-only">X (Twitter)</span>
                </Link>
                <Link href="https://www.tiktok.com/@eventhubglobal" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-black rounded flex items-center justify-center hover:bg-gray-800 transition-colors">
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                  <span className="sr-only">TikTok</span>
                </Link>
                <Link href="https://www.youtube.com/@eventhubglobal" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-red-600 rounded flex items-center justify-center hover:bg-red-700 transition-colors">
                  <Youtube className="h-5 w-5 text-white" />
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
