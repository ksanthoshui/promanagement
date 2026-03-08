import React from "react";
import { motion } from "motion/react";
import { 
  Settings, 
  Globe, 
  Database, 
  Lock, 
  Mail, 
  Bell, 
  Shield, 
  Cloud,
  Cpu,
  Save,
  RefreshCw
} from "lucide-react";

const SystemSettings: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight mb-1">System Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Configure global platform parameters and infrastructure.</p>
        </motion.div>
        <div className="flex items-center space-x-3">
          <button className="px-5 py-2.5 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-white/10 transition-all flex items-center">
            <RefreshCw size={16} className="mr-2" />
            Reset
          </button>
          <button className="google-button-primary flex items-center">
            <Save size={18} className="mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-1">
          {[
            { label: "General Configuration", icon: Globe, active: true },
            { label: "Database & Storage", icon: Database, active: false },
            { label: "Authentication & Security", icon: Shield, active: false },
            { label: "Email & Notifications", icon: Mail, active: false },
            { label: "API & Integrations", icon: Cpu, active: false },
          ].map((item, i) => (
            <button
              key={i}
              className={`w-full flex items-center px-5 py-3 rounded-xl font-bold text-sm transition-all border ${
                item.active 
                  ? "bg-google-blue/10 text-google-blue border-google-blue/20" 
                  : "text-slate-500 border-transparent hover:bg-surface-light dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-300"
              }`}
            >
              <item.icon size={18} className="mr-3" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 google-card p-8 space-y-10">
          <section className="space-y-6">
            <h3 className="text-xl font-bold tracking-tight">General Configuration</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Platform Name</label>
                <input 
                  type="text" 
                  defaultValue="ProManage Enterprise"
                  className="w-full px-4 py-3 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-google-blue/50 outline-none text-slate-900 dark:text-white font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Support Email</label>
                <input 
                  type="email" 
                  defaultValue="support@promanage.com"
                  className="w-full px-4 py-3 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-google-blue/50 outline-none text-slate-900 dark:text-white font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Default Timezone</label>
                <select className="w-full px-4 py-3 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-google-blue/50 outline-none text-slate-900 dark:text-white font-medium cursor-pointer">
                  <option>UTC (Coordinated Universal Time)</option>
                  <option>EST (Eastern Standard Time)</option>
                  <option>PST (Pacific Standard Time)</option>
                </select>
              </div>
            </div>
          </section>

          <section className="space-y-6 pt-10 border-t border-border-light dark:border-border-dark">
            <h3 className="text-xl font-bold tracking-tight">Maintenance Mode</h3>
            <div className="flex items-center justify-between p-6 bg-google-yellow/5 border border-google-yellow/20 rounded-2xl">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-google-yellow/10 text-google-yellow rounded-xl">
                  <Settings size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Enable Maintenance Mode</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                    When active, only administrators can access the platform.
                  </p>
                </div>
              </div>
              <input type="checkbox" className="w-10 h-5 rounded-full bg-slate-200 dark:bg-white/10 appearance-none checked:bg-google-yellow relative after:content-[''] after:absolute after:top-1 after:left-1 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-all checked:after:left-6 cursor-pointer" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
