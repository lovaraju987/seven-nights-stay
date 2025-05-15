
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
import Home from "./pages/hosteller/Home";
import HostelDetail from "./pages/hosteller/HostelDetail";
import Booking from "./pages/hosteller/Booking";

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
          
          {/* Retain Default Routes */}
          <Route path="/index" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
