import React from 'react';
import { Zap, Cloud, Code } from 'lucide-react';

// Now accepting 'notificationsEnabled' and 'setNotificationsEnabled' as props
const Settings = ({ theme, toggleTheme, notificationsEnabled, setNotificationsEnabled }) => {
  
  // Handler to toggle and Request Permission immediately
  const handleNotificationToggle = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);

    // If turning ON, ask browser for permission right away
    if (newState && Notification.permission !== "granted") {
        Notification.requestPermission();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Appearance Card */}
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-4 md:p-6">
                <h2 className="card-title border-b border-base-300 pb-2 mb-4">Appearance</h2>
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text font-bold">🌗 Dark Mode</span> 
                        <input 
                            type="checkbox" 
                            className="toggle toggle-primary" 
                            checked={theme === 'dark'} 
                            onChange={toggleTheme} 
                        />
                    </label>
                </div>
            </div>
        </div>

        {/* Notifications Card */}
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-4 md:p-6">
                <h2 className="card-title border-b border-base-300 pb-2 mb-4">Notifications</h2>
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text font-bold">🔔 Desktop Alerts</span> 
                        <input 
                            type="checkbox" 
                            className="toggle toggle-success" 
                            checked={notificationsEnabled} 
                            onChange={handleNotificationToggle} 
                        />
                    </label>
                    <p className="text-xs opacity-60 mt-1">Enable popup alerts for critical hazards.</p>
                </div>
            </div>
        </div>
        
        {/* Footer */}
        <div className="mt-10 text-center">
            <p className="text-xs font-mono text-gray-500 flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
                <span className="flex items-center gap-1"><Zap size={12} /> Powered by <span className="font-bold">React</span></span>
                <span className="hidden md:inline opacity-50">•</span>
                <span className="flex items-center gap-1"><Cloud size={12} /> Integrated with <span className="font-bold">ThingsBoard</span></span>
                <span className="hidden md:inline opacity-50">•</span>
                <span className="flex items-center gap-1"><Code size={12} /> Developed by <span className="font-bold">F1: The IDP</span></span>
            </p>
        </div>
    </div>
  );
};

export default Settings;