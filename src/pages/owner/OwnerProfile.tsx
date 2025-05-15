
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Camera, Save, User } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const OwnerProfile = () => {
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+91 9876543210",
    address: "123 Main Street, Bangalore, Karnataka",
    bio: "Hostel owner with 5+ years of experience managing properties across Bangalore.",
    profileImage: "" // This will be empty until user uploads an image
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    // In a real app, this would save to backend
    toast.success("Profile updated successfully");
  };

  const handleImageUpload = () => {
    // In a real app, this would trigger file upload
    document.getElementById("profile-image-upload")?.click();
  };

  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <h2 className="text-lg font-medium">Personal Information</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="h-24 w-24 border-2 border-blue-500">
                  {profile.profileImage ? (
                    <img src={profile.profileImage} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-12 w-12" />
                  )}
                </Avatar>
                <Button 
                  size="icon" 
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                  onClick={handleImageUpload}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <input
                  type="file"
                  id="profile-image-upload"
                  className="hidden"
                  accept="image/*"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">Upload a profile photo</p>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={profile.name} 
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={profile.email} 
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={profile.phone} 
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={profile.address} 
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  name="bio" 
                  value={profile.bio} 
                  onChange={handleInputChange}
                  className="resize-none"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <h2 className="text-lg font-medium">Account Settings</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input 
                id="current-password" 
                type="password" 
                placeholder="••••••••"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input 
                  id="new-password" 
                  type="password" 
                  placeholder="••••••••"
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleSaveProfile}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnerProfile;
