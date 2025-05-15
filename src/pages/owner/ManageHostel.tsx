
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Edit, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Wifi, 
  Tv, 
  Utensils, 
  ShowerHead,
  Trash2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Mock data for a sample hostel
const mockHostel = {
  id: "1",
  name: "Royal Boys Hostel",
  description: "A comfortable and affordable hostel for male students, located close to major universities and educational institutions.",
  address: "123 College Road, Bangalore, Karnataka, 560001",
  phone: "+91 9876543210",
  email: "info@royalboyshoste.com",
  propertyType: "Student Hostel",
  rooms: 45,
  bathrooms: 20,
  singleOccupancy: 15,
  doubleOccupancy: 20,
  tripleOccupancy: 10,
  price: {
    single: 8000,
    double: 6000,
    triple: 4500
  },
  amenities: [
    "WiFi", "TV Room", "Mess", "Laundry", "Power Backup", 
    "Hot Water", "Security", "CCTV", "Study Room"
  ],
  photos: [
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg"
  ]
};

const ManageHostel = () => {
  const { hostelId } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [hostel, setHostel] = useState(mockHostel);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: hostel.name,
    description: hostel.description,
    address: hostel.address,
    phone: hostel.phone,
    email: hostel.email,
    propertyType: hostel.propertyType
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setHostel({
        ...hostel,
        ...formData
      });
      setIsEditing(false);
      setIsLoading(false);
      toast({
        title: "Hostel updated",
        description: "Your hostel details have been updated successfully.",
      });
    }, 1500);
  };
  
  // Handle deletion confirmation
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this hostel? This action cannot be undone.")) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        navigate("/owner/dashboard");
        toast({
          title: "Hostel deleted",
          description: "Your hostel has been removed from our platform.",
          variant: "destructive"
        });
      }, 1500);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Back button and header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="mb-4 p-0" 
          onClick={() => navigate("/owner/dashboard")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">{hostel.name}</h1>
            <p className="text-gray-500">{hostel.address}</p>
          </div>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Hostel
          </Button>
        </div>
      </div>
      
      {/* Main content with tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="rooms">Rooms & Pricing</TabsTrigger>
          <TabsTrigger value="amenities">Amenities & Photos</TabsTrigger>
        </TabsList>
        
        {/* Details Tab */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Hostel Information
                {!isEditing && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Details
                  </Button>
                )}
              </CardTitle>
              <CardDescription>
                Manage your hostel's basic information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Hostel Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="propertyType">Property Type</Label>
                      <Input 
                        id="propertyType" 
                        name="propertyType" 
                        value={formData.propertyType} 
                        onChange={handleChange} 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      value={formData.description} 
                      onChange={handleChange} 
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea 
                      id="address" 
                      name="address" 
                      value={formData.address} 
                      onChange={handleChange} 
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={formData.phone}
                        onChange={handleChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setFormData({
                          name: hostel.name,
                          description: hostel.description,
                          address: hostel.address,
                          phone: hostel.phone,
                          email: hostel.email,
                          propertyType: hostel.propertyType
                        });
                        setIsEditing(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Building className="h-4 w-4" />
                      <span>Type:</span>
                    </div>
                    <p>{hostel.propertyType}</p>
                  </div>
                  
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>Address:</span>
                    </div>
                    <p>{hostel.address}</p>
                  </div>
                  
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Phone className="h-4 w-4" />
                      <span>Phone:</span>
                    </div>
                    <p>{hostel.phone}</p>
                  </div>
                  
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Mail className="h-4 w-4" />
                      <span>Email:</span>
                    </div>
                    <p>{hostel.email}</p>
                  </div>
                  
                  <div className="grid gap-2">
                    <h3 className="text-gray-500">Description:</h3>
                    <p>{hostel.description}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Rooms Tab */}
        <TabsContent value="rooms">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Rooms & Pricing
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => navigate(`/owner/manage-rooms/${hostelId}`)}
                >
                  Manage Rooms
                </Button>
              </CardTitle>
              <CardDescription>
                Overview of your hostel's room inventory and pricing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Single Occupancy</CardTitle>
                    <CardDescription>
                      {hostel.singleOccupancy} rooms available
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-2xl font-bold">
                      ₹{hostel.price.single}
                      <span className="text-sm font-normal text-gray-500">/month</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Double Occupancy</CardTitle>
                    <CardDescription>
                      {hostel.doubleOccupancy} rooms available
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-2xl font-bold">
                      ₹{hostel.price.double}
                      <span className="text-sm font-normal text-gray-500">/month</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Triple Occupancy</CardTitle>
                    <CardDescription>
                      {hostel.tripleOccupancy} rooms available
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-2xl font-bold">
                      ₹{hostel.price.triple}
                      <span className="text-sm font-normal text-gray-500">/month</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">
                  Go to the Manage Rooms page for detailed configuration of room types, 
                  inventory management, and setting up room-specific amenities and photos.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Amenities Tab */}
        <TabsContent value="amenities">
          <Card>
            <CardHeader>
              <CardTitle>Amenities & Photos</CardTitle>
              <CardDescription>
                Showcase your hostel's features and facilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Amenities Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">Available Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hostel.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                      {amenity === "WiFi" ? <Wifi className="h-4 w-4 text-blue-500" /> : 
                       amenity === "TV Room" ? <Tv className="h-4 w-4 text-blue-500" /> : 
                       amenity === "Mess" ? <Utensils className="h-4 w-4 text-blue-500" /> : 
                       amenity === "Hot Water" ? <ShowerHead className="h-4 w-4 text-blue-500" /> : 
                       <div className="w-4 h-4 bg-blue-500 rounded-full" />}
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline">
                    Edit Amenities
                  </Button>
                </div>
              </div>
              
              {/* Photos Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">Hostel Photos</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {hostel.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <AspectRatio ratio={4/3} className="bg-gray-100 rounded-md overflow-hidden">
                        <img
                          src={photo}
                          alt={`Hostel photo ${index + 1}`}
                          className="object-cover h-full w-full"
                        />
                      </AspectRatio>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="secondary" size="sm" className="text-xs">
                          Replace
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline">
                    Manage Photos
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageHostel;
