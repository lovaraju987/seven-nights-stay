import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Phone, LogOut, User, Settings, HelpCircle, Shield, Bell, CreditCard, Camera, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/useAuth";

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, loading, updateProfile, signOut } = useAuth();
  
  // Local state for form data
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    emergency_contact: "",
  });

  const [isUpdating, setIsUpdating] = useState(false);

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        emergency_contact: profile.emergency_contact || "",
      });
    }
  }, [profile]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Error logging out");
    } else {
      toast.success("Successfully logged out");
      navigate("/role-selection");
    }
  };
  
  const handleSaveProfile = async () => {
    setIsUpdating(true);
    try {
      const { error } = await updateProfile(formData);
      if (error) {
        toast.error("Failed to update profile");
      } else {
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error("An error occurred while updating profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-2 text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (!user || !profile) {
    return null; // Will redirect to login
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold text-blue-800">My Profile</h1>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 p-4 max-w-md mx-auto w-full">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="help">Support</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card className="mb-4">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-2 border-blue-500">
                      <User className="h-12 w-12" />
                    </Avatar>
                    <Button 
                      size="icon" 
                      className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                      onClick={() => toast.info("Photo upload coming soon!")}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <h2 className="text-lg font-semibold mt-2">{profile.name}</h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {user.email_confirmed_at && (
                      <div className="bg-green-50 text-green-700 text-xs rounded-full px-2 py-0.5 flex items-center">
                        <Shield className="h-3 w-3 mr-1" />
                        Email Verified
                      </div>
                    )}
                    {profile.phone && (
                      <div className="bg-blue-50 text-blue-700 text-xs rounded-full px-2 py-0.5 flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        Phone Added
                      </div>
                    )}
                    {profile.id_verified && (
                      <div className="bg-green-50 text-green-700 text-xs rounded-full px-2 py-0.5 flex items-center">
                        <Shield className="h-3 w-3 mr-1" />
                        ID Verified
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={formData.name} 
                      onChange={(e) => handleInputChange('name', e.target.value)} 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      value={user.email || ""} 
                      disabled
                      className="bg-gray-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed here</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={formData.phone} 
                      onChange={(e) => handleInputChange('phone', e.target.value)} 
                      placeholder="+91 9876543210"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="emergency_contact">Emergency Contact</Label>
                    <Input 
                      id="emergency_contact" 
                      value={formData.emergency_contact} 
                      onChange={(e) => handleInputChange('emergency_contact', e.target.value)} 
                      placeholder="+91 9876543210"
                    />
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleSaveProfile}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-0">
                <h3 className="text-lg font-medium">Account Security</h3>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => toast.info("Password change coming soon!")}
                >
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card className="mb-4">
              <CardHeader className="pb-0">
                <h3 className="text-lg font-medium">Notifications</h3>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Booking Updates</p>
                    <p className="text-sm text-gray-500">
                      Receive updates about your bookings
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Promotions</p>
                    <p className="text-sm text-gray-500">
                      Receive emails about deals and offers
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Hostel Recommendations</p>
                    <p className="text-sm text-gray-500">
                      Get notified about new hostels matching your preferences
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">App Updates</p>
                    <p className="text-sm text-gray-500">
                      Get notified about new features and improvements
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-4">
              <CardHeader className="pb-0">
                <h3 className="text-lg font-medium">Payment Methods</h3>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="border rounded-lg p-4 mb-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="h-6 w-6 mr-3 text-blue-600" />
                    <div>
                      <p className="font-medium">VISA •••• 4321</p>
                      <p className="text-sm text-gray-500">Expires 01/26</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
                
                <Button variant="outline" className="w-full">
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-0">
                <h3 className="text-lg font-medium">Privacy</h3>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Share Booking History</p>
                    <p className="text-sm text-gray-500">
                      Allow hostels to see your past bookings
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Location Services</p>
                    <p className="text-sm text-gray-500">
                      Enable location to find nearby hostels
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Button variant="outline" className="w-full">
                  Delete My Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="help">
            <Card className="mb-4">
              <CardHeader className="pb-0">
                <h3 className="text-lg font-medium">Help & Support</h3>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/hosteller/faq")}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Frequently Asked Questions
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/hosteller/contact")}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open("https://oneto7hostels.com/terms", "_blank")}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Terms & Conditions
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open("https://oneto7hostels.com/privacy", "_blank")}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy Policy
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-0">
                <h3 className="text-lg font-medium">About</h3>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-center">
                  <h4 className="font-bold text-blue-800 mb-1">OneTo7 <span className="text-blue-600">Hostels</span></h4>
                  <p className="text-sm text-gray-500 mb-4">Version 1.0.0</p>
                  <p className="text-sm text-gray-700 mb-6">
                    The ultimate platform for finding and booking hostels across India.
                    Your comfortable stay is just a few clicks away!
                  </p>
                </div>
                
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Navigation */}
      <nav className="bg-white border-t border-gray-200 flex justify-around items-center py-3 sticky bottom-0">
        <Button 
          variant="ghost" 
          className="flex flex-col items-center text-gray-500"
          onClick={() => navigate("/hosteller/home")}
        >
          <MapPin className="h-5 w-5" />
          <span className="text-xs mt-1">Explore</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className="flex flex-col items-center text-gray-500"
          onClick={() => navigate("/hosteller/bookings")}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-xs mt-1">Bookings</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className="flex flex-col items-center text-blue-600"
          onClick={() => navigate("/hosteller/profile")}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </Button>
      </nav>
    </div>
  );
};

export default Profile;
