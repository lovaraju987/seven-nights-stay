
import React from "react";
import AgentLayout from "@/components/agent/AgentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HomeIcon, CheckCircleIcon, ClockIcon, CalendarIcon, BellIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data for the dashboard
const stats = [
  {
    title: "Hostels Added",
    value: 24,
    icon: <HomeIcon className="h-5 w-5 text-blue-500" />,
    iconBg: "bg-blue-100",
    change: "+4 this month",
  },
  {
    title: "Approved Hostels",
    value: 18,
    icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
    iconBg: "bg-green-100",
    change: "75% approval rate",
  },
  {
    title: "Pending Approvals",
    value: 6,
    icon: <ClockIcon className="h-5 w-5 text-orange-500" />,
    iconBg: "bg-orange-100",
    change: "2 submitted today",
  },
];

const upcomingVisits = [
  {
    hostelName: "Royal Boys Hostel",
    location: "Koramangala, Bangalore",
    date: "Today, 2:00 PM",
    purpose: "Photo Update",
  },
  {
    hostelName: "Comfort PG",
    location: "HSR Layout, Bangalore",
    date: "Tomorrow, 11:00 AM",
    purpose: "Initial Visit",
  },
];

const followUps = [
  {
    hostelName: "Sri Krishna Hostel",
    task: "Collect ID proof from owner",
    priority: "high",
    deadline: "Today",
  },
  {
    hostelName: "Elite Girls PG",
    task: "Explain new features to owner",
    priority: "medium",
    deadline: "Tomorrow",
  },
  {
    hostelName: "Friendly Boys Hostel",
    task: "Follow up on pending payment",
    priority: "high",
    deadline: "Overdue",
  },
];

const AgentDashboard = () => {
  const navigate = useNavigate();

  return (
    <AgentLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome, Rajesh!</h1>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Visits */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-gray-500" />
                Upcoming Visits
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingVisits.length > 0 ? (
                <div className="space-y-4">
                  {upcomingVisits.map((visit, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{visit.hostelName}</h4>
                          <p className="text-sm text-gray-500">{visit.location}</p>
                        </div>
                        <Badge variant="outline">{visit.purpose}</Badge>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">{visit.date}</div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">View Calendar</Button>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">No upcoming visits</div>
              )}
            </CardContent>
          </Card>

          {/* Follow-ups */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <BellIcon className="h-5 w-5 text-gray-500" />
                Follow-ups & Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {followUps.length > 0 ? (
                <div className="space-y-4">
                  {followUps.map((task, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{task.hostelName}</h4>
                          <p className="text-sm">{task.task}</p>
                        </div>
                        <Badge
                          variant={
                            task.priority === "high"
                              ? "destructive"
                              : task.priority === "medium"
                              ? "outline"
                              : "secondary"
                          }
                        >
                          {task.deadline}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/agent/tasks")}
                  >
                    View All Tasks
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">No pending tasks</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AgentLayout>
  );
};

export default AgentDashboard;
