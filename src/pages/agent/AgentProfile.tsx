
import React from "react";
import AgentLayout from "@/components/agent/AgentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

const AgentProfile = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/role-selection");
  };
  
  const handleSave = () => {
    toast.success("Profile updated successfully");
  };

  return (
    <AgentLayout>
      <div className="space-y-6 max-w-3xl">
        <h1 className="text-2xl font-bold">My Profile</h1>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <Avatar className="w-24 h-24">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl">RK</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <Button variant="outline" size="sm">
                  Change Photo
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" defaultValue="Rajesh Kumar" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" defaultValue="9876543210" readOnly className="bg-gray-50" />
                <p className="text-xs text-gray-500">Phone number cannot be changed</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input id="email" type="email" defaultValue="rajesh.k@example.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="region">Assigned Region</Label>
                <Input id="region" defaultValue="Bangalore South" readOnly className="bg-gray-50" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" defaultValue="123 Main Street, Bangalore" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Change Password</Label>
              <Input id="password" type="password" placeholder="Enter new password" />
            </div>
            
            <div className="pt-4 border-t flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AgentLayout>
  );
};

export default AgentProfile;
