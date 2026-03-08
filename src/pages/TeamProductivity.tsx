import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/index.ts";
import { motion } from "motion/react";
import Counter from "../components/Counter.tsx";
import { 
  Users, 
  Zap, 
  Target, 
  Award, 
  TrendingUp, 
  Clock,
  ChevronRight,
  Star
} from "lucide-react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

const TeamProductivity: React.FC = () => {
  const { projects } = useSelector((state: RootState) => state.projects);
  const { tasks } = useSelector((state: RootState) => state.tasks);

  // Extract unique members
  const allMembers = Array.from(new Set(projects.flatMap(p => p.members || []).map(m => m._id)))
    .map(id => projects.flatMap(p => p.members || []).find(m => m._id === id))
    .filter(Boolean);

  const memberStats = allMembers.map(member => {
    const memberTasks = tasks.filter(t => t.assignedTo?._id === member?._id || t.assignedTo === member?._id);
    const completed = memberTasks.filter(t => t.status === "Completed").length;
    const productivity = memberTasks.length > 0 ? Math.round((completed / memberTasks.length) * 100) : 0;
    
    return {
      name: member?.name,
      role: member?.role,
      tasks: memberTasks.length,
      completed,
      productivity,
      avatar: member?.avatar
    };
  });

  const radarData = [
    { subject: 'Speed', A: 120, fullMark: 150 },
    { subject: 'Quality', A: 98, fullMark: 150 },
    { subject: 'Reliability', A: 86, fullMark: 150 },
    { subject: 'Teamwork', A: 99, fullMark: 150 },
    { subject: 'Innovation', A: 85, fullMark: 150 },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Team Productivity</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Analyze team performance and individual contributions.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Productivity Radar */}
        <div className="google-card p-8">
          <h3 className="text-xl font-bold tracking-tight mb-8 flex items-center">
            <Zap size={20} className="mr-3 text-google-yellow" />
            Overall Competency
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar name="Team" dataKey="A" stroke="#708238" fill="#708238" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performers */}
        <div className="lg:col-span-2 google-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold tracking-tight flex items-center">
              <Award size={20} className="mr-3 text-google-blue" />
              Top Performers
            </h3>
            <button className="text-xs font-bold text-google-blue hover:underline">View Rankings</button>
          </div>
          <div className="space-y-6">
            {memberStats.sort((a, b) => b.productivity - a.productivity).slice(0, 4).map((m, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-surface-light dark:bg-white/5 rounded-2xl border border-border-light dark:border-border-dark group hover:border-google-blue/30 transition-all">
                <div className="flex items-center">
                  <div className="relative">
                    <img 
                      src={m.avatar || `https://ui-avatars.com/api/?name=${m.name}&background=708238&color=fff&bold=true`} 
                      className="w-12 h-12 rounded-xl object-cover border border-border-light dark:border-border-dark"
                      alt={m.name || "Member"}
                    />
                    {i === 0 && <Star size={16} className="absolute -top-2 -right-2 text-google-yellow fill-google-yellow" />}
                  </div>
                  <div className="ml-4">
                    <p className="font-bold text-slate-900 dark:text-white group-hover:text-google-blue transition-colors">{m.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{m.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-google-blue">
                    <Counter value={m.productivity} suffix="%" />
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Efficiency</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="google-card p-8">
        <h3 className="text-xl font-bold tracking-tight mb-8 flex items-center">
          <TrendingUp size={20} className="mr-3 text-google-green" />
          Team Activity Trend
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
              { name: 'Mon', activity: 40 },
              { name: 'Tue', activity: 60 },
              { name: 'Wed', activity: 45 },
              { name: 'Thu', activity: 90 },
              { name: 'Fri', activity: 65 },
              { name: 'Sat', activity: 30 },
              { name: 'Sun', activity: 20 },
            ]}>
              <defs>
                <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#708238" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#708238" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="activity" stroke="#708238" strokeWidth={3} fillOpacity={1} fill="url(#colorActivity)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TeamProductivity;
