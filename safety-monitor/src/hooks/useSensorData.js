import { useState, useEffect } from 'react'; // <--- Removed 'useMemo'

export const useSensorData = (DEVICE_TOKEN, notificationsEnabled) => {
  const [systemStatus, setSystemStatus] = useState("NORMAL");
  const [notification, setNotification] = useState({title: '', body: ''});
  const [sensorData, setSensorData] = useState({ temp: 0, gas: 0, p_fire: 0 });
  
  // Histories
  const [liveHistory, setLiveHistory] = useState([]);
  const [dailyArchives, setDailyArchives] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fireAlertNX_archives')) || {}; } catch { return {}; }
  });
  const [alertLog, setAlertLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fireAlertNX_alerts')) || []; } catch { return []; }
  });

  // Thresholds
  const TEMP_THRESHOLD = 57;
  const GAS_THRESHOLD = 100;

  // Persistence
  useEffect(() => localStorage.setItem('fireAlertNX_alerts', JSON.stringify(alertLog)), [alertLog]);
  useEffect(() => localStorage.setItem('fireAlertNX_archives', JSON.stringify(dailyArchives)), [dailyArchives]);

  // Data Fetching Loop
  useEffect(() => {
    const interval = setInterval(async () => {
        try {
            const response = await fetch(`/api/v1/${DEVICE_TOKEN}/attributes?clientKeys=temperature,gas,p_fire`);
            const data = await response.json();
            
            // Parse Data
            let tempVal = data.client?.temperature || data.temperature || 0;
            let gasVal = data.client?.gas || data.gas || 0;
            let pFireVal = data.client?.p_fire || data.p_fire || 0;

            setSensorData({ temp: tempVal, gas: gasVal, p_fire: pFireVal });

            const now = new Date();
            const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
            const shortTimeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
            const todayStr = now.toISOString().split('T')[0];

            // Update Histories
            setLiveHistory(prev => {
                const newData = { time: timeStr, rawTime: now.getTime(), temp: tempVal, gas: gasVal };
                return [...prev, newData].filter(pt => pt.rawTime > (now.getTime() - 7200000));
            });

            setDailyArchives(prev => {
                const dayData = prev[todayStr] || [];
                const lastEntry = dayData[dayData.length - 1];
                if (!lastEntry || lastEntry.time !== shortTimeStr) {
                    return { ...prev, [todayStr]: [...dayData, { time: shortTimeStr, temp: tempVal, gas: gasVal }] };
                }
                return prev;
            });

            // Hazard Logic
            if (tempVal > TEMP_THRESHOLD || gasVal > GAS_THRESHOLD || pFireVal > 0) {
                let msg = "Hazard Detected!";
                let type = "WARNING";
                if (pFireVal > 0) { msg = "🔥 FLAME DETECTED!"; type = "CRITICAL"; }
                else if (gasVal > GAS_THRESHOLD) { msg = `Gas Leak (${gasVal} PPM)`; type = "WARNING"; }
                else if (tempVal > TEMP_THRESHOLD) { msg = `High Heat (${tempVal}°C)`; type = "WARNING"; }

                setSystemStatus("CRITICAL");
                setNotification({ title: "HAZARD ALERT", body: msg });
                
                setAlertLog(prev => {
                    if (prev[0] && prev[0].msg === msg && (now.getTime() - new Date(prev[0].timestamp).getTime() < 5000)) return prev;
                    return [{ id: Date.now(), timestamp: now.toLocaleString(), type, msg, val: Math.max(tempVal, gasVal) }, ...prev];
                });

                if (notificationsEnabled && Notification.permission === "granted") new Notification("⚠️ FIREALERTNX", { body: msg });
            } else {
                setSystemStatus("NORMAL");
            }
        } catch (error) { console.error(error); }
    }, 2000); 
    return () => clearInterval(interval);
  }, [notificationsEnabled, DEVICE_TOKEN]);

  const clearHistory = () => {
    if(window.confirm("Clear logs?")) { setAlertLog([]); localStorage.removeItem('fireAlertNX_alerts'); }
  };

  return { systemStatus, notification, setNotification, sensorData, liveHistory, dailyArchives, alertLog, clearHistory, TEMP_THRESHOLD, GAS_THRESHOLD };
};