import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// Import the checkmark icon
import { CheckCircle } from 'lucide-react';

// REMOVED 'thresholds' from props
const LiveMonitor = ({ sensorData, liveHistory, viewWindow, setViewWindow, timeOptions, theme }) => {
  return (
    <>
        {/* DYNAMIC STATUS BAR */}
        {sensorData.p_fire > 0.5 ? (
            <div className="w-full bg-red-600 text-white p-4 rounded-lg flex items-center gap-3 font-bold uppercase mb-6 shadow-sm animate-pulse">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span className="text-lg">CRITICAL HAZARD DETECTED</span>
            </div>
        ) : (
            <div className="w-full bg-green-500 text-white p-4 rounded-lg flex items-center gap-3 font-bold uppercase mb-6 shadow-sm">
                <CheckCircle size={24} className="text-white" />
                <span className="text-lg">NORMAL</span>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. THERMAL HEAT (Now displaying p_fire) */}
            <StatusCard 
                title="Fire Probability" 
                value={`${sensorData.temp}`} 
                limit="" 
                borderColor="border-blue-500"
                textColor="text-blue-500"
                progressColor="progress-info" 
                progress={sensorData.temp} 
                max={1} 
            />

            {/* 2. GAS LEVELS (Now displaying mq9_v) */}
            <StatusCard 
                title="GAS LEVELS" 
                value={sensorData.gas} 
                limit=""
                borderColor="border-yellow-500"
                textColor="text-yellow-500"
                progressColor="progress-warning" 
                progress={sensorData.gas} 
                max={1000} 
            />

            {/* 3. FIRE SENSOR (Now displaying ai_label) */}
            <StatusCard 
                title="Fire Status" 
                value={sensorData.p_fire > 0 ? "FIRE LIKELY" : "NORMAL"} 
                limit="" 
                borderColor="border-red-500"
                textColor="text-red-500"
                isDigital={true} 
                active={sensorData.p_fire > 0} 
            />
        </div>

        {/* Chart Section */}
        <div className="card bg-base-100 shadow-xl mt-6">
            <div className="card-body p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="card-title text-sm opacity-70">REAL-TIME TRENDS</h2>
                    <select className="select select-bordered select-sm" value={viewWindow} onChange={(e) => setViewWindow(parseInt(e.target.value))}>
                        {timeOptions.map((opt, i) => <option key={i} value={opt.ms}>{opt.label}</option>)}
                    </select>
                </div>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={liveHistory.filter(pt => pt.rawTime > liveHistory[liveHistory.length - 1]?.rawTime - viewWindow)}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            
                            {/* Auto Domain so the small p_fire (0.16) isn't flattened */}
                            <XAxis 
                                dataKey="rawTime" 
                                type="number" 
                                domain={['dataMin', 'dataMax']} 
                                stroke="currentColor" 
                                tick={{fontSize: 12}} 
                                tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString([], { hour12: false })}
                            />
                            
                            <YAxis stroke="currentColor" tick={{fontSize: 12}} domain={['auto', 'auto']} />
                            
                            <Tooltip 
                                contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }} 
                                labelFormatter={(t) => new Date(t).toLocaleTimeString()}
                            />
                            
                            {/* Blue Line = p_fire (Thermal) */}
                            <Line type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={3} dot={false} /> 
                            
                            {/* Yellow Line = Gas */}
                            <Line type="monotone" dataKey="gas" stroke="#eab308" strokeWidth={3} dot={false} /> 
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    </>
  );
};

// StatusCard remains unchanged
const StatusCard = ({ title, value, limit, borderColor, textColor, progressColor, progress, max, isDigital, active }) => (
    <div className={`card bg-base-100 shadow-xl border-t-4 ${borderColor}`}>
        <div className="card-body p-4 md:p-6">
            <h2 className={`card-title ${textColor} text-sm`}>{title}</h2>
            <div className="stat-value text-3xl">{value}</div>
            <div className="text-xs opacity-50 font-mono">{limit}</div>
            
            {isDigital ? (
                <div className={`w-full h-4 mt-2 rounded-full ${active ? "bg-red-500 animate-pulse" : "bg-base-200"}`}></div>
            ) : (
                <progress className={`progress ${progressColor} w-full mt-2`} value={progress} max={max}></progress>
            )}
        </div>
    </div>
);

export default LiveMonitor;