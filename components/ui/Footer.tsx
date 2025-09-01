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

                <div className="py-2  w-8 h-8 ">
                  <a href="#" className="  rounded-full  transition-colors">


                    <svg width="32" height="32" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                <div className="py-2 mx-2  w-6 h-6">
                <a href="#" className="  rounded-full  transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_2234_5388)">
<path d="M18.375 0H5.625C2.5184 0 0 2.5184 0 5.625V18.375C0 21.4816 2.5184 24 5.625 24H18.375C21.4816 24 24 21.4816 24 18.375V5.625C24 2.5184 21.4816 0 18.375 0Z" fill="url(#paint0_radial_2234_5388)"/>
<path d="M18.375 0H5.625C2.5184 0 0 2.5184 0 5.625V18.375C0 21.4816 2.5184 24 5.625 24H18.375C21.4816 24 24 21.4816 24 18.375V5.625C24 2.5184 21.4816 0 18.375 0Z" fill="url(#paint1_radial_2234_5388)"/>
<path d="M12.0008 2.625C9.45478 2.625 9.13519 2.63616 8.13525 2.68163C7.13719 2.72738 6.45591 2.88534 5.85984 3.11719C5.24316 3.35662 4.72013 3.67697 4.19906 4.19822C3.67753 4.71937 3.35719 5.24241 3.117 5.85881C2.8845 6.45506 2.72634 7.13662 2.68144 8.13422C2.63672 9.13425 2.625 9.45394 2.625 12.0001C2.625 14.5463 2.63625 14.8648 2.68163 15.8647C2.72756 16.8628 2.88553 17.5441 3.11719 18.1402C3.35681 18.7568 3.67716 19.2799 4.19841 19.8009C4.71938 20.3225 5.24241 20.6436 5.85862 20.883C6.45516 21.1148 7.13653 21.2728 8.13441 21.3186C9.13444 21.364 9.45375 21.3752 11.9997 21.3752C14.5461 21.3752 14.8646 21.364 15.8646 21.3186C16.8626 21.2728 17.5447 21.1148 18.1412 20.883C18.7576 20.6436 19.2799 20.3225 19.8007 19.8009C20.3223 19.2799 20.6425 18.7568 20.8828 18.1404C21.1133 17.5441 21.2715 16.8626 21.3184 15.8649C21.3633 14.865 21.375 14.5463 21.375 12.0001C21.375 9.45394 21.3633 9.13444 21.3184 8.13441C21.2715 7.13634 21.1133 6.45516 20.8828 5.85909C20.6425 5.24241 20.3223 4.71937 19.8007 4.19822C19.2793 3.67678 18.7578 3.35644 18.1406 3.11728C17.543 2.88534 16.8613 2.72728 15.8632 2.68163C14.8632 2.63616 14.5448 2.625 11.9979 2.625H12.0008ZM11.1598 4.31447C11.4095 4.31409 11.688 4.31447 12.0008 4.31447C14.5041 4.31447 14.8007 4.32347 15.7892 4.36838C16.7032 4.41019 17.1994 4.56291 17.5298 4.69125C17.9674 4.86112 18.2793 5.06428 18.6072 5.3925C18.9353 5.72062 19.1384 6.03309 19.3088 6.47062C19.4371 6.80062 19.59 7.29675 19.6316 8.21081C19.6765 9.19913 19.6863 9.49594 19.6863 11.9979C19.6863 14.4999 19.6765 14.7968 19.6316 15.7851C19.5898 16.6991 19.4371 17.1952 19.3088 17.5253C19.1389 17.9629 18.9353 18.2744 18.6072 18.6023C18.2791 18.9305 17.9676 19.1335 17.5298 19.3035C17.1997 19.4324 16.7032 19.5848 15.7892 19.6266C14.8009 19.6715 14.5041 19.6812 12.0008 19.6812C9.49753 19.6812 9.20081 19.6715 8.21259 19.6266C7.29853 19.5844 6.80241 19.4317 6.47166 19.3033C6.03422 19.1333 5.72166 18.9303 5.39353 18.6022C5.06541 18.274 4.86234 17.9623 4.692 17.5246C4.56366 17.1945 4.41075 16.6984 4.36913 15.7843C4.32422 14.796 4.31522 14.4992 4.31522 11.9956C4.31522 9.492 4.32422 9.19678 4.36913 8.20847C4.41094 7.29441 4.56366 6.79828 4.692 6.46781C4.86197 6.03028 5.06541 5.71781 5.39363 5.38969C5.72184 5.06156 6.03422 4.85841 6.47175 4.68816C6.80222 4.55925 7.29853 4.40691 8.21259 4.36491C9.07744 4.32581 9.41259 4.31409 11.1598 4.31212V4.31447ZM17.0052 5.87109C16.3841 5.87109 15.8802 6.37453 15.8802 6.99572C15.8802 7.61681 16.3841 8.12072 17.0052 8.12072C17.6263 8.12072 18.1302 7.61681 18.1302 6.99572C18.1302 6.37463 17.6263 5.87072 17.0052 5.87072V5.87109ZM12.0008 7.18556C9.34209 7.18556 7.18641 9.34125 7.18641 12.0001C7.18641 14.6589 9.34209 16.8136 12.0008 16.8136C14.6597 16.8136 16.8146 14.6589 16.8146 12.0001C16.8146 9.34134 14.6595 7.18556 12.0007 7.18556H12.0008ZM12.0008 8.87503C13.7267 8.87503 15.1259 10.2741 15.1259 12.0001C15.1259 13.7259 13.7267 15.1252 12.0008 15.1252C10.275 15.1252 8.87588 13.7259 8.87588 12.0001C8.87588 10.2741 10.2749 8.87503 12.0008 8.87503Z" fill="white"/>
</g>
<defs>
<radialGradient id="paint0_radial_2234_5388" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(6.375 25.8485) rotate(-90) scale(23.7858 22.1227)">
<stop stop-color="#FFDD55"/>
<stop offset="0.1" stop-color="#FFDD55"/>
<stop offset="0.5" stop-color="#FF543E"/>
<stop offset="1" stop-color="#C837AB"/>
</radialGradient>
<radialGradient id="paint1_radial_2234_5388" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(-4.02009 1.72884) rotate(78.681) scale(10.6324 43.827)">
<stop stop-color="#3771C8"/>
<stop offset="0.128" stop-color="#3771C8"/>
<stop offset="1" stop-color="#6600FF" stop-opacity="0"/>
</radialGradient>
<clipPath id="clip0_2234_5388">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>

</a>


                

                </div>
                <div className=" py-2 w-6 h-6">
                <a href="#" className="  rounded-full  transition-colors">
                <svg width="23" height="26" viewBox="0 0 23 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_2144_16176)">
<path d="M17.045 9.36208C18.7231 10.5585 20.7789 11.2625 22.9992 11.2625V7.00119C22.579 7.00135 22.1599 6.9576 21.7488 6.87065V10.2249C19.5287 10.2249 17.4731 9.52104 15.7947 8.32468V17.0209C15.7947 21.3712 12.2588 24.8975 7.89739 24.8975C6.27005 24.8975 4.75744 24.4068 3.50098 23.5653C4.93506 25.0278 6.93498 25.935 9.14748 25.935C13.5092 25.935 17.0452 22.4087 17.0452 18.0582V9.36208H17.045ZM18.5876 5.06294C17.73 4.12846 17.1668 2.9208 17.045 1.58566V1.0376H15.8601C16.1583 2.7345 17.1758 4.18423 18.5876 5.06294ZM6.25954 20.227C5.78035 19.6005 5.52133 18.8339 5.52255 18.0457C5.52255 16.0561 7.13983 14.4428 9.13517 14.4428C9.50696 14.4426 9.87657 14.4996 10.231 14.6117V10.255C9.81681 10.1985 9.39886 10.1744 8.98109 10.1832V13.5742C8.62649 13.4621 8.25669 13.4052 7.88472 13.4054C5.88947 13.4054 4.27229 15.0185 4.27229 17.0084C4.27229 18.4155 5.08061 19.6336 6.25954 20.227Z" fill="#FF004F"/>
<path d="M15.7944 8.32459C17.473 9.52095 19.5284 10.2248 21.7486 10.2248V6.87056C20.5093 6.60725 19.4122 5.96137 18.5873 5.06294C17.1754 4.18414 16.1581 2.73441 15.8599 1.0376H12.7474V18.058C12.7403 20.0423 11.1258 21.6489 9.13478 21.6489C7.9616 21.6489 6.91923 21.0911 6.25915 20.2269C5.0804 19.6336 4.27198 18.4154 4.27198 17.0085C4.27198 15.0188 5.88917 13.4055 7.88442 13.4055C8.26671 13.4055 8.63516 13.4649 8.98078 13.5743V10.1833C4.69596 10.2716 1.25 13.7635 1.25 18.0581C1.25 20.2019 2.1081 22.1454 3.50086 23.5654C4.75732 24.4068 6.26984 24.8977 7.89727 24.8977C12.2587 24.8977 15.7945 21.3711 15.7945 17.0209L15.7944 8.32459Z" fill="black"/>
<path d="M21.7489 6.87028V5.9635C20.6314 5.96512 19.5359 5.65298 18.5877 5.06274C19.427 5.9792 20.5322 6.6112 21.7489 6.87046M15.8601 1.03731C15.8317 0.875176 15.8099 0.711959 15.7947 0.548062V0H11.4971V17.0206C11.4903 19.0047 9.8758 20.6113 7.88469 20.6113C7.32022 20.6121 6.76347 20.4805 6.25941 20.2269C6.9195 21.0909 7.96186 21.6486 9.13504 21.6486C11.126 21.6486 12.7407 20.0421 12.7477 18.0579V1.0374L15.8601 1.03731ZM8.98132 10.183V9.21754C8.6222 9.16861 8.26016 9.14411 7.89771 9.1442C3.5358 9.1442 0 12.6707 0 17.0206C0 19.7478 1.38961 22.1513 3.5013 23.5651C2.10854 22.1451 1.25045 20.2016 1.25045 18.0578C1.25045 13.7633 4.69631 10.2713 8.98132 10.183Z" fill="#00F2EA"/>
</g>
<defs>
<clipPath id="clip0_2144_16176">
<rect width="23" height="26" fill="white"/>
</clipPath>
</defs>
</svg>
           </a>     </div>
                <div className=" py-2 w-6 h-6">
                <a href="#" className="  rounded-full  transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_2234_5393)">
<path d="M14.2343 10.1625L22.9767 0H20.9048L13.3141 8.82375L7.25106 0H0.258057L9.42643 13.3433L0.258057 24H2.32993L10.3463 14.6818L16.7491 24H23.7421L14.2337 10.1625H14.2343ZM11.3967 13.4606L10.4676 12.132L3.07637 1.55962H6.25862L12.2232 10.092L13.1521 11.4206L20.9057 22.5112H17.7239L11.3967 13.4612V13.4606Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_2234_5393">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>
</a>
</div>
<div className=" py-2 w-6 h-6">
<a href="#" className="  rounded-full  transition-colors">
<svg width="25" height="18" viewBox="0 0 25 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_2234_5399)">
<path d="M24.4479 2.8075C24.3045 2.26486 24.0248 1.77014 23.6366 1.37263C23.2484 0.975112 22.7653 0.688661 22.2354 0.5418C20.2953 0 12.4873 0 12.4873 0C12.4873 0 4.67893 0.0164 2.73889 0.5582C2.20895 0.70507 1.72584 0.991536 1.33766 1.38907C0.949476 1.78661 0.669767 2.28134 0.526386 2.824C-0.0604304 6.3538 -0.288067 11.7324 0.542499 15.121C0.685895 15.6636 0.965611 16.1584 1.35379 16.5559C1.74198 16.9534 2.22508 17.2398 2.755 17.3867C4.69504 17.9285 12.5032 17.9285 12.5032 17.9285C12.5032 17.9285 20.3113 17.9285 22.2513 17.3867C22.7812 17.2399 23.2644 16.9534 23.6526 16.5559C24.0408 16.1584 24.3205 15.6637 24.4639 15.121C25.0828 11.5862 25.2736 6.2109 24.4479 2.8075Z" fill="#FF0000"/>
<path d="M10.002 12.8086L16.4793 8.9668L10.002 5.125V12.8086Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_2234_5399">
<rect width="25" height="18" fill="white"/>
</clipPath>
</defs>
</svg>
</a>
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
