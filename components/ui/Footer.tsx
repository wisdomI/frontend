import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaTiktok, FaYoutube } from "react-icons/fa6";
import Image from "next/image";
import Logo from '@/public/images/white-2.png'
export default function Footer() {
  return (
    <footer className="bg-event-blue text-white">
      <div className="container mx-auto px-8 md:px-12 lg:px-16 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Description */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <a href="/" className="inline-block">
                <Image src={Logo} alt="EventHub Logo" width={150} height={60} />
              </a>
            </div>
            <p className="text-blue-100 text-sm font-sans leading-relaxed mb-6">
              Event Hub is a trusted digital marketplace in Nigeria that simplifies discovering, 
              verifying, booking, and coordinating event service providers like caterers, photographers, 
              decorators, and wedding dress vendors.
            </p>
            <p className="text-blue-100 text-sm font-sans leading-relaxed mb-6">
              It offers seamless service discovery, secure payments, trusted reviews, verified profiles, 
              and transparent communication—all in one app.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 flex gap-2 ">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-full">
                  <Mail className="w-4 h-4 text-event-blue" />
                </div>
                <span className="font-sans text-sm">hello@eventhub.ng</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-full">
                  <Phone className="w-4 h-4 text-event-blue" />
                </div>
                <span className="font-sans text-sm">+234 809 123 4567</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-full">
                  <MapPin className="w-4 h-4 text-event-blue" />
                </div>
                <span className="font-sans text-sm">Lagos, Nigeria</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex gap-2">
          <div>
            <h4 className="font-semibold text-lg mb-6 font-heading">Quick Links</h4>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li><a href="/" className="hover:text-white font-sans transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-white font-sans transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-white font-sans transition-colors">Contact Us</a></li>
              <li><a href="/how-it-works" className="hover:text-white font-sans transition-colors">How it Works</a></li>
              <li><a href="/blog" className="hover:text-white font-sans transition-colors">Blog</a></li>
              <li><a href="/news" className="hover:text-white font-sans transition-colors">News</a></li>
              <li><a href="/our-team" className="hover:text-white font-sans transition-colors">Our Team</a></li>
              <li><a href="/investors" className="hover:text-white font-sans transition-colors">Investors</a></li>
              <li><a href="/help-support" className="hover:text-white font-sans transition-colors">Help & Support</a></li>
              <li><a href="/mediacit" className="hover:text-white font-sans transition-colors">Mediacit</a></li>
              <li><a href="/faq" className="hover:text-white font-sans transition-colors">FAQ</a></li>
              <li><a href="/careers" className="hover:text-white font-sans transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Legal Information */}
          <div>
            <h4 className="font-semibold text-lg mb-6 font-heading">Legal Information</h4>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li><a href="/privacy" className="hover:text-white font-sans transition-colors">Privacy Policy</a></li>
              <li><a href="/payment-policy" className="hover:text-white font-sans transition-colors">Payment Policy</a></li>
              <li><a href="/vendor-agreement" className="hover:text-white font-sans transition-colors">Vendor Agreement</a></li>
              <li><a href="/client-agreement" className="hover:text-white font-sans transition-colors">Client Agreement</a></li>
              <li><a href="/event-insurance" className="hover:text-white font-sans transition-colors">Event Insurance</a></li>
              <li><a href="/safety-guidelines" className="hover:text-white font-sans transition-colors">Safety Guidelines</a></li>
              <li><a href="/dispute-resolution" className="hover:text-white font-sans transition-colors">Dispute Resolution</a></li>
              <li><a href="/terms" className="hover:text-white font-sans transition-colors">Terms & Condition</a></li>
              <li><a href="/refunds-claims" className="hover:text-white font-sans transition-colors">Refunds & Claims policy</a></li>
              <li><a href="/cookies" className="hover:text-white font-sans transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
          </div>

          {/* Newsletter */}
          <div className="col-span-2">
            <h4 className="font-semibold text-lg font-heading mb-4">Subscribe Newsletter</h4>
            <p className="text-blue-100 text-sm mb-6 font-sans">
              Get the latest Vendor update & Event tips
            </p>
            
            <form className="flex mb-6">
              <input
                type="email"
                placeholder="Enter email address"
                className="flex-1 px-4 py-3 rounded-l-lg font-sans text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                type="submit"
                className="bg-yellow text-gray-800 px-6 py-3 font-sans rounded-r-lg font-semibold hover:bg-yellow transition-colors"
              >
                Subscribe
              </button>
            </form>

            {/* Social Icons */}
            <div className="flex gap-4">
              <a href="#" className="bg-white p-2 rounded-full hover:bg-yellow-400 transition-colors">
                <FaFacebookF className="w-4 h-4 text-event-blue" />
              </a>
              <a href="#" className="bg-white p-2 rounded-full hover:bg-yellow-400 transition-colors">
                <FaInstagram className="w-4 h-4 text-event-blue" />
              </a>
              <a href="#" className="bg-white p-2 rounded-full hover:bg-yellow-400 transition-colors">
                <FaXTwitter className="w-4 h-4 text-event-blue" />
              </a>
              <a href="#" className="bg-white p-2 rounded-full hover:bg-yellow-400 transition-colors">
                <FaTiktok className="w-4 h-4 text-event-blue" />
              </a>
              <a href="#" className="bg-white p-2 rounded-full hover:bg-yellow-400 transition-colors">
                <FaYoutube className="w-4 h-4 text-event-blue" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-blue-200/20 mt-12 pt-8 text-center">
          <p className="text-blue-100 text-sm font-sans">
            © 2025 EventHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
