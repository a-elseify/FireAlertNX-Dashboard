import React from 'react';

const HistoryLog = ({ history }) => {
  // 1. Safety Check: Ensure history is an array
  const safeHistory = Array.isArray(history) ? history : [];
  
  // 2. Sort: Newest logs at the top
  const logs = [...safeHistory].reverse();

  return (
    <div className="card bg-[#1b212d] shadow-xl border border-gray-800">
      <div className="card-body p-6">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="card-title text-white text-lg">Telemetry History</h2>
                <p className="text-gray-500 text-xs">Live stream from Device ID: ...edd8</p>
            </div>
            <div className="badge badge-primary badge-outline text-xs">
                {logs.length} Data Points
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full text-left table-xs md:table-sm">
            {/* Table Header */}
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="bg-[#141820]">Time</th>
                <th className="bg-[#141820] text-blue-400">p_fire (Value)</th>
                <th className="bg-[#141820] text-yellow-500">mq9_v (Value)</th>
                <th className="bg-[#141820] text-red-500">ai_label</th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">
                    No data received yet...
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <tr key={index} className="hover:bg-gray-800/50 border-b border-gray-800 transition-colors">
                    
                    {/* 1. Time */}
                    <td className="font-mono text-gray-400">
                        {new Date(log.rawTime).toLocaleTimeString()}
                    </td>
                    
                    {/* 2. p_fire (Stored in log.temp inside App.jsx) */}
                    <td className="text-blue-400 font-mono font-bold">
                        {log.temp !== undefined ? log.temp.toFixed(5) : "0.00000"}
                    </td>

                    {/* 3. mq9_v (Stored in log.gas inside App.jsx) */}
                    <td className="text-yellow-500 font-mono font-bold">
                        {log.gas !== undefined ? log.gas.toFixed(2) : "0.00"}
                    </td>

                    {/* 4. ai_label (Stored in log.p_fire inside App.jsx) */}
                    <td>
                         {log.p_fire === 1 ? (
                            <span className="badge badge-error badge-xs font-bold text-white">FIRE (1)</span>
                         ) : (
                            <span className="badge badge-ghost badge-xs text-gray-500">NORMAL (0)</span>
                         )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryLog;