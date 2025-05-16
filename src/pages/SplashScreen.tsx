
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      navigate("/role-selection");
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-pulse bg-blue-200 rounded-full -z-10"></div>
        <div className="text-6xl font-bold text-blue-600">
          <span className="text-blue-800">OneTo7</span> Hostels
        </div>
      </div>
      <Card className="p-6 max-w-md w-full text-center bg-white/80 backdrop-blur-sm shadow-xl">
        <p className="text-gray-600 mb-4">Finding your perfect stay...</p>
        <div className="flex justify-center">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 animate-[shimmer_1.5s_infinite]"></div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SplashScreen;
