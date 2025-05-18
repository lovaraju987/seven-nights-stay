import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

const Notifications = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSendNotification = () => {
    if (!title || !message) {
      toast.error("Both title and message are required.");
      return;
    }

    // This is a placeholder. Replace it with your actual push logic if integrated.
    toast.success("Notification sent successfully!");
    setTitle("");
    setMessage("");
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Notifications</h1>

        <Card>
          <CardHeader>
            <CardTitle>Send Push Notification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                placeholder="Enter notification title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                placeholder="Enter your notification message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <Button onClick={handleSendNotification}>Send Notification</Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Notifications;