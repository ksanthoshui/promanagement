import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useSelector } from "react-redux";
import { RootState } from "../store/index.ts";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Clock, MapPin, User } from "lucide-react";

const CalendarView: React.FC = () => {
  const [date, setDate] = useState<any>(new Date());
  const { tasks } = useSelector((state: RootState) => state.tasks);

  // Get tasks for the selected date
  const selectedDateTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    return (
      taskDate.getDate() === date.getDate() &&
      taskDate.getMonth() === date.getMonth() &&
      taskDate.getFullYear() === date.getFullYear()
    );
  });

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight mb-1">Calendar View</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Keep track of your deadlines and project milestones.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Card */}
        <div className="lg:col-span-2">
          <div className="google-card p-6">
            <Calendar 
              onChange={setDate} 
              value={date}
              className="w-full border-none font-sans"
              tileClassName={({ date: tileDate, view }) => {
                if (view === 'month') {
                  const hasTask = tasks.some(task => {
                    if (!task.dueDate) return false;
                    const taskDate = new Date(task.dueDate);
                    return (
                      taskDate.getDate() === tileDate.getDate() &&
                      taskDate.getMonth() === tileDate.getMonth() &&
                      taskDate.getFullYear() === tileDate.getFullYear()
                    );
                  });
                  return hasTask ? "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-google-blue after:rounded-full" : "";
                }
                return null;
              }}
            />
          </div>
        </div>

        {/* Tasks for Selected Date */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold tracking-tight">
              {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </h3>
            <span className="text-[10px] font-bold text-google-blue bg-google-blue/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
              {selectedDateTasks.length} Tasks
            </span>
          </div>

          <div className="space-y-4">
            {selectedDateTasks.length > 0 ? (
              selectedDateTasks.map((task, idx) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl hover:border-google-blue/30 transition-all group cursor-pointer"
                >
                  <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-google-blue transition-colors mb-2">{task.title}</h4>
                  <div className="flex items-center space-x-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <span className="flex items-center">
                      <Clock size={12} className="mr-1 text-google-blue" />
                      {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="flex items-center">
                      <User size={12} className="mr-1 text-google-blue" />
                      {task.assignedTo?.name || "Unassigned"}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-12 text-center border-2 border-dashed border-border-light dark:border-border-dark rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No tasks scheduled</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .react-calendar {
          background: transparent;
          border: none;
          width: 100% !important;
        }
        .react-calendar__navigation button {
          color: #708238;
          font-weight: bold;
          font-size: 1.2rem;
        }
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: rgba(112, 130, 56, 0.1);
          border-radius: 12px;
        }
        .react-calendar__month-view__weekdays {
          font-weight: bold;
          text-transform: uppercase;
          font-size: 0.7rem;
          color: #94a3b8;
          margin-bottom: 1rem;
        }
        .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
        }
        .react-calendar__tile {
          padding: 1.5rem 0.5rem;
          font-weight: 600;
          border-radius: 12px;
          transition: all 0.2s;
          color: #475569;
        }
        .dark .react-calendar__tile {
          color: #e2e8f0;
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: rgba(112, 130, 56, 0.1);
          color: #708238;
        }
        .react-calendar__tile--now {
          background: rgba(112, 130, 56, 0.05) !important;
          color: #708238 !important;
          border: 1px solid rgba(112, 130, 56, 0.2);
        }
        .react-calendar__tile--active {
          background: #708238 !important;
          color: white !important;
          box-shadow: 0 4px 12px rgba(112, 130, 56, 0.3);
        }
        .react-calendar__tile--active:enabled:hover,
        .react-calendar__tile--active:enabled:focus {
          background: #708238 !important;
        }
      `}</style>
    </div>
  );
};

export default CalendarView;
