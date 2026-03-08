import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/index.ts";
import { removeMember } from "../store/slices/projectSlice.ts";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  Shield, 
  User,
  Code,
  Palette,
  Trash2,
  AlertCircle
} from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  access: "Admin" | "Member" | "Guest";
  status: "Active" | "Inactive";
  avatar?: string;
  projectIds: string[];
}

const Members: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects } = useSelector((state: RootState) => state.projects);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"All" | "Developer" | "Designer">("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Extract real members from projects
  const members: Member[] = Array.from(new Set(projects.flatMap(p => p.members || []).map(m => m._id)))
    .map(id => {
      const memberProjects = projects.filter(p => p.members?.some((m: any) => m._id === id));
      const m = projects.flatMap(p => p.members || []).find(m => m._id === id);
      if (!m) return null;
      
      return {
        id: m._id,
        name: m.name,
        email: m.email || `${m.name.toLowerCase().replace(" ", ".")}@example.com`,
        role: m.role || (Math.random() > 0.5 ? "Developer" : "Designer"),
        access: (m.role === "Admin" ? "Admin" : "Member") as "Admin" | "Member" | "Guest",
        status: "Active" as "Active" | "Inactive",
        avatar: m.avatar,
        projectIds: memberProjects.map(p => p._id)
      } as Member;
    })
    .filter((m): m is Member => m !== null);

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "All" || member.role === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleRemoveMember = async (member: Member) => {
    if (window.confirm(`Are you sure you want to remove ${member.name} from all projects?`)) {
      try {
        // Remove from all projects they are part of
        for (const projectId of member.projectIds) {
          await dispatch(removeMember({ projectId, userId: member.id })).unwrap();
        }
        setActiveMenu(null);
      } catch (error) {
        console.error("Failed to remove member:", error);
        alert("Failed to remove member. You might not have permission.");
      }
    }
  };

  const getRoleIcon = (role: string) => {
    if (role === "Developer") return <Code size={14} className="text-google-blue" />;
    if (role === "Designer") return <Palette size={14} className="text-google-red" />;
    return <User size={14} className="text-slate-400" />;
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Members</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your team members and their access levels.</p>
        </motion.div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 bg-google-blue hover:bg-[#5a6a2d] text-white font-bold text-sm rounded-xl flex items-center transition-all shadow-md hover:shadow-lg group"
        >
          <UserPlus size={20} className="mr-2 group-hover:scale-110 transition-transform" />
          Add Members
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-google-blue transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-google-blue/50 outline-none transition-all text-slate-900 dark:text-white font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-sm"
          />
        </div>

        <div className="flex bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-1 shadow-sm">
          {(["All", "Developer", "Designer"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeFilter === filter 
                  ? "bg-google-blue text-white shadow-md" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Members Table */}
      <div className="google-card flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-light dark:bg-white/[0.02] text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-border-light dark:border-border-dark">
                <th className="px-8 py-5">Member</th>
                <th className="px-8 py-5">Role</th>
                <th className="px-8 py-5">Access Level</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {filteredMembers.map((member, idx) => (
                <motion.tr 
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="hover:bg-surface-light dark:hover:bg-white/[0.01] transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center">
                      <div className="relative">
                        <img 
                          src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}&background=708238&color=fff&bold=true`} 
                          className="w-10 h-10 rounded-xl object-cover border border-border-light dark:border-border-dark"
                          alt={member.name}
                        />
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-surface-dark ${member.status === 'Active' ? 'bg-google-green' : 'bg-slate-300'}`} />
                      </div>
                      <div className="ml-4">
                        <p className="font-bold text-slate-900 dark:text-white group-hover:text-google-blue transition-colors">{member.name}</p>
                        <p className="text-xs text-slate-500 font-medium">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center px-3 py-1.5 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-lg w-fit">
                      {getRoleIcon(member.role)}
                      <span className="ml-2 text-xs font-bold text-slate-700 dark:text-slate-300">{member.role}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center">
                      <Shield size={14} className={`mr-2 ${member.access === 'Admin' ? 'text-google-yellow' : 'text-google-blue'}`} />
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{member.access}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      member.status === 'Active' 
                        ? 'bg-google-green/10 text-google-green border-google-green/20' 
                        : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-white/5 dark:border-white/10'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right relative">
                    <button 
                      onClick={() => setActiveMenu(activeMenu === member.id ? null : member.id)}
                      className="p-2 text-slate-400 hover:text-google-blue hover:bg-google-blue/10 rounded-lg transition-all"
                    >
                      <MoreVertical size={18} />
                    </button>
                    
                    <AnimatePresence>
                      {activeMenu === member.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setActiveMenu(null)}
                          />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-8 top-12 w-48 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-xl z-20 py-2"
                          >
                            <button className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-surface-light dark:hover:bg-white/5 flex items-center">
                              <User size={16} className="mr-3" />
                              View Profile
                            </button>
                            {currentUser?.role === "Admin" && member.id !== currentUser._id && (
                              <button 
                                onClick={() => handleRemoveMember(member)}
                                className="w-full px-4 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center"
                              >
                                <Trash2 size={16} className="mr-3" />
                                Remove Member
                              </button>
                            )}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-surface-light dark:bg-white/5 text-slate-300 rounded-full flex items-center justify-center mb-6 border border-border-light dark:border-border-dark">
              <User size={40} />
            </div>
            <h3 className="text-xl font-bold tracking-tight mb-2">No members found</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Try adjusting your search or filter settings.</p>
          </div>
        )}
      </div>

      {/* Add Member Modal (Simplified) */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-2xl shadow-2xl p-8 border border-border-light dark:border-border-dark"
            >
              <h2 className="text-2xl font-bold tracking-tight mb-2">Add New <span className="text-google-blue">Member</span></h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 text-sm">Invite a new colleague to join your workspace.</p>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="colleague@example.com"
                    className="w-full px-4 py-3 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-google-blue/50 outline-none font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Role</label>
                  <select className="w-full px-4 py-3 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-google-blue/50 outline-none font-bold text-sm">
                    <option>Developer</option>
                    <option>Designer</option>
                    <option>Manager</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-3 border border-border-light dark:border-border-dark rounded-xl font-bold text-sm text-slate-600 dark:text-slate-400 hover:bg-surface-light dark:hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 py-3 bg-google-blue text-white rounded-xl font-bold text-sm shadow-md hover:bg-[#5a6a2d] transition-all">
                    Send Invite
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Members;
