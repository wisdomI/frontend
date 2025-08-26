import React, { useState } from 'react';

interface HeaderSwitchProps {
  activeTab?: 'posts' | 'direct';
  onTabChange?: (tab: 'posts' | 'direct') => void;
}

const HeaderSwitch: React.FC<HeaderSwitchProps> = ({ 
  activeTab = 'posts', 
  onTabChange 
}) => {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const handleTabChange = (tab: 'posts' | 'direct') => {
    setCurrentTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="bg-event-blue rounded-2xl p-1 flex w-full max-w-2xl mx-auto">
      <button
        onClick={() => handleTabChange('posts')}
        className={`flex-1 py-3 px-6 rounded-xl text-center font-medium transition-all duration-200 ${
          currentTab === 'posts'
            ? 'bg-white text-event-blue shadow-sm'
            : 'text-white hover:text-gray-200'
        }`}
      >
        Service Request Posts
      </button>
      <button
        onClick={() => handleTabChange('direct')}
        className={`flex-1 py-3 px-6 rounded-xl text-center font-medium transition-all duration-200 ${
          currentTab === 'direct'
            ? 'bg-white text-event-blue shadow-sm'
            : 'text-white hover:text-gray-200'
        }`}
      >
        Direct Service Request
      </button>
    </div>
  );
};

export default HeaderSwitch;