import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaTiktok, FaYoutube } from "react-icons/fa6";
import Image from "next/image";
import Logo from '@/public/images/white-2.png'
export default function Footer() {
  return (
    <footer className="bg-event-blue text-white">
      <div className="container mx-auto px-4 py-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {/* Brand & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center min-w-[160px]">
                        <a href="/" className="text-2xl font-bold text-event-blue">
                          <Image src={Logo}
                          alt="logo image "
                          width={200}
                          height={200}
                          />
                        </a>
                      </div>
            <p className="text-blue-100 text-md font-sans font-normal  leading-relaxed mb-4">
              Event Hub is a trusted digital marketplace in Nigeria that simplifies discovering, 
              verifying, booking, and coordinating event service providers like caterers, photographers, 
              decorators, and dress vendors.
            </p>
            <p className="text-blue-100 text-md font-sans font-normal leading-relaxed mb-6 mt-2">
              It offers seamless service discovery, secure payments, trusted reviews, verified profiles, 
              and transparent communication—all in one app.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 gap-2 flex flex-row items-center">
              <div className="flex items-center  gap-2 ">
                <div className="bg-white p-1 rounded-full"><Mail className="w-5 h-5   text-black " /> </div>
                <span className="font-sans text-md ">hello@eventhub.ng</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white p-1 rounded-full">  <Phone className="w-5 h-5 text-black  " /> </div>
              
                <span className="font-sans text-md ">+234 809 123 4567</span>
              </div>
              <div className="flex items-center gap-2 ">
                <div className="bg-white p-1 rounded-full"> <MapPin className="w-5 h-5 text-black " /> </div>
               
                <span className="font-sans text-md ">
                  Lagos, Nigeria
                </span>
                
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex gap-6">
          <div>
            <h4 className="font-semibold mb-4 font-heading ">Quick Links</h4>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li><a href="/" className="hover:text-white font-sans">Home</a></li>
              <li><a href="/about" className="hover:text-white font-sans">About Us</a></li>
              <li><a href="/how-it-works" className="hover:text-white font-sans">How it Works</a></li>
              <li><a href="/blog" className="hover:text-white font-sans">Blog</a></li>
              <li><a href="/dispute" className="hover:text-white font-sans">Dispute Resolution</a></li>
              <li><a href="/faq" className="hover:text-white font-sans">FAQ</a></li>
              <li><a href="/contact" className="hover:text-white font-sans">Contact Us</a></li>
              <li><a href="/careers" className="hover:text-white font-sans">Careers</a></li>
            </ul>
          </div>

          {/* Legal Info */}
          <div>
            <h4 className="font-semibold mb-4 font-heading">Legal Information</h4>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li><a href="/privacy" className="hover:text-white font-sans" >Privacy Policy</a></li>
              <li><a href="/vendor-agreement" className="hover:text-white font-sans">Vendor Agreement</a></li>
              <li><a href="/safety" className="hover:text- font-sans">Safety Guidelines</a></li>
              <li><a href="/terms" className="hover:text-white font-sans">Terms & Condition</a></li>
              <li><a href="/cookies" className="hover:text-white font-sans">Cookie Policy</a></li>
            </ul>
          </div>
          </div>

          {/* Newsletter */}
          <div className="col-span-2">
            <h4 className="font-semibold text-[20px] font-heading mb-4 mt-6 ">Subscribe Newsletter</h4>
            <p className="text-blue-100 text-md mb-4 font-sans ">
              Get the latest Vendor update & Event tips
            </p>
            <div>
            <form className="flex mb-4 ">
              <input
                type="email"
                placeholder="Enter email address"
                className="flex-1 px-2 py-4 rounded-l-lg font-sans  text-gray-800 focus:outline-none"
              />
              <button
                type="submit"
                className=" bg-[#ecad23] text-gray-700 px-5 py-2 font-sans rounded-r-lg font-semibold hover:bg-yellow-600"
              >
                Subscribe
              </button>
            </form>

            {/* Social Icons  work on it */}
            <div className="flex gap-4 text-white text-lg">
              <FaFacebookF className="cursor-pointer hover:text-yellow-400" />
              <FaInstagram className="cursor-pointer hover:text-yellow-400" />
              <FaXTwitter className="cursor-pointer hover:text-yellow-400" />
              <FaTiktok className="cursor-pointer hover:text-yellow-400" />
              <FaYoutube className="cursor-pointer hover:text-yellow-400" />
            </div>
          </div>
        </div>
        </div>


        {/* Bottom Copyright */}
        <div className="border-t border-blue-200/20 mt-10 pt-6  font-sans text-center text-blue-100 text-md ">
          © 2025 EventHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
