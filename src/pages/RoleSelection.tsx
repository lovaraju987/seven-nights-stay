
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserIcon, HomeIcon, UsersRoundIcon } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState<"hosteller" | "owner" | "agent" | null>(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!selectedRole) {
      toast.error("Please select a role to continue");
      return;
    }

    if (selectedRole === "hosteller") {
      navigate("/login");
    } else if (selectedRole === "owner") {
      navigate("/owner/login");
    } else {
      navigate("/agent/login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <h2 className="text-2xl font-bold">Continue As</h2>
          <p className="text-gray-500 text-sm">Select your role to proceed</p>
        </CardHeader>
        
        <CardContent className="grid gap-4">
          <Card 
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedRole === "hosteller" ? "ring-2 ring-blue-500 bg-blue-50" : "bg-white"
            }`}
            onClick={() => setSelectedRole("hosteller")}
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-blue-100">
                <UserIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Hosteller</h3>
                <p className="text-sm text-gray-500">I want to find and book hostels</p>
              </div>
            </div>
          </Card>
          
          <Card 
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedRole === "owner" ? "ring-2 ring-blue-500 bg-blue-50" : "bg-white"
            }`}
            onClick={() => setSelectedRole("owner")}
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-blue-100">
                <HomeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Hostel Owner</h3>
                <p className="text-sm text-gray-500">I want to manage my hostel</p>
              </div>
            </div>
          </Card>
          
          <Card 
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedRole === "agent" ? "ring-2 ring-blue-500 bg-blue-50" : "bg-white"
            }`}
            onClick={() => setSelectedRole("agent")}
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-blue-100">
                <UsersRoundIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Relationship Manager</h3>
                <p className="text-sm text-gray-500">I onboard and manage hostels</p>
              </div>
            </div>
          </Card>
        </CardContent>
        
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleContinue}
            disabled={!selectedRole}
          >
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RoleSelection;
