import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  activePage: string;
  onPageChange: (path: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activePage, onPageChange }) => {
  const router = useRouter();
  const navItems = [
    { name: 'Service Request Posts', path: '/dashboard/service-requests' },
    { name: 'Direct Service Request', path: '/dashboard/direct-request' },
  ];

  return (
    <nav
      style={{
        backgroundColor: '#032d71',
        padding: '12px',
        borderRadius: '16px',
         marginTop:"50px"
      }}
    >
      {navItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          style={{
            color: '#fff',
            fontSize: '16px',
            marginRight: '20px',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
          onClick={() => onPageChange(item.path)}
        >
          {item.name}
        </Link>
      ))}

      {/* 👇 Just a thin line under the nav items */}
      <div
        style={{
          marginTop: '8px',
          height: '1px',
          backgroundColor: '#caf0f8',
          borderRadius: '1px',
        }}
      />
    </nav>
  );
};

export default Navbar;
