import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, 
  Users, 
  Target, 
  CheckCircle2, 
  BarChart3, 
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell,
  PieChart,
  Pie
} from "recharts";
import api from "../services/api.ts";

interface PerformanceData {
  completionRate: number;
  totalTasks: number;
  completedTasks: number;
  projectPerformance: {
    name: string;
    total: number;
    completed: number;
    rate: number;
  }[];
  memberPerformance: {
    id: string;
    name: string;
    avatar: string;
    total: number;
    completed: number;
    efficiency: number;
  }[];
  efficiencyTrend: {
    name: string;
    rate: number;
  }[];
}

const Performance: React.FC = () => {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const response = await api.get("/dashboard/performance-overview");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching performance data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-google-blue"></div>
      </div>
    );
  }

  if (!data) return null;

  const COLORS = ["#4285F4", "#34A853", "#FBBC05", "#EA4335", "#8E44AD"];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Performance <span className="text-google-blue">Analytics</span></h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Real-time insights into team productivity and project progress.</p>
        </motion.div>
        
        <div className="flex items-center gap-3 bg-white dark:bg-surface-dark p-1.5 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
          <button className="px-4 py-2 bg-google-blue text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md">Last 30 Days</button>
          <button className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-xs font-bold uppercase tracking-wider transition-all">Last 90 Days</button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="google-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-google-blue/10 rounded-xl flex items-center justify-center text-google-blue">
              <Target size={20} />
            </div>
            <span className="flex items-center text-[10px] font-bold text-google-green bg-google-green/10 px-2 py-1 rounded-full">
              <ArrowUpRight size={12} className="mr-1" />
              +12%
            </span>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Completion Rate</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold">{data.completionRate}%</h3>
            <span className="text-xs text-slate-400 font-medium">vs last month</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${data.completionRate}%` }}
              className="h-full bg-google-blue"
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="google-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-google-green/10 rounded-xl flex items-center justify-center text-google-green">
              <CheckCircle2 size={20} />
            </div>
            <span className="flex items-center text-[10px] font-bold text-google-green bg-google-green/10 px-2 py-1 rounded-full">
              <ArrowUpRight size={12} className="mr-1" />
              +5%
            </span>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tasks Completed</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold">{data.completedTasks}</h3>
            <span className="text-xs text-slate-400 font-medium">/ {data.totalTasks} total</span>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-surface-dark bg-slate-200" />
              ))}
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">+8 others</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="google-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-google-yellow/10 rounded-xl flex items-center justify-center text-google-yellow">
              <TrendingUp size={20} />
            </div>
            <span className="flex items-center text-[10px] font-bold text-google-red bg-google-red/10 px-2 py-1 rounded-full">
              <ArrowDownRight size={12} className="mr-1" />
              -2%
            </span>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Avg. Efficiency</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold">84%</h3>
            <span className="text-xs text-slate-400 font-medium">team average</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span>Low: 62%</span>
            <span>High: 98%</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="google-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-google-red/10 rounded-xl flex items-center justify-center text-google-red">
              <Activity size={20} />
            </div>
            <span className="flex items-center text-[10px] font-bold text-google-green bg-google-green/10 px-2 py-1 rounded-full">
              Stable
            </span>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Active Projects</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold">{data.projectPerformance.length}</h3>
            <span className="text-xs text-slate-400 font-medium">current projects</span>
          </div>
          <div className="mt-4 flex gap-1">
            {data.projectPerformance.map((p, i) => (
              <div key={i} className="h-1.5 flex-1 bg-google-blue rounded-full opacity-60" style={{ opacity: 0.2 + (i * 0.2) }} />
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Efficiency Trend Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="google-card p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Efficiency <span className="text-google-blue">Trend</span></h2>
              <p className="text-sm text-slate-500 font-medium">Weekly completion rate percentage.</p>
            </div>
            <div className="p-2 bg-surface-light dark:bg-white/5 rounded-lg border border-border-light dark:border-border-dark">
              <TrendingUp size={18} className="text-google-blue" />
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.efficiencyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: 700
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#4285F4" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#4285F4', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Project Performance Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="google-card p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Project <span className="text-google-green">Progress</span></h2>
              <p className="text-sm text-slate-500 font-medium">Completion status by project.</p>
            </div>
            <div className="p-2 bg-surface-light dark:bg-white/5 rounded-lg border border-border-light dark:border-border-dark">
              <BarChart3 size={18} className="text-google-green" />
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.projectPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                  width={100}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="rate" radius={[0, 4, 4, 0]} barSize={20}>
                  {data.projectPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Team Member Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold tracking-tight flex items-center">
            <Users size={20} className="mr-2 text-google-blue" />
            Team Member Efficiency
          </h2>
          
          <div className="google-card overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-light dark:bg-white/[0.02] text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-border-light dark:border-border-dark">
                  <th className="px-8 py-5">Member</th>
                  <th className="px-8 py-5">Tasks</th>
                  <th className="px-8 py-5">Completed</th>
                  <th className="px-8 py-5">Efficiency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark">
                {data.memberPerformance.map((member, idx) => (
                  <tr key={member.id} className="hover:bg-surface-light dark:hover:bg-white/[0.01] transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center">
                        <img 
                          src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}&background=4285F4&color=fff&bold=true`} 
                          className="w-8 h-8 rounded-lg object-cover border border-border-light dark:border-border-dark"
                          alt={member.name}
                        />
                        <span className="ml-3 font-bold text-slate-900 dark:text-white group-hover:text-google-blue transition-colors">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{member.total}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-bold text-google-green">{member.completed}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 w-24 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              member.efficiency > 80 ? 'bg-google-green' : 
                              member.efficiency > 50 ? 'bg-google-yellow' : 'bg-google-red'
                            }`}
                            style={{ width: `${member.efficiency}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{member.efficiency}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight flex items-center">
            <PieChartIcon size={20} className="mr-2 text-google-yellow" />
            Task Distribution
          </h2>
          
          <div className="google-card p-8 flex flex-col items-center justify-center">
            <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Completed', value: data.completedTasks },
                      { name: 'Pending', value: data.totalTasks - data.completedTasks }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#34A853" />
                    <Cell fill="#f1f5f9" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full space-y-3 mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-google-green" />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Completed ({data.completionRate}%)</span>
                </div>
                <span className="text-xs font-bold">{data.completedTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-200" />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Remaining</span>
                </div>
                <span className="text-xs font-bold">{data.totalTasks - data.completedTasks}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;
