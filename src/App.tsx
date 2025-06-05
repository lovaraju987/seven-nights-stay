import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SplashScreen from "./pages/SplashScreen";
import RoleSelection from "./pages/RoleSelection";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/hosteller/Home";
import HostelDetail from "./pages/hosteller/HostelDetail";
import Booking from "./pages/hosteller/Booking";
import Bookings from "./pages/hosteller/Bookings";
import Profile from "./pages/hosteller/Profile";
import Wishlist from "./pages/hosteller/Wishlist";
import Filters from "./pages/hosteller/Filters";

// Owner Routes
import OwnerLogin from "./pages/owner/OwnerLogin";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import AddHostel from "./pages/owner/AddHostel";
import ManageHostel from "./pages/owner/ManageHostel";
import ManageRooms from "./pages/owner/ManageRooms";
import BookingList from "./pages/owner/BookingList";
import Subscription from "./pages/owner/Subscription";
import QRStorefront from "./pages/owner/QRStorefront";
import Analytics from "./pages/owner/Analytics";
import OwnerProfile from "./pages/owner/OwnerProfile";

// Admin Routes
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import HostelManagement from "./pages/admin/HostelManagement";
import UserManagement from "./pages/admin/UserManagement";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import Logs from "./pages/admin/Logs";
import ComplaintManagement from "./pages/admin/ComplaintManagement";
import SubscriptionPlans from "./pages/admin/SubscriptionPlans";
import Notifications from "@/pages/admin/Notifications";
import AdminProfile from "./pages/admin/AdminProfile";
import OwnerManagement from "./pages/admin/OwnerManagement";
import BookingManagement from "./pages/admin/BookingManagement";

// Agent Routes
import AgentLogin from "./pages/agent/AgentLogin";
import AgentDashboard from "./pages/agent/AgentDashboard";
import AgentAddHostel from "./pages/agent/AgentAddHostel";
import AgentMyHostels from "./pages/agent/AgentMyHostels";
import AgentTasks from "./pages/agent/AgentTasks";
import AgentPerformance from "./pages/agent/AgentPerformance";
import AgentProfile from "./pages/agent/AgentProfile";
import AgentViewHostel from "./pages/agent/AgentViewHostel";
import AgentEditHostel from "./pages/agent/AgentEditHostel";
import AgentHostelImages from "./pages/agent/AgentHostelImages";
import AgentContactHostel from "./pages/agent/AgentContactHostel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/login" element={<Login />} />
          
          {/* Hosteller Routes */}
          <Route
            path="/hosteller/home"
            element={
              <ProtectedRoute role="hosteller">
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hosteller/hostel/:hostelId"
            element={
              <ProtectedRoute role="hosteller">
                <HostelDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hosteller/booking/:hostelId/:roomId"
            element={
              <ProtectedRoute role="hosteller">
                <Booking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hosteller/bookings"
            element={
              <ProtectedRoute role="hosteller">
                <Bookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hosteller/wishlist"
            element={
              <ProtectedRoute role="hosteller">
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hosteller/profile"
            element={
              <ProtectedRoute role="hosteller">
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hosteller/filters"
            element={
              <ProtectedRoute role="hosteller">
                <Filters />
              </ProtectedRoute>
            }
          />
          
          {/* Owner Routes */}
          <Route path="/owner/login" element={<OwnerLogin />} />
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute role="owner">
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/add-hostel"
            element={
              <ProtectedRoute role="owner">
                <AddHostel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/manage-hostel/:hostelId"
            element={
              <ProtectedRoute role="owner">
                <ManageHostel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/manage-rooms/:hostelId"
            element={
              <ProtectedRoute role="owner">
                <ManageRooms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/bookings"
            element={
              <ProtectedRoute role="owner">
                <BookingList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/subscription"
            element={
              <ProtectedRoute role="owner">
                <Subscription />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/qr-storefront/:hostelId"
            element={
              <ProtectedRoute role="owner">
                <QRStorefront />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/analytics"
            element={
              <ProtectedRoute role="owner">
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/profile"
            element={
              <ProtectedRoute role="owner">
                <OwnerProfile />
              </ProtectedRoute>
            }
          />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/hostels"
            element={
              <ProtectedRoute role="admin">
                <HostelManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/owners"
            element={
              <ProtectedRoute role="admin">
                <OwnerManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute role="admin">
                <BookingManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/complaints"
            element={
              <ProtectedRoute role="admin">
                <ComplaintManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/subscriptions"
            element={
              <ProtectedRoute role="admin">
                <SubscriptionPlans />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/notifications"
            element={
              <ProtectedRoute role="admin">
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute role="admin">
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/logs"
            element={
              <ProtectedRoute role="admin">
                <Logs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute role="admin">
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute role="admin">
                <AdminProfile />
              </ProtectedRoute>
            }
          />
          
          {/* Agent Routes */}
          <Route path="/agent/login" element={<AgentLogin />} />
          <Route
            path="/agent/dashboard"
            element={
              <ProtectedRoute role="agent">
                <AgentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/add-hostel"
            element={
              <ProtectedRoute role="agent">
                <AgentAddHostel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/my-hostels"
            element={
              <ProtectedRoute role="agent">
                <AgentMyHostels />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/tasks"
            element={
              <ProtectedRoute role="agent">
                <AgentTasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/performance"
            element={
              <ProtectedRoute role="agent">
                <AgentPerformance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/profile"
            element={
              <ProtectedRoute role="agent">
                <AgentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/view-hostel/:id"
            element={
              <ProtectedRoute role="agent">
                <AgentViewHostel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/edit-hostel/:id"
            element={
              <ProtectedRoute role="agent">
                <AgentEditHostel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/hostel-images/:id"
            element={
              <ProtectedRoute role="agent">
                <AgentHostelImages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/contact-hostel/:id"
            element={
              <ProtectedRoute role="agent">
                <AgentContactHostel />
              </ProtectedRoute>
            }
          />
          
          {/* Retain Default Routes */}
          <Route path="/index" element={<Index />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
