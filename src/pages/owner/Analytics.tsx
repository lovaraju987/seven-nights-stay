
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock data for charts
const occupancyData = [
  { month: "Jan", rate: 65 },
  { month: "Feb", rate: 70 },
  { month: "Mar", rate: 75 },
  { month: "Apr", rate: 80 },
  { month: "May", rate: 85 },
  { month: "Jun", rate: 90 },
];

const revenueData = [
  { month: "Jan", revenue: 35000 },
  { month: "Feb", revenue: 38000 },
  { month: "Mar", revenue: 42000 },
  { month: "Apr", revenue: 40000 },
  { month: "May", revenue: 45000 },
  { month: "Jun", revenue: 48000 },
];

const roomDistributionData = [
  { name: "Single", value: 30 },
  { name: "Double", value: 45 },
  { name: "Triple", value: 25 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const Analytics = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <Button
        variant="ghost"
        className="mb-6 p-0"
        onClick={() => navigate("/owner/dashboard")}
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Analytics</h1>
        <p className="text-gray-500">Track your hostel's performance metrics</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy Rate Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={occupancyData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    name="Occupancy Rate (%)"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue (₹)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Room Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Room Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roomDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {roomDistributionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Booking Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <p className="text-gray-500 text-center">
                Future update will include data on booking sources.<br />
                This feature is coming soon.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
