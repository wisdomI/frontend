import { LockOutlined } from '@ant-design/icons';
import { LockIcon, ShieldClose } from 'lucide-react';
import React from 'react';
import { BsShield, BsShieldCheck, BsShieldLockFill } from 'react-icons/bs';

const WhyChooseEventHub = () => {
    return (
      <section className="bg-blue-50 p-4 rounded-lg flex items-center justify-between text-blue-800 text-sm mb-6">
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 42 42" fill="none">
            <g clipPath="url(#clip0_1792_16380)">
              <path d="M19.993 27.204V29.359L14.807 26.3646V20.3753L16.6724 21.4518C16.0098 24.0072 17.2686 26.4823 19.993 27.2041M26.4967 18.0952V12.1059L21.3098 9.11133V15.1005L26.4967 18.0952ZM20.69 15.1005V9.11133L15.5032 12.1059V18.0952L20.69 15.1005ZM27.8131 20.3752V26.3645L33 29.3591V23.3699L27.8131 20.3752ZM21.996 27.2054V29.3587L27.1932 26.3641V20.3751L25.3269 21.4532C26.0629 24.0427 24.7751 26.4172 21.996 27.2054M14.1868 26.3644V20.3752L9 23.3699V29.3591L14.1868 26.3644ZM24.3206 19.71L26.1865 18.6322L20.9997 15.6375L15.813 18.6321L17.6791 19.7088C19.4812 17.8072 22.3784 17.7411 24.3206 19.71ZM9.30994 29.8959L14.4967 32.8905L19.6836 29.8959L14.4967 26.9013L9.30994 29.8959ZM22.3164 29.8959L27.5032 32.8905L32.69 29.8959L27.5032 26.9013L22.3164 29.8959ZM24.3525 22.7887C24.3525 20.2176 21.5499 18.6019 19.32 19.8875C17.0901 21.1731 17.09 24.4045 19.32 25.6901C21.55 26.9757 24.3525 25.3599 24.3525 22.7887Z" fill="#032D71"/>
            </g>
            <defs>
              <clipPath id="clip0_1792_16380">
                <rect width="24" height="24" fill="white" transform="translate(9 9)"/>
              </clipPath>
            </defs>
          </svg>
          <p className='font-semibold font-sans text-base text-gray-700'>Why Choose EventHub</p>
        </div>
        <div className="flex space-x-6">
          <div className='flex items-center gap-2'>
            <BsShieldLockFill className='text-event-blue w-5 h-5' />
            <a href="/safe-payments" className="hover:underline font-semibold font-sans text-sm text-gray-700">Safe Payments</a>
          </div>
          <div className='flex items-center gap-2'>
          <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 0C6.155 0 3 3.155 3 7V8H2C0.9 8 0 8.9 0 10V22C0 23.1 0.9 24 2 24H18C19.1 24 20 23.1 20 22V10C20 8.9 19.1 8 18 8H17V7C17 3.155 13.845 0 10 0ZM10 2C12.755 2 15 4.245 15 7V8H5V7C5 4.245 7.245 2 10 2ZM10 11C12.8 11 15 13.2 15 16C15 18.8 12.8 21 10 21C7.2 21 5 18.8 5 16C5 13.2 7.2 11 10 11ZM10 13C8.3 13 7 14.3 7 16C7 17.7 8.3 19 10 19C11.7 19 13 17.7 13 16C13 15.7 12.906 15.394 12.906 15.094C12.606 15.594 12.1 16 11.5 16C10.7 16 10 15.3 10 14.5C10 13.9 10.406 13.394 10.906 13.094C10.606 13.094 10.3 13 10 13Z" fill="#032D71"/>
</svg>
            <a href="/data-privacy" className="hover:underline font-semibold font-sans text-sm text-gray-700">Data Privacy</a>
          </div>
        </div>
      </section>
    );
  };
  
  export default WhyChooseEventHub;