import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/index.ts";
import { logout } from "../store/slices/authSlice.ts";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Briefcase, 
  Bell, 
  TrendingUp,
  User, 
  Users,
  LogOut, 
  Menu, 
  X,
  PlusCircle,
  Search,
  CheckSquare,
  ListTodo,
  Shield,
  Moon,
  Sun,
  ShieldAlert,
  Settings as SettingsIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications } = useSelector((state: RootState) => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [sidebarWidth, setSidebarWidth] = React.useState(280);
  const [isResizing, setIsResizing] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [theme, setTheme] = React.useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "dark"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const startResizing = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = React.useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = React.useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth > 200 && newWidth < 480) {
        setSidebarWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
      document.body.style.cursor = "col-resize";
    } else {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      document.body.style.cursor = "default";
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      document.body.style.cursor = "default";
    };
  }, [isResizing, resize, stopResizing]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Projects", path: "/projects", icon: Briefcase },
    { name: "Task List", path: "/task-list", icon: ListTodo },
    { name: "My Tasks", path: "/tasks", icon: CheckSquare },
    { name: "Members", path: "/members", icon: User },
    { name: "Roles & Permissions", path: "/roles", icon: Shield },
    { name: "Performance", path: "/performance", icon: TrendingUp },
    { name: "Calendar", path: "/calendar", icon: Bell },
  ];

  const reportItems = [
    { name: "Project Reports", path: "/reports/projects", icon: Briefcase },
    { name: "Team Productivity", path: "/reports/productivity", icon: User },
    { name: "Statistics", path: "/statistics", icon: LayoutDashboard },
  ];

  const adminItems = [
    { name: "Admin Panel", path: "/admin", icon: ShieldAlert },
  ];

  const generalItems = [
    { name: "Settings", path: "/settings", icon: SettingsIcon },
  ];

  return (
    <div className="h-screen bg-bg-light dark:bg-bg-dark text-[#202124] dark:text-[#e8eaed] flex relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="bg-blob bg-google-blue/10 top-[-10%] left-[-10%]" />
      <div className="bg-blob bg-google-red/10 bottom-[-10%] right-[-10%] animation-delay-2000" />
      <div className="bg-blob bg-google-yellow/5 top-[40%] left-[30%] animation-delay-4000" />

      <aside 
        style={{ width: isSidebarOpen ? sidebarWidth : 80 }}
        className={`hidden md:flex flex-col bg-white dark:bg-surface-dark border-r border-border-light dark:border-border-dark z-30 relative group/sidebar h-full ${
          isResizing ? "" : "transition-[width] duration-300 ease-in-out"
        }`}
      >
        {/* Sidebar Header - Fixed at top */}
        <div className={`h-20 flex items-center px-6 border-b border-transparent ${isSidebarOpen ? "justify-between" : "justify-center"}`}>
          <AnimatePresence mode="wait">
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center whitespace-nowrap"
              >
                <div className="flex -space-x-1 mr-2">
                  <div className="w-2 h-2 rounded-full bg-google-blue" />
                  <div className="w-2 h-2 rounded-full bg-google-red" />
                  <div className="w-2 h-2 rounded-full bg-google-yellow" />
                  <div className="w-2 h-2 rounded-full bg-google-green" />
                </div>
                PRO<span className="text-google-blue">MANAGE</span>
              </motion.span>
            )}
          </AnimatePresence>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 hover:bg-surface-light dark:hover:bg-white/5 rounded-full transition-all text-slate-500 dark:text-slate-400 hover:text-google-blue ${!isSidebarOpen ? "" : ""}`}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-4">
          <nav className="px-3 space-y-1">
            {isSidebarOpen && <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-2">Main</p>}
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center p-3 rounded-xl transition-all group relative overflow-hidden ${
                      isActive
                        ? "bg-google-blue/10 text-google-blue"
                        : "text-slate-600 dark:text-slate-400 hover:bg-surface-light dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-100"
                    } ${!isSidebarOpen ? "justify-center px-0" : ""}`}
                  >
                  <div className={`flex items-center justify-center ${!isSidebarOpen ? "w-full" : "w-5"}`}>
                    <item.icon size={20} className={`${isActive ? "text-google-blue" : "group-hover:scale-110 transition-transform"}`} />
                  </div>
                  {isSidebarOpen && (
                    <span className={`ml-4 font-medium tracking-tight transition-opacity duration-300 whitespace-nowrap ${isActive ? "font-bold" : ""}`}>
                      {item.name}
                    </span>
                  )}
                  </Link>
                );
              })}
            </nav>

            <nav className="px-3 space-y-1 mt-8">
              {isSidebarOpen && <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Reports</p>}
              {reportItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center p-3 rounded-xl transition-all group relative overflow-hidden ${
                        isActive
                          ? "bg-google-blue/10 text-google-blue"
                          : "text-slate-600 dark:text-slate-400 hover:bg-surface-light dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-100"
                      } ${!isSidebarOpen ? "justify-center px-0" : ""}`}
                    >
                    <div className={`flex items-center justify-center ${!isSidebarOpen ? "w-full" : "w-5"}`}>
                      <item.icon size={20} className={`${isActive ? "text-google-blue" : "group-hover:scale-110 transition-transform"}`} />
                    </div>
                    {isSidebarOpen && (
                      <span className={`ml-4 font-medium tracking-tight transition-opacity duration-300 whitespace-nowrap ${isActive ? "font-bold" : ""}`}>
                        {item.name}
                      </span>
                    )}
                    </Link>
                  );
                })}
            </nav>

            {user?.role === "Admin" && (
              <nav className="px-3 space-y-1 mt-8">
                {isSidebarOpen && <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Admin</p>}
                {adminItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center p-3 rounded-xl transition-all group relative overflow-hidden ${
                          isActive
                            ? "bg-google-blue/10 text-google-blue"
                            : "text-slate-600 dark:text-slate-400 hover:bg-surface-light dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-100"
                        } ${!isSidebarOpen ? "justify-center px-0" : ""}`}
                      >
                      <div className={`flex items-center justify-center ${!isSidebarOpen ? "w-full" : "w-5"}`}>
                        <item.icon size={20} className={`${isActive ? "text-google-blue" : "group-hover:scale-110 transition-transform"}`} />
                      </div>
                      {isSidebarOpen && (
                        <span className={`ml-4 font-medium tracking-tight transition-opacity duration-300 whitespace-nowrap ${isActive ? "font-bold" : ""}`}>
                          {item.name}
                        </span>
                      )}
                      </Link>
                    );
                  })}
              </nav>
            )}

            <nav className="px-3 space-y-1 mt-8">
              {isSidebarOpen && <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">General</p>}
              {generalItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center p-3 rounded-xl transition-all group relative overflow-hidden ${
                        isActive
                          ? "bg-google-blue/10 text-google-blue"
                          : "text-slate-600 dark:text-slate-400 hover:bg-surface-light dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-100"
                      } ${!isSidebarOpen ? "justify-center px-0" : ""}`}
                    >
                    <div className={`flex items-center justify-center ${!isSidebarOpen ? "w-full" : "w-5"}`}>
                      <item.icon size={20} className={`${isActive ? "text-google-blue" : "group-hover:scale-110 transition-transform"}`} />
                    </div>
                    {isSidebarOpen && (
                      <span className={`ml-4 font-medium tracking-tight transition-opacity duration-300 whitespace-nowrap ${isActive ? "font-bold" : ""}`}>
                        {item.name}
                      </span>
                    )}
                    </Link>
                  );
                })}
            </nav>
          </div>

          {/* Fixed Logout Area */}
          <div className="p-4 border-t border-border-light dark:border-border-dark bg-white dark:bg-surface-dark mt-auto">
            <button
              onClick={handleLogout}
              className={`flex items-center w-full p-3 text-slate-600 dark:text-slate-400 hover:bg-rose-500/5 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition-all group ${!isSidebarOpen ? "justify-center px-0" : ""}`}
            >
              <div className={`flex items-center justify-center ${!isSidebarOpen ? "w-full" : "w-5"}`}>
                <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
              </div>
              {isSidebarOpen && (
                <span className="ml-4 font-medium transition-opacity duration-300 whitespace-nowrap">
                  Logout
                </span>
              )}
            </button>
          </div>
        </aside>

      {/* Separate Slide Bar (Resizer) */}
      <div 
        onMouseDown={startResizing}
        className={`hidden md:block w-1.5 hover:w-2 bg-transparent hover:bg-google-blue/20 cursor-col-resize transition-all z-50 active:bg-google-blue/40 relative -ml-0.75 ${isResizing ? "bg-google-blue/40 w-2" : ""}`}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-8 bg-slate-300 dark:bg-slate-700 rounded-full opacity-0 group-hover/sidebar:opacity-100 transition-opacity" />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 z-20">
        {/* Navbar */}
        <header className="h-16 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-border-light dark:border-border-dark flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-slate-500 hover:text-google-blue"
            >
              <Menu size={24} />
            </button>
            <span className="ml-3 text-lg font-bold text-slate-900 dark:text-white">PRO<span className="text-google-blue">MANAGE</span></span>
          </div>

          <div className="hidden sm:flex items-center bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl px-4 py-2 w-[500px] focus-within:bg-white dark:focus-within:bg-surface-dark focus-within:shadow-md focus-within:border-transparent transition-all group">
            <Search size={18} className="text-slate-500 group-focus-within:text-google-blue transition-colors" />
            <input 
              type="text" 
              placeholder="Search projects, tasks..." 
              className="bg-transparent border-none focus:ring-0 text-sm ml-3 w-full text-slate-900 dark:text-slate-200 placeholder:text-slate-500 font-medium"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:bg-surface-light dark:hover:bg-white/5 rounded-full transition-all hover:text-google-blue group"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <Sun size={20} className="group-hover:rotate-90 transition-transform" />
              ) : (
                <Moon size={20} className="group-hover:-rotate-12 transition-transform" />
              )}
            </button>

            <Link to="/notifications" className="relative p-2 text-slate-500 hover:bg-surface-light dark:hover:bg-white/5 rounded-full transition-all hover:text-google-blue group">
              <Bell size={20} className="group-hover:rotate-12 transition-transform" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-google-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-surface-dark">
                  {unreadCount}
                </span>
              )}
            </Link>
            
            <div className="flex items-center space-x-3 pl-4 border-l border-border-light dark:border-border-dark">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{user?.name}</p>
                <p className="text-[10px] text-google-blue font-bold uppercase tracking-widest">{user?.role}</p>
              </div>
              <div className="relative group">
                <img 
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=1a73e8&color=ffffff&bold=true`} 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full border border-border-light dark:border-border-dark object-cover hover:shadow-md transition-shadow cursor-pointer"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              key="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/20 dark:bg-black/60 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div
              key="mobile-menu-content"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-white dark:bg-surface-dark border-r border-border-light dark:border-border-dark z-[60] md:hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 flex items-center justify-between border-b border-border-light dark:border-border-dark">
                <span className="text-xl font-bold text-slate-900 dark:text-white">PRO<span className="text-google-blue">MANAGE</span></span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-google-blue">
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center p-4 rounded-xl transition-all ${
                      location.pathname === item.path
                        ? "bg-google-blue/10 text-google-blue font-bold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-surface-light dark:hover:bg-white/5"
                    }`}
                  >
                    <item.icon size={24} />
                    <span className="ml-4 font-medium text-lg">{item.name}</span>
                  </Link>
                ))}
              </nav>
              <div className="p-6 border-t border-border-light dark:border-border-dark">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full p-4 text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all font-bold text-lg"
                >
                  <LogOut size={24} className="mr-4" />
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
