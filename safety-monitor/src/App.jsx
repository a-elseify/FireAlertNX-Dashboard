import React, { useState, useEffect } from 'react';
import LiveMonitor from './components/LiveMonitor';
import Sidebar from './components/Sidebar'; 

// --- IMPORTS ---
import AirQualityWidget from './components/AirQualityWidget';
import HistoryLog from './components/HistoryLog';
import Settings from './components/Settings';
// ---------------

function App() {
  // --- CONFIGURATION ---
  const TB_USERNAME = "1002267314@ucsiuniversity.edu.my"; 
  const TB_PASSWORD = "Ahmed2026";
  const DEVICE_ID   = "5ba48fa0-ce8c-11f0-8d27-9f87c351edd8"; 
  // ---------------------

  // --- THEME STATE ---
  const [theme, setTheme] = useState('dark');
  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // --- NEW: NOTIFICATION STATE ---
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // --- SIDEBAR STATE ---
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('live');
  const toggleExpanded = () => setIsExpanded(!isExpanded);
  const closeDrawer = () => setIsExpanded(false);

  // --- DATA STATE ---
  const [sensorData, setSensorData] = useState({ temp: 0, gas: 0, p_fire: 0 });
  const [liveHistory, setLiveHistory] = useState([]);
  const [jwtToken, setJwtToken] = useState(null);
  const [viewWindow, setViewWindow] = useState(60000); 

  // 1. LOGIN
  useEffect(() => {
    const login = async () => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: TB_USERNAME, password: TB_PASSWORD })
            });
            const data = await res.json();
            if (data.token) setJwtToken(data.token);
        } catch (e) { console.error("Login Error", e); }
    };
    login();
  }, []);

  // 2. FETCH DATA LOOP & NOTIFICATIONS
  useEffect(() => {
    if (!jwtToken) return;

    const fetchData = async () => {
        try {
            const keys = "p_fire,mq9_v,mq9,gas,ai_label";
            const url = `/api/plugins/telemetry/DEVICE/${DEVICE_ID}/values/timeseries?keys=${keys}&limit=1`;
            
            const res = await fetch(url, {
                headers: { 'X-Authorization': `Bearer ${jwtToken}` }
            });
            const data = await res.json();
            
            const thermalPacket = data.p_fire?.[0] || {};
            const gasPacket = data.mq9_v?.[0] || data.mq9?.[0] || data.gas?.[0] || {};
            const aiPacket = data.ai_label?.[0] || {};

            const newPoint = {
                rawTime: Date.now(),
                temp: parseFloat(thermalPacket.value || 0), 
                gas: parseFloat(gasPacket.value || 0),      
                p_fire: parseFloat(aiPacket.value || 0)     
            };

            setSensorData({
                temp: newPoint.temp,
                gas: newPoint.gas,
                p_fire: newPoint.p_fire
            });

            setLiveHistory(prev => {
                const updated = [...prev, newPoint];
                return updated.slice(-50); 
            });

            // --- DESKTOP ALERT LOGIC ---
            // Trigger if Fire Prob > 0.5 AND Notifications are Enabled
            if (notificationsEnabled && (newPoint.p_fire > 0.5 || newPoint.p_fire === 1)) {
                
                // 1. Check Browser Permission
                if (Notification.permission === "granted") {
                    // 2. Send Alert (throttled by browser usually)
                    new Notification("🔥 CRITICAL HAZARD DETECTED", {
                        body: `Fire Probability: ${newPoint.p_fire}\nCheck the dashboard immediately!`,
                        icon: "/Logo.png",
                        requireInteraction: true // Keeps alert on screen until clicked
                    });
                } else if (Notification.permission !== "denied") {
                    // 3. Request Permission if not yet asked
                    Notification.requestPermission();
                }
            }
            // ---------------------------

        } catch (error) { console.error("Fetch Error:", error); }
    };

    const interval = setInterval(fetchData, 2000); 
    return () => clearInterval(interval);
  }, [jwtToken, notificationsEnabled]); // Re-run if notification setting changes

  return (
    <div className="flex h-screen bg-base-200 text-base-content font-sans">
      <Sidebar 
        isExpanded={isExpanded} 
        toggleExpanded={toggleExpanded}
        closeDrawer={closeDrawer}
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 overflow-y-auto transition-all duration-300">
          <div className="p-4 md:p-8">
            {activeTab === 'live' && (
                <LiveMonitor 
                    sensorData={sensorData}
                    liveHistory={liveHistory}
                    viewWindow={viewWindow}
                    setViewWindow={setViewWindow}
                    timeOptions={[{label: '1 Min', ms: 60000}, {label: '5 Min', ms: 300000}]}
                    theme={theme}
                />
            )}

            {activeTab === 'air' && <AirQualityWidget sensorData={sensorData} />}
            {activeTab === 'history' && <HistoryLog history={liveHistory} />}

            {activeTab === 'settings' && (
                <Settings 
                    // Pass Theme Props
                    theme={theme} 
                    toggleTheme={toggleTheme}
                    // Pass Notification Props (Lifted State)
                    notificationsEnabled={notificationsEnabled}
                    setNotificationsEnabled={setNotificationsEnabled}
                />
            )}
          </div>
      </main>
    </div>
  );
}

export default App;