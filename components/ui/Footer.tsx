import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaTiktok, FaYoutube } from "react-icons/fa6";
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-event-blue text-white">
      <div className="container mx-auto px-4 py-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <Image 
                src="/images/FooterLogo.png" 
                alt="EventHub" 
                width={120}
                height={24}
                className="h-6 w-30"
              />
            </div>
            <p className="text-blue-100 text-sm leading-relaxed mb-4">
              Event Hub is a trusted digital marketplace in Nigeria that simplifies discovering, 
              verifying, booking, and coordinating event service providers like caterers, photographers, 
              decorators, and dress vendors.
            </p>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">
              It offers seamless service discovery, secure payments, trusted reviews, verified profiles, 
              and transparent communication—all in one app.
            </p>

            {/* Contact Info */}
            <div className="space-y-3  ">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 " /> hello@eventhub.ng
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5  " /> +234 809 123 4567
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 " /> Lagos, Nigeria
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/about" className="hover:text-white">About Us</a></li>
              <li><a href="/how-it-works" className="hover:text-white">How it Works</a></li>
              <li><a href="/blog" className="hover:text-white">Blog</a></li>
              <li><a href="/dispute" className="hover:text-white">Dispute Resolution</a></li>
              <li><a href="/faq" className="hover:text-white">FAQ</a></li>
              <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
              <li><a href="/careers" className="hover:text-white">Careers</a></li>
            </ul>
          </div>

          {/* Legal Info */}
          <div>
            <h4 className="font-semibold mb-4">Legal Information</h4>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="/vendor-agreement" className="hover:text-white">Vendor Agreement</a></li>
              <li><a href="/safety" className="hover:text-white">Safety Guidelines</a></li>
              <li><a href="/terms" className="hover:text-white">Terms & Condition</a></li>
              <li><a href="/cookies" className="hover:text-white">Cookie Policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Subscribe Newsletter</h4>
            <p className="text-blue-100 text-sm mb-4">
              Get the latest Vendor update & Event tips
            </p>
            <form className="flex mb-4">
              <input
                type="email"
                placeholder="Enter email address"
                className="flex-1 px-4 py-2 rounded-l-lg text-gray-800 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-yellow-500 text-white px-5 py-2 rounded-r-lg font-semibold hover:bg-yellow-600"
              >
                Subscribe
              </button>
            </form>

            {/* Social Icons */}
            <div className="flex gap-4 text-white text-lg">
              <FaFacebookF className="cursor-pointer hover:text-yellow-400" />
              <FaInstagram className="cursor-pointer hover:text-yellow-400" />
              <FaXTwitter className="cursor-pointer hover:text-yellow-400" />
              <FaTiktok className="cursor-pointer hover:text-yellow-400" />
              <FaYoutube className="cursor-pointer hover:text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-blue-200/20 mt-10 pt-6 text-center text-blue-100 text-sm">
          © 2025 EventHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
