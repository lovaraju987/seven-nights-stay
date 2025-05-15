
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HomeIcon,
  PlusIcon,
  ClipboardListIcon,
  ListIcon,
  TrendingUpIcon,
  UserCogIcon,
  LogOutIcon,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

const AgentLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/role-selection");
  };

  const menuItems = [
    {
      icon: <HomeIcon className="h-5 w-5" />,
      name: "Dashboard",
      path: "/agent/dashboard",
    },
    {
      icon: <PlusIcon className="h-5 w-5" />,
      name: "Add Hostel",
      path: "/agent/add-hostel",
    },
    {
      icon: <ListIcon className="h-5 w-5" />,
      name: "My Hostels",
      path: "/agent/my-hostels",
    },
    {
      icon: <ClipboardListIcon className="h-5 w-5" />,
      name: "Tasks",
      path: "/agent/tasks",
    },
    {
      icon: <TrendingUpIcon className="h-5 w-5" />,
      name: "Performance",
      path: "/agent/performance",
    },
    {
      icon: <UserCogIcon className="h-5 w-5" />,
      name: "Profile",
      path: "/agent/profile",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="h-20 flex items-center justify-center border-b">
          <h1 className="text-xl font-bold text-blue-600">OneTo7</h1>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => (
              <li key={item.path}>
                <a
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                  }}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </a>
              </li>
            ))}
            <li>
              <button
                className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left text-gray-600 hover:bg-gray-100 transition-colors"
                onClick={handleLogout}
              >
                <LogOutIcon className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
        <div className="flex items-center justify-between h-16 px-4">
          <h1 className="text-lg font-bold text-blue-600">OneTo7 Agent</h1>
          <div className="relative">
            {/* Mobile menu button */}
            <button className="p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="px-4 py-6 md:px-8 md:py-8">{children}</div>
      </main>
    </div>
  );
};

export default AgentLayout;
