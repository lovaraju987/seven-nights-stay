
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  BarChart2,
  Users,
  Home,
  AlertCircle,
  Calendar,
  TrendingUp,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

// Mock data for charts
const bookingData = [
  { name: "Jan", bookings: 65 },
  { name: "Feb", bookings: 59 },
  { name: "Mar", bookings: 80 },
  { name: "Apr", bookings: 81 },
  { name: "May", bookings: 56 },
  { name: "Jun", bookings: 55 },
  { name: "Jul", bookings: 40 },
];

const revenueData = [
  { name: "Jan", revenue: 13000 },
  { name: "Feb", revenue: 9800 },
  { name: "Mar", revenue: 15000 },
  { name: "Apr", revenue: 17000 },
  { name: "May", revenue: 12000 },
  { name: "Jun", revenue: 14000 },
  { name: "Jul", revenue: 18000 },
];

const hostelTypeData = [
  { name: "Boys", value: 45 },
  { name: "Girls", value: 35 },
  { name: "Co-ed", value: 20 },
];

const COLORS = ["#0088FE", "#FF8042", "#FFBB28"];

const AdminDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Hostels",
      value: "124",
      description: "Verified: 98 | Pending: 26",
      icon: <Home className="h-8 w-8 text-blue-500" />,
      onClick: () => navigate("/admin/hostels"),
    },
    {
      title: "Total Users",
      value: "3,542",
      description: "Active: 3,128 | Blocked: 414",
      icon: <Users className="h-8 w-8 text-green-500" />,
      onClick: () => navigate("/admin/users"),
    },
    {
      title: "Active Owners",
      value: "86",
      description: "Subscription Active: 74",
      icon: <ShieldCheck className="h-8 w-8 text-violet-500" />,
      onClick: () => navigate("/admin/owners"),
    },
    {
      title: "Total Bookings",
      value: "12,543",
      description: "This Month: 843",
      icon: <Calendar className="h-8 w-8 text-yellow-500" />,
      onClick: () => navigate("/admin/bookings"),
    },
    {
      title: "Complaints",
      value: "12",
      description: "Open: 5 | Resolved: 7",
      icon: <AlertCircle className="h-8 w-8 text-red-500" />,
      onClick: () => navigate("/admin/complaints"),
    },
    {
      title: "Monthly Revenue",
      value: "₹182,500",
      description: "14% increase from last month",
      icon: <CreditCard className="h-8 w-8 text-teal-500" />,
      onClick: () => navigate("/admin/reports"),
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/reports")}
            >
              Export Reports
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={stat.onClick}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Bookings Overview</CardTitle>
              <CardDescription>Monthly booking trend for the current year</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Hostel Types</CardTitle>
              <CardDescription>Distribution by gender</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hostelTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {hostelTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Subscription Revenue</CardTitle>
              <CardDescription>Monthly revenue from hostel owner subscriptions</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4c1d95"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
