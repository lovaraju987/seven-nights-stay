
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeftIcon, User, LogOut } from "lucide-react";

const OwnerProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate("/owner/dashboard")}
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
      
      <header className="mb-8">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-gray-500">View and edit your account information</p>
      </header>

      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="bg-gray-200 rounded-full h-24 w-24 flex items-center justify-center">
            <User className="h-12 w-12 text-gray-500" />
          </div>
          <Button size="sm" className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0">
            <span className="sr-only">Change avatar</span>
            +
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-semibold">Personal Information</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="John Doe" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="john.doe@example.com" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Mobile Number</Label>
              <Input id="phone" defaultValue="+91 9876543210" readOnly className="bg-gray-50" />
              <p className="text-xs text-gray-500 mt-1">Mobile number cannot be changed</p>
            </div>
            <div>
              <Label htmlFor="alt-phone">Alternate Contact</Label>
              <Input id="alt-phone" placeholder="Enter alternate number" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-semibold">Security</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline">Change Password</Button>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Button variant="outline" className="gap-2 text-red-500 border-red-200 hover:bg-red-50">
          <LogOut className="h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default OwnerProfile;
