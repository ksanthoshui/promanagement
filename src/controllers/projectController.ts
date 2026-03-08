import { Project } from "../models/Project.ts";
import { User } from "../models/User.ts";
import { Task } from "../models/Task.ts";
import { Notification } from "../models/Notification.ts";
import { sendEmail } from "../utils/emailService.ts";
import crypto from "crypto";

const generateProjectCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  const length = Math.floor(Math.random() * 3) + 6; // 6, 7, or 8
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const createProject = async (req: any, res: any) => {
  try {
    const { name, description, deadline } = req.body;
    
    let projectCode: string = "";
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      projectCode = generateProjectCode();
      const existingProject = await Project.findOne({ projectCode });
      if (!existingProject) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new Error("Failed to generate a unique project code. Please try again.");
    }
    
    const project = new Project({
      name,
      description,
      deadline,
      projectCode,
      owner: req.user._id,
      members: [req.user._id],
    });

    await project.save();
    console.log("Project saved with code:", project.projectCode);
    res.status(201).json(project);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const inviteMember = async (req: any, res: any) => {
  try {
    const { email, projectId } = req.body;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // In a real app, we'd check if user exists, if not send a different email
    const user = await User.findOne({ email });
    
    const inviteLink = `${process.env.APP_URL}/projects/join?code=${project.projectCode}`;
    const html = `
      <h1>Project Invitation</h1>
      <p>You have been invited to join the project: <strong>${project.name}</strong></p>
      <p>Use the code below to join:</p>
      <h2 style="background: #f4f4f4; padding: 10px; display: inline-block;">${project.projectCode}</h2>
      <br/>
      <a href="${inviteLink}" style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Join Project</a>
    `;

    await sendEmail(email, `Invitation to join ${project.name}`, html);

    if (user) {
      if (!project.members.includes(user._id)) {
        project.members.push(user._id);
        await project.save();
        
        const io = req.app.get("io");
        if (io) {
          const populatedProject = await Project.findById(project._id)
            .populate("owner", "name email avatar")
            .populate("members", "name email avatar");
          io.to(project._id.toString()).emit("project-updated", populatedProject);
        }
      }

      const notification = new Notification({
        recipient: user._id,
        sender: req.user._id,
        type: "Project Invitation",
        message: `You have been added to project: ${project.name}`,
        link: `/projects/${project._id}`,
      });
      await notification.save();
    }

    res.json({ message: "Invitation sent successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjects = async (req: any, res: any) => {
  try {
    const projects = await Project.find({ members: req.user._id })
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar")
      .lean();
    
    const projectIds = projects.map(p => p._id);
    const tasks = await Task.find({ project: { $in: projectIds } });

    const projectsWithProgress = projects.map(p => {
      const pTasks = tasks.filter(t => t.project.toString() === p._id.toString());
      const completed = pTasks.filter(t => t.status === "Completed").length;
      const progress = pTasks.length > 0 ? Math.round((completed / pTasks.length) * 100) : 0;
      return { ...p, progress };
    });

    res.json(projectsWithProgress);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req: any, res: any) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar")
      .lean();
    
    if (!project) return res.status(404).json({ message: "Project not found" });
    
    const tasks = await Task.find({ project: project._id });
    const completed = tasks.filter(t => t.status === "Completed").length;
    const progress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

    res.json({ ...project, progress });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const joinProject = async (req: any, res: any) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: "Project code is required" });

    const project = await Project.findOne({ projectCode: code.toUpperCase() });
    if (!project) return res.status(404).json({ message: "Invalid project code" });

    if (project.members.includes(req.user._id)) {
      return res.status(400).json({ message: "Already a member of this project" });
    }

    project.members.push(req.user._id);
    await project.save();
    console.log("Joined project code:", project.projectCode);

    const io = req.app.get("io");
    if (io) {
      const populatedProject = await Project.findById(project._id)
        .populate("owner", "name email avatar")
        .populate("members", "name email avatar");
      io.to(project._id.toString()).emit("project-updated", populatedProject);
    }

    res.json(project);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req: any, res: any) => {
  try {
    const { name, description, deadline, status } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() !== req.user._id.toString() && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Unauthorized to update this project" });
    }

    if (name) project.name = name;
    if (description) project.description = description;
    if (deadline) project.deadline = deadline;
    if (status) project.status = status;

    await project.save();
    console.log("Updated project code:", project.projectCode);
    
    const io = req.app.get("io");
    if (io) {
      io.to(project._id.toString()).emit("project-updated", project);
    }
    
    res.json(project);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req: any, res: any) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() !== req.user._id.toString() && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Unauthorized to delete this project" });
    }

    const io = req.app.get("io");
    if (io) {
      io.to(project._id.toString()).emit("project-deleted", project._id);
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const removeMember = async (req: any, res: any) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() !== req.user._id.toString() && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Unauthorized to remove members" });
    }

    project.members = project.members.filter((m: any) => m.toString() !== userId);
    await project.save();
    console.log("Removed member, project code:", project.projectCode);
    
    // Emit socket event
    const io = req.app.get("io");
    if (io) {
      io.emit("member-removed", { projectId: project._id, userId });
    }
    
    res.json(project);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
