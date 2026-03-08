import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/index.ts";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Calendar,
  User,
  Tag,
  ArrowUpDown
} from "lucide-react";
import TaskDetail from "../components/TaskDetail.tsx";

const TaskList: React.FC = () => {
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const { projects } = useSelector((state: RootState) => state.projects);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "text-google-green bg-google-green/10 border-google-green/20";
      case "In Progress": return "text-google-yellow bg-google-yellow/10 border-google-yellow/20";
      default: return "text-google-blue bg-google-blue/10 border-google-blue/20";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "text-google-red bg-google-red/10 border-google-red/20";
      case "Medium": return "text-google-yellow bg-google-yellow/10 border-google-yellow/20";
      default: return "text-google-green bg-google-green/10 border-google-green/20";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Task List</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">A comprehensive view of all tasks across your workspace.</p>
        </motion.div>
        <button className="px-5 py-2.5 bg-google-blue hover:bg-[#5a6a2d] text-white font-bold text-sm rounded-xl flex items-center transition-all shadow-md hover:shadow-lg group">
          <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform" />
          Create Task
        </button>
      </div>

      {/* Filters Bar */}
      <div className="google-card p-4 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-google-blue transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks by title..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl outline-none focus:ring-2 focus:ring-google-blue/50 transition-all text-sm font-medium"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-slate-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider outline-none cursor-pointer hover:border-google-blue/50 transition-all"
            >
              <option value="All">All Status</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider outline-none cursor-pointer hover:border-google-blue/50 transition-all"
          >
            <option value="All">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="google-card overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-light dark:bg-white/[0.02] border-b border-border-light dark:border-border-dark">
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Task</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Assignee</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Due Date</th>
                <th className="px-8 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {filteredTasks.map((task) => (
                <tr 
                  key={task._id} 
                  onClick={() => setSelectedTask(task)}
                  className="hover:bg-surface-light dark:hover:bg-white/[0.01] transition-all cursor-pointer group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-4 border ${getStatusColor(task.status)}`}>
                        {task.status === "Completed" ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-google-blue transition-colors tracking-tight">{task.title}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                          {projects.find(p => p._id === task.project)?.name || "Unknown Project"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center">
                      <img 
                        src={task.assignedTo?.avatar || `https://ui-avatars.com/api/?name=${task.assignedTo?.name || "U"}&background=708238&color=fff&bold=true`} 
                        className="w-8 h-8 rounded-full border border-border-light dark:border-border-dark mr-3"
                        alt="Assignee"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{task.assignedTo?.name || "Unassigned"}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center text-slate-500 dark:text-slate-400">
                      <Calendar size={14} className="mr-2 text-google-blue" />
                      <span className="text-xs font-bold">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Date"}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-400 hover:text-google-blue transition-all">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTasks.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-surface-light dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 border border-border-light dark:border-border-dark">
              <Search size={24} />
            </div>
            <h3 className="text-xl font-bold tracking-tight mb-1">No tasks found</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedTask && (
          <TaskDetail task={selectedTask} onClose={() => setSelectedTask(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;
