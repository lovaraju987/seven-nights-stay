
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, BarChart4, LineChart, PieChart, FileDown } from "lucide-react";

const Analytics = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate("/owner/dashboard")}
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
      
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Analytics & Reports</h1>
          <p className="text-gray-500">View insights and performance metrics for your hostel</p>
        </div>
        <Button variant="outline" className="gap-2">
          <FileDown className="h-4 w-4" />
          Export Data
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Booking Trends</h2>
          </CardHeader>
          <CardContent className="h-60 flex items-center justify-center">
            <LineChart className="h-40 w-40 text-gray-300" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Room Occupancy</h2>
          </CardHeader>
          <CardContent className="h-60 flex items-center justify-center">
            <BarChart4 className="h-40 w-40 text-gray-300" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Booking Sources</h2>
          </CardHeader>
          <CardContent className="h-48 flex items-center justify-center">
            <PieChart className="h-32 w-32 text-gray-300" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Revenue</h2>
          </CardHeader>
          <CardContent className="h-48 flex items-center justify-center">
            <LineChart className="h-32 w-32 text-gray-300" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Customer Ratings</h2>
          </CardHeader>
          <CardContent className="h-48 flex items-center justify-center">
            <BarChart4 className="h-32 w-32 text-gray-300" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Detailed Reports</h2>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-8">
            This section is under construction. Soon, you'll be able to access detailed reports here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
