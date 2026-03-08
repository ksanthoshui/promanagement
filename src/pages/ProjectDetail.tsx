import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/index.ts";
import { fetchProjectById, updateProject, deleteProject, inviteMember } from "../store/slices/projectSlice.ts";
import { fetchTasksByProject, createTask, updateTaskStatus, taskCreated, taskUpdated, taskDeleted } from "../store/slices/taskSlice.ts";
import { 
  Plus, 
  MoreHorizontal, 
  Calendar as CalendarIcon, 
  MessageSquare, 
  Paperclip, 
  CheckSquare,
  ChevronLeft,
  Users,
  Settings,
  Clock,
  AlertCircle,
  LayoutGrid,
  Trello,
  Calendar as CalendarLucide,
  GanttChartSquare,
  UserPlus,
  Copy,
  Check,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import TaskDetail from "../components/TaskDetail.tsx";
import socketService from "../services/socket.ts";

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentProject } = useSelector((state: RootState) => state.projects);
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);
  
  const projectProgress = tasks.length > 0 
    ? Math.round((tasks.filter(t => t.status === "Completed").length / tasks.length) * 100)
    : 0;
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const selectedTask = tasks.find(t => t._id === selectedTaskId);
  const [viewMode, setViewMode] = useState<"kanban" | "calendar" | "timeline">("kanban");
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "Medium", dueDate: "" });
  const [editProject, setEditProject] = useState({ name: "", description: "", status: "", deadline: "" });
  const [inviteEmail, setInviteEmail] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id));
      dispatch(fetchTasksByProject(id));

      const socket = socketService.getSocket();
      if (socket) {
        socket.emit("join-project", id);

        socket.on("task-created", (task: any) => {
          if (task.project === id) {
            dispatch(taskCreated(task));
          }
        });

        socket.on("task-updated", (task: any) => {
          if (task.project === id || task.project?._id === id) {
            dispatch(taskUpdated(task));
          }
        });

        socket.on("task-deleted", (data: { taskId: string, projectId: string }) => {
          if (data.projectId === id) {
            dispatch(taskDeleted(data.taskId));
          }
        });
      }

      return () => {
        if (socket) {
          socket.off("task-created");
          socket.off("task-updated");
          socket.off("task-deleted");
        }
      };
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentProject) {
      setEditProject({
        name: currentProject.name,
        description: currentProject.description || "",
        status: currentProject.status,
        deadline: currentProject.deadline ? new Date(currentProject.deadline).toISOString().split('T')[0] : ""
      });
    }
  }, [currentProject]);

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      await dispatch(updateProject({ id, data: editProject }));
      setIsSettingsModalOpen(false);
    }
  };

  const handleDeleteProject = async () => {
    if (id) {
      await dispatch(deleteProject(id));
      navigate("/projects");
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id && inviteEmail) {
      await dispatch(inviteMember({ projectId: id, email: inviteEmail }));
      setIsInviteModalOpen(false);
      setInviteEmail("");
    }
  };

  const copyToClipboard = () => {
    if (currentProject?.projectCode) {
      navigator.clipboard.writeText(currentProject.projectCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      await dispatch(createTask({ ...newTask, project: id }));
      setIsTaskModalOpen(false);
      setNewTask({ title: "", description: "", priority: "Medium", dueDate: "" });
    }
  };

  const handleStatusChange = (taskId: string, newStatus: string) => {
    dispatch(updateTaskStatus({ id: taskId, status: newStatus }));
  };

  const columns = [
    { id: "Todo", title: "To Do", color: "bg-google-blue/10 text-google-blue border-google-blue/20" },
    { id: "In Progress", title: "In Progress", color: "bg-google-yellow/10 text-google-yellow border-google-yellow/20" },
    { id: "Completed", title: "Completed", color: "bg-google-green/10 text-google-green border-google-green/20" },
  ];

  const getTasksByStatus = (status: string) => tasks.filter((t) => t.status === status);

  if (!currentProject) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 border-4 border-google-blue/20 border-t-google-blue rounded-full"
      />
      <p className="text-slate-500 dark:text-slate-400 font-medium uppercase text-[10px] tracking-widest">Accessing Project Data...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <Link to="/projects" className="p-2.5 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-white/5 rounded-xl transition-all text-slate-500 hover:text-google-blue hover:shadow-google group">
            <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-2xl font-bold tracking-tight">{currentProject.name}</h1>
              <span className="px-3 py-0.5 bg-google-blue/10 text-google-blue border border-google-blue/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {currentProject.status}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <div className="flex items-center">
                <Users size={12} className="mr-1.5 text-google-blue" />
                {currentProject.members.length} Members
              </div>
              <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
              <div className="flex items-center">
                <Clock size={12} className="mr-1.5 text-google-blue" />
                Created by <span className="text-slate-700 dark:text-slate-300 ml-1">{currentProject.owner.name}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex bg-slate-100 dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl p-1">
            <button 
              onClick={() => setViewMode("kanban")}
              className={`p-2 rounded-lg transition-all ${viewMode === "kanban" ? "bg-white dark:bg-surface-dark text-google-blue shadow-google" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"}`}
              title="Kanban Board"
            >
              <Trello size={18} />
            </button>
            <button 
              onClick={() => setViewMode("calendar")}
              className={`p-2 rounded-lg transition-all ${viewMode === "calendar" ? "bg-white dark:bg-surface-dark text-google-blue shadow-google" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"}`}
              title="Calendar View"
            >
              <CalendarLucide size={18} />
            </button>
            <button 
              onClick={() => setViewMode("timeline")}
              className={`p-2 rounded-lg transition-all ${viewMode === "timeline" ? "bg-white dark:bg-surface-dark text-google-blue shadow-google" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"}`}
              title="Timeline View"
            >
              <GanttChartSquare size={18} />
            </button>
          </div>
          
          <div className="flex -space-x-2 mr-2">
            {currentProject.members.slice(0, 4).map((member: any, idx: number) => {
              const memberName = typeof member === 'string' ? 'User' : member.name;
              const memberAvatar = typeof member === 'string' ? null : member.avatar;
              return (
                <img 
                  key={idx}
                  src={memberAvatar || `https://ui-avatars.com/api/?name=${memberName}&background=708238&color=ffffff&bold=true`}
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-surface-dark shadow-sm hover:z-10 transition-all cursor-pointer"
                  title={memberName}
                />
              );
            })}
            {currentProject.members.length > 4 && (
              <div className="w-8 h-8 rounded-full bg-surface-light dark:bg-white/5 border-2 border-white dark:border-surface-dark flex items-center justify-center text-[9px] font-bold text-google-blue">
                +{currentProject.members.length - 4}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsInviteModalOpen(true)}
              className="p-2.5 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-slate-500 hover:text-google-blue hover:shadow-google rounded-xl transition-all"
              title="Invite Member"
            >
              <UserPlus size={18} />
            </button>
            <button 
              onClick={() => setIsSettingsModalOpen(true)}
              className="p-2.5 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-slate-500 hover:text-google-blue hover:shadow-google rounded-xl transition-all"
              title="Project Settings"
            >
              <Settings size={18} />
            </button>
            <button 
              onClick={() => setIsTaskModalOpen(true)}
              className="px-5 py-2.5 bg-google-blue hover:bg-[#5a6a2d] text-white font-bold text-sm rounded-xl flex items-center transition-all shadow-md hover:shadow-lg group"
            >
              <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform" />
              Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Content based on View Mode */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full min-h-[600px]">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-3">
                  <h3 className="font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px]">{column.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${column.color}`}>
                    {getTasksByStatus(column.id).length}
                  </span>
                </div>
                <button className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded-md text-slate-500 hover:text-google-blue transition-colors">
                  <Plus size={14} />
                </button>
              </div>

              <div className="flex-1 bg-surface-light dark:bg-white/[0.02] border border-border-light dark:border-border-dark rounded-2xl p-4 space-y-4 min-h-[200px]">
                {getTasksByStatus(column.id).map((task) => (
                  <motion.div
                    key={task._id}
                    layoutId={task._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setSelectedTaskId(task._id)}
                    className="google-card p-4 group cursor-pointer relative overflow-hidden hover:shadow-google-hover transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${
                        task.priority === "High" ? "bg-google-red/10 text-google-red border-google-red/20" : 
                        task.priority === "Medium" ? "bg-google-yellow/10 text-google-yellow border-google-yellow/20" : "bg-google-green/10 text-google-green border-google-green/20"
                      }`}>
                        {task.priority}
                      </span>
                      <button className="p-1 text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                    <h4 className="font-bold mb-1 group-hover:text-google-blue transition-colors tracking-tight text-sm">{task.title}</h4>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-[11px] line-clamp-2 mb-4 leading-relaxed">{task.description}</p>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-light dark:border-border-dark">
                      <div className="flex items-center space-x-3 text-slate-500 dark:text-slate-600">
                        <div className="flex items-center text-[9px] font-bold uppercase tracking-wider">
                          <MessageSquare size={10} className="mr-1.5 text-google-blue" />
                          {task.comments?.length || 0}
                        </div>
                        <div className="flex items-center text-[9px] font-bold uppercase tracking-wider">
                          <CheckSquare size={10} className="mr-1.5 text-google-blue" />
                          {task.subtasks?.filter((s: any) => s.completed).length || 0}/{task.subtasks?.length || 0}
                        </div>
                      </div>
                      <img 
                        src={task.assignedTo?.avatar || `https://ui-avatars.com/api/?name=${task.assignedTo?.name || "Unassigned"}&background=708238&color=ffffff&bold=true`}
                        className="w-6 h-6 rounded-full border border-border-light dark:border-border-dark shadow-sm"
                        alt="Assignee"
                      />
                    </div>
                  </motion.div>
                ))}
                {getTasksByStatus(column.id).length === 0 && (
                  <div className="h-24 border-2 border-dashed border-border-light dark:border-border-dark rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-600 text-[10px] font-bold uppercase tracking-widest italic">
                    No active tasks
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === "calendar" && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="google-card p-6"
        >
          <Calendar 
            className="w-full border-none font-sans bg-transparent text-slate-600 dark:text-slate-300"
            tileContent={({ date, view }) => {
              if (view === 'month') {
                const dayTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === date.toDateString());
                return (
                  <div className="flex flex-col space-y-1 mt-1">
                    {dayTasks.map(t => (
                      <div 
                        key={t._id} 
                        onClick={() => setSelectedTaskId(t._id)}
                        className="text-[7px] px-1.5 py-0.5 bg-google-blue/10 text-google-blue rounded truncate font-bold uppercase tracking-wider cursor-pointer border border-google-blue/20 hover:bg-google-blue hover:text-white transition-colors"
                      >
                        {t.title}
                      </div>
                    ))}
                  </div>
                );
              }
            }}
          />
        </motion.div>
      )}

      {viewMode === "timeline" && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="google-card p-6 overflow-x-auto"
        >
          <div className="min-w-[800px] space-y-4">
            {tasks.map((task) => (
              <div key={task._id} className="flex items-center cursor-pointer group" onClick={() => setSelectedTaskId(task._id)}>
                <div className="w-48 pr-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate group-hover:text-google-blue transition-colors">{task.title}</div>
                <div className="flex-1 h-8 bg-slate-100 dark:bg-white/5 rounded-lg relative border border-border-light dark:border-border-dark overflow-hidden">
                  {task.dueDate && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: task.status === "Completed" ? "100%" : "0%" }}
                      className={`absolute h-full rounded-lg flex items-center px-3 text-[8px] font-bold uppercase tracking-wider text-white ${
                        task.status === "Completed" ? "bg-google-green" : "bg-google-blue"
                      }`}
                      style={{ 
                        left: "10%", // Simplified for demo
                      }}
                    >
                      {task.status}
                    </motion.div>
                  )}
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="py-16 text-center text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest text-[10px]">
                No timeline data available
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedTask && (
          <TaskDetail 
            task={selectedTask} 
            onClose={() => setSelectedTaskId(null)} 
          />
        )}
      </AnimatePresence>

      {/* Task Modal */}
      <AnimatePresence>
        {isTaskModalOpen && (
          <div key="task-modal-root" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              key="task-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTaskModalOpen(false)}
              className="absolute inset-0 bg-slate-900/20 dark:bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              key="task-modal-content"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl shadow-2xl p-8 overflow-hidden"
            >
              <h2 className="text-2xl font-bold tracking-tight mb-1">Create Task</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Add a new task to this project.</p>
              
              <form onSubmit={handleCreateTask} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Task Title</label>
                  <input 
                    type="text" 
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-google-blue/50 outline-none text-slate-900 dark:text-white font-medium placeholder:text-slate-400"
                    placeholder="e.g. Design System Update"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Description</label>
                  <textarea 
                    rows={3}
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-google-blue/50 outline-none resize-none text-slate-900 dark:text-white font-medium placeholder:text-slate-400"
                    placeholder="Describe the task details..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Priority</label>
                    <select 
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-google-blue/50 outline-none text-slate-900 dark:text-white font-medium cursor-pointer"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Due Date</label>
                    <input 
                      type="date" 
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-google-blue/50 outline-none text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                </div>
                <div className="flex space-x-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsTaskModalOpen(false)}
                    className="flex-1 google-button-outline"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 google-button-primary"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invite Member Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div key="invite-modal-root" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              key="invite-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute inset-0 bg-slate-900/20 dark:bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              key="invite-modal-content"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl shadow-2xl p-8 overflow-hidden"
            >
              <h2 className="text-2xl font-bold tracking-tight mb-1">Invite Members</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Add collaborators to this project.</p>
              
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Project Code</label>
                  <div className="flex items-center bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl p-4 group hover:border-google-blue/30 transition-all">
                    <span className="flex-1 font-mono font-bold text-google-blue text-2xl tracking-widest uppercase">
                      {currentProject.projectCode}
                    </span>
                    <button 
                      onClick={copyToClipboard}
                      className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg text-slate-500 hover:text-google-blue transition-all"
                    >
                      {copied ? <Check size={20} className="text-google-green" /> : <Copy size={20} />}
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border-light dark:border-border-dark"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="bg-white dark:bg-surface-dark px-3 text-slate-400">Or invite via email</span>
                  </div>
                </div>

                <form onSubmit={handleInvite} className="space-y-4">
                  <input 
                    type="email" 
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-google-blue/50 outline-none text-slate-900 dark:text-white font-medium placeholder:text-slate-400"
                    placeholder="colleague@example.com"
                  />
                  <button 
                    type="submit"
                    className="w-full google-button-primary"
                  >
                    Send Invitation
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Project Settings Modal */}
      <AnimatePresence>
        {isSettingsModalOpen && (
          <div key="settings-modal-root" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              key="settings-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/20 dark:bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              key="settings-modal-content"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl shadow-2xl p-8 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Project Settings</h2>
                <button onClick={() => setIsSettingsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateProject} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Project Name</label>
                  <input 
                    type="text" 
                    required
                    value={editProject.name}
                    onChange={(e) => setEditProject({ ...editProject, name: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-google-blue/50 outline-none text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Description</label>
                  <textarea 
                    rows={3}
                    value={editProject.description}
                    onChange={(e) => setEditProject({ ...editProject, description: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-google-blue/50 outline-none resize-none text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Status</label>
                    <select 
                      value={editProject.status}
                      onChange={(e) => setEditProject({ ...editProject, status: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-google-blue/50 outline-none text-slate-900 dark:text-white font-medium cursor-pointer"
                    >
                      <option value="Active">Active</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Deadline</label>
                    <input 
                      type="date" 
                      value={editProject.deadline}
                      onChange={(e) => setEditProject({ ...editProject, deadline: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-google-blue/50 outline-none text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-border-light dark:border-border-dark flex flex-col space-y-4">
                  <button 
                    type="submit"
                    className="w-full google-button-primary"
                  >
                    Save Changes
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    className="w-full px-6 py-2 border border-google-red/20 text-google-red font-medium rounded-lg hover:bg-google-red/5 transition-all flex items-center justify-center"
                  >
                    <AlertCircle size={18} className="mr-2" />
                    Delete Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <div key="delete-confirm-modal-root" className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              key="delete-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="absolute inset-0 bg-slate-900/40 dark:bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              key="delete-content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white dark:bg-surface-dark border border-google-red/20 rounded-2xl shadow-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-google-red/10 text-google-red rounded-full flex items-center justify-center mx-auto mb-6 border border-google-red/20">
                <AlertCircle size={32} />
              </div>
              <h2 className="text-xl font-bold tracking-tight mb-2">Delete Project?</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">This action is irreversible. All project data and tasks will be permanently removed.</p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="flex-1 google-button-outline"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteProject}
                  className="flex-1 bg-google-red hover:bg-red-700 text-white font-medium px-6 py-2 rounded-lg transition-all shadow-sm"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetail;
