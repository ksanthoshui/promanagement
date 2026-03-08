import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/index.ts";
import { motion } from "motion/react";
import Counter from "../components/Counter.tsx";
import { 
  FileText, 
  Download, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Calendar,
  ChevronRight,
  Filter
} from "lucide-react";
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

const ProjectReports: React.FC = () => {
  const { projects } = useSelector((state: RootState) => state.projects);
  const { tasks } = useSelector((state: RootState) => state.tasks);

  const projectStats = projects.map(project => {
    const projectTasks = tasks.filter(t => t.project === project._id || t.project?._id === project._id);
    const completed = projectTasks.filter(t => t.status === "Completed").length;
    const progress = projectTasks.length > 0 ? Math.round((completed / projectTasks.length) * 100) : 0;
    
    return {
      name: project.name,
      tasks: projectTasks.length,
      completed,
      progress,
      status: project.status
    };
  });

  const COLORS = ["#708238", "#f9ab00", "#ea4335", "#4285f4"];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Project Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Detailed insights and performance metrics for your projects.</p>
        </motion.div>
        <div className="flex items-center space-x-3">
          <button className="px-5 py-2.5 bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-google-blue/10 hover:text-google-blue transition-all flex items-center">
            <Filter size={16} className="mr-2" />
            Filter
          </button>
          <button className="google-button-primary flex items-center">
            <Download size={18} className="mr-2" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Completion Chart */}
        <div className="lg:col-span-2 google-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold tracking-tight">Project Completion Status</h3>
            <TrendingUp size={20} className="text-google-green" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  cursor={{ fill: 'rgba(112, 130, 56, 0.05)' }}
                />
                <Bar dataKey="progress" fill="#708238" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="google-card p-6 bg-google-blue/5 border-google-blue/20">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-google-blue/10 text-google-blue rounded-xl">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Completed</p>
                <h4 className="text-2xl font-bold tracking-tight">
                  <Counter value={projectStats.reduce((acc, curr) => acc + curr.completed, 0)} suffix=" Tasks" />
                </h4>
              </div>
            </div>
            <div className="w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-google-blue h-full" style={{ width: '65%' }} />
            </div>
          </div>

          <div className="google-card p-6">
            <h4 className="text-sm font-bold tracking-tight mb-4">Project Health</h4>
            <div className="space-y-4">
              {projectStats.slice(0, 3).map((p, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${p.progress > 70 ? 'bg-google-green' : p.progress > 30 ? 'bg-google-yellow' : 'bg-google-red'}`} />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{p.name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    <Counter value={p.progress} suffix="%" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="google-card overflow-hidden">
        <div className="p-6 border-b border-border-light dark:border-border-dark flex items-center justify-between">
          <h3 className="text-lg font-bold tracking-tight">Detailed Project Metrics</h3>
          <button className="text-xs font-bold text-google-blue hover:underline flex items-center">
            View All
            <ChevronRight size={14} className="ml-1" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-light dark:bg-white/[0.02] text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-8 py-4">Project Name</th>
                <th className="px-8 py-4">Total Tasks</th>
                <th className="px-8 py-4">Completed</th>
                <th className="px-8 py-4">Efficiency</th>
                <th className="px-8 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {projectStats.map((p, i) => (
                <tr key={i} className="hover:bg-surface-light dark:hover:bg-white/[0.01] transition-all">
                  <td className="px-8 py-5 font-bold text-slate-900 dark:text-white">{p.name}</td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-600 dark:text-slate-400">{p.tasks}</td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-600 dark:text-slate-400">{p.completed}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center">
                      <div className="flex-1 bg-slate-200 dark:bg-white/10 h-1.5 rounded-full mr-3 max-w-[100px]">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${p.progress}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="bg-google-blue h-full" 
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-500">
                        <Counter value={p.progress} suffix="%" />
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-google-green/10 text-google-green border border-google-green/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {p.status || "Active"}
                    </span>
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

export default ProjectReports;
