
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, Download, Share2, QrCodeIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

const QRStorefront = () => {
  const { hostelId } = useParams();
  const navigate = useNavigate();
  const storefrontUrl = `https://oneto7.example.com/hostel/${hostelId}`;

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
      
      <header className="mb-8">
        <h1 className="text-2xl font-bold">QR Code & Storefront</h1>
        <p className="text-gray-500">Access your hostel's QR code and public storefront URL</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">QR Code</h2>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <QrCodeIcon className="h-48 w-48 text-gray-800" />
            </div>
            <p className="text-sm text-gray-500 mb-4 text-center">
              Print this QR code and place it at your hostel reception for easy booking
            </p>
            <div className="flex gap-4">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download QR
              </Button>
              <Button variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Storefront Link</h2>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">
                Share this link with potential customers to let them view and book your hostel directly
              </p>
              <div className="flex">
                <Input value={storefrontUrl} readOnly />
                <Button className="ml-2">Copy</Button>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-medium mb-2">Storefront Preview</h3>
              <div className="border rounded-md p-4 bg-gray-50">
                <p className="text-gray-600">Storefront preview will be available soon.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRStorefront;
