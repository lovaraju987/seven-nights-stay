
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { QrCode, Download, Share2, Copy, Check } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { toast } from "@/components/ui/sonner";

const QRStorefront = () => {
  const { hostelId } = useParams();
  const [copied, setCopied] = useState(false);
  const [settings, setSettings] = useState({
    enableDirectBooking: true,
    showPricing: true,
    showRoomAvailability: true,
    allowReviews: true
  });
  
  // Mock data for the current hostel
  const hostelData = {
    id: hostelId,
    name: "Backpackers Haven",
    address: "123 Main Street, Koramangala, Bangalore",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://oneto7.com/hostel/" + hostelId,
    storefrontUrl: "https://oneto7.com/hostel/" + hostelId
  };
  
  const handleToggleChange = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    toast.success(`Setting updated successfully`);
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(hostelData.storefrontUrl);
    setCopied(true);
    toast.success("Link copied to clipboard");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const handleDownloadQR = () => {
    // In a real app, this would trigger download of the QR code
    const link = document.createElement('a');
    link.href = hostelData.qrCodeUrl;
    link.download = `${hostelData.name.replace(/\s+/g, '-')}-QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("QR Code download started");
  };
  
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">QR Storefront</h1>
        <p className="text-gray-600">
          Generate a QR code for your hostel to allow quick access to your listing
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* QR Code Section */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium">QR Code for {hostelData.name}</h2>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4 w-64 h-64 flex items-center justify-center">
              <AspectRatio ratio={1/1} className="bg-white">
                <img 
                  src={hostelData.qrCodeUrl} 
                  alt="QR Code" 
                  className="h-full w-full object-contain"
                />
              </AspectRatio>
            </div>
            
            <div className="flex gap-4 mt-4 w-full">
              <Button 
                variant="outline" 
                className="flex-1 flex items-center gap-2"
                onClick={handleDownloadQR}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 flex items-center gap-2"
                onClick={() => {
                  // In a real app, this would trigger a share dialog
                  toast.info("Share functionality would open here");
                }}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
            
            <div className="mt-6 w-full">
              <Label htmlFor="storefront-url" className="mb-2 block">Storefront URL</Label>
              <div className="flex">
                <Input 
                  id="storefront-url" 
                  value={hostelData.storefrontUrl}
                  readOnly
                  className="rounded-r-none"
                />
                <Button 
                  onClick={handleCopyLink} 
                  variant="secondary" 
                  className="rounded-l-none"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Share this URL directly or through the QR code
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Settings Section */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium">Storefront Settings</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Direct Booking</p>
                  <p className="text-sm text-gray-500">
                    Allow customers to book directly through the storefront
                  </p>
                </div>
                <Switch 
                  checked={settings.enableDirectBooking} 
                  onCheckedChange={() => handleToggleChange('enableDirectBooking')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Pricing</p>
                  <p className="text-sm text-gray-500">
                    Display room rates on your storefront
                  </p>
                </div>
                <Switch 
                  checked={settings.showPricing} 
                  onCheckedChange={() => handleToggleChange('showPricing')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Room Availability</p>
                  <p className="text-sm text-gray-500">
                    Display available beds and rooms
                  </p>
                </div>
                <Switch 
                  checked={settings.showRoomAvailability} 
                  onCheckedChange={() => handleToggleChange('showRoomAvailability')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Allow Reviews</p>
                  <p className="text-sm text-gray-500">
                    Let customers leave reviews on your storefront
                  </p>
                </div>
                <Switch 
                  checked={settings.allowReviews} 
                  onCheckedChange={() => handleToggleChange('allowReviews')}
                />
              </div>
              
              <div className="pt-4 mt-4 border-t">
                <Button className="w-full">Save Changes</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <h2 className="text-lg font-medium">QR Code Usage Statistics</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Total Scans</p>
              <p className="text-2xl font-bold">127</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Bookings via QR</p>
              <p className="text-2xl font-bold">23</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <p className="text-2xl font-bold">18.1%</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Promote your QR code in your property, on business cards, and in local tourist spots to increase visibility.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRStorefront;
