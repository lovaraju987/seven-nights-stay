
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

const BookingList = () => {
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
      
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Booking List</h1>
        <p className="text-gray-500">View and manage your bookings</p>
      </header>

      <div className="flex mb-6">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search bookings..." 
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="ml-4">Filter</Button>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-600">This page is under construction. Soon, you'll be able to view and manage your bookings here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingList;
