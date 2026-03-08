import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/index.ts";
import { fetchProjects, createProject, joinProject, deleteProject } from "../store/slices/projectSlice.ts";
import { 
  Plus, 
  Users, 
  Calendar, 
  ChevronRight, 
  Search,
  Filter,
  MoreVertical,
  LayoutGrid,
  List as ListIcon,
  Link as LinkIcon,
  CheckCircle2,
  Check,
  Copy
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import Counter from "../components/Counter.tsx";

const Projects: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { projects, loading } = useSelector((state: RootState) => state.projects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        await dispatch(deleteProject(projectId)).unwrap();
      } catch (error) {
        console.error("Failed to delete project:", error);
        alert("Failed to delete project. You might not have permission.");
      }
    }
  };
  const [createdProject, setCreatedProject] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [newProject, setNewProject] = useState({ name: "", description: "", deadline: "" });
  const [joinCode, setJoinCode] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(createProject(newProject));
    if (createProject.fulfilled.match(resultAction)) {
      setCreatedProject(resultAction.payload);
      setNewProject({ name: "", description: "", deadline: "" });
    }
  };

  const handleJoinProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(joinProject(joinCode));
    setIsJoinModalOpen(false);
    setJoinCode("");
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight mb-1">Projects</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage and organize your team's projects.</p>
        </motion.div>
        
        <div className="flex items-center space-x-3">
          <div className="flex bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-1 shadow-sm">
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-google-blue text-white shadow-md" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-google-blue text-white shadow-md" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"}`}
            >
              <ListIcon size={18} />
            </button>
          </div>
          
          <button 
            onClick={() => setIsJoinModalOpen(true)}
            className="px-5 py-2.5 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-google-blue/50 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center transition-all hover:shadow-google group"
          >
            <LinkIcon size={18} className="mr-2 text-google-blue group-hover:scale-110 transition-transform" />
            Join
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-google-blue hover:bg-[#5a6a2d] text-white font-bold text-sm rounded-xl flex items-center transition-all shadow-md hover:shadow-lg group"
          >
            <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform" />
            New Project
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-google-blue transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-google-blue/50 outline-none transition-all text-slate-900 dark:text-white font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-sm"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter size={18} className="text-slate-400" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-surface-light dark:hover:bg-white/5 transition-all outline-none focus:ring-2 focus:ring-google-blue/50 cursor-pointer shadow-sm"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <AnimatePresence mode="popLayout">
        {viewMode === "grid" ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project, idx) => (
              <Link to={`/projects/${project._id}`} key={project._id}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.03, duration: 0.4 }}
                  className="google-card p-6 group cursor-pointer relative overflow-hidden transition-all duration-300 hover:shadow-google-hover"
                >
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="w-12 h-12 bg-google-blue/10 rounded-xl flex items-center justify-center text-google-blue font-bold text-xl border border-google-blue/20 group-hover:bg-google-blue group-hover:text-white transition-all">
                      {project.name.charAt(0)}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 bg-surface-light dark:bg-white/5 px-2 py-1 rounded border border-border-light dark:border-border-dark mb-2">
                        {project.projectCode}
                      </span>
                      <div className="relative">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setActiveMenu(activeMenu === project._id ? null : project._id);
                          }}
                          className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          <MoreVertical size={18} />
                        </button>
                        
                        <AnimatePresence>
                          {activeMenu === project._id && (
                            <>
                              <div 
                                className="fixed inset-0 z-10" 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setActiveMenu(null);
                                }}
                              />
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="absolute right-0 top-8 w-32 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-xl z-20 py-2"
                              >
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    navigate(`/projects/${project._id}`);
                                  }}
                                  className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-surface-light dark:hover:bg-white/5 flex items-center"
                                >
                                  Open
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDeleteProject(project._id);
                                    setActiveMenu(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center"
                                >
                                  Delete
                                </button>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2 group-hover:text-google-blue transition-colors tracking-tight">
                    {project.name}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-xs line-clamp-2 mb-6 leading-relaxed">
                    {project.description || "No description provided for this project."}
                  </p>
                  
                    {project.progress > 0 && (
                      <div className="space-y-3 relative z-10">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                          <span className="text-slate-500 dark:text-slate-400">Progress</span>
                          <span className="text-slate-900 dark:text-white">
                            <Counter value={project.progress} suffix="%" />
                          </span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-google-blue rounded-full" 
                          />
                        </div>
                      </div>
                    )}

                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-border-light dark:border-border-dark relative z-10">
                    <div className="flex -space-x-2">
                      {project.members.slice(0, 3).map((member: any, idx: number) => {
                        const memberName = typeof member === 'string' ? 'User' : member.name;
                        const memberAvatar = typeof member === 'string' ? null : member.avatar;
                        return (
                          <img 
                            key={idx}
                            src={memberAvatar || `https://ui-avatars.com/api/?name=${memberName}&background=708238&color=ffffff&bold=true`}
                            className="w-8 h-8 rounded-full border-2 border-white dark:border-surface-dark group-hover:border-google-blue transition-colors"
                            alt={memberName}
                          />
                        );
                      })}
                      {project.members.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-surface-light dark:bg-white/5 border-2 border-white dark:border-surface-dark flex items-center justify-center text-[9px] font-bold text-google-blue">
                          +{project.members.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                      <Calendar size={12} className="mr-1.5 text-google-blue" />
                      {project.deadline ? new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "---"}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="google-card overflow-hidden"
          >
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-border-light dark:border-border-dark">
                  <th className="px-8 py-4">Project Name</th>
                  <th className="px-8 py-4">Code</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Deadline</th>
                  <th className="px-8 py-4">Progress</th>
                  <th className="px-8 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark">
                {filteredProjects.map((project) => (
                  <tr 
                    key={project._id} 
                    className="hover:bg-surface-light dark:hover:bg-white/[0.02] transition-colors cursor-pointer group"
                    onClick={() => navigate(`/projects/${project._id}`)}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-google-blue/10 rounded-lg flex items-center justify-center text-google-blue font-bold border border-google-blue/20 group-hover:bg-google-blue group-hover:text-white transition-all mr-4">
                          {project.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-google-blue transition-colors">{project.name}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{project.members.length} Members</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 bg-surface-light dark:bg-white/5 px-2 py-1 rounded border border-border-light dark:border-border-dark">
                        {project.projectCode}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-2 py-0.5 bg-google-green/10 text-google-green border border-google-green/20 rounded text-[9px] font-bold uppercase tracking-wider">
                        {project.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-xs font-medium text-slate-500 dark:text-slate-400">
                      {project.deadline ? new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "---"}
                    </td>
                    <td className="px-8 py-5">
                      {project.progress > 0 ? (
                        <div className="flex items-center space-x-3">
                          <div className="w-24 h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${project.progress}%` }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              className="h-full bg-google-blue" 
                            />
                          </div>
                          <span className="text-[10px] font-bold text-slate-500">
                            <Counter value={project.progress} suffix="%" />
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">No tasks yet</span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === project._id ? null : project._id);
                        }}
                        className="p-2 text-slate-400 hover:text-google-blue hover:bg-google-blue/10 rounded-lg transition-all"
                      >
                        <MoreVertical size={18} />
                      </button>

                      <AnimatePresence>
                        {activeMenu === project._id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenu(null);
                              }}
                            />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute right-8 top-12 w-32 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-xl z-20 py-2"
                            >
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/projects/${project._id}`);
                                }}
                                className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-surface-light dark:hover:bg-white/5 flex items-center"
                              >
                                Open
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteProject(project._id);
                                  setActiveMenu(null);
                                }}
                                className="w-full px-4 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center"
                              >
                                Delete
                              </button>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div key="create-project-modal-root" className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              key="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-primary-dark/80 backdrop-blur-md"
            />
            <motion.div 
              key="modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-lg bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl shadow-2xl p-10 overflow-hidden"
            >
              {!createdProject ? (
                <>
                  <h2 className="text-2xl font-bold tracking-tight mb-1">Create New <span className="text-google-blue">Project</span></h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 text-sm">Fill in the details to start a new project.</p>
                  
                  <form onSubmit={handleCreateProject} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Project Name</label>
                      <input 
                        type="text" 
                        required
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        className="w-full px-4 py-3 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-google-blue/50 outline-none text-slate-900 dark:text-white font-bold placeholder:text-slate-300 dark:placeholder:text-slate-700"
                        placeholder="e.g. Project Phoenix"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Description</label>
                      <textarea 
                        rows={3}
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        className="w-full px-4 py-3 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-google-blue/50 outline-none resize-none text-slate-900 dark:text-white font-medium placeholder:text-slate-300 dark:placeholder:text-slate-700"
                        placeholder="What is this project about?"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Deadline</label>
                      <input 
                        type="date" 
                        value={newProject.deadline}
                        onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                        className="w-full px-4 py-3 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-google-blue/50 outline-none text-slate-900 dark:text-white font-bold"
                      />
                    </div>
                    <div className="flex space-x-4 pt-4">
                      <button 
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 px-6 py-3 border border-border-light dark:border-border-dark text-slate-600 dark:text-slate-400 font-bold text-sm rounded-xl hover:bg-surface-light dark:hover:bg-white/5 transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 px-6 py-3 bg-google-blue text-white font-bold text-sm rounded-xl hover:bg-[#5a6a2d] shadow-md transition-all"
                      >
                        Create Project
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-google-green/10 text-google-green rounded-full flex items-center justify-center mx-auto mb-6 border border-google-green/20">
                    <CheckCircle2 size={32} />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight mb-2">Project <span className="text-google-green">Created</span></h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 text-sm">Your project is now active. Share the code below with your team.</p>
                  
                  <div className="space-y-3 mb-8">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Project Code</label>
                    <div className="flex items-center bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl p-4 group">
                      <span className="flex-1 font-mono font-bold text-google-blue text-2xl tracking-widest uppercase">
                        {createdProject.projectCode}
                      </span>
                      <button 
                        onClick={() => copyToClipboard(createdProject.projectCode)}
                        className="p-2 bg-white dark:bg-surface-dark rounded-lg text-slate-400 hover:text-google-blue shadow-sm transition-all"
                      >
                        {copied ? <Check size={20} className="text-google-green" /> : <Copy size={20} />}
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setIsModalOpen(false);
                      setCreatedProject(null);
                    }}
                    className="w-full px-6 py-3 bg-google-blue text-white font-bold text-sm rounded-xl hover:bg-[#5a6a2d] shadow-md transition-all"
                  >
                    Go to Projects
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Join Project Modal */}
      <AnimatePresence>
        {isJoinModalOpen && (
          <div key="join-project-modal-root" className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              key="join-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsJoinModalOpen(false)}
              className="absolute inset-0 bg-primary-dark/80 backdrop-blur-md"
            />
            <motion.div 
              key="join-modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-md bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl shadow-2xl p-10 overflow-hidden"
            >
              <h2 className="text-2xl font-bold tracking-tight mb-1">Join a <span className="text-google-blue">Project</span></h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 text-sm">Enter the project code to establish a connection.</p>
              
              <form onSubmit={handleJoinProject} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Project Code</label>
                  <input 
                    type="text" 
                    required
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="w-full px-6 py-4 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-google-blue/50 outline-none text-center text-2xl font-bold tracking-widest uppercase text-google-blue placeholder:text-slate-300 dark:placeholder:text-slate-700"
                    placeholder="XJ-82K9L"
                  />
                </div>
                <div className="flex space-x-4">
                  <button 
                    type="button"
                    onClick={() => setIsJoinModalOpen(false)}
                    className="flex-1 px-6 py-3 border border-border-light dark:border-border-dark text-slate-600 dark:text-slate-400 font-bold text-sm rounded-xl hover:bg-surface-light dark:hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3 bg-google-blue text-white font-bold text-sm rounded-xl hover:bg-[#5a6a2d] shadow-md transition-all"
                  >
                    Join Project
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

export default Projects;
