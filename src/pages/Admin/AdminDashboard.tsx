import React from "react";
import { motion } from "motion/react";
import Counter from "../../components/Counter.tsx";
import { 
  Users, 
  Briefcase, 
  Settings, 
  Activity, 
  ShieldAlert, 
  Database, 
  Globe, 
  Lock,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const adminStats = [
    { label: "Total Users", value: 1240, trend: "+12%", icon: Users, color: "text-google-blue", bg: "bg-google-blue/10", suffix: "" },
    { label: "Active Projects", value: 85, trend: "+5%", icon: Briefcase, color: "text-google-green", bg: "bg-google-green/10", suffix: "" },
    { label: "System Load", value: 24, trend: "-2%", icon: Activity, color: "text-google-yellow", bg: "bg-google-yellow/10", suffix: "%" },
    { label: "Security Alerts", value: 0, trend: "0%", icon: ShieldAlert, color: "text-google-red", bg: "bg-google-red/10", suffix: "" },
  ];

  const adminModules = [
    { name: "Manage Users", desc: "Add, edit, and remove user accounts and permissions.", icon: Users, path: "/admin/users" },
    { name: "Manage Projects", desc: "Oversee all active and archived projects across the organization.", icon: Briefcase, path: "/admin/projects" },
    { name: "System Settings", desc: "Configure global application parameters and integrations.", icon: Settings, path: "/admin/settings" },
    { name: "Activity Logs", desc: "Monitor all system events and user actions for auditing.", icon: Activity, path: "/admin/logs" },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Admin Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Global system overview and administrative controls.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="google-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-bold text-google-green">{stat.trend}</span>
            </div>
            <h4 className="text-2xl font-bold tracking-tight mb-1">
              <Counter value={stat.value} suffix={stat.suffix} />
            </h4>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-xl font-bold tracking-tight">Administrative Modules</h3>
          <div className="grid grid-cols-1 gap-4">
            {adminModules.map((module, i) => (
              <Link
                key={i}
                to={module.path}
                className="google-card p-6 flex items-center group hover:border-google-blue/30 transition-all"
              >
                <div className="p-4 bg-surface-light dark:bg-white/5 text-slate-400 group-hover:text-google-blue group-hover:bg-google-blue/10 rounded-2xl transition-all mr-6">
                  <module.icon size={32} />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold tracking-tight mb-1 group-hover:text-google-blue transition-colors">{module.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{module.desc}</p>
                </div>
                <ArrowRight size={20} className="text-slate-300 group-hover:text-google-blue group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="google-card p-8">
          <h3 className="text-xl font-bold tracking-tight mb-8 flex items-center">
            <Database size={20} className="mr-3 text-google-blue" />
            System Health
          </h3>
          <div className="space-y-8">
            {[
              { label: "API Server", status: "Operational", color: "text-google-green" },
              { label: "Database Cluster", status: "Operational", color: "text-google-green" },
              { label: "Storage Service", status: "Operational", color: "text-google-green" },
              { label: "Email Gateway", status: "Maintenance", color: "text-google-yellow" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-4 ${item.color === 'text-google-green' ? 'bg-google-green' : 'bg-google-yellow'}`} />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${item.color}`}>{item.status}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-surface-light dark:bg-white/5 rounded-2xl border border-border-light dark:border-border-dark">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold tracking-tight">Database Usage</h4>
              <span className="text-xs font-bold text-slate-500">
                <Counter value={4.2} decimals={1} /> GB / 10 GB
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-white/10 h-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '42%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="bg-google-blue h-full" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
