import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) {
        toast.error("Could not fetch user. Please login again.");
        setLoading(false);
        navigate("/admin/login");
        return;
      }

      const userId = authData.user.id;
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
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev: any) => ({ ...prev, [name]: value }));
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

    const updateFields: any = {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      address: profile.address,
    };

    const { error } = await supabase.from("profiles").update(updateFields).eq("id", userId);
    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated successfully");
    }

    if (profile.email) {
      const { error: emailError } = await supabase.auth.updateUser({ email: profile.email });
      if (emailError) {
        toast.error("Failed to update email: " + emailError.message);
      }
    }

    setLoading(false);
  };

  const handleImageUpload = () => {
    document.getElementById("admin-profile-upload")?.click();
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">Admin Profile</h1>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border" />
              <Button size="icon" onClick={handleImageUpload}>
                <Camera className="h-4 w-4" />
              </Button>
              <input id="admin-profile-upload" type="file" accept="image/*" className="hidden" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={profile?.name || ""}
                  onChange={handleChange}
                  disabled={loading || !profile}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile?.email || ""}
                  onChange={handleChange}
                  disabled={loading || !profile}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={profile?.phone || ""}
                  onChange={handleChange}
                  disabled={loading || !profile}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={profile?.address || ""}
                  onChange={handleChange}
                  disabled={loading || !profile}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={handleSave} disabled={loading || !profile}>
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
