import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Activity, 
  Search, 
  Filter, 
  Download, 
  User, 
  Clock, 
  Shield, 
  Globe,
  Database,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

const ActivityLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const mockLogs = [
    { id: 1, action: "User Login", user: "Santhosh K", target: "System", time: "2 mins ago", type: "Security", status: "Success" },
    { id: 2, action: "Project Created", user: "Jane Doe", target: "Mobile App Dev", time: "15 mins ago", type: "Action", status: "Success" },
    { id: 3, action: "Settings Updated", user: "Admin", target: "Global Config", time: "1 hour ago", type: "System", status: "Success" },
    { id: 4, action: "Failed Login Attempt", user: "Unknown", target: "Auth Service", time: "3 hours ago", type: "Security", status: "Failed" },
    { id: 5, action: "Task Deleted", user: "Bob Smith", target: "Website Redesign", time: "5 hours ago", type: "Action", status: "Success" },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Security": return <Shield size={14} className="text-google-red" />;
      case "System": return <Database size={14} className="text-google-blue" />;
      default: return <Activity size={14} className="text-google-green" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Activity Logs</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Audit trail of all system events and user actions.</p>
        </motion.div>
        <button className="google-button-outline flex items-center">
          <Download size={18} className="mr-2" />
          Download Logs
        </button>
      </div>

      {/* Filters */}
      <div className="google-card p-4 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-google-blue transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search logs by action, user or target..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl outline-none focus:ring-2 focus:ring-google-blue/50 transition-all text-sm font-medium"
          />
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-5 py-2.5 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-google-blue/10 hover:text-google-blue transition-all flex items-center">
            <Filter size={16} className="mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="google-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-light dark:bg-white/[0.02] text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-8 py-4">Action</th>
                <th className="px-8 py-4">User</th>
                <th className="px-8 py-4">Target</th>
                <th className="px-8 py-4">Time</th>
                <th className="px-8 py-4">Type</th>
                <th className="px-8 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {mockLogs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-light dark:hover:bg-white/[0.01] transition-all group">
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-900 dark:text-white group-hover:text-google-blue transition-colors">{log.action}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
                      <User size={14} className="mr-2 text-slate-400" />
                      {log.user}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-500">{log.target}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center text-xs font-bold text-slate-400">
                      <Clock size={14} className="mr-2" />
                      {log.time}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center text-[10px] font-bold uppercase tracking-widest">
                      {getTypeIcon(log.type)}
                      <span className="ml-2">{log.type}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className={`flex items-center text-[10px] font-bold uppercase tracking-widest ${
                      log.status === 'Success' ? 'text-google-green' : 'text-google-red'
                    }`}>
                      {log.status === 'Success' ? <CheckCircle2 size={14} className="mr-2" /> : <AlertCircle size={14} className="mr-2" />}
                      {log.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-border-light dark:border-border-dark flex items-center justify-between">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Showing 5 of 1,240 events</p>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1.5 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1.5 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
