import { Project } from "../models/Project.ts";
import { Task } from "../models/Task.ts";
import { User } from "../models/User.ts";

export const getDashboardStats = async (req: any, res: any) => {
  try {
    const userId = req.user._id;

    // Projects count
    const activeProjectsCount = await Project.countDocuments({ 
      members: userId, 
      status: "Active" 
    });

    // Tasks stats
    const tasks = await Task.find({ 
      project: { $in: await Project.find({ members: userId }).distinct("_id") } 
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "Completed").length;
    const pendingTasks = tasks.filter(t => t.status !== "Completed").length;
    
    const now = new Date();
    const overdueTasks = tasks.filter(t => 
      t.status !== "Completed" && t.dueDate && new Date(t.dueDate) < now
    ).length;

    // Task distribution for Pie Chart
    const distribution = {
      todo: tasks.filter(t => t.status === "Todo").length,
      inProgress: tasks.filter(t => t.status === "In Progress").length,
      completed: completedTasks
    };

    // Weekly activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const weeklyTasks = await Task.find({
      project: { $in: await Project.find({ members: userId }).distinct("_id") },
      createdAt: { $gte: sevenDaysAgo }
    });

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyActivity = days.map(day => {
      const count = weeklyTasks.filter(t => {
        const d = new Date(t.createdAt);
        return days[d.getDay()] === day;
      }).length;
      return { name: day, tasks: count };
    });

    res.json({
      stats: {
        activeProjects: activeProjectsCount,
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks
      },
      distribution,
      weeklyActivity
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeamPerformance = async (req: any, res: any) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId).populate("members", "name avatar");
    if (!project) return res.status(404).json({ message: "Project not found" });

    const tasks = await Task.find({ project: projectId });

    const performance = project.members.map((member: any) => {
      const memberTasks = tasks.filter(t => t.assignedTo?.toString() === member._id.toString());
      const completed = memberTasks.filter(t => t.status === "Completed").length;
      return {
        name: member.name,
        avatar: member.avatar,
        total: memberTasks.length,
        completed,
        efficiency: memberTasks.length > 0 ? Math.round((completed / memberTasks.length) * 100) : 0
      };
    });

    res.json(performance);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPerformanceOverview = async (req: any, res: any) => {
  try {
    const userId = req.user._id;
    const projects = await Project.find({ members: userId }).populate("members", "name avatar");
    const projectIds = projects.map(p => p._id);
    const tasks = await Task.find({ project: { $in: projectIds } });

    // Overall stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "Completed").length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Project-wise performance
    const projectPerformance = projects.map(p => {
      const pTasks = tasks.filter(t => t.project.toString() === p._id.toString());
      const pCompleted = pTasks.filter(t => t.status === "Completed").length;
      return {
        name: p.name,
        total: pTasks.length,
        completed: pCompleted,
        rate: pTasks.length > 0 ? Math.round((pCompleted / pTasks.length) * 100) : 0
      };
    });

    // Member performance (aggregate across all projects)
    const memberMap = new Map();
    projects.forEach(p => {
      p.members.forEach((m: any) => {
        if (!memberMap.has(m._id.toString())) {
          memberMap.set(m._id.toString(), {
            id: m._id,
            name: m.name,
            avatar: m.avatar,
            total: 0,
            completed: 0
          });
        }
      });
    });

    tasks.forEach(t => {
      if (t.assignedTo) {
        const member = memberMap.get(t.assignedTo.toString());
        if (member) {
          member.total += 1;
          if (t.status === "Completed") member.completed += 1;
        }
      }
    });

    const memberPerformance = Array.from(memberMap.values()).map(m => ({
      ...m,
      efficiency: m.total > 0 ? Math.round((m.completed / m.total) * 100) : 0
    })).sort((a, b) => b.efficiency - a.efficiency);

    // Efficiency trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentTasks = tasks.filter(t => new Date(t.createdAt) >= thirtyDaysAgo);
    
    // Group by week or day? Let's do last 4 weeks
    const weeks = [3, 2, 1, 0].map(w => {
      const start = new Date();
      start.setDate(start.getDate() - (w + 1) * 7);
      const end = new Date();
      end.setDate(end.getDate() - w * 7);
      
      const wTasks = tasks.filter(t => {
        const d = new Date(t.createdAt);
        return d >= start && d < end;
      });
      const wCompleted = wTasks.filter(t => t.status === "Completed").length;
      return {
        name: `Week ${4-w}`,
        rate: wTasks.length > 0 ? Math.round((wCompleted / wTasks.length) * 100) : 0
      };
    });

    res.json({
      completionRate,
      totalTasks,
      completedTasks,
      projectPerformance,
      memberPerformance,
      efficiencyTrend: weeks
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
