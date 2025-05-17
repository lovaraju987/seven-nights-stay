
import React, { useEffect, useState } from "react";
import AgentLayout from "@/components/agent/AgentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const AgentProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) {
        setLoading(false);
        toast.error("Could not fetch user. Please login again.");
        navigate("/agent/login");
        return;
      }
      const userId = authData.user.id;
      // fetch profile
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) {
        toast.error("Could not fetch profile");
      } else {
        setProfile(data);
      }
      setLoading(false);
    };
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/role-selection");
  };

  // Update fields in profile state
  const handleChange = (field: string, value: string) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!profile) return;
    setLoading(true);
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;
    if (!userId) {
      setLoading(false);
      toast.error("Not logged in");
      return;
    }
    // Only update editable fields
    const updateFields: any = {
      name: profile.name,
      email: profile.email,
      address: profile.address,
    };
    const { error } = await supabase
      .from("profiles")
      .update(updateFields)
      .eq("id", userId);
    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated successfully");
    }
    // Change password if provided
    if (password) {
      const { error: passError } = await supabase.auth.updateUser({ password });
      if (passError) {
        toast.error("Failed to update password: " + passError.message);
      } else {
        toast.success("Password updated successfully");
        setPassword("");
      }
    }
    // Update email in Supabase auth.users if changed/provided
    if (profile.email) {
      const { error: emailError } = await supabase.auth.updateUser({ email: profile.email });
      if (emailError) {
        toast.error("Failed to update email: " + emailError.message);
      } else {
        toast.success("Email updated successfully");
      }
    }
    setLoading(false);
  };

  return (
    <AgentLayout>
      <div className="space-y-6 max-w-3xl mx-auto px-2">
        <h1 className="text-2xl font-bold">Agent Profile</h1>
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="text-2xl">
                    {profile?.name
                      ? profile.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase()
                      : "AG"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="text-lg font-semibold">{profile?.name || "Agent Name"}</div>
                  <div className="text-gray-500 text-sm">
                    Role: <span className="font-medium">{profile?.role || "Agent"}</span>
                  </div>
                  <div className="text-gray-500 text-sm">
                    Region: <span className="font-medium">{profile?.region || "N/A"}</span>
                  </div>
                  <div className="text-gray-500 text-sm flex items-center gap-2">
                    Status:
                    {profile?.is_verified ? (
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-medium">Verified</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs font-medium">Not Verified</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-1 flex justify-end">
                <Button variant="outline" size="sm" disabled>
                  Change Photo
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <div className="font-semibold text-base mb-2">Personal Information</div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile?.name || ""}
                    onChange={e => handleChange("name", e.target.value)}
                    disabled={loading || !profile}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile?.phone || ""}
                    readOnly
                    className="bg-gray-50"
                    disabled
                  />
                  <p className="text-xs text-gray-500">Phone number cannot be changed</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile?.email || ""}
                    onChange={e => handleChange("email", e.target.value)}
                    disabled={loading || !profile}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={profile?.address || ""}
                    onChange={e => handleChange("address", e.target.value)}
                    disabled={loading || !profile}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Assigned Region</Label>
                  <Input
                    id="region"
                    value={profile?.region || ""}
                    readOnly
                    className="bg-gray-50"
                    disabled
                  />
                </div>
              </div>
              {/* System Access */}
              <div className="space-y-4">
                <div className="font-semibold text-base mb-2">System Access</div>
                <div className="space-y-2">
                  <Label htmlFor="loginEmail">Login Email</Label>
                  <Input
                    id="loginEmail"
                    type="email"
                    value={profile?.email || ""}
                    onChange={e => handleChange("email", e.target.value)}
                    disabled={loading || !profile}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500">Leave blank to keep current password</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={profile?.role || "Agent"}
                    readOnly
                    className="bg-gray-50"
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t">
              <Button variant="outline" onClick={handleLogout} disabled={loading}>
                Logout
              </Button>
              <Button onClick={handleSave} disabled={loading || !profile}>
                Update Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AgentLayout>
  );
};

export default AgentProfile;
