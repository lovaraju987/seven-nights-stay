
import React, { useState, useEffect } from "react";
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
  ArrowLeftIcon, 
  PencilIcon, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Wifi, 
  Tv, 
  Utensils, 
  ShowerHead,
  TrashIcon,
  Menu
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { supabase } from "@/lib/supabase";


const ManageHostel = () => {
  const { hostelId } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [hostel, setHostel] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    propertyType: ""
  });

  // Fetch hostel details
  useEffect(() => {
    const fetchHostel = async () => {
      if (!hostelId) return;
      setIsLoading(true);
      const { data, error } = await supabase
        .from("hostels")
        .select("*")
        .eq("id", hostelId)
        .single();
      if (error || !data) {
        console.error("Failed to fetch hostel", error);
        toast({
          title: "Error",
          description: "Could not load hostel details",
          variant: "destructive",
        });
      } else {
        setHostel(data);
        setFormData({
          name: data.name || "",
          description: data.description || "",
          address: (data.address?.address ?? data.address) || "",
          phone: data.phone || "",
          email: data.email || "",
          propertyType: data.propertyType || data.type || "",
        });
      }
      setIsLoading(false);
    };
    fetchHostel();
  }, [hostelId]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostelId) return;
    setIsLoading(true);

    const { error } = await supabase
      .from("hostels")
      .update({
        name: formData.name,
        description: formData.description,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        type: formData.propertyType,
      })
      .eq("id", hostelId);

    if (error) {
      console.error("Failed to update hostel", error);
      toast({
        title: "Error",
        description: "Failed to update hostel details",
        variant: "destructive",
      });
    } else {
      if (hostel) {
        setHostel({ ...hostel, ...formData });
      }
      setIsEditing(false);
      toast({
        title: "Hostel updated",
        description: "Your hostel details have been updated successfully.",
      });
    }
    setIsLoading(false);
  };
  
  // Handle deletion confirmation
  const handleDelete = async () => {
    if (!hostelId) return;
    if (window.confirm("Are you sure you want to delete this hostel? This action cannot be undone.")) {
      setIsLoading(true);
      const { error } = await supabase.from("hostels").delete().eq("id", hostelId);
      if (error) {
        console.error("Failed to delete hostel", error);
        toast({
          title: "Error",
          description: "Failed to delete hostel",
          variant: "destructive",
        });
      } else {
        navigate("/owner/dashboard");
        toast({
          title: "Hostel deleted",
          description: "Your hostel has been removed from our platform.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }
  };

  if (!hostel) {
    return (
      <div className="flex items-center justify-center p-6">Loading...</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Mobile navigation */}
      <div className="flex md:hidden justify-between items-center mb-4">
        <Button 
          variant="ghost" 
          className="p-0" 
          onClick={() => navigate("/owner/dashboard")}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] sm:w-[300px]">
            <div className="py-4 space-y-4">
              <h2 className="text-lg font-medium">Manage Hostel</h2>
              <nav className="flex flex-col space-y-2">
                <Button 
                  variant={activeTab === "details" ? "default" : "ghost"} 
                  className="justify-start" 
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </Button>
                <Button 
                  variant={activeTab === "rooms" ? "default" : "ghost"} 
                  className="justify-start"
                  onClick={() => setActiveTab("rooms")}
                >
                  Rooms & Pricing
                </Button>
                <Button 
                  variant={activeTab === "amenities" ? "default" : "ghost"} 
                  className="justify-start"
                  onClick={() => setActiveTab("amenities")}
                >
                  Amenities & Photos
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="mt-4"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete Hostel
                </Button>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Back button and header */}
      <div className="mb-6">
        <div className="hidden md:block">
          <Button 
            variant="ghost" 
            className="mb-4 p-0" 
            onClick={() => navigate("/owner/dashboard")}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">{hostel.name}</h1>
            <p className="text-muted-foreground">{hostel.address}</p>
          </div>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isLoading}
            className="hidden md:flex"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete Hostel
          </Button>
        </div>
      </div>
      
      {/* Main content with tabs */}
      <Tabs 
        defaultValue="details" 
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-3 mb-6 hidden md:grid">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="rooms">Rooms & Pricing</TabsTrigger>
          <TabsTrigger value="amenities">Amenities & Photos</TabsTrigger>
        </TabsList>
        
        {/* Details Tab */}
        <TabsContent value="details">
          <Card className="border-sidebar-border bg-sidebar-accent">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Hostel Information
                {!isEditing && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
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
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building className="h-4 w-4" />
                      <span>Type:</span>
                    </div>
                    <p>{hostel.propertyType}</p>
                  </div>
                  
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>Address:</span>
                    </div>
                    <p>{hostel.address}</p>
                  </div>
                  
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>Phone:</span>
                    </div>
                    <p>{hostel.phone}</p>
                  </div>
                  
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>Email:</span>
                    </div>
                    <p>{hostel.email}</p>
                  </div>
                  
                  <div className="grid gap-2">
                    <h3 className="text-muted-foreground">Description:</h3>
                    <p>{hostel.description}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Rooms Tab */}
        <TabsContent value="rooms">
          <Card className="border-sidebar-border bg-sidebar-accent">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      <span className="text-sm font-normal text-muted-foreground">/month</span>
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
                      <span className="text-sm font-normal text-muted-foreground">/month</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="sm:col-span-2 lg:col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Triple Occupancy</CardTitle>
                    <CardDescription>
                      {hostel.tripleOccupancy} rooms available
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-2xl font-bold">
                      ₹{hostel.price.triple}
                      <span className="text-sm font-normal text-muted-foreground">/month</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6 bg-sidebar-accent rounded-lg p-4 border border-sidebar-border">
                <p className="text-sm text-muted-foreground">
                  Go to the Manage Rooms page for detailed configuration of room types, 
                  inventory management, and setting up room-specific amenities and photos.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Amenities Tab */}
        <TabsContent value="amenities">
          <Card className="border-sidebar-border bg-sidebar-accent">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                  {hostel.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 bg-sidebar-primary/10 p-3 rounded-md">
                      {amenity === "WiFi" ? <Wifi className="h-4 w-4 text-sidebar-primary" /> : 
                       amenity === "TV Room" ? <Tv className="h-4 w-4 text-sidebar-primary" /> : 
                       amenity === "Mess" ? <Utensils className="h-4 w-4 text-sidebar-primary" /> : 
                       amenity === "Hot Water" ? <ShowerHead className="h-4 w-4 text-sidebar-primary" /> : 
                       <div className="w-4 h-4 bg-sidebar-primary rounded-full" />}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {hostel.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <AspectRatio ratio={4/3} className="bg-sidebar-accent border border-sidebar-border rounded-md overflow-hidden">
                        <img
                          src={photo}
                          alt={`Hostel photo ${index + 1}`}
                          className="object-cover h-full w-full"
                        />
                      </AspectRatio>
                      <div className="absolute inset-0 bg-sidebar-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
