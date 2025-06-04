
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import React from "react";
import AgentLayout from "@/components/agent/AgentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HomeIcon, CheckCircleIcon, ClockIcon, CalendarIcon, BellIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AgentDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any[]>([]);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) return;
      const userId = authData.user.id;

      const { data: profile } = await supabase.from("profiles").select("name").eq("id", userId).single();
      setUserName(profile?.name || "Agent");

      const { data: hostels } = await supabase
        .from("hostels")
        .select("status")
        .eq("agent_id", userId);

      const total = hostels?.length || 0;
      const approved = hostels?.filter(h => h.status === "verified").length || 0;
      const pending = hostels?.filter(h => h.status === "pending").length || 0;

      setStats([
        {
          title: "Hostels Added",
          value: total,
          icon: <HomeIcon className="h-5 w-5 text-blue-500" />,
          iconBg: "bg-blue-100",
          change: `+${total} total`,
        },
        {
          title: "Verified Hostels",
          value: approved,
          icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
          iconBg: "bg-green-100",
          change: `${((approved / total) * 100 || 0).toFixed(0)}% verification rate`,
        },
        {
          title: "Pending Approvals",
          value: pending,
          icon: <ClockIcon className="h-5 w-5 text-orange-500" />,
          iconBg: "bg-orange-100",
          change: `${pending} waiting`,
        },
      ]);
    };

    fetchData();
  }, []);

  return (
    <AgentLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {userName}!</h1>
            <p className="text-gray-500">Here's an overview of your activity</p>
          </div>
          <Button onClick={() => navigate("/agent/add-hostel")}>
            Add New Hostel
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full ${stat.iconBg}`}>{stat.icon}</div>
                  <span className="text-3xl font-bold">{stat.value}</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-600">{stat.title}</h3>
                  <p className="text-sm text-gray-500">{stat.change}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* The following sections were removed as per instructions (upcomingVisits, followUps) */}
      </div>
    </AgentLayout>
  );
};

export default AgentDashboard;
