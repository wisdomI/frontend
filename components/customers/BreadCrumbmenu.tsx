// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";

// export default function Breadcrumb() {
//   const pathname = usePathname();

//   // Split pathname into parts, e.g. "/dashboard/posts" => ["dashboard", "posts"]
//   const segments = pathname.split("/").filter(Boolean);

//   return (
//     <nav className="text-sm text-gray-600 flex items-center space-x-1">
//       {segments.map((segment, index) => {
//         const href = "/" + segments.slice(0, index + 1).join("/"); // builds path progressively
//         const isLast = index === segments.length - 1;

//         return (
//           <span key={index} className="flex items-center">
//             {!isLast ? (
//               <Link href={href} className="hover:underline capitalize">
//                 {segment.replace("-", " ")}
//               </Link>
//             ) : (
//               <span className="font-medium text-gray-800 capitalize">
//                 {segment.replace("-", " ")}
//               </span>
//             )}
//             {!isLast && (
//               <span className="mx-2 text-gray-400">{">"}</span>
//             )}
//           </span>
//         );
//       })}
//     </nav>
//   );
// }


// components/Breadcrumb.tsx
'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { selectMenuItem, resetBreadcrumb } from '@/store/dashboardSlice';
import { RootState } from "@/store/store"
import { BreadcrumbItem } from "@/types/dashbaord"

const Breadcrumb = () => {
  const breadcrumbItems = useSelector((state: RootState) => state.dashboard.breadcrumbItems);
  const dispatch = useDispatch();

  const handleBreadcrumbClick = (index: number) => {
    const newItems = breadcrumbItems.slice(0, index + 1);
    const newView = newItems[newItems.length - 1].path.replace('/dashboard/', '');
    dispatch(selectMenuItem({ view: newView, breadcrumb: null as any })); // Avoid adding breadcrumb
  };

  return (
    <div className="breadcrumb" style={{ padding: '10px', background: '#fff' }}>
      {breadcrumbItems.map((item, index) => (
        <span key={index} style={{ marginRight: '5px' }}>
          <Link
            href={item.path}
            onClick={() => handleBreadcrumbClick(index)}
            style={{ textDecoration: 'none', color: 'gray' }}
          >
            {item.label}
          </Link>
          {index < breadcrumbItems.length - 1 && ' > '}
        </span>
      ))}
      <button
        onClick={() => dispatch(resetBreadcrumb())}
        style={{ marginLeft: '10px', cursor: 'pointer' }}
      >
        
      </button>
    </div>
  );
};

export default Breadcrumb;