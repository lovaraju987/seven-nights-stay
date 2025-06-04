
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import React from "react";
import AgentLayout from "@/components/agent/AgentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const AgentPerformance = () => {
  const [performance, setPerformance] = useState<any>({
    hostelCount: 0,
    approvalRate: 0,
    responseTime: 0,
    taskCompletion: 0,
  });
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [agentRankings, setAgentRankings] = useState<any[]>([]);
  const [userName, setUserName] = useState("Agent");

  useEffect(() => {
    const fetchPerformance = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id;
      if (!userId) return;

      const { data: profile } = await supabase.from("profiles").select("name").eq("id", userId).single();
      setUserName(profile?.name || "Agent");

      const { data: hostels } = await supabase
        .from("hostels")
        .select("status, created_at")
        .eq("agent_id", userId);

      const { data: tasks } = await supabase
        .from("agent_tasks")
        .select("status, due_date, completed_date")
        .eq("agent_id", userId);

      const hostelCount = hostels?.length || 0;
      const approvalCount = hostels?.filter(h => h.status === "verified").length || 0;
      const approvalRate = hostelCount ? Math.round((approvalCount / hostelCount) * 100) : 0;

      const taskCount = tasks?.length || 0;
      const completedCount = tasks?.filter(t => t.status === "completed").length || 0;
      const taskCompletion = taskCount ? Math.round((completedCount / taskCount) * 100) : 0;

      const responseTimes = tasks
        ?.filter(t => t.status === "completed" && t.completed_date && t.due_date)
        .map(t => (new Date(t.completed_date).getTime() - new Date(t.due_date).getTime()) / (1000 * 60 * 60));
      const avgResponseTime = responseTimes?.length ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1) : 0;

      const monthStats: Record<string, { hostels: number; tasks: number }> = {};
      hostels?.forEach(h => {
        const m = new Date(h.created_at).toLocaleString("default", { month: "short" });
        if (!monthStats[m]) monthStats[m] = { hostels: 0, tasks: 0 };
        monthStats[m].hostels += 1;
      });
      tasks?.forEach(t => {
        const m = new Date(t.due_date).toLocaleString("default", { month: "short" });
        if (!monthStats[m]) monthStats[m] = { hostels: 0, tasks: 0 };
        monthStats[m].tasks += 1;
      });

      const sortedMonths = Object.entries(monthStats).map(([month, data]) => ({ month, ...data }));
      setMonthlyData(sortedMonths);

      const { data: allProfiles } = await supabase
        .from("profiles")
        .select("id, name");

      const { data: allHostels } = await supabase
        .from("hostels")
        .select("agent_id, status");

      const agentStats: Record<string, { name: string; hostels: number; approved: number }> = {};
      allHostels?.forEach(h => {
        const id = h.agent_id;
        const name = allProfiles?.find(p => p.id === id)?.name || "Unnamed";
        if (!agentStats[id]) agentStats[id] = { name, hostels: 0, approved: 0 };
        agentStats[id].hostels += 1;
        if (h.status === "verified") agentStats[id].approved += 1;
      });

      const sortedAgents = Object.values(agentStats)
        .map(a => ({
          name: a.name,
          hostels: a.hostels,
          approvalRate: Math.round((a.approved / a.hostels) * 100),
        }))
        .sort((a, b) => b.hostels - a.hostels);

      setAgentRankings(sortedAgents);
      setPerformance({
        hostelCount,
        approvalRate,
        taskCompletion,
        responseTime: avgResponseTime,
      });
    };
    fetchPerformance();
  }, []);

  // Find the current agent in the rankings
  const currentAgentIndex = agentRankings.findIndex(a => a.name === userName);

  return (
    <AgentLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Performance Tracker</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">{performance.hostelCount}</div>
              <p className="text-sm text-gray-500">Hostels Onboarded</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">{performance.approvalRate}%</div>
              <p className="text-sm text-gray-500">Verification Rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-orange-600">{performance.responseTime} hrs</div>
              <p className="text-sm text-gray-500">Avg. Response Time</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-purple-600">{performance.taskCompletion}%</div>
              <p className="text-sm text-gray-500">Task Completion</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="hostels" name="Hostels Added" fill="#3b82f6" />
                    <Bar dataKey="tasks" name="Tasks Completed" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agent Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agentRankings.map((agent, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      agent.name === userName
                        ? "bg-blue-50 border border-blue-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-sm">
                          {index + 1}
                        </div>
                        <span className="font-medium">
                          {agent.name}
                          {agent.name === userName && " (You)"}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500 mr-4">
                          {agent.hostels} hostels
                        </span>
                        <span className="font-medium">{agent.approvalRate}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AgentLayout>
  );
};

export default AgentPerformance;
