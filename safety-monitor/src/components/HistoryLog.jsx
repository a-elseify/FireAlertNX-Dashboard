import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, AlertTriangle, Trash2, Activity } from 'lucide-react';

const HistoryView = ({ dailyArchives, selectedDate, setSelectedDate, alertLog, clearHistory, theme }) => {
  const historicalData = useMemo(() => dailyArchives[selectedDate] || [], [dailyArchives, selectedDate]);

  // Helper function to flip the date format
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="card bg-base-100 shadow-xl h-fit">
            <div className="card-body p-4 md:p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="card-title text-lg flex items-center gap-2"><Calendar size={20} className="text-primary" /> Daily Archives</h2>
                    {/* The input must stay YYYY-MM-DD for the browser, but we display it differently below */}
                    <input type="date" className="input input-bordered input-sm" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} max={new Date().toISOString().split('T')[0]} />
                </div>
                {historicalData.length > 0 ? (
                    <div className="h-64 w-full bg-base-200/50 rounded-lg p-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={historicalData}> 
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis dataKey="time" stroke="currentColor" tick={{fontSize: 10}} interval={10} />
                                <YAxis stroke="currentColor" tick={{fontSize: 10}} />
                                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }} />
                                <Line type="monotone" dataKey="temp" stroke="#3ABFF8" dot={false} strokeWidth={2} />
                                <Line type="monotone" dataKey="gas" stroke="#FBBD23" dot={false} strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-64 flex flex-col items-center justify-center opacity-40 bg-base-200 rounded-lg border-2 border-dashed border-base-300">
                        <Activity size={32} />
                        {/* UPDATED: Now uses the formatDate helper */}
                        <p className="text-sm mt-2">No data recorded for {formatDate(selectedDate)}</p>
                    </div>
                )}
            </div>
        </div>

        {/* Alert Log */}
        <div className="card bg-base-100 shadow-xl h-[600px]">
            <div className="card-body p-0 flex flex-col h-full">
                <div className="p-6 border-b border-base-300 flex justify-between items-center">
                    <h2 className="card-title text-lg flex items-center gap-2"><AlertTriangle size={20} className="text-warning" /> Alert Log</h2>
                    {alertLog.length > 0 && <button onClick={clearHistory} className="btn btn-xs btn-outline btn-error flex gap-1"><Trash2 size={12} /> Clear</button>}
                </div>
                <div className="flex-1 overflow-y-auto p-0">
                    <table className="table table-pin-rows">
                        <thead><tr><th>Time</th><th>Type</th><th>Message</th></tr></thead>
                        <tbody>
                            {alertLog.map((log) => (
                                <tr key={log.id} className="hover:bg-base-200">
                                    <td className="font-mono text-xs opacity-70 whitespace-nowrap">{log.timestamp.split(',')[1]} <br/><span className="text-[10px]">{log.timestamp.split(',')[0]}</span></td>
                                    <td><span className={`badge badge-sm ${log.type === 'CRITICAL' ? 'badge-error' : 'badge-warning'} font-bold`}>{log.type}</span></td>
                                    <td className="text-sm font-medium">{log.msg}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  );
};
export default HistoryView;