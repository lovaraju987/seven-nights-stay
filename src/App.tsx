
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
          
          {/* Retain Default Routes */}
          <Route path="/index" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
