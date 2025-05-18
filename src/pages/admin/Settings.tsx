import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

const Settings = () => {
  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Admin Settings</h1>

        {/* Platform Control */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Maintenance Mode</Label>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <Label>Enable New Registrations</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>Enable Booking System</Label>
              <Switch defaultChecked />
            </div>
            <Button onClick={handleSave}>Save</Button>
          </CardContent>
        </Card>

        {/* Default Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Default Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-1 block">Default Subscription Plan Price</Label>
              <Input type="number" placeholder="e.g. 999" />
            </div>
            <div>
              <Label className="mb-1 block">Grace Period (in days)</Label>
              <Input type="number" placeholder="e.g. 7" />
            </div>
            <Button onClick={handleSave}>Save</Button>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Contact & Support Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-1 block">Support Email</Label>
              <Input type="email" placeholder="support@example.com" />
            </div>
            <div>
              <Label className="mb-1 block">Support Phone</Label>
              <Input type="tel" placeholder="+91-9876543210" />
            </div>
            <Button onClick={handleSave}>Save</Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Settings;