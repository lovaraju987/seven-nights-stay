
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, Star, Heart, Share, Wifi, Coffee, Tv, Camera, Phone, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Hostel, Room } from "@/types/database";

const HostelDetail = () => {
  const { hostelId } = useParams<{ hostelId: string }>();
  const navigate = useNavigate();
  
  const [hostel, setHostel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (hostelId) {
      fetchHostelDetails();
      checkWishlist();
    }
  }, [hostelId]);

  const fetchHostelDetails = async () => {
    setLoading(true);
    try {
      // Using direct type assertions to bypass TypeScript errors
      const { data: hostelData, error: hostelError } = await supabase
        .from('hostels')
        .select('*')
        .eq('id', hostelId)
        .single() as { data: Hostel | null, error: any };
      
      if (hostelError) throw hostelError;
      
      // Using direct type assertions to bypass TypeScript errors
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .eq('hostel_id', hostelId) as { data: Room[] | null, error: any };
        
      if (roomsError) throw roomsError;
      
      if (hostelData) {
        // Format the hostel data with rooms
        const formattedHostel = {
          ...hostelData,
          // Use actual images from Supabase storage if available, otherwise use placeholder images
          images: hostelData.images && hostelData.images.length > 0 ? 
                  hostelData.images : 
                  [
                    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218MHx8aG9zdGVsfHx8fHx8MTY4NDc0NjQ5OQ&ixlib=rb-4.0.3&q=80&w=600",
                    "https://images.unsplash.com/photo-1613977257363-707ba9348227?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218MHx8aG9zdGVsfHx8fHx8MTY4NDc0NjUwMA&ixlib=rb-4.0.3&q=80&w=600",
                    "https://images.unsplash.com/photo-1626265774643-f1a323ced0ff?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218MHx8aG9zdGVsLHJvb218fHx8fHwxNjg0NzQ2NTc4&ixlib=rb-4.0.3&q=80&w=600"
                  ],
          rooms: roomsData ? roomsData.map((room: Room) => ({
            id: room.id,
            type: room.type,
            dailyPrice: room.pricing_daily,
            weeklyPrice: room.pricing_weekly,
            monthlyPrice: room.pricing_monthly,
            availableBeds: room.beds_available,
            features: [
              room.ac ? 'Air Conditioned' : 'Non-AC',
              `${room.type} Room`,
              room.type === 'single' ? 'Private Bathroom' : 'Shared Bathroom',
              'Locker Storage'
            ]
          })) : [],
          // Placeholder data for now
          rating: 4.7,
          reviews: 54,
          landmarks: ["1.2 km from Metro Station", "500m from Market", "2 km from Tech Park"],
          amenities: ["WiFi", "Common Area", "TV Room", "CCTV", "24/7 Security", "Laundry", "Meals"],
          fullAddress: hostelData.address && typeof hostelData.address === 'object' ? 
                    `${hostelData.address.line1 || ''} ${hostelData.address.line2 || ''}, ${hostelData.address.city || ''}, ${hostelData.address.state || ''} - ${hostelData.address.pincode || ''}` : 
                    'Address not available'
        };
        
        setHostel(formattedHostel);
      }
    } catch (error) {
      console.error("Error fetching hostel details:", error);
      toast.error("Failed to load hostel details");
    } finally {
      setLoading(false);
    }
  };

  const checkWishlist = () => {
    // Check if hostel is in wishlist
    const storedWishlist = localStorage.getItem("hostelWishlist");
    if (storedWishlist) {
      try {
        const parsedWishlist = JSON.parse(storedWishlist);
        const isWishlisted = parsedWishlist.some((item: any) => item.id === hostelId);
        setIsFavorite(isWishlisted);
      } catch (error) {
        console.error("Error parsing wishlist from localStorage:", error);
      }
    }
  };

  const handleNextImage = () => {
    if (!hostel || !hostel.images) return;
    setCurrentImageIndex((prev) => (prev + 1) % hostel.images.length);
  };

  const handlePrevImage = () => {
    if (!hostel || !hostel.images) return;
    setCurrentImageIndex((prev) => (prev - 1 + hostel.images.length) % hostel.images.length);
  };

  const toggleFavorite = () => {
    // Get current wishlist
    const storedWishlist = localStorage.getItem("hostelWishlist");
    let currentWishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
    
    if (isFavorite) {
      // Remove from wishlist
      currentWishlist = currentWishlist.filter((item: any) => item.id !== hostelId);
      toast("Removed from wishlist");
    } else {
      // Create simplified hostel object for wishlist
      const wishlistItem = {
        id: hostel.id,
        name: hostel.name,
        gender: hostel.type,
        location: hostel.address && typeof hostel.address === 'object' ? 
                  `${hostel.address.city || ''}, ${hostel.address.state || ''}` : 
                  'Location not available',
        rating: hostel.rating,
        price: hostel.rooms && hostel.rooms.length > 0 ? hostel.rooms[0].dailyPrice : 0,
        availableBeds: hostel.rooms ? 
                      hostel.rooms.reduce((total: number, room: any) => total + room.availableBeds, 0) : 
                      0,
        image: hostel.images && hostel.images.length > 0 ? hostel.images[0] : ''
      };
      
      // Add to wishlist
      currentWishlist.push(wishlistItem);
      toast("Added to wishlist");
    }
    
    // Update localStorage
    localStorage.setItem("hostelWishlist", JSON.stringify(currentWishlist));
    
    // Update state
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    // In a real app, implement share functionality
    toast("Share functionality will be implemented");
  };

  const handleBookNow = (roomId: string) => {
    navigate(`/hosteller/booking/${hostelId}/${roomId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-500">Loading hostel details...</p>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center p-4">
        <AlertCircleIcon className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Hostel Not Found</h2>
        <p className="text-gray-600 mb-4 text-center">We couldn't find the hostel you're looking for.</p>
        <Button onClick={() => navigate('/hosteller/home')}>Back to Explore</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Image Carousel */}
      <div className="relative h-64">
        <img 
          src={hostel.images[currentImageIndex]} 
          alt={`Hostel image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation arrows for carousel */}
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-black/30 text-white h-8 w-8 rounded-full"
            onClick={handlePrevImage}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-black/30 text-white h-8 w-8 rounded-full rotate-180"
            onClick={handleNextImage}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Image counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded-md text-xs">
          {currentImageIndex + 1}/{hostel.images.length}
        </div>
        
        {/* Back button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 left-4 bg-white rounded-full shadow-md"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-4">
        {/* Hostel Title & Actions */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-xl font-bold">{hostel.name}</h1>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span>
                {hostel.address && typeof hostel.address === 'object' ? 
                  `${hostel.address.city || ''}, ${hostel.address.state || ''}` : 
                  'Location not available'}
              </span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-9 w-9 rounded-full"
              onClick={toggleFavorite}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-9 w-9 rounded-full"
              onClick={handleShare}
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium rounded-full px-2.5 py-1">
            {hostel.type === 'boys' ? 'Boys Only' : hostel.type === 'girls' ? 'Girls Only' : 'Co-ed'}
          </span>
          <span className="bg-green-100 text-green-800 text-xs font-medium rounded-full px-2.5 py-1 flex items-center">
            <Star className="h-3 w-3 mr-1 fill-current" />
            {hostel.rating} ({hostel.reviews} reviews)
          </span>
          <span className="bg-purple-100 text-purple-800 text-xs font-medium rounded-full px-2.5 py-1">
            Verified
          </span>
        </div>
        
        {/* Hostel Description */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h2 className="text-lg font-medium mb-2">About this hostel</h2>
            <p className="text-gray-600 text-sm">{hostel.description}</p>
          </CardContent>
        </Card>
        
        {/* Amenities */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h2 className="text-lg font-medium mb-3">Amenities</h2>
            <div className="grid grid-cols-2 gap-3">
              {hostel.amenities.map((amenity: string) => (
                <div key={amenity} className="flex items-center text-sm">
                  <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                    {amenity === 'WiFi' && <Wifi className="h-4 w-4" />}
                    {amenity === 'Common Area' && <Coffee className="h-4 w-4" />}
                    {amenity === 'TV Room' && <Tv className="h-4 w-4" />}
                    {amenity === 'CCTV' && <Camera className="h-4 w-4" />}
                    {!['WiFi', 'Common Area', 'TV Room', 'CCTV'].includes(amenity) && <Coffee className="h-4 w-4" />}
                  </div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Nearby Landmarks */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h2 className="text-lg font-medium mb-2">Nearby Landmarks</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              {hostel.landmarks.map((landmark: string, index: number) => (
                <li key={index} className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  {landmark}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        {/* Room Types */}
        <h2 className="text-lg font-medium mb-3">Available Room Types</h2>
        <div className="space-y-4 mb-20">
          {hostel.rooms && hostel.rooms.length > 0 ? (
            hostel.rooms.map((room: any) => (
              <Card key={room.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{room.type}</h3>
                      <div className="text-green-600 text-sm font-medium">
                        {room.availableBeds} beds available
                      </div>
                    </div>
                    
                    <ul className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-xs text-gray-600">
                      {room.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1.5"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="flex justify-between items-center pt-2 border-t">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-blue-600 font-medium">₹{room.dailyPrice}</div>
                          <div className="text-xs text-gray-500">Daily</div>
                        </div>
                        <div>
                          <div className="text-blue-600 font-medium">₹{room.weeklyPrice}</div>
                          <div className="text-xs text-gray-500">Weekly</div>
                        </div>
                        <div>
                          <div className="text-blue-600 font-medium">₹{room.monthlyPrice}</div>
                          <div className="text-xs text-gray-500">Monthly</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 border-t">
                    <Button 
                      className="w-full"
                      onClick={() => handleBookNow(room.id)}
                      disabled={room.availableBeds <= 0}
                    >
                      {room.availableBeds > 0 ? 'Book Now' : 'No Beds Available'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No rooms available at this time.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom Action Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex justify-between items-center">
        <div>
          <Button variant="outline" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Contact Hostel
          </Button>
        </div>
        <Button onClick={() => hostel.rooms && hostel.rooms.length > 0 ? handleBookNow(hostel.rooms[0].id) : null}>Book Now</Button>
      </div>
    </div>
  );
};

const AlertCircleIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default HostelDetail;
