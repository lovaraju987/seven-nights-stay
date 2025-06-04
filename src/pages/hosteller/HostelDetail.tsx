import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, Star, Heart, Share, Wifi, Coffee, Tv, Camera, Phone } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/lib/supabase";

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-4 w-4" />,
  "Common Area": <Coffee className="h-4 w-4" />,
  "TV Room": <Tv className="h-4 w-4" />,
  CCTV: <Camera className="h-4 w-4" />,
};

const HostelDetail = () => {
  const { hostelId } = useParams<{ hostelId: string }>();
  const navigate = useNavigate();
  const [hostel, setHostel] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: authData } = await supabase.auth.getUser();
      setUserId(authData?.user?.id || null);

      // Fetch hostel
      const { data: hostelData, error: hostelError } = await supabase
        .from("hostels")
        .select("*")
        .eq("id", hostelId)
        .single();
      if (hostelError || !hostelData) {
        toast("Hostel not found");
        setLoading(false);
        return;
      }
      // Fetch rooms
      const { data: roomsData, error: roomsError } = await supabase
        .from("rooms")
        .select("*")
        .eq("hostel_id", hostelId);
      if (roomsError) {
        toast("Failed to load rooms");
      }
      setHostel(hostelData);
      setRooms(roomsData || []);
      setLoading(false);
    };
    fetchData();
  }, [hostelId]);

  useEffect(() => {
    const checkWishlist = async () => {
      if (!userId || !hostelId) return;
      const { data, error } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', userId)
        .eq('hostel_id', hostelId)
        .single();
      if (!error && data) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
    };
    checkWishlist();
  }, [hostelId, userId]);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % hostel.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + hostel.images.length) % hostel.images.length);
  };

  const toggleFavorite = async () => {
    if (!userId || !hostelId) return;

    if (isFavorite) {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', userId)
        .eq('hostel_id', hostelId);
      if (!error) {
        toast('Removed from wishlist');
        setIsFavorite(false);
      }
    } else {
      const { error } = await supabase
        .from('wishlists')
        .insert([{ user_id: userId, hostel_id: hostelId }]);
      if (!error) {
        toast('Added to wishlist');
        setIsFavorite(true);
      }
    }
  };

  const handleShare = () => {
    // In a real app, implement share functionality
    toast("Share functionality will be implemented");
  };

  const handleBookNow = (roomId: string) => {
    navigate(`/hosteller/booking/${hostelId}/${roomId}`);
  };

  if (loading || !hostel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading hostel details...</p>
      </div>
    );
  }

  // Map backend data to frontend structure
  const images = hostel.images && hostel.images.length > 0 ? hostel.images : ["/placeholder.svg"];
  const amenities = hostel.amenities || [];
  const address = hostel.address?.address || hostel.address || "";
  const location = hostel.address?.city ? `${hostel.address.city}, ${hostel.address.state}` : "";
  const gender = hostel.type || "co-ed";
  const rating = hostel.rating || 4.5;
  const reviews = hostel.reviews || 0;
  const description = hostel.description || "";
  const landmarks = hostel.landmarks || [];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Image Carousel */}
      <div className="relative h-64">
        <img 
          src={images[currentImageIndex]} 
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
              <span>{location}</span>
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
            {gender === 'boys' ? 'Boys Only' : gender === 'girls' ? 'Girls Only' : 'Co-ed'}
          </span>
          <span className="bg-green-100 text-green-800 text-xs font-medium rounded-full px-2.5 py-1 flex items-center">
            <Star className="h-3 w-3 mr-1 fill-current" />
            {rating} ({reviews} reviews)
          </span>
          <span className="bg-purple-100 text-purple-800 text-xs font-medium rounded-full px-2.5 py-1">
            Verified
          </span>
        </div>
        
        {/* Hostel Description */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h2 className="text-lg font-medium mb-2">About this hostel</h2>
            <p className="text-gray-600 text-sm">{description}</p>
          </CardContent>
        </Card>
        
        {/* Amenities */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h2 className="text-lg font-medium mb-3">Amenities</h2>
            <div className="grid grid-cols-2 gap-3">
              {amenities.length > 0 ? amenities.map((amenity: string) => (
                <div key={amenity} className="flex items-center text-sm">
                  <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                    {amenityIcons[amenity] || <Coffee className="h-4 w-4" />}
                  </div>
                  <span>{amenity}</span>
                </div>
              )) : <span className="text-gray-400">No amenities listed</span>}
            </div>
          </CardContent>
        </Card>
        
        {/* Nearby Landmarks */}
        {landmarks.length > 0 && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <h2 className="text-lg font-medium mb-2">Nearby Landmarks</h2>
              <ul className="space-y-2 text-sm text-gray-600">
                {landmarks.map((landmark: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    {landmark}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        
        {/* Room Types */}
        <h2 className="text-lg font-medium mb-3">Available Room Types</h2>
        <div className="space-y-4 mb-20">
          {rooms.length > 0 ? rooms.map((room) => (
            <Card key={room.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{room.room_name || room.type}</h3>
                    <div className="text-green-600 text-sm font-medium">
                      {room.beds_available} beds available
                    </div>
                  </div>
                  <ul className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-xs text-gray-600">
                    {room.type && <li className="flex items-center"><div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1.5"></div>{room.type}</li>}
                    {room.ac && <li className="flex items-center"><div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1.5"></div>AC</li>}
                  </ul>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-blue-600 font-medium">₹{room.pricing_daily}</div>
                        <div className="text-xs text-gray-500">Daily</div>
                      </div>
                      <div>
                        <div className="text-blue-600 font-medium">₹{room.pricing_weekly}</div>
                        <div className="text-xs text-gray-500">Weekly</div>
                      </div>
                      <div>
                        <div className="text-blue-600 font-medium">₹{room.pricing_monthly}</div>
                        <div className="text-xs text-gray-500">Monthly</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 border-t">
                  <Button 
                    className="w-full"
                    onClick={() => handleBookNow(room.id)}
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          )) : <span className="text-gray-400">No rooms available</span>}
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
        {rooms.length > 0 && (
          <Button onClick={() => handleBookNow(rooms[0].id)}>Book Now</Button>
        )}
      </div>
    </div>
  );
};

export default HostelDetail;
