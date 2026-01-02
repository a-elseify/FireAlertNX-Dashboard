import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react'; 
import { useSensorData } from './hooks/useSensorData';

// Sub-Components
import AirQualityWidget from './AirQualityWidget';
import Sidebar from './components/Sidebar';
import LiveMonitor from './components/LiveMonitor';
import HistoryView from './components/HistoryLog';
import Settings from './components/Settings';

const Dashboard = () => {
  const DEVICE_TOKEN = "Z988MDDW3BjoYwfiPcFG"; 
  const [theme, setTheme] = useState("dark");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState("live"); 
  const [viewWindow, setViewWindow] = useState(60 * 1000);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); 

  // Use the Custom Hook
  const { 
    systemStatus, notification, setNotification, sensorData, liveHistory, dailyArchives, 
    alertLog, clearHistory, TEMP_THRESHOLD, GAS_THRESHOLD 
  } = useSensorData(DEVICE_TOKEN, notificationsEnabled);

  const timeOptions = [
    { label: "1 Min", ms: 60 * 1000 }, { label: "5 Min", ms: 5 * 60 * 1000 },
    { label: "10 Min", ms: 10 * 60 * 1000 }, { label: "30 Min", ms: 30 * 60 * 1000 },
    { label: "1 Hr", ms: 60 * 60 * 1000 }, { label: "2 Hr", ms: 120 * 60 * 1000 }
  ];

  useEffect(() => { document.title = "FireAlertNX | Dashboard"; }, []);

  return (
    <div className="drawer lg:drawer-open" data-theme={theme}>
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      
      {/* Sidebar Component */}
      <div className="drawer-side z-40">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label> 
        <Sidebar 
            isExpanded={isSidebarExpanded} 
            toggleExpanded={() => setIsSidebarExpanded(!isSidebarExpanded)} 
            closeDrawer={() => document.getElementById('my-drawer-2').checked = false}
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
        />
      </div>

      <div className="drawer-content flex flex-col bg-base-200 min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden navbar bg-base-100 shadow-sm z-30 sticky top-0 px-4">
            <div className="flex-none"><label htmlFor="my-drawer-2" className="btn btn-square btn-ghost"><Menu className="h-6 w-6" /></label></div>
            <div className="flex-1 px-2 mx-2"><span className="text-xl font-bold text-orange-600 tracking-tighter">FireAlert<span className="text-base-content">NX</span></span></div>
        </div>

        {/* Notification Toast */}
        {notification.title && (
            <div className="toast toast-top toast-end z-50 mt-16 lg:mt-0">
                <div className="alert alert-error text-white animate-pulse shadow-2xl">
                    <div><h3 className="font-bold">{notification.title}</h3><div className="text-xs">{notification.body}</div></div>
                    <button className="btn btn-sm btn-ghost" onClick={() => {setNotification({title:'', body:''});}}>Dismiss</button>
                </div>
            </div>
        )}

        <div className="p-4 md:p-6 lg:p-10 space-y-6">
            {activeTab !== 'settings' && (
                <div className={`alert ${systemStatus === "NORMAL" ? "alert-success" : "alert-error"} shadow-lg text-white`}>
                    <h3 className="font-bold text-lg flex items-center gap-2">{systemStatus === "NORMAL" ? <>✅ NORMAL</> : <>🚨 CRITICAL</>}</h3>
                </div>
            )}

            {activeTab === 'live' && (
                <LiveMonitor 
                    sensorData={sensorData} liveHistory={liveHistory} viewWindow={viewWindow} 
                    setViewWindow={setViewWindow} timeOptions={timeOptions} theme={theme}
                    thresholds={{temp: TEMP_THRESHOLD, gas: GAS_THRESHOLD}} 
                />
            )}

            {activeTab === 'air' && <div className="w-full flex justify-center"><AirQualityWidget gasValue={sensorData.gas} /></div>}

            {activeTab === 'history' && (
                <HistoryView 
                    dailyArchives={dailyArchives} selectedDate={selectedDate} setSelectedDate={setSelectedDate}
                    alertLog={alertLog} clearHistory={clearHistory} theme={theme}
                />
            )}

            {activeTab === 'settings' && (
                <Settings 
                    theme={theme} setTheme={setTheme} 
                    notificationsEnabled={notificationsEnabled} setNotificationsEnabled={setNotificationsEnabled} 
                />
            )}
        </div>
      </div> 
    </div>
  );
};
export default Dashboard;