import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/index.ts";
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from "../store/slices/notificationSlice.ts";
import { 
  Bell, 
  CheckCircle2, 
  MessageSquare, 
  UserPlus, 
  Clock,
  MoreHorizontal,
  Check
} from "lucide-react";
import { motion } from "motion/react";

const Notifications: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, loading } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkRead = (id: string) => {
    dispatch(markNotificationRead(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead());
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "Task Assigned": return <CheckCircle2 className="text-google-green" size={24} />;
      case "Comment": return <MessageSquare className="text-google-blue" size={24} />;
      case "Project Invitation": return <UserPlus className="text-google-yellow" size={24} />;
      case "Deadline Reminder": return <Clock className="text-google-red" size={24} />;
      default: return <Bell className="text-slate-500" size={24} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight mb-1">Notifications</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Stay updated with your project activities.</p>
        </motion.div>
        <button 
          onClick={handleMarkAllRead}
          className="google-button-outline text-xs"
        >
          Mark all as read
        </button>
      </div>

      <div className="google-card overflow-hidden">
        {notifications.length > 0 ? (
          <div className="divide-y divide-border-light dark:divide-border-dark">
            {notifications.map((notification, idx) => (
              <motion.div 
                key={notification._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-6 flex items-start group transition-all ${notification.read ? "opacity-60" : "bg-google-blue/5 dark:bg-google-blue/10"}`}
              >
                <div className={`p-3 rounded-xl mr-5 border transition-all ${
                  notification.read ? "bg-surface-light dark:bg-white/5 border-border-light dark:border-border-dark" : "bg-white dark:bg-surface-dark border-google-blue/20 shadow-sm"
                }`}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-lg font-bold tracking-tight ${notification.read ? "text-slate-500" : ""}`}>
                      {notification.type}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">{notification.message}</p>
                  {!notification.read && (
                    <button 
                      onClick={() => handleMarkRead(notification._id)}
                      className="mt-4 flex items-center text-[10px] font-bold text-google-blue uppercase tracking-wider hover:underline transition-all"
                    >
                      <Check size={14} className="mr-1.5" />
                      Mark as read
                    </button>
                  )}
                </div>
                <button className="p-2 text-slate-400 hover:text-google-blue transition-all opacity-0 group-hover:opacity-100">
                  <MoreHorizontal size={18} />
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-surface-light dark:bg-white/5 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-border-light dark:border-border-dark">
              <Bell size={32} />
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-2">No Notifications</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Your activity stream is currently clear.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
