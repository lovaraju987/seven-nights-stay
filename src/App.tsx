
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Index from './pages/Index';
import Login from './pages/Login';
import RoleSelection from './pages/RoleSelection';
import NotFound from './pages/NotFound';
import SplashScreen from './pages/SplashScreen';
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from './contexts/AuthContext';

// Hosteller Routes
import Home from './pages/hosteller/Home';
import HostelDetail from './pages/hosteller/HostelDetail';
import Booking from './pages/hosteller/Booking';
import Bookings from './pages/hosteller/Bookings';
import Profile from './pages/hosteller/Profile';
import Wishlist from './pages/hosteller/Wishlist';
import Filters from './pages/hosteller/Filters';

// Owner Routes
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerLogin from './pages/owner/OwnerLogin';
import OwnerProfile from './pages/owner/OwnerProfile';
import Analytics from './pages/owner/Analytics';
import ManageHostel from './pages/owner/ManageHostel';
import ManageRooms from './pages/owner/ManageRooms';
import BookingList from './pages/owner/BookingList';
import QRStorefront from './pages/owner/QRStorefront';
import Subscription from './pages/owner/Subscription';
import AddHostel from './pages/owner/AddHostel';

// Admin Routes
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import UserManagement from './pages/admin/UserManagement';
import HostelManagement from './pages/admin/HostelManagement';
import ComplaintManagement from './pages/admin/ComplaintManagement';
import SubscriptionPlans from './pages/admin/SubscriptionPlans';

// Agent Routes
import AgentDashboard from './pages/agent/AgentDashboard';
import AgentLogin from './pages/agent/AgentLogin';
import AgentProfile from './pages/agent/AgentProfile';
import AgentTasks from './pages/agent/AgentTasks';
import AgentMyHostels from './pages/agent/AgentMyHostels';
import AgentPerformance from './pages/agent/AgentPerformance';
import AgentAddHostel from './pages/agent/AgentAddHostel';

// Auth
import Auth from './pages/Auth';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Common Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/splash" element={<SplashScreen />} />
          
          {/* Hosteller Routes */}
          <Route path="/hosteller/home" element={<Home />} />
          <Route path="/hosteller/hostel/:hostelId" element={<HostelDetail />} />
          <Route path="/hosteller/booking/:hostelId/:roomId" element={<Booking />} />
          <Route path="/hosteller/bookings" element={<Bookings />} />
          <Route path="/hosteller/profile" element={<Profile />} />
          <Route path="/hosteller/wishlist" element={<Wishlist />} />
          <Route path="/hosteller/filters" element={<Filters />} />
          
          {/* Owner Routes */}
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/login" element={<OwnerLogin />} />
          <Route path="/owner/profile" element={<OwnerProfile />} />
          <Route path="/owner/analytics" element={<Analytics />} />
          <Route path="/owner/manage-hostel/:hostelId" element={<ManageHostel />} />
          <Route path="/owner/manage-rooms/:hostelId" element={<ManageRooms />} />
          <Route path="/owner/bookings" element={<BookingList />} />
          <Route path="/owner/qr-storefront" element={<QRStorefront />} />
          <Route path="/owner/subscription" element={<Subscription />} />
          <Route path="/owner/add-hostel" element={<AddHostel />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/hostels" element={<HostelManagement />} />
          <Route path="/admin/complaints" element={<ComplaintManagement />} />
          <Route path="/admin/subscription-plans" element={<SubscriptionPlans />} />
          
          {/* Agent Routes */}
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
          <Route path="/agent/login" element={<AgentLogin />} />
          <Route path="/agent/profile" element={<AgentProfile />} />
          <Route path="/agent/tasks" element={<AgentTasks />} />
          <Route path="/agent/my-hostels" element={<AgentMyHostels />} />
          <Route path="/agent/performance" element={<AgentPerformance />} />
          <Route path="/agent/add-hostel" element={<AgentAddHostel />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
