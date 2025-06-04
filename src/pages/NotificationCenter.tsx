import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { fetchNotifications } from "@/lib/push";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) return;
      const data = await fetchNotifications(authData.user.id);
      setNotifications(data);
    };
    load();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Notifications</h1>
      {notifications.map((n) => (
        <Card key={n.id}>
          <CardHeader>
            <CardTitle>{n.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{n.body}</p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(n.created_at).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      ))}
      {notifications.length === 0 && <p>No notifications.</p>}
      <Button onClick={() => location.reload()}>Refresh</Button>
    </div>
  );
};

export default NotificationCenter;

