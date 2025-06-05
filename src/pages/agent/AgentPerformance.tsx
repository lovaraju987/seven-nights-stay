
import React from "react";
import AgentLayout from "@/components/agent/AgentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

// Mock data
const performanceData = {
  hostelCount: 24,
  approvalRate: 75,
  responseTime: 5.2,
  taskCompletion: 92,
};

const monthlyData = [
  { month: "Jan", hostels: 2, tasks: 14 },
  { month: "Feb", hostels: 3, tasks: 16 },
  { month: "Mar", hostels: 5, tasks: 22 },
  { month: "Apr", hostels: 6, tasks: 26 },
  { month: "May", hostels: 8, tasks: 34 },
];

const agentRankings = [
  { name: "Amit Singh", hostels: 32, approvalRate: 86 },
  { name: "Priya Sharma", hostels: 28, approvalRate: 78 },
  { name: "Rajesh Kumar", hostels: 24, approvalRate: 75 }, // Current user
  { name: "Suresh Patel", hostels: 20, approvalRate: 80 },
  { name: "Meena Reddy", hostels: 18, approvalRate: 72 },
];

const AgentPerformance = () => {
  return (
    <AgentLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Performance Tracker</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">{performanceData.hostelCount}</div>
              <p className="text-sm text-gray-500">Hostels Onboarded</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">{performanceData.approvalRate}%</div>
              <p className="text-sm text-gray-500">Approval Rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-orange-600">{performanceData.responseTime} hrs</div>
              <p className="text-sm text-gray-500">Avg. Response Time</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-purple-600">{performanceData.taskCompletion}%</div>
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
                      agent.name === "Rajesh Kumar"
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
                          {agent.name === "Rajesh Kumar" && " (You)"}
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
