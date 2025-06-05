
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/sonner";
import { ArrowLeftIcon, MapPinIcon, ImageIcon, HomeIcon } from "lucide-react";

// Mock amenities list
const amenitiesList = [
  "WiFi", "AC", "TV", "Laundry", "Parking", "Kitchen", "Gym", 
  "Power Backup", "CCTV", "Lift", "Drinking Water", "Hot Water",
  "Study Table", "Refrigerator", "Microwave", "Common Room"
];

const AddHostel = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "Boys", // Default value
    description: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    contactNumber: "",
    amenities: [] as string[],
    agreeToTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => {
      if (prev.amenities.includes(amenity)) {
        return {
          ...prev,
          amenities: prev.amenities.filter(a => a !== amenity)
        };
      } else {
        return {
          ...prev,
          amenities: [...prev.amenities, amenity]
        };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.name.trim() === "") {
      toast.error("Hostel name is required");
      return;
    }
    
    if (formData.address.trim() === "") {
      toast.error("Address is required");
      return;
    }
    
    if (!formData.agreeToTerms) {
      toast.error("You must agree to the terms and conditions");
      return;
    }
    
    setIsLoading(true);
    
    // Simulating API call to submit hostel
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Hostel submitted for review!");
      navigate("/owner/dashboard");
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate("/owner/dashboard")}
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
      
      <header className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <HomeIcon className="h-6 w-6" /> Add New Hostel
        </h1>
        <p className="text-gray-500">Fill in the details to list your hostel on OneTo7</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Basic Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Hostel Name *</Label>
              <Input 
                id="name" 
                name="name"
                placeholder="E.g. Royal Boys Hostel" 
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label>Hostel Type *</Label>
              <RadioGroup 
                defaultValue={formData.type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                className="flex flex-wrap gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Boys" id="boys" />
                  <Label htmlFor="boys" className="cursor-pointer">Boys</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Girls" id="girls" />
                  <Label htmlFor="girls" className="cursor-pointer">Girls</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Co-ed" id="co-ed" />
                  <Label htmlFor="co-ed" className="cursor-pointer">Co-ed</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description"
                placeholder="Tell us about your hostel, its unique features, and nearby landmarks" 
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Location</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Full Address *</Label>
              <Textarea 
                id="address" 
                name="address"
                placeholder="Enter complete address with building name, street, etc." 
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input 
                  id="city" 
                  name="city"
                  placeholder="E.g. Mumbai" 
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input 
                  id="state" 
                  name="state"
                  placeholder="E.g. Maharashtra" 
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input 
                  id="pincode" 
                  name="pincode"
                  placeholder="E.g. 400001" 
                  value={formData.pincode}
                  onChange={handleInputChange}
                  maxLength={6}
                />
              </div>
            </div>
            
            <div>
              <Button 
                type="button" 
                variant="outline"
                className="w-full md:w-auto gap-2"
              >
                <MapPinIcon className="h-4 w-4" />
                Choose on Map
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                Select the precise location to help users find your hostel
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Amenities</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {amenitiesList.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`amenity-${amenity}`} 
                    checked={formData.amenities.includes(amenity)}
                    onCheckedChange={() => handleAmenityToggle(amenity)}
                  />
                  <label 
                    htmlFor={`amenity-${amenity}`}
                    className="text-sm cursor-pointer"
                  >
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact & Support */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Contact & Support</h2>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="contactNumber">Support Contact Number *</Label>
              <Input 
                id="contactNumber" 
                name="contactNumber"
                placeholder="Contact number for hostel inquiries" 
                value={formData.contactNumber}
                onChange={handleInputChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                This number will be visible to users for hostel-specific inquiries
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Media Upload */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Photos & Videos</h2>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
              <ImageIcon className="h-8 w-8 mx-auto text-gray-400" />
              <h3 className="mt-2 text-sm font-medium">Upload Hostel Images</h3>
              <p className="mt-1 text-xs text-gray-500">
                Upload clear images of rooms, common areas, and exterior. JPEG, PNG, or GIF only.
              </p>
              <Button 
                type="button" 
                variant="outline" 
                className="mt-4"
              >
                Upload Images
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Terms & Submit */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Checkbox 
                id="terms" 
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                }
              />
              <label 
                htmlFor="terms"
                className="text-sm"
              >
                I confirm that the information provided is accurate and I agree to the <a href="#" className="text-blue-600">Terms & Conditions</a>
              </label>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/owner/dashboard")}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span> 
                    Submitting...
                  </>
                ) : (
                  "Submit for Review"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default AddHostel;
