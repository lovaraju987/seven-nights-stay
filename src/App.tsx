import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import MoveInChecklist from "./pages/hosteller/MoveInChecklist";

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
          <Route path="/hosteller/home" element={<Home />} />
          <Route path="/hosteller/hostel/:hostelId" element={<HostelDetail />} />
          <Route path="/hosteller/booking/:hostelId/:roomId" element={<Booking />} />
          <Route path="/hosteller/bookings" element={<Bookings />} />
          <Route path="/hosteller/move-in-checklist/:bookingId" element={<MoveInChecklist />} />
          <Route path="/hosteller/wishlist" element={<Wishlist />} />
          <Route path="/hosteller/profile" element={<Profile />} />
          <Route path="/hosteller/filters" element={<Filters />} />
          
          {/* Owner Routes */}
          <Route path="/owner/login" element={<OwnerLogin />} />
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/add-hostel" element={<AddHostel />} />
          <Route path="/owner/manage-hostel/:hostelId" element={<ManageHostel />} />
          <Route path="/owner/manage-rooms/:hostelId" element={<ManageRooms />} />
          <Route path="/owner/bookings" element={<BookingList />} />
          <Route path="/owner/subscription" element={<Subscription />} />
          <Route path="/owner/qr-storefront/:hostelId" element={<QRStorefront />} />
          <Route path="/owner/analytics" element={<Analytics />} />
          <Route path="/owner/profile" element={<OwnerProfile />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/hostels" element={<HostelManagement />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/complaints" element={<ComplaintManagement />} />
          <Route path="/admin/subscriptions" element={<SubscriptionPlans />} />
          <Route path="/admin/notifications" element={<Notifications />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/logs" element={<Logs />} />
          <Route path="/admin/settings" element={<Settings />} />
          
          {/* Agent Routes */}
          <Route path="/agent/login" element={<AgentLogin />} />
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
          <Route path="/agent/add-hostel" element={<AgentAddHostel />} />
          <Route path="/agent/my-hostels" element={<AgentMyHostels />} />
          <Route path="/agent/tasks" element={<AgentTasks />} />
          <Route path="/agent/performance" element={<AgentPerformance />} />
          <Route path="/agent/profile" element={<AgentProfile />} />
          <Route path="/agent/view-hostel/:id" element={<AgentViewHostel />} />
          <Route path="/agent/edit-hostel/:id" element={<AgentEditHostel />} />
          <Route path="/agent/hostel-images/:id" element={<AgentHostelImages />} />
          <Route path="/agent/contact-hostel/:id" element={<AgentContactHostel />} />
          
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
