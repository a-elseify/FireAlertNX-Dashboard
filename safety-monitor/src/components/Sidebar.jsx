import React from 'react';
import { Menu, X, Activity, Wind, Settings as SettingsIcon, Calendar } from 'lucide-react';

const MenuItem = ({ id, icon, label, isExpanded, activeTab, onClick }) => {
  // 1. Explicitly assign the 'icon' prop to a Capitalized variable.
  // This satisfies React (must be capitalized) and the Linter (variable is used).
  const IconComponent = icon;

  return (
    <li>
      <a 
        onClick={onClick} 
        className={`flex items-center ${activeTab === id ? "active font-bold" : ""} ${isExpanded ? "justify-start px-4" : "justify-center px-0"}`} 
        title={label}
      >
        {/* 2. Use the Capitalized variable here */}
        <IconComponent size={22} />
        <span className={`transition-all duration-200 ${isExpanded ? "opacity-100 ml-2" : "opacity-0 w-0 hidden"}`}>
          {label}
        </span>
      </a>
    </li>
  );
};

const Sidebar = ({ isExpanded, toggleExpanded, closeDrawer, activeTab, setActiveTab }) => {
  
  const handleItemClick = (id) => {
    setActiveTab(id);
    closeDrawer();
  };

  return (
    <aside className={`min-h-full bg-base-100 text-base-content border-r border-base-300 flex flex-col transition-all duration-300 ease-in-out ${isExpanded ? 'w-80' : 'w-20 hidden lg:flex'} lg:flex`}>
      
      {/* Header */}
      <div className={`flex items-center p-4 mb-2 ${isExpanded ? 'justify-between' : 'justify-center'}`}>
        <div className={`flex items-center gap-0 overflow-hidden transition-all duration-300 ${isExpanded ? 'w-auto' : 'w-0 opacity-0'}`}>
           {isExpanded && (
            <div className="flex items-center">
                <img src="/Logo.png" alt="Logo" className="w-8 h-8 object-contain mr-2" />
                <span className="text-xl font-bold text-orange-600 tracking-tighter whitespace-nowrap">
                    FireAlert<span className="text-base-content">NX</span>
                </span>
            </div>
           )}
        </div>
        <button className="btn btn-ghost btn-square hidden lg:flex" onClick={toggleExpanded}>
            <Menu size={24} />
        </button>
        <button className="btn btn-sm btn-ghost lg:hidden" onClick={closeDrawer}>
            <X size={20} />
        </button>
      </div>

      {/* Menu Items */}
      <ul className="menu px-2 gap-2 flex-1">
        <MenuItem 
            id="live" 
            icon={Activity} // Pass as lowercase 'icon'
            label="Live Monitoring" 
            isExpanded={isExpanded} 
            activeTab={activeTab} 
            onClick={() => handleItemClick('live')} 
        />
        <MenuItem 
            id="air" 
            icon={Wind} 
            label="Air Quality" 
            isExpanded={isExpanded} 
            activeTab={activeTab} 
            onClick={() => handleItemClick('air')} 
        />
        <MenuItem 
            id="history" 
            icon={Calendar} 
            label="History & Logs" 
            isExpanded={isExpanded} 
            activeTab={activeTab} 
            onClick={() => handleItemClick('history')} 
        />
      </ul>

      {/* Footer Settings */}
      <div className="p-2 border-t border-base-300 mt-auto">
         <ul className="menu">
            <MenuItem 
                id="settings" 
                icon={SettingsIcon} 
                label="Settings" 
                isExpanded={isExpanded} 
                activeTab={activeTab} 
                onClick={() => handleItemClick('settings')} 
            />
         </ul>
      </div>
    </aside>
  );
};

export default Sidebar;