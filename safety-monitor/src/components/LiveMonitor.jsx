import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LiveMonitor = ({ sensorData, liveHistory, viewWindow, setViewWindow, timeOptions, thresholds, theme }) => {
  return (
    <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. THERMAL HEAT (Now displaying p_fire) */}
            <StatusCard 
                title="Fire Probability" 
                value={`${sensorData.temp}`} 
                limit="" 
                borderColor="border-blue-500"
                textColor="text-blue-500"
                progressColor="progress-info" // Fixed class name for daisyUI
                progress={sensorData.temp} 
                max={1} // Adjusted max since p_fire is small (0.16)
            />

            {/* 2. GAS LEVELS (Now displaying gas) */}
            <StatusCard 
                title="GAS LEVELS" 
                value={sensorData.gas} 
 
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