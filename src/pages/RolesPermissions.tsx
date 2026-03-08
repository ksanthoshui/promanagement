import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  ChevronRight,
  MoreVertical,
  X,
  Info
} from "lucide-react";
import api from "../services/api.ts";

interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
  isCustom: boolean;
  isActive: boolean;
  updatedAt: string;
}

const RolesPermissions: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [recentChanges, setRecentChanges] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
    isActive: true
  });

  const availablePermissions = [
    { id: "manage_projects", label: "Manage Projects" },
    { id: "manage_tasks", label: "Manage Tasks" },
    { id: "manage_users", label: "Manage Users" },
    { id: "view_reports", label: "View Reports" },
    { id: "system_settings", label: "System Settings" }
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesRes, changesRes] = await Promise.all([
        api.get("/roles"),
        api.get("/roles/recent-changes")
      ]);
      setRoles(rolesRes.data);
      setRecentChanges(changesRes.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        isActive: role.isActive
      });
    } else {
      setEditingRole(null);
      setFormData({
        name: "",
        description: "",
        permissions: [],
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRole) {
        await api.put(`/roles/${editingRole._id}`, formData);
      } else {
        await api.post("/roles", formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error saving role:", error);
      alert("Failed to save role. Name might be duplicate or unauthorized.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this role? This cannot be undone.")) {
      try {
        await api.delete(`/roles/${id}`);
        fetchData();
      } catch (error: any) {
        alert(error.response?.data?.message || "Failed to delete role.");
      }
    }
  };

  const togglePermission = (permId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter(p => p !== permId)
        : [...prev.permissions, permId]
    }));
  };

  const activeRolesCount = roles.filter(r => r.isActive).length;
  const customRolesCount = roles.filter(r => r.isCustom).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Roles & <span className="text-google-blue">Permissions</span></h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Define access levels and manage system permissions.</p>
        </motion.div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 bg-google-blue hover:bg-[#5a6a2d] text-white font-bold text-sm rounded-xl flex items-center transition-all shadow-md hover:shadow-lg group"
        >
          <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform" />
          Create Custom Role
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="google-card p-6 flex items-center"
        >
          <div className="w-12 h-12 bg-google-blue/10 rounded-xl flex items-center justify-center text-google-blue mr-4">
            <Shield size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Roles</p>
            <p className="text-2xl font-bold">{roles.length}</p>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="google-card p-6 flex items-center"
        >
          <div className="w-12 h-12 bg-google-green/10 rounded-xl flex items-center justify-center text-google-green mr-4">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Roles</p>
            <p className="text-2xl font-bold">{activeRolesCount}</p>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="google-card p-6 flex items-center"
        >
          <div className="w-12 h-12 bg-google-yellow/10 rounded-xl flex items-center justify-center text-google-yellow mr-4">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Custom Roles</p>
            <p className="text-2xl font-bold">{customRolesCount}</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Roles List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold tracking-tight flex items-center">
            <Shield size={20} className="mr-2 text-google-blue" />
            System & Custom Roles
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              <div className="py-20 text-center text-slate-400">Loading roles...</div>
            ) : roles.map((role, idx) => (
              <motion.div
                key={role._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="google-card p-6 group hover:border-google-blue/30 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-google-blue transition-colors">
                        {role.name}
                      </h3>
                      {!role.isCustom && (
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-white/5 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded border border-slate-200 dark:border-white/10">
                          System
                        </span>
                      )}
                      {role.isActive ? (
                        <span className="w-2 h-2 bg-google-green rounded-full" title="Active" />
                      ) : (
                        <span className="w-2 h-2 bg-slate-300 rounded-full" title="Inactive" />
                      )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-4">
                      {role.description || "No description provided."}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map(p => (
                        <span key={p} className="px-2 py-1 bg-surface-light dark:bg-white/5 text-slate-600 dark:text-slate-400 text-[10px] font-bold rounded-lg border border-border-light dark:border-border-dark">
                          {p.replace(/_/g, " ").toUpperCase()}
                        </span>
                      ))}
                      {role.permissions.length === 0 && (
                        <span className="text-[10px] font-bold text-slate-400 italic">No permissions assigned</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleOpenModal(role)}
                      className="p-2 text-slate-400 hover:text-google-blue hover:bg-google-blue/10 rounded-lg transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    {role.isCustom && (
                      <button 
                        onClick={() => handleDelete(role._id)}
                        className="p-2 text-slate-400 hover:text-google-red hover:bg-google-red/10 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Changes */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight flex items-center">
            <Clock size={20} className="mr-2 text-google-blue" />
            Recent Changes
          </h2>
          
          <div className="google-card p-6 space-y-6">
            {recentChanges.length === 0 ? (
              <p className="text-sm text-slate-400 italic text-center py-4">No recent changes detected.</p>
            ) : recentChanges.map((change, idx) => (
              <div key={change._id} className="flex items-start gap-4 relative">
                {idx !== recentChanges.length - 1 && (
                  <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-border-light dark:bg-border-dark" />
                )}
                <div className="w-10 h-10 rounded-full bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark flex items-center justify-center text-google-blue z-10">
                  <Edit2 size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Role Updated</p>
                  <p className="text-xs text-slate-500 font-medium mb-1">
                    The role <span className="text-google-blue font-bold">"{change.name}"</span> was modified.
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {new Date(change.updatedAt).toLocaleDateString()} at {new Date(change.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            <button className="w-full py-3 border border-border-light dark:border-border-dark rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-surface-light dark:hover:bg-white/5 transition-all flex items-center justify-center">
              View Audit Log
              <ChevronRight size={14} className="ml-1" />
            </button>
          </div>

          <div className="google-card p-6 bg-google-blue/5 border-google-blue/20">
            <div className="flex items-center gap-3 mb-3">
              <Info size={20} className="text-google-blue" />
              <h4 className="font-bold text-google-blue">Security Tip</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Always follow the principle of least privilege. Only grant permissions that are absolutely necessary for the role's function.
            </p>
          </div>
        </div>
      </div>

      {/* Role Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-surface-dark rounded-2xl shadow-2xl overflow-hidden border border-border-light dark:border-border-dark"
            >
              <div className="p-8 border-b border-border-light dark:border-border-dark flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    {editingRole ? "Edit Role" : "Create Custom Role"}
                  </h2>
                  <p className="text-slate-500 text-sm font-medium">Configure permissions for this role.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-light dark:hover:bg-white/5 rounded-lg transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Role Name</label>
                    <input 
                      type="text" 
                      required
                      disabled={editingRole && !editingRole.isCustom}
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Lead Developer"
                      className="w-full px-4 py-3 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-google-blue/50 outline-none font-bold disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Status</label>
                    <select 
                      value={formData.isActive ? "active" : "inactive"}
                      onChange={e => setFormData({...formData, isActive: e.target.value === "active"})}
                      className="w-full px-4 py-3 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-google-blue/50 outline-none font-bold"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Description</label>
                  <textarea 
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the responsibilities of this role..."
                    className="w-full px-4 py-3 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-google-blue/50 outline-none font-medium resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Permissions</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availablePermissions.map(perm => (
                      <div 
                        key={perm.id}
                        onClick={() => togglePermission(perm.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          formData.permissions.includes(perm.id)
                            ? "bg-google-blue/5 border-google-blue text-google-blue"
                            : "bg-surface-light dark:bg-white/5 border-border-light dark:border-border-dark text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        <span className="text-sm font-bold">{perm.label}</span>
                        {formData.permissions.includes(perm.id) && <CheckCircle2 size={18} />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-border-light dark:border-border-dark rounded-xl font-bold text-sm text-slate-600 dark:text-slate-400 hover:bg-surface-light dark:hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-google-blue text-white rounded-xl font-bold text-sm shadow-md hover:bg-[#5a6a2d] transition-all"
                  >
                    {editingRole ? "Update Role" : "Create Role"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RolesPermissions;
