
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

const ManageHostel = () => {
  const { hostelId } = useParams();
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
        <h1 className="text-2xl font-bold">Manage Hostel</h1>
        <p className="text-gray-500">Edit your hostel details</p>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-semibold">Hostel ID: {hostelId}</h2>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">This page is under construction. Soon, you'll be able to manage your hostel details here.</p>
          <div className="mt-4">
            <Button 
              onClick={() => navigate(`/owner/manage-rooms/${hostelId}`)}
              className="mr-4"
            >
              Manage Rooms
            </Button>
            <Button 
              onClick={() => navigate(`/owner/qr-storefront/${hostelId}`)}
              variant="outline"
            >
              View QR & Storefront
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageHostel;
