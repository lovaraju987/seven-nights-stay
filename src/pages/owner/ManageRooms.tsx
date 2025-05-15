
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";

const ManageRooms = () => {
  const { hostelId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate(`/owner/manage-hostel/${hostelId}`)}
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Hostel Details
      </Button>
      
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manage Rooms</h1>
          <p className="text-gray-500">Add and edit rooms for your hostel</p>
        </div>
        <Button className="gap-2">
          <PlusIcon className="h-4 w-4" />
          Add New Room
        </Button>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-semibold">Hostel ID: {hostelId}</h2>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">This page is under construction. Soon, you'll be able to add and manage rooms for your hostel here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageRooms;
