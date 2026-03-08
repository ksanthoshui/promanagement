import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/index.ts";
import { 
  addComment, 
  addSubtask, 
  toggleSubtask, 
  uploadAttachment,
  updateTaskStatus
} from "../store/slices/taskSlice.ts";
import { 
  X, 
  MessageSquare, 
  CheckSquare, 
  Paperclip, 
  Plus, 
  Send,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { motion } from "motion/react";

interface TaskDetailProps {
  task: any;
  onClose: () => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [comment, setComment] = useState("");
  const [subtaskTitle, setSubtaskTitle] = useState("");

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      dispatch(addComment({ id: task._id, text: comment }));
      setComment("");
    }
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (subtaskTitle.trim()) {
      dispatch(addSubtask({ id: task._id, title: subtaskTitle }));
      setSubtaskTitle("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      dispatch(uploadAttachment({ id: task._id, file }));
    }
  };

  const handleStatusChange = (status: string) => {
    dispatch(updateTaskStatus({ id: task._id, status }));
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/20 dark:bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-border-light dark:border-border-dark flex items-center justify-between bg-surface-light dark:bg-white/[0.02]">
          <div className="flex items-center space-x-4 sm:space-x-6">
            <div className={`p-3 rounded-xl border ${
              task.status === "Completed" ? "bg-google-green/10 text-google-green border-google-green/20" : 
              task.status === "In Progress" ? "bg-google-yellow/10 text-google-yellow border-google-yellow/20" : "bg-google-blue/10 text-google-blue border-google-blue/20"
            }`}>
              {task.status === "Completed" ? <CheckCircle2 size={24} /> : 
               task.status === "In Progress" ? <Clock size={24} /> : <AlertCircle size={24} />}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-0.5">{task.title}</h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Project: <span className="text-google-blue">{task.project.name}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 custom-scrollbar">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <section>
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4 ml-1">Description</h3>
              <div className="bg-surface-light dark:bg-white/[0.02] border border-border-light dark:border-border-dark p-6 rounded-xl">
                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  {task.description || "No description provided for this task."}
                </p>
              </div>
            </section>

            {/* Subtasks */}
            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Subtasks</h3>
                {task.subtasks?.length > 0 && (
                  <span className="text-[10px] font-bold text-google-green bg-google-green/10 border border-google-green/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {task.progress}% Done
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {task.subtasks?.map((sub: any) => (
                  <div 
                    key={sub._id} 
                    className="flex items-center p-4 bg-surface-light dark:bg-white/[0.02] border border-border-light dark:border-border-dark rounded-xl hover:border-google-blue/30 transition-all group"
                  >
                    <button 
                      onClick={() => dispatch(toggleSubtask({ id: task._id, subtaskId: sub._id }))}
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                        sub.completed ? "bg-google-green border-google-green text-white" : "border-slate-200 dark:border-white/10 text-transparent hover:border-google-blue/50"
                      }`}
                    >
                      <CheckSquare size={14} />
                    </button>
                    <span className={`ml-4 text-sm font-medium ${sub.completed ? "text-slate-400 dark:text-slate-600 line-through" : "text-slate-900 dark:text-slate-300"}`}>
                      {sub.title}
                    </span>
                  </div>
                ))}
                <form onSubmit={handleAddSubtask} className="flex items-center mt-4">
                  <input 
                    type="text"
                    value={subtaskTitle}
                    onChange={(e) => setSubtaskTitle(e.target.value)}
                    placeholder="Add a subtask..."
                    className="flex-1 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-google-blue/50 text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                  <button type="submit" className="ml-3 p-3 bg-google-blue text-white rounded-xl hover:bg-[#5a6a2d] transition-all shadow-sm">
                    <Plus size={20} />
                  </button>
                </form>
              </div>
            </section>

            {/* Comments */}
            <section>
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-6 ml-1">Comments</h3>
              <div className="space-y-6 mb-8">
                {task.comments?.map((c: any) => (
                  <div key={c._id} className="flex space-x-4">
                    <img 
                      src={c.user.avatar || `https://ui-avatars.com/api/?name=${c.user.name}&background=708238&color=fff&bold=true`} 
                      className="w-10 h-10 rounded-full border border-border-light dark:border-border-dark"
                      alt={c.user.name}
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 bg-surface-light dark:bg-white/[0.02] border border-border-light dark:border-border-dark p-4 rounded-xl">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{c.user.name}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddComment} className="flex items-start space-x-4">
                <img 
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=708238&color=fff&bold=true`} 
                  className="w-10 h-10 rounded-full border border-border-light dark:border-border-dark"
                  alt="My Avatar"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 relative">
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows={3}
                    className="w-full bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-google-blue/50 resize-none text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                  <button 
                    type="submit" 
                    className="absolute right-3 bottom-3 p-2 bg-google-blue text-white rounded-lg hover:bg-[#5a6a2d] transition-all shadow-sm"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </section>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-10">
            {/* Status Selector */}
            <section>
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4 ml-1">Status</h3>
              <div className="grid grid-cols-1 gap-2">
                {["Todo", "In Progress", "Completed"].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all text-left flex items-center justify-between group ${
                      task.status === s 
                        ? "bg-google-blue/10 border-google-blue/50 text-google-blue" 
                        : "bg-surface-light dark:bg-white/5 border-border-light dark:border-border-dark text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-white/10"
                    }`}
                  >
                    {s}
                    {task.status === s && <CheckCircle2 size={16} />}
                  </button>
                ))}
              </div>
            </section>

            {/* Assignee */}
            <section>
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4 ml-1">Assignee</h3>
              <div className="flex items-center p-4 bg-surface-light dark:bg-white/[0.02] border border-border-light dark:border-border-dark rounded-xl">
                <img 
                  src={task.assignedTo?.avatar || `https://ui-avatars.com/api/?name=${task.assignedTo?.name || "Unassigned"}&background=708238&color=fff&bold=true`} 
                  className="w-12 h-12 rounded-full border border-border-light dark:border-border-dark"
                  alt="Assignee"
                  referrerPolicy="no-referrer"
                />
                <div className="ml-4">
                  <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{task.assignedTo?.name || "Unassigned"}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">{task.assignedTo?.role || "Team Member"}</p>
                </div>
              </div>
            </section>

            {/* Attachments */}
            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Attachments</h3>
                <label className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-google-blue rounded-lg cursor-pointer transition-all">
                  <Plus size={18} />
                  <input type="file" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
              <div className="space-y-3">
                {task.attachments?.map((file: any) => (
                  <div key={file._id} className="flex items-center justify-between p-3 bg-surface-light dark:bg-white/[0.02] border border-border-light dark:border-border-dark rounded-xl group hover:border-google-blue/30 transition-all">
                    <div className="flex items-center min-w-0">
                      <Paperclip size={14} className="text-google-blue mr-3 shrink-0" />
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate tracking-tight">{file.name}</span>
                    </div>
                    <a 
                      href={file.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
                    >
                      <Download size={16} />
                    </a>
                  </div>
                ))}
                {(!task.attachments || task.attachments.length === 0) && (
                  <div className="py-6 text-center border border-dashed border-border-light dark:border-border-dark rounded-xl">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">No attachments</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskDetail;
