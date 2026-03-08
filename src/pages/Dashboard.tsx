import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../store/index.ts";
import { fetchProjects, joinProject } from "../store/slices/projectSlice.ts";
import { fetchDashboardStats } from "../store/slices/dashboardSlice.ts";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  Calendar as CalendarIcon,
  Link as LinkIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Counter from "../components/Counter.tsx";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { projects } = useSelector((state: RootState) => state.projects);
  const { user } = useSelector((state: RootState) => state.auth);
  const { stats, distribution, weeklyActivity, loading } = useSelector((state: RootState) => state.dashboard);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const handleJoinProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(joinProject(joinCode));
    setIsJoinModalOpen(false);
    setJoinCode("");
    dispatch(fetchProjects());
    dispatch(fetchDashboardStats());
  };

  const statCards = [
    { label: "Active Projects", value: stats?.activeProjects || 0, icon: TrendingUp, color: "text-google-blue", bg: "bg-google-blue/10" },
    { label: "Completed Tasks", value: stats?.completedTasks || 0, icon: CheckCircle2, color: "text-google-green", bg: "bg-google-green/10" },
    { label: "Pending Tasks", value: stats?.pendingTasks || 0, icon: Clock, color: "text-google-yellow", bg: "bg-google-yellow/10" },
    { label: "Overdue", value: stats?.overdueTasks || 0, icon: AlertCircle, color: "text-google-red", bg: "bg-google-red/10" },
  ];

  const pieData = distribution ? [
    { name: "Todo", value: distribution.todo },
    { name: "In Progress", value: distribution.inProgress },
    { name: "Completed", value: distribution.completed },
  ] : [];

  const COLORS = ["#708238", "#f9ab00", "#1e8e3e"];

  if (loading && !stats) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 border-4 border-slate-200 border-t-google-blue rounded-full"
      />
      <p className="text-slate-500 font-medium tracking-tight text-sm">Loading your dashboard...</p>
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            Welcome back, <span className="text-google-blue">{user?.name}</span>! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Here's what's happening with your projects today.</p>
        </motion.div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsJoinModalOpen(true)}
            className="px-5 py-2.5 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-google-blue/50 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center transition-all hover:shadow-google group"
          >
            <LinkIcon size={18} className="mr-2 text-google-blue group-hover:scale-110 transition-transform" />
            Join Project
          </button>
          
          <div className="flex items-center space-x-2 bg-white dark:bg-surface-dark p-2 px-4 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
            <CalendarIcon size={16} className="text-google-blue" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

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
              <h2 className="text-2xl font-bold tracking-tight mb-2">Join a <span className="text-google-blue">Project</span></h2>
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.4 }}
            className="google-card p-6 relative group overflow-hidden cursor-pointer hover:shadow-google-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} p-3 rounded-xl transition-colors`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Stats</span>
            </div>
            <h3 className="text-3xl font-bold mb-1 tracking-tight">
              <Counter value={stat.value} />
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Activity */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 google-card p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold tracking-tight">System Activity</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mt-1">Weekly Task Throughput</p>
            </div>
            <select className="bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark text-xs font-bold text-slate-600 dark:text-slate-400 rounded-lg px-3 py-1.5 focus:ring-google-blue/50 outline-none cursor-pointer hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
              <option>Current Cycle</option>
              <option>Previous Cycle</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#5f6368", fontSize: 10, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#5f6368", fontSize: 10, fontWeight: 500 }}
                />
                <Tooltip 
                  cursor={{ fill: "rgba(112, 130, 56, 0.05)" }}
                  contentStyle={{ 
                    backgroundColor: "white", 
                    borderRadius: "8px", 
                    border: "1px solid #dadce0",
                    boxShadow: "0 2px 6px rgba(60,64,67,.15)"
                  }}
                  itemStyle={{ color: "#708238", fontWeight: "bold" }}
                />
                <Bar dataKey="tasks" fill="#708238" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Task Distribution */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="google-card p-8"
        >
          <h2 className="text-xl font-bold tracking-tight mb-1">Distribution</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-8">Task Status Allocation</p>
          
          <div className="h-60 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "white", 
                    borderRadius: "8px", 
                    border: "1px solid #dadce0",
                    boxShadow: "0 2px 6px rgba(60,64,67,.15)"
                  }}
                  itemStyle={{ color: "#708238", fontWeight: "bold" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.totalTasks || 0}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Total</span>
            </div>
          </div>
          
          <div className="space-y-4 mt-8">
            {pieData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between group">
                <div className="flex items-center">
                  <div className="w-2.5 h-2.5 rounded-full mr-3" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">{item.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                    <Counter value={stats?.totalTasks ? Math.round((item.value / stats.totalTasks) * 100) : 0} suffix="%" />
                  </span>
                  <div className="w-16 h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stats?.totalTasks ? (item.value / stats.totalTasks) * 100 : 0}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full" 
                      style={{ 
                        backgroundColor: COLORS[index]
                      }} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Projects */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="google-card overflow-hidden"
      >
        <div className="p-8 flex items-center justify-between border-b border-border-light dark:border-border-dark">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Active Projects</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mt-1">Recent Project Deployments</p>
          </div>
          <Link to="/projects">
            <button className="px-4 py-2 bg-surface-light dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-border-light dark:border-border-dark rounded-lg text-xs font-bold text-google-blue uppercase tracking-wider transition-all">
              View All
            </button>
          </Link>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-border-light dark:border-border-dark">
                <th className="px-8 py-4">Project</th>
                <th className="px-8 py-4">Code</th>
                <th className="px-8 py-4">Deadline</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Progress</th>
                <th className="px-8 py-4 text-right">Members</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {projects.slice(0, 5).map((project) => (
                <tr 
                  key={project._id} 
                  className="group hover:bg-surface-light dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                  onClick={() => navigate(`/projects/${project._id}`)}
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-google-blue/10 rounded-lg flex items-center justify-center text-google-blue font-bold border border-google-blue/20">
                        {project.name.charAt(0)}
                      </div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-google-blue transition-colors">{project.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 bg-surface-light dark:bg-white/5 px-2 py-1 rounded border border-border-light dark:border-border-dark">
                      {project.projectCode}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-xs font-medium text-slate-500">
                    {project.deadline ? new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "---"}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                      project.status === "Active" 
                        ? "bg-google-green/10 text-google-green border-google-green/20" 
                        : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    {project.progress > 0 ? (
                      <div className="flex items-center space-x-3">
                        <div className="w-20 h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
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
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">No tasks</span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end -space-x-2">
                      {project.members.slice(0, 3).map((member: any, idx: number) => {
                        const memberName = typeof member === 'string' ? 'User' : member.name;
                        const memberAvatar = typeof member === 'string' ? null : member.avatar;
                        return (
                          <img 
                            key={idx}
                            src={memberAvatar || `https://ui-avatars.com/api/?name=${memberName}&background=708238&color=ffffff&bold=true`}
                            className="w-7 h-7 rounded-full border-2 border-white dark:border-surface-dark group-hover:border-google-blue transition-colors"
                            alt={memberName}
                          />
                        );
                      })}
                      {project.members.length > 3 && (
                        <div className="w-7 h-7 rounded-full bg-surface-light dark:bg-white/5 border-2 border-white dark:border-surface-dark flex items-center justify-center text-[9px] font-bold text-google-blue">
                          +{project.members.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="p-3 bg-surface-light dark:bg-white/5 rounded-full text-slate-400">
                        <AlertCircle size={28} />
                      </div>
                      <p className="text-slate-500 font-medium text-xs">No active projects detected</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
