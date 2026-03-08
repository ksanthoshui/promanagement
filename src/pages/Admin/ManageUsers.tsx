import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Search, 
  UserPlus, 
  MoreHorizontal, 
  Shield, 
  Mail, 
  CheckCircle2, 
  XCircle,
  Filter,
  ChevronRight
} from "lucide-react";

const ManageUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const mockUsers = [
    { id: 1, name: "Santhosh K", email: "k.santhosh.ui@gmail.com", role: "Admin", status: "Active", joined: "2024-01-15" },
    { id: 2, name: "Jane Doe", email: "jane@example.com", role: "Manager", status: "Active", joined: "2024-02-10" },
    { id: 3, name: "Bob Smith", email: "bob@example.com", role: "Member", status: "Inactive", joined: "2024-03-05" },
    { id: 4, name: "Alice Johnson", email: "alice@example.com", role: "Member", status: "Active", joined: "2024-03-12" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Manage Users</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Control user access and permissions across the platform.</p>
        </motion.div>
        <button className="google-button-primary flex items-center">
          <UserPlus size={20} className="mr-2" />
          Add New User
        </button>
      </div>

      {/* Filters */}
      <div className="google-card p-4 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-google-blue transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
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

      {/* Users Table */}
      <div className="google-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-light dark:bg-white/[0.02] text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-8 py-4">User</th>
                <th className="px-8 py-4">Role</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Joined Date</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-surface-light dark:hover:bg-white/[0.01] transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${user.name}&background=708238&color=fff&bold=true`} 
                        className="w-10 h-10 rounded-full border border-border-light dark:border-border-dark mr-4"
                        alt={user.name}
                      />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white group-hover:text-google-blue transition-colors">{user.name}</p>
                        <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300">
                      <Shield size={14} className="mr-2 text-google-blue" />
                      {user.role}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      user.status === 'Active' ? 'bg-google-green/10 text-google-green border-google-green/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-500">{user.joined}</td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-400 hover:text-google-blue transition-all">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
