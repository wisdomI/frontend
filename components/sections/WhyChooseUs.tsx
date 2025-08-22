import { LockOutlined } from '@ant-design/icons';
import { LockIcon, ShieldClose } from 'lucide-react';
import React from 'react';
import { BsShield, BsShieldCheck, BsShieldFill } from 'react-icons/bs';

const WhyChooseEventHub = () => {
    return (
      <section className="bg-blue-100 p-3 rounded-lg flex items-center justify-between text-blue-800 text-sm">
        <div className="flex items-center  ">
          {/* Info Icon (triangle with !; use SVG or Heroicons) */}
         

<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
<g clip-path="url(#clip0_1792_16380)">
<path d="M19.993 27.204V29.359L14.807 26.3646V20.3753L16.6724 21.4518C16.0098 24.0072 17.2686 26.4823 19.993 27.2041M26.4967 18.0952V12.1059L21.3098 9.11133V15.1005L26.4967 18.0952ZM20.69 15.1005V9.11133L15.5032 12.1059V18.0952L20.69 15.1005ZM27.8131 20.3752V26.3645L33 29.3591V23.3699L27.8131 20.3752ZM21.996 27.2054V29.3587L27.1932 26.3641V20.3751L25.3269 21.4532C26.0629 24.0427 24.7751 26.4172 21.996 27.2054M14.1868 26.3644V20.3752L9 23.3699V29.3591L14.1868 26.3644ZM24.3206 19.71L26.1865 18.6322L20.9997 15.6375L15.813 18.6321L17.6791 19.7088C19.4812 17.8072 22.3784 17.7411 24.3206 19.71ZM9.30994 29.8959L14.4967 32.8905L19.6836 29.8959L14.4967 26.9013L9.30994 29.8959ZM22.3164 29.8959L27.5032 32.8905L32.69 29.8959L27.5032 26.9013L22.3164 29.8959ZM24.3525 22.7887C24.3525 20.2176 21.5499 18.6019 19.32 19.8875C17.0901 21.1731 17.09 24.4045 19.32 25.6901C21.55 26.9757 24.3525 25.3599 24.3525 22.7887Z" fill="#032D71"/>
</g>
<defs>
<clipPath id="clip0_1792_16380">
<rect width="24" height="24" fill="white" transform="translate(9 9)"/>
</clipPath>
</defs>
</svg>

          <p className='font-semibold font-sans text-[16px] text-[#484848]'>      Why Choose EventHub</p>
   
        </div>
        <div className="flex space-x-4">
          <div className='flex gap-2 '>
            <ShieldClose className='text-event-blue' />
              <a href="/safe-payments" className="hover:underline font-semibold font-sans text-[16px]  text-[#484848]">Safe Payments</a>
          </div>
        <div className='flex gap-2'>
          <LockIcon className='text-event-blue'/>
          <a href="/data-privacy" className="hover:underline font-semibold font-sans text-[16px]  text-[#484848] ">Data Privacy</a>
          
        </div>
          
        </div>
      </section>
    );
  };
  
  export default WhyChooseEventHub;