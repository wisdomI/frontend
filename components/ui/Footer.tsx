import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaTiktok, FaYoutube } from "react-icons/fa6";
import Image from "next/image";
import Logo from '@/public/images/white-2.png'
export default function Footer() {
  return (
    <footer className="bg-event-blue text-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-10 py-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand & Description */}
          <div className="col-span-2">
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
                <span className="font-sans text-sm">hello@eventhub.global</span>
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
                <span className="font-sans text-sm p-2">Lagos, Nigeria</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex gap-2 col-span-2  justify-center md:mt-10 ">
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
          <div className="col-span-2 md:mt-10">
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
              {/* <a href="#" className="bg-white p-2 rounded-full hover:bg-yellow-400 transition-colors">
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
              </a> */}

              <div className='flex gap-4  '>

                <div className=" px-2 py-2 mr-2 w-8 h-8 ">
                  <a href="#" className="  rounded-full  transition-colors">


                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0_2144_16166)">
                        <path d="M28 14C28 6.26806 21.7319 0 14 0C6.26806 0 0 6.26806 0 14C0 20.9877 5.11963 26.7797 11.8125 27.8299V18.0469H8.25781V14H11.8125V10.9156C11.8125 7.40687 13.9027 5.46875 17.1006 5.46875C18.6322 5.46875 20.2344 5.74219 20.2344 5.74219V9.1875H18.4691C16.7299 9.1875 16.1875 10.2667 16.1875 11.3739V14H20.0703L19.4496 18.0469H16.1875V27.8299C22.8804 26.7797 28 20.9879 28 14Z" fill="#1877F2" />
                        <path d="M19.4496 18.0469L20.0703 14H16.1875V11.3739C16.1875 10.2666 16.7299 9.1875 18.4691 9.1875H20.2344V5.74219C20.2344 5.74219 18.6322 5.46875 17.1005 5.46875C13.9027 5.46875 11.8125 7.40688 11.8125 10.9156V14H8.25781V18.0469H11.8125V27.8299C12.5361 27.9433 13.2675 28.0002 14 28C14.7325 28.0002 15.4639 27.9433 16.1875 27.8299V18.0469H19.4496Z" fill="white" />
                      </g>
                      <defs>
                        <clipPath id="clip0_2144_16166">
                          <rect width="28" height="28" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>

                  </a>
                </div>
                <div className="py-2 mx-2  w-8 h-8">
                  <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32.1562 0H9.84375C4.4072 0 0 4.4072 0 9.84375V32.1562C0 37.5928 4.4072 42 9.84375 42H32.1562C37.5928 42 42 37.5928 42 32.1562V9.84375C42 4.4072 37.5928 0 32.1562 0Z" fill="url(#paint0_radial_1376_33241)" />
                    <path d="M32.1562 0H9.84375C4.4072 0 0 4.4072 0 9.84375V32.1562C0 37.5928 4.4072 42 9.84375 42H32.1562C37.5928 42 42 37.5928 42 32.1562V9.84375C42 4.4072 37.5928 0 32.1562 0Z" fill="url(#paint1_radial_1376_33241)" />
                    <path d="M21.0015 4.59375C16.5459 4.59375 15.9866 4.61327 14.2367 4.69284C12.4901 4.77291 11.2978 5.04935 10.2547 5.45508C9.17552 5.87409 8.26022 6.43469 7.34836 7.34688C6.43568 8.25891 5.87508 9.17421 5.45475 10.2529C5.04788 11.2964 4.7711 12.4891 4.69252 14.2349C4.61426 15.9849 4.59375 16.5444 4.59375 21.0002C4.59375 25.4559 4.61344 26.0134 4.69284 27.7633C4.77323 29.5099 5.04968 30.7022 5.45508 31.7453C5.87442 32.8245 6.43502 33.7398 7.34721 34.6516C8.25891 35.5643 9.17421 36.1262 10.2526 36.5452C11.2965 36.951 12.4889 37.2274 14.2352 37.3075C15.9853 37.3871 16.5441 37.4066 20.9995 37.4066C25.4556 37.4066 26.0131 37.3871 27.763 37.3075C29.5096 37.2274 30.7031 36.951 31.7471 36.5452C32.8258 36.1262 33.7398 35.5643 34.6513 34.6516C35.564 33.7398 36.1244 32.8245 36.5449 31.7458C36.9482 30.7022 37.2251 29.5096 37.3072 27.7636C37.3857 26.0137 37.4062 25.4559 37.4062 21.0002C37.4062 16.5444 37.3857 15.9853 37.3072 14.2352C37.2251 12.4886 36.9482 11.2965 36.5449 10.2534C36.1244 9.17421 35.564 8.25891 34.6513 7.34688C33.7388 6.43437 32.8261 5.87377 31.7461 5.45524C30.7002 5.04935 29.5073 4.77274 27.7607 4.69284C26.0106 4.61327 25.4535 4.59375 20.9964 4.59375H21.0015ZM19.5297 7.55032C19.9666 7.54966 20.454 7.55032 21.0015 7.55032C25.3821 7.55032 25.9012 7.56607 27.6311 7.64466C29.2307 7.71783 30.0989 7.98509 30.6772 8.20969C31.4429 8.50697 31.9887 8.86249 32.5626 9.43687C33.1369 10.0111 33.4922 10.5579 33.7903 11.3236C34.0149 11.9011 34.2825 12.7693 34.3553 14.3689C34.4339 16.0985 34.451 16.6179 34.451 20.9964C34.451 25.3749 34.4339 25.8945 34.3553 27.6239C34.2822 29.2235 34.0149 30.0917 33.7903 30.6693C33.493 31.435 33.1369 31.9802 32.5626 32.5541C31.9884 33.1283 31.4432 33.4837 30.6772 33.7811C30.0996 34.0067 29.2307 34.2733 27.6311 34.3465C25.9015 34.4251 25.3821 34.4421 21.0015 34.4421C16.6207 34.4421 16.1014 34.4251 14.372 34.3465C12.7724 34.2727 11.9042 34.0054 11.3254 33.7808C10.5599 33.4833 10.0129 33.128 9.43868 32.5538C8.86446 31.9796 8.5091 31.434 8.211 30.668C7.9864 30.0904 7.71881 29.2222 7.64597 27.6225C7.56738 25.893 7.55163 25.3736 7.55163 20.9923C7.55163 16.611 7.56738 16.0944 7.64597 14.3648C7.71914 12.7652 7.9864 11.897 8.211 11.3187C8.50845 10.553 8.86446 10.0062 9.43884 9.43195C10.0132 8.85773 10.5599 8.50221 11.3256 8.20427C11.9039 7.97869 12.7724 7.71209 14.372 7.63859C15.8855 7.57017 16.472 7.54966 19.5297 7.54622V7.55032ZM29.7591 10.2744C28.6722 10.2744 27.7904 11.1554 27.7904 12.2425C27.7904 13.3294 28.6722 14.2113 29.7591 14.2113C30.846 14.2113 31.7279 13.3294 31.7279 12.2425C31.7279 11.1556 30.846 10.2738 29.7591 10.2738V10.2744ZM21.0015 12.5747C16.3487 12.5747 12.5762 16.3472 12.5762 21.0002C12.5762 25.6531 16.3487 29.4238 21.0015 29.4238C25.6545 29.4238 29.4256 25.6531 29.4256 21.0002C29.4256 16.3474 25.6541 12.5747 21.0011 12.5747H21.0015ZM21.0015 15.5313C24.0217 15.5313 26.4703 17.9796 26.4703 21.0002C26.4703 24.0204 24.0217 26.469 21.0015 26.469C17.9813 26.469 15.5328 24.0204 15.5328 21.0002C15.5328 17.9796 17.9811 15.5313 21.0015 15.5313Z" fill="white" />
                    <defs>
                      <radialGradient id="paint0_radial_1376_33241" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11.1562 45.2348) rotate(-90) scale(41.6251 38.7146)">
                        <stop stop-color="#FFDD55" />
                        <stop offset="0.1" stop-color="#FFDD55" />
                        <stop offset="0.5" stop-color="#FF543E" />
                        <stop offset="1" stop-color="#C837AB" />
                      </radialGradient>
                      <radialGradient id="paint1_radial_1376_33241" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(-7.03516 3.02548) rotate(78.681) scale(18.6067 76.6972)">
                        <stop stop-color="#3771C8" />
                        <stop offset="0.128" stop-color="#3771C8" />
                        <stop offset="1" stop-color="#6600FF" stop-opacity="0" />
                      </radialGradient>
                    </defs>
                  </svg>
                </div>
                <div className=" py-2 w-8 h-8">
                  <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_1376_33248" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="0" width="42" height="42">
                      <path d="M0 0H42V42H0V0Z" fill="white" />
                    </mask>
                    <g mask="url(#mask0_1376_33248)">
                      <path d="M33.075 1.968H39.516L25.446 18.09L42 40.032H29.04L18.882 26.727L7.272 40.032H0.825L15.873 22.782L0 1.971H13.29L22.458 14.13L33.075 1.968ZM30.81 36.168H34.38L11.34 5.631H7.512L30.81 36.168Z" fill="white" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className=" mt-6 pt-8 text-center">
          <p className="text-blue-100 text-sm font-sans">
            © 2025 EventHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
