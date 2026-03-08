import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/index.ts";
import { motion } from "motion/react";
import Counter from "../components/Counter.tsx";
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap
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
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";

const ChartsStatistics: React.FC = () => {
  const { projects } = useSelector((state: RootState) => state.projects);
  const { tasks } = useSelector((state: RootState) => state.tasks);

  const statusData = [
    { name: 'Completed', value: tasks.filter(t => t.status === "Completed").length },
    { name: 'In Progress', value: tasks.filter(t => t.status === "In Progress").length },
    { name: 'Todo', value: tasks.filter(t => t.status === "Todo").length },
  ];

  const COLORS = ["#708238", "#f9ab00", "#4285f4"];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Charts & Statistics</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Visual representation of your workspace data and trends.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Tasks", value: tasks.length, trend: "+12%", up: true, icon: BarChart3, color: "text-google-blue", suffix: "" },
          { label: "Completion Rate", value: 68, trend: "+5%", up: true, icon: Target, color: "text-google-green", suffix: "%" },
          { label: "Active Projects", value: projects.length, trend: "0%", up: true, icon: Zap, color: "text-google-yellow", suffix: "" },
          { label: "Avg. Velocity", value: 4.2, trend: "-2%", up: false, icon: Activity, color: "text-google-red", suffix: "", decimals: 1 },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="google-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-surface-light dark:bg-white/5 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div className={`flex items-center text-[10px] font-bold ${stat.up ? 'text-google-green' : 'text-google-red'}`}>
                {stat.up ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                {stat.trend}
              </div>
            </div>
            <h4 className="text-2xl font-bold tracking-tight mb-1">
              <Counter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
            </h4>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Task Distribution */}
        <div className="google-card p-8">
          <h3 className="text-xl font-bold tracking-tight mb-8 flex items-center">
            <PieChartIcon size={20} className="mr-3 text-google-blue" />
            Task Distribution
          </h3>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                <Counter value={tasks.length} />
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-8">
            {statusData.map((s, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{s.name}</span>
                </div>
                <p className="text-lg font-bold">
                  <Counter value={s.value} />
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Performance */}
        <div className="google-card p-8">
          <h3 className="text-xl font-bold tracking-tight mb-8 flex items-center">
            <LineChartIcon size={20} className="mr-3 text-google-green" />
            Weekly Performance
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { name: 'W1', performance: 45 },
                { name: 'W2', performance: 52 },
                { name: 'W3', performance: 48 },
                { name: 'W4', performance: 70 },
                { name: 'W5', performance: 65 },
                { name: 'W6', performance: 85 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Line type="monotone" dataKey="performance" stroke="#708238" strokeWidth={3} dot={{ r: 6, fill: '#708238', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsStatistics;
