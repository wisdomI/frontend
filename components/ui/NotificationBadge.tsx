import React from 'react';

interface NotificationBadgeProps {
  count: number;
  color?: 'red' | 'green' | 'blue' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  color = 'red',
  size = 'sm'
}) => {
  if (count <= 0) return null;

  const colorClasses = {
    red: 'bg-red-500 text-white',
    green: 'bg-green-500 text-white',
    blue: 'bg-blue-500 text-white',
    yellow: 'bg-yellow-500 text-black'
  };

  const sizeClasses = {
    sm: 'h-5 w-5 text-xs',
    md: 'h-6 w-6 text-sm',
    lg: 'h-7 w-7 text-base'
  };

  return (
    <span
      className={`
        absolute -top-1 -right-1 rounded-full flex items-center justify-center font-medium
        ${colorClasses[color]} ${sizeClasses[size]}
      `}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
};

export default NotificationBadge;