
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  BarChart2, 
  Home, 
  Users, 
  AlertCircle, 
  Settings, 
  Bell, 
  FileText, 
  Activity,
  Shield,
  UserCog,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/lib/supabase";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const menuItems = [
    {
      title: "Dashboard",
      icon: <BarChart2 className="h-5 w-5" />,
      path: "/admin/dashboard",
    },
    {
      title: "Hostel Management",
      icon: <Home className="h-5 w-5" />,
      path: "/admin/hostels",
    },
    {
      title: "User & Owner Management",
      icon: <Users className="h-5 w-5" />,
      path: "/admin/users",
    },
    {
      title: "Complaints",
      icon: <AlertCircle className="h-5 w-5" />,
      path: "/admin/complaints",
    },
    {
      title: "Subscription Plans",
      icon: <Shield className="h-5 w-5" />,
      path: "/admin/subscriptions",
    },
    {
      title: "Notifications",
      icon: <Bell className="h-5 w-5" />,
      path: "/admin/notifications",
    },
    {
      title: "Reports & Exports",
      icon: <FileText className="h-5 w-5" />,
      path: "/admin/reports",
    },
    {
      title: "Activity Logs",
      icon: <Activity className="h-5 w-5" />,
      path: "/admin/logs",
    },
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/admin/settings",
    },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto border-r bg-white">
          <div className="flex items-center justify-center px-4">
            <h1 className="text-xl font-bold text-indigo-600">OneTo7 Admin</h1>
          </div>
          <div className="mt-5 flex flex-col flex-1 px-3">
            <nav className="flex-1 space-y-1">
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    location.pathname === item.path
                      ? "bg-indigo-100 text-indigo-700"
                      : ""
                  }`}
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </Button>
              ))}
            </nav>
            <div className="mt-auto pb-4">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-500"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-3">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="absolute left-4 top-3 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex flex-col h-full bg-white">
            <div className="flex items-center justify-between p-4 border-b">
              <h1 className="text-xl font-bold text-indigo-600">OneTo7 Admin</h1>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    location.pathname === item.path
                      ? "bg-indigo-100 text-indigo-700"
                      : ""
                  }`}
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </Button>
              ))}
            </nav>
            <div className="p-4 border-t">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-500"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-3">Logout</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6">
          <div className="md:hidden"></div>
          <div className="md:hidden"></div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => toast.info("No new notifications")}>
              <Bell className="h-5 w-5" />
            </Button>
            <div className="ml-4 relative">
              <Button 
                variant="ghost" 
                className="flex items-center"
                onClick={() => navigate("/admin/profile")}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-indigo-600 text-white">
                    AD
                  </AvatarFallback>
                </Avatar>
                <span className="ml-2 text-sm font-medium hidden sm:block">Admin User</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
