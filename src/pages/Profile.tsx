import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/index.ts";
import { 
  User, 
  Mail, 
  Shield, 
  Camera, 
  Lock, 
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState<"general" | "security">("general");

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight mb-1">Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your personal information and security settings.</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 space-y-1">
          <button 
            onClick={() => setActiveTab("general")}
            className={`w-full flex items-center px-5 py-3 rounded-xl font-bold text-sm transition-all border ${
              activeTab === "general" 
                ? "bg-google-blue/10 text-google-blue border-google-blue/20" 
                : "text-slate-500 border-transparent hover:bg-surface-light dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-300"
            }`}
          >
            <User size={18} className="mr-3" />
            General
          </button>
          <button 
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center px-5 py-3 rounded-xl font-bold text-sm transition-all border ${
              activeTab === "security" 
                ? "bg-google-blue/10 text-google-blue border-google-blue/20" 
                : "text-slate-500 border-transparent hover:bg-surface-light dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-300"
            }`}
          >
            <Lock size={18} className="mr-3" />
            Security
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === "general" ? (
              <motion.div 
                key="general-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="google-card p-8 space-y-8"
              >
                {/* Profile Picture */}
                <div className="flex items-center space-x-6">
                  <div className="relative group">
                    <img 
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=708238&color=ffffff&bold=true&size=128`} 
                      className="w-24 h-24 rounded-full object-cover border-2 border-border-light dark:border-border-dark group-hover:shadow-md transition-all"
                      alt="Profile"
                    />
                    <button className="absolute -bottom-1 -right-1 p-2 bg-google-blue text-white rounded-full shadow-md hover:bg-[#5a6a2d] transition-all border-2 border-white dark:border-surface-dark">
                      <Camera size={16} />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight mb-0.5">Profile Picture</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Update your avatar for project collaboration.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-google-blue transition-colors" size={18} />
                      <input 
                        type="text" 
                        defaultValue={user?.name}
                        className="w-full pl-12 pr-4 py-3 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-google-blue/50 outline-none text-slate-900 dark:text-white font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="email" 
                        disabled
                        defaultValue={user?.email}
                        className="w-full pl-12 pr-4 py-3 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl text-slate-400 dark:text-slate-600 cursor-not-allowed font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Role</label>
                    <div className="relative group">
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        disabled
                        defaultValue={user?.role}
                        className="w-full pl-12 pr-4 py-3 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl text-slate-400 dark:text-slate-600 cursor-not-allowed font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button className="google-button-primary">
                    Save Changes
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="security-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="google-card p-8 space-y-8"
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight mb-0.5">Password</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Update your password to keep your account secure.</p>
                  </div>
                  
                  <div className="space-y-4 max-w-md">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Current Password</label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-3 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-google-blue/50 outline-none text-slate-900 dark:text-white font-medium placeholder:text-slate-400"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">New Password</label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-3 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-google-blue/50 outline-none text-slate-900 dark:text-white font-medium placeholder:text-slate-400"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Confirm New Password</label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-3 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-google-blue/50 outline-none text-slate-900 dark:text-white font-medium placeholder:text-slate-400"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div className="pt-2 flex justify-start">
                    <button className="google-button-primary">
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="pt-8 border-t border-border-light dark:border-border-dark">
                  <h3 className="text-xl font-bold tracking-tight mb-6">Security Features</h3>
                  <div className="flex items-center justify-between p-5 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-2xl group transition-all">
                    <div className="flex items-center">
                      <div className="p-3 bg-google-green/10 text-google-green rounded-xl mr-5 border border-google-green/20">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Two-Factor Authentication</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Your account is protected with an extra layer of security.</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-google-blue hover:underline">Configure</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Profile;
