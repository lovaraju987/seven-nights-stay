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
  Menu,
  Loader2
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { supabase, authHelpers } from "@/integrations/supabase/client";

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
  const [hostel, setHostel] = useState<any>(null);
  const [roomCount, setRoomCount] = useState({ single: 0, double: 0, triple: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [userId, setUserId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: ''
    },
    phone: '',
    email: '',
    propertyType: 'Student Hostel',
    type: 'boys' // Default value
  });

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const { data: { user } } = await authHelpers.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }
      
      setUserId(user.id);
      
      // Check if user has owner role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (profileError || profile.role !== 'owner') {
        toast.error("You don't have permission to access this page");
        navigate("/");
        return;
      }
      
      // Fetch hostel data
      if (hostelId) {
        fetchHostelData(hostelId, user.id);
      }
    };
    
    checkAuth();
  }, [hostelId, navigate]);
  
  const fetchHostelData = async (id: string, ownerId: string) => {
    try {
      const { data: hostelData, error: hostelError } = await supabase
        .from('hostels')
        .select('*')
        .eq('id', id)
        .eq('owner_id', ownerId)
        .single();
        
      if (hostelError) throw hostelError;
      
      if (hostelData) {
        setHostel(hostelData);
        
        // Set form data
        setFormData({
          name: hostelData.name,
          description: hostelData.description || '',
          address: hostelData.address || {
            line1: '',
            line2: '',
            city: '',
            state: '',
            pincode: ''
          },
          phone: '',
          email: '',
          propertyType: 'Student Hostel',
          type: hostelData.type || 'boys'
        });
        
        // Fetch room counts
        const { data: roomsData, error: roomsError } = await supabase
          .from('rooms')
          .select('type, beds_total')
          .eq('hostel_id', id);
          
        if (roomsError) throw roomsError;
        
        if (roomsData) {
          const counts = {
            single: 0,
            double: 0, 
            triple: 0,
            total: roomsData.length
          };
          
          roomsData.forEach((room: any) => {
            if (room.type === 'single') counts.single++;
            if (room.type === 'double') counts.double++;
            if (room.type === 'triple') counts.triple++;
          });
          
          setRoomCount(counts);
        }
      }
    } catch (error) {
      console.error("Error fetching hostel data:", error);
      toast.error("Failed to load hostel data");
    } finally {
      setIsLoadingPage(false);
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle address fields
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Format address for JSONB column
      const formattedAddress = {
        line1: formData.address.line1,
        line2: formData.address.line2,
        city: formData.address.city,
        state: formData.address.state,
        pincode: formData.address.pincode
      };
      
      const { error } = await supabase
        .from('hostels')
        .update({
          name: formData.name,
          description: formData.description,
          address: formattedAddress,
          type: formData.type
        })
        .eq('id', hostelId);
        
      if (error) throw error;
      
      // Update local state
      setHostel({
        ...hostel,
        name: formData.name,
        description: formData.description,
        address: formattedAddress,
        type: formData.type
      });
      
      setIsEditing(false);
      toast.success("Hostel details updated successfully");
    } catch (error: any) {
      console.error("Error updating hostel:", error);
      toast.error(error.message || "Failed to update hostel");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle deletion confirmation
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this hostel? This action cannot be undone.")) {
      setIsLoading(true);
      
      try {
        // Delete hostel
        const { error } = await supabase
          .from('hostels')
          .delete()
          .eq('id', hostelId);
          
        if (error) throw error;
        
        navigate("/owner/dashboard");
        toast.success("Hostel deleted successfully");
      } catch (error: any) {
        console.error("Error deleting hostel:", error);
        toast.error(error.message || "Failed to delete hostel");
        setIsLoading(false);
      }
    }
  };

  if (isLoadingPage) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }
  
  if (!hostel) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold mb-2">Hostel Not Found</h2>
          <p className="text-gray-500 mb-6">The hostel you're looking for doesn't exist or you don't have permission to access it.</p>
          <Button onClick={() => navigate("/owner/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
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
            <p className="text-muted-foreground">
              {hostel.address && typeof hostel.address === 'object' ? 
                `${hostel.address.city || ''}, ${hostel.address.state || ''}` : 
                'Address not available'}
            </p>
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
                      <Label>Hostel Type</Label>
                      <div className="flex space-x-4">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="boys"
                            name="type"
                            value="boys"
                            checked={formData.type === 'boys'}
                            onChange={() => setFormData({...formData, type: 'boys'})}
                            className="mr-2"
                          />
                          <label htmlFor="boys">Boys</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="girls"
                            name="type"
                            value="girls"
                            checked={formData.type === 'girls'}
                            onChange={() => setFormData({...formData, type: 'girls'})}
                            className="mr-2"
                          />
                          <label htmlFor="girls">Girls</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="coed"
                            name="type"
                            value="coed"
                            checked={formData.type === 'coed'}
                            onChange={() => setFormData({...formData, type: 'coed'})}
                            className="mr-2"
                          />
                          <label htmlFor="coed">Co-ed</label>
                        </div>
                      </div>
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
                    <Label>Address</Label>
                    <div className="space-y-3">
                      <Input 
                        name="address.line1" 
                        placeholder="Address Line 1" 
                        value={formData.address.line1} 
                        onChange={handleChange}
                      />
                      <Input 
                        name="address.line2" 
                        placeholder="Address Line 2 (optional)" 
                        value={formData.address.line2} 
                        onChange={handleChange}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input 
                          name="address.city" 
                          placeholder="City" 
                          value={formData.address.city} 
                          onChange={handleChange}
                        />
                        <Input 
                          name="address.state" 
                          placeholder="State" 
                          value={formData.address.state} 
                          onChange={handleChange}
                        />
                        <Input 
                          name="address.pincode" 
                          placeholder="Pincode" 
                          value={formData.address.pincode} 
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setFormData({
                          name: hostel.name,
                          description: hostel.description || '',
                          address: hostel.address || {
                            line1: '',
                            line2: '',
                            city: '',
                            state: '',
                            pincode: ''
                          },
                          phone: '',
                          email: '',
                          propertyType: 'Student Hostel',
                          type: hostel.type || 'boys'
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
                    <p>{hostel.type === 'boys' ? 'Boys Hostel' : hostel.type === 'girls' ? 'Girls Hostel' : 'Co-ed Hostel'}</p>
                  </div>
                  
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>Address:</span>
                    </div>
                    <p>
                      {hostel.address && typeof hostel.address === 'object' ? (
                        <>
                          {hostel.address.line1}{hostel.address.line1 && hostel.address.line2 && ', '}{hostel.address.line2}<br/>
                          {hostel.address.city}{hostel.address.city && ', '}{hostel.address.state}{' '}
                          {hostel.address.pincode && `- ${hostel.address.pincode}`}
                        </>
                      ) : 'Address not available'}
                    </p>
                  </div>
                  
                  <div className="grid gap-2">
                    <h3 className="text-muted-foreground">Description:</h3>
                    <p>{hostel.description || 'No description available'}</p>
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
                      {roomCount.single} rooms available
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-2xl font-bold">
                      <span className="text-sm font-normal text-muted-foreground">Pricing varies by room</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Double Occupancy</CardTitle>
                    <CardDescription>
                      {roomCount.double} rooms available
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-2xl font-bold">
                      <span className="text-sm font-normal text-muted-foreground">Pricing varies by room</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="sm:col-span-2 lg:col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Triple Occupancy</CardTitle>
                    <CardDescription>
                      {roomCount.triple} rooms available
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-2xl font-bold">
                      <span className="text-sm font-normal text-muted-foreground">Pricing varies by room</span>
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
                  {['WiFi', 'Common Area', 'TV Room', 'CCTV', '24/7 Security', 'Laundry', 'Meals'].map((amenity, index) => (
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
                  {(hostel.images && hostel.images.length > 0 ? hostel.images : ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg", "/placeholder.svg"]).map((photo: string, index: number) => (
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
