import React from 'react';
import { Wind } from 'lucide-react';

const AirQualityWidget = ({ sensorData, gasValue, thresholds }) => {
  // --- CONFIGURATION ---
  
  // 1. FORCED LIMIT (Hardcoded to 100)
  // We ignore 'thresholds' prop to ensure it doesn't override our value
  const limit = thresholds?.gas || 100; 
  const gaugeMax = 1000;
  
  // 2. DATA LOADING
  const value = sensorData?.gas ?? gasValue ?? 0;

  // Zone Boundaries based on the 100 limit
  const zoneGreenEnd = limit * 0.8;   // 0 to 80
  const zoneYellowEnd = limit * 1.2;  // 80 to 120

  // --- SVG HELPERS ---
  const radius = 42;
  const cx = 50;
  const cy = 50;
  
  const valueToDegrees = (val) => {
    const clamped = Math.min(Math.max(val, 0), gaugeMax);
    return (clamped / gaugeMax) * 270 - 135;
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const describeArc = (startVal, endVal) => {
    const startAngle = valueToDegrees(startVal);
    const endAngle = valueToDegrees(endVal);
    const start = polarToCartesian(cx, cy, radius, endAngle);
    const end = polarToCartesian(cx, cy, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };

  const rotation = valueToDegrees(value);

  // --- STRICT ALIGNMENT ---
  // TALL TICKS: Exact numbers you want to see
  const majorTicks = [0, 200, 400, 600, 800, 1000];
  
  // SHORT TICKS: The spaces in between
  const minorTicks = [100, 300, 500, 700, 900];

  return (
    <div className="card bg-base-100 shadow-xl max-w-sm mx-auto">
      <div className="card-body p-6 items-center">
        {/* Header */}
        <h2 className="card-title text-sm opacity-70 flex items-center gap-2 w-full mb-4">
          <Wind size={20} /> Air Quality Index (MQ-9)
        </h2>

        {/* --- GAUGE CONTAINER --- */}
        <div className="relative w-72 h-72 bg-[#1a1f2e] rounded-full border-[6px] border-[#131722] shadow-2xl p-4">
            
            {/* SVG Layer */}
            <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 100 100">
                {/* ZONES (Darker Colors) */}
                {/* Dark Green */}
                <path d={describeArc(0, zoneGreenEnd)} fill="none" stroke="#15803d" strokeWidth="8" strokeLinecap="butt" className="opacity-90" />
                
                {/* Dark Yellow/Ochre */}
                <path d={describeArc(zoneGreenEnd, zoneYellowEnd)} fill="none" stroke="#a16207" strokeWidth="8" strokeLinecap="butt" className="opacity-90" />
                
                {/* Dark Red */}
                <path d={describeArc(zoneYellowEnd, gaugeMax)} fill="none" stroke="#b91c1c" strokeWidth="8" strokeLinecap="butt" className="opacity-90" />

                {/* SHORT TICKS */}
                {minorTicks.map((val) => {
                   const angle = valueToDegrees(val);
                   return (
                     <line 
                        key={`minor-${val}`} 
                        x1="50" y1="12" 
                        x2="50" y2="14" 
                        stroke="#4b5563" 
                        strokeWidth="0.5" 
                        transform={`rotate(${angle} 50 50)`} 
                     />
                   )
                })}

                {/* TALL TICKS */}
                {majorTicks.map((val) => {
                   const angle = valueToDegrees(val);
                   return (
                     <line 
                        key={`major-${val}`} 
                        x1="50" y1="12" 
                        x2="50" y2="17" 
                        stroke="#9ca3af" 
                        strokeWidth="1.5" 
                        transform={`rotate(${angle} 50 50)`} 
                     />
                   )
                })}
            </svg>

            {/* LABELS (Aligned with Tall Ticks) */}
            {majorTicks.map((tickValue) => {
                 const angle = valueToDegrees(tickValue);
                 const radiusPos = 25; 
                 const rad = (angle - 90) * (Math.PI / 180);
                 const x = 50 + radiusPos * Math.cos(rad);
                 const y = 50 + radiusPos * Math.sin(rad);
                 return (
                    <div key={`label-${tickValue}`} className="absolute text-[10px] font-bold text-gray-400 -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
                        {tickValue}
                    </div>
                 );
            })}

            {/* Center "GAS" Label */}
            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <h3 className="text-2xl font-black text-gray-300 tracking-widest opacity-90">GAS</h3>
            </div>

            {/* NEEDLE */}
            <div className="absolute top-1/2 left-1/2 w-full h-full pointer-events-none transition-transform duration-700 ease-out" style={{ transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}>
                <div className="absolute top-0 left-1/2 w-1.5 h-[50%] bg-gradient-to-b from-transparent via-red-500 to-red-600 -translate-x-1/2 origin-bottom shadow-[0_0_15px_rgba(220,38,38,0.8)] rounded-full"></div>
            </div>
            
            {/* Pivot */}
            <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-[#131722] border-[3px] border-red-900/50 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,1)]"></div>
            </div>

            {/* VALUE BOX */}
            <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 px-3 py-1 rounded border border-gray-700 bg-[#0f1219] shadow-inner">
                <span className={`font-mono text-xl font-bold tracking-wider drop-shadow-[0_0_5px_rgba(255,255,255,0.2)] ${value > limit ? 'text-red-500' : 'text-green-400'}`}>
                    {String(value).padStart(3, '0')}
                </span>
            </div>

        </div>

        {/* Footer */}
        <div className="text-center mt-6 font-mono text-xs text-gray-500 uppercase tracking-widest">
          PPM LIMIT: {limit}
        </div>
      </div>
    </div>
  );
};

export default AirQualityWidget;