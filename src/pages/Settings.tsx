import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Bell, Shield, Eye, Globe, Moon, Sun, Smartphone, Mail, Lock, Trash2, AlertTriangle, CheckCircle2 } from "lucide-react";
import api from "../services/api.ts";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice.ts";
import { useNavigate } from "react-router-dom";

interface UserSettings {
  notifications: {
    taskAssigned: boolean;
    taskCompleted: boolean;
    mentions: boolean;
  };
  appearance: {
    theme: "light" | "dark";
  };
}

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<"notifications" | "privacy" | "appearance" | "account">("notifications");
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/users/settings");
        setSettings(response.data);
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleUpdateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!settings) return;
    try {
      setSaving(true);
      const updated = { ...settings, ...newSettings };
      const response = await api.put("/users/settings", updated);
      setSettings(response.data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action is permanent and cannot be undone.")) {
      try {
        await api.delete("/users/account");
        dispatch(logout());
        navigate("/login");
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account.");
      }
    }
  };

  const sections = [
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "privacy", name: "Privacy & Security", icon: Shield },
    { id: "appearance", name: "Appearance", icon: Eye },
    { id: "account", name: "Account Management", icon: Lock },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-google-blue"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight mb-1">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Configure your workspace and personal preferences.</p>
        </motion.div>

        {saveSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-2 bg-google-green/10 text-google-green rounded-xl border border-google-green/20"
          >
            <CheckCircle2 size={16} />
            <span className="text-xs font-bold">Settings saved successfully</span>
          </motion.div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-72 space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={`w-full flex items-center px-5 py-3 rounded-xl font-bold text-sm transition-all border ${
                activeSection === section.id
                  ? "bg-google-blue/10 text-google-blue border-google-blue/20 shadow-sm"
                  : "text-slate-500 border-transparent hover:bg-surface-light dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-300"
              }`}
            >
              <section.icon size={18} className="mr-3" />
              {section.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="google-card p-8 space-y-10">
            {activeSection === "notifications" && settings && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold tracking-tight">Email Notifications</h3>
                  <div className="space-y-4">
                    {[
                      { 
                        id: "taskAssigned", 
                        name: "Task assigned to me", 
                        desc: "Get notified when someone assigns you a new task.",
                        checked: settings.notifications.taskAssigned
                      },
                      { 
                        id: "taskCompleted", 
                        name: "Task completed", 
                        desc: "Get notified when a task in your project is completed.",
                        checked: settings.notifications.taskCompleted
                      },
                      { 
                        id: "mentions", 
                        name: "Mentions", 
                        desc: "Get notified when someone mentions you in a comment.",
                        checked: settings.notifications.mentions
                      },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-surface-light dark:bg-white/5 rounded-2xl border border-border-light dark:border-border-dark">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{item.desc}</p>
                        </div>
                        <button 
                          onClick={() => handleUpdateSettings({
                            notifications: {
                              ...settings.notifications,
                              [item.id]: !item.checked
                            }
                          })}
                          disabled={saving}
                          className={`w-12 h-6 rounded-full transition-all relative ${
                            item.checked ? 'bg-google-blue' : 'bg-slate-200 dark:bg-white/10'
                          }`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                            item.checked ? 'left-7' : 'left-1'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === "appearance" && settings && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold tracking-tight">Theme Preferences</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleUpdateSettings({ appearance: { theme: "dark" } })}
                      className={`p-6 border-2 rounded-2xl text-left group transition-all ${
                        settings.appearance.theme === "dark" 
                          ? "border-google-blue bg-google-blue/5" 
                          : "border-border-light dark:border-border-dark bg-surface-light dark:bg-white/5 hover:border-google-blue/30"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md transition-all ${
                        settings.appearance.theme === "dark" ? "bg-google-blue text-white" : "bg-slate-200 dark:bg-white/10 text-slate-500"
                      }`}>
                        <Moon size={24} />
                      </div>
                      <p className="font-bold text-slate-900 dark:text-white">Dark Mode</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Easier on the eyes in low-light environments.</p>
                    </button>
                    <button 
                      onClick={() => handleUpdateSettings({ appearance: { theme: "light" } })}
                      className={`p-6 border-2 rounded-2xl text-left group transition-all ${
                        settings.appearance.theme === "light" 
                          ? "border-google-blue bg-google-blue/5" 
                          : "border-border-light dark:border-border-dark bg-surface-light dark:bg-white/5 hover:border-google-blue/30"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md transition-all ${
                        settings.appearance.theme === "light" ? "bg-google-blue text-white" : "bg-slate-200 dark:bg-white/10 text-slate-500"
                      }`}>
                        <Sun size={24} />
                      </div>
                      <p className="font-bold text-slate-900 dark:text-white">Light Mode</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Classic high-contrast interface for daylight use.</p>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === "account" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold tracking-tight">Account Deletion</h3>
                  <div className="p-6 bg-google-red/5 border border-google-red/20 rounded-2xl">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-google-red/10 text-google-red rounded-xl">
                        <AlertTriangle size={24} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-google-red">Warning: This action is permanent</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                          Deleting your account will permanently remove all your data, projects, and tasks. This cannot be undone.
                        </p>
                        <button 
                          onClick={handleDeleteAccount}
                          className="mt-6 px-6 py-3 bg-google-red text-white font-bold text-sm rounded-xl hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
                        >
                          Delete My Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {(activeSection === "privacy") && (
              <div className="py-20 text-center">
                <Shield size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                <h3 className="text-xl font-bold tracking-tight mb-2">Security Settings</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Advanced security configurations will be available soon.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
