import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Search, 
  Briefcase, 
  MoreHorizontal, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Plus,
  Filter,
  ArrowRight
} from "lucide-react";

const ManageProjects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const mockProjects = [
    { id: 1, name: "Website Redesign", owner: "Santhosh K", members: 8, tasks: 45, status: "Active", progress: 65 },
    { id: 2, name: "Mobile App Dev", owner: "Jane Doe", members: 12, tasks: 120, status: "Active", progress: 30 },
    { id: 3, name: "Marketing Campaign", owner: "Bob Smith", members: 5, tasks: 24, status: "Completed", progress: 100 },
    { id: 4, name: "API Integration", owner: "Alice Johnson", members: 4, tasks: 18, status: "On Hold", progress: 15 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Manage Projects</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Oversee all organizational projects and resource allocation.</p>
        </motion.div>
        <button className="google-button-primary flex items-center">
          <Plus size={20} className="mr-2" />
          New Project
        </button>
      </div>

      {/* Filters */}
      <div className="google-card p-4 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-google-blue transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search projects by name or owner..." 
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

      {/* Projects Table */}
      <div className="google-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-light dark:bg-white/[0.02] text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-8 py-4">Project</th>
                <th className="px-8 py-4">Owner</th>
                <th className="px-8 py-4">Stats</th>
                <th className="px-8 py-4">Progress</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {mockProjects.map((project) => (
                <tr key={project.id} className="hover:bg-surface-light dark:hover:bg-white/[0.01] transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-google-blue/10 rounded-xl flex items-center justify-center text-google-blue mr-4 border border-google-blue/20">
                        <Briefcase size={20} />
                      </div>
                      <p className="font-bold text-slate-900 dark:text-white group-hover:text-google-blue transition-colors">{project.name}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${project.owner}&background=708238&color=fff&bold=true`} 
                        className="w-6 h-6 rounded-full mr-2"
                        alt={project.owner}
                      />
                      {project.owner}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4 text-xs font-bold text-slate-500">
                      <span className="flex items-center"><Users size={14} className="mr-1 text-google-blue" /> {project.members}</span>
                      <span className="flex items-center"><CheckCircle2 size={14} className="mr-1 text-google-green" /> {project.tasks}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center">
                      <div className="flex-1 bg-slate-200 dark:bg-white/10 h-1.5 rounded-full mr-3 max-w-[80px]">
                        <div className="bg-google-blue h-full" style={{ width: `${project.progress}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      project.status === 'Active' ? 'bg-google-green/10 text-google-green border-google-green/20' : 
                      project.status === 'Completed' ? 'bg-google-blue/10 text-google-blue border-google-blue/20' : 'bg-google-yellow/10 text-google-yellow border-google-yellow/20'
                    }`}>
                      {project.status}
                    </span>
                  </td>
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

export default ManageProjects;
