import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/index.ts";
import { fetchTasksByProject } from "../store/slices/taskSlice.ts";
import { fetchProjects } from "../store/slices/projectSlice.ts";
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter,
  MoreHorizontal,
  Calendar as CalendarIcon,
  MessageSquare,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import TaskDetail from "../components/TaskDetail.tsx";

const MyTasks: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { projects } = useSelector((state: RootState) => state.projects);
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    // Fetch tasks for all projects the user is in
    projects.forEach(project => {
      dispatch(fetchTasksByProject(project._id));
    });
  }, [projects, dispatch]);

  // Filter tasks assigned to the current user
  const myTasks = tasks.filter(task => {
    const isAssigned = task.assignedTo?._id === user?._id || task.assignedTo === user?._id;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || task.status === statusFilter;
    return isAssigned && matchesSearch && matchesStatus;
  });

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "High": return "bg-google-red/10 text-google-red border-google-red/20";
      case "Medium": return "bg-google-yellow/10 text-google-yellow border-google-yellow/20";
      case "Low": return "bg-google-green/10 text-google-green border-google-green/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight mb-1">My Tasks</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Monitor and manage your assigned tasks across all projects.</p>
      </motion.div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-google-blue transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search your tasks..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-google-blue/50 outline-none transition-all text-slate-900 dark:text-white font-medium placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center space-x-3">
          <Filter size={18} className="text-slate-500" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-6 py-3 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-surface-light dark:hover:bg-white/5 transition-all outline-none focus:ring-2 focus:ring-google-blue/50 cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Todo">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="google-card overflow-hidden">
        {myTasks.length > 0 ? (
          <div className="divide-y divide-border-light dark:divide-border-dark">
            {myTasks.map((task, idx) => (
              <motion.div 
                key={task._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                onClick={() => setSelectedTask(task)}
                className="p-6 hover:bg-surface-light dark:hover:bg-white/[0.02] transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                <div className="flex items-start space-x-5">
                  <div className={`mt-1 p-3 rounded-xl border transition-all ${
                    task.status === "Completed" ? "bg-google-green/10 text-google-green border-google-green/20" : "bg-google-blue/10 text-google-blue border-google-blue/20"
                  }`}>
                    {task.status === "Completed" ? <CheckCircle2 size={20} /> : <CheckSquare size={20} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold group-hover:text-google-blue transition-colors tracking-tight mb-1">
                      {task.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm line-clamp-1 mb-3">{task.description}</p>
                    <div className="flex flex-wrap items-center gap-4">
                      <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getPriorityStyle(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center">
                        <CalendarIcon size={14} className="mr-1.5 text-google-blue" />
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No deadline"}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center">
                        <MessageSquare size={14} className="mr-1.5 text-google-blue" />
                        {task.comments?.length || 0} Comments
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Project</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-google-blue transition-colors">
                      {projects.find(p => p._id === task.project)?.name || "Unknown"}
                    </p>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-google-blue transition-all">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-surface-light dark:bg-white/5 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-border-light dark:border-border-dark">
              <CheckSquare size={32} />
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-2">No Tasks Found</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium">You don't have any assigned tasks matching the current filters.</p>
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedTask && (
          <TaskDetail 
            task={selectedTask} 
            onClose={() => setSelectedTask(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyTasks;
