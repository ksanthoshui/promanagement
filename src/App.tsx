import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store/index.ts";
import { memberRemoved, projectUpdated, projectDeleted } from "./store/slices/projectSlice.ts";
import { taskCreated, taskUpdated, taskDeleted } from "./store/slices/taskSlice.ts";
import socketService from "./services/socket.ts";
import Layout from "./components/Layout.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Projects from "./pages/Projects.tsx";
import ProjectDetail from "./pages/ProjectDetail.tsx";
import MyTasks from "./pages/MyTasks.tsx";
import Profile from "./pages/Profile.tsx";
import Notifications from "./pages/Notifications.tsx";
import CalendarView from "./pages/CalendarView.tsx";
import Settings from "./pages/Settings.tsx";
import TaskList from "./pages/TaskList.tsx";
import Members from "./pages/Members.tsx";
import RolesPermissions from "./pages/RolesPermissions.tsx";
import Performance from "./pages/Performance.tsx";
import ProjectReports from "./pages/ProjectReports.tsx";
import TeamProductivity from "./pages/TeamProductivity.tsx";
import ChartsStatistics from "./pages/ChartsStatistics.tsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.tsx";
import ManageUsers from "./pages/Admin/ManageUsers.tsx";
import ManageProjects from "./pages/Admin/ManageProjects.tsx";
import SystemSettings from "./pages/Admin/SystemSettings.tsx";
import ActivityLogs from "./pages/Admin/ActivityLogs.tsx";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useSelector((state: RootState) => state.auth);
  if (!token) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
};

export default function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      const socket = socketService.connect();
      
      socket.on("member-removed", (data: { projectId: string, userId: string }) => {
        console.log("Real-time member removed:", data);
        dispatch(memberRemoved(data));
      });

      socket.on("project-updated", (project: any) => {
        console.log("Real-time project updated:", project);
        dispatch(projectUpdated(project));
      });

      socket.on("project-deleted", (projectId: string) => {
        console.log("Real-time project deleted:", projectId);
        dispatch(projectDeleted(projectId));
      });

      socket.on("task-created", (task: any) => {
        dispatch(taskCreated(task));
      });

      socket.on("task-updated", (task: any) => {
        dispatch(taskUpdated(task));
      });

      socket.on("task-deleted", (data: { taskId: string, projectId: string }) => {
        dispatch(taskDeleted(data.taskId));
      });

      return () => {
        socketService.disconnect();
      };
    }
  }, [token, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><MyTasks /></ProtectedRoute>} />
        <Route path="/task-list" element={<ProtectedRoute><TaskList /></ProtectedRoute>} />
        <Route path="/members" element={<ProtectedRoute><Members /></ProtectedRoute>} />
        <Route path="/roles" element={<ProtectedRoute><RolesPermissions /></ProtectedRoute>} />
        <Route path="/performance" element={<ProtectedRoute><Performance /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        
        {/* Reports & Analytics */}
        <Route path="/reports/projects" element={<ProtectedRoute><ProjectReports /></ProtectedRoute>} />
        <Route path="/reports/productivity" element={<ProtectedRoute><TeamProductivity /></ProtectedRoute>} />
        <Route path="/statistics" element={<ProtectedRoute><ChartsStatistics /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><ManageUsers /></ProtectedRoute>} />
        <Route path="/admin/projects" element={<ProtectedRoute><ManageProjects /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><SystemSettings /></ProtectedRoute>} />
        <Route path="/admin/logs" element={<ProtectedRoute><ActivityLogs /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
