import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar'; 

// --- IMPORT YOUR TABS ---
import LiveMonitor from './components/LiveMonitor';
import AirQualityWidget from './components/AirQualityWidget';
import HistoryLog from './components/HistoryLog';
import Settings from './components/Settings';
// ------------------------

function App() {
  // --- CONFIGURATION ---
  const TB_USERNAME = "1002267314@ucsiuniversity.edu.my"; 
  const TB_PASSWORD = "Ahmed2026";
  const DEVICE_ID   = "5ba48fa0-ce8c-11f0-8d27-9f87c351edd8"; 
  // ---------------------

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

  // 2. FETCH DATA LOOP
  useEffect(() => {
    if (!jwtToken) return;

    const fetchData = async () => {
        try {
            const url = `/api/plugins/telemetry/DEVICE/${DEVICE_ID}/values/timeseries?keys=p_fire,mq9_v,ai_label&limit=1`;
            
            const res = await fetch(url, {
                headers: { 'X-Authorization': `Bearer ${jwtToken}` }
            });
            const data = await res.json();
            
            // --- MAPPING ---
            const thermalPacket = data.p_fire?.[0] || {};
            const gasPacket = data.mq9_v?.[0] || {}; 
            const aiPacket = data.ai_label?.[0] || {};

            const newPoint = {
                rawTime: Date.now(),
                temp: parseFloat(thermalPacket.value || 0), // p_fire
                gas: parseFloat(gasPacket.value || 0),      // mq9_v
                p_fire: parseFloat(aiPacket.value || 0)     // ai_label
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

        } catch (error) { console.error("Fetch Error:", error); }
    };

    const interval = setInterval(fetchData, 2000); 
    return () => clearInterval(interval);
  }, [jwtToken]);

  return (
    <div className="flex h-screen bg-base-200 text-base-content font-sans">
      
      {/* SIDEBAR */}
      <Sidebar 
        isExpanded={isExpanded} 
        toggleExpanded={toggleExpanded}
        closeDrawer={closeDrawer}
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto transition-all duration-300">
          <div className="p-4 md:p-8">
            
            {/* 1. LIVE MONITORING */}
            {activeTab === 'live' && (
                <LiveMonitor 
                    sensorData={sensorData}
                    liveHistory={liveHistory}
                    viewWindow={viewWindow}
                    setViewWindow={setViewWindow}
                    timeOptions={[{label: '1 Min', ms: 60000}, {label: '5 Min', ms: 300000}]}
                    theme="dark"
                />
            )}

            {/* 2. AIR QUALITY */}
            {activeTab === 'air' && (
                <AirQualityWidget sensorData={sensorData} />
            )}

            {/* 3. HISTORY & LOGS */}
            {activeTab === 'history' && (
                <HistoryLog history={liveHistory} />
            )}

            {/* 4. SETTINGS */}
            {activeTab === 'settings' && (
                <Settings 
                    deviceId={DEVICE_ID} 
                    username={TB_USERNAME} 
                />
            )}

          </div>
      </main>
    </div>
  );
}

export default App;