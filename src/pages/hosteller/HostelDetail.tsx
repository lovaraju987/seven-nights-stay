
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, Star, Heart, Share, Wifi, Coffee, Tv, Camera, Phone } from "lucide-react";
import { toast } from "@/components/ui/sonner";

// Mock data
const mockHostelDetails = {
  id: "1",
  name: "Backpackers Haven",
  gender: "co-ed",
  location: "Koramangala, Bangalore",
  fullAddress: "123, 5th Block, Koramangala, Bangalore - 560034",
  rating: 4.7,
  reviews: 54,
  description: "A modern, comfortable hostel located in the heart of Koramangala. Perfect for students and working professionals looking for a community living experience.",
  amenities: ["WiFi", "Common Area", "TV Room", "CCTV", "24/7 Security", "Laundry", "Meals"],
  landmarks: ["1.2 km from Metro Station", "500m from Market", "2 km from Tech Park"],
  images: [
    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218MHx8aG9zdGVsfHx8fHx8MTY4NDc0NjQ5OQ&ixlib=rb-4.0.3&q=80&w=600",
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218MHx8aG9zdGVsfHx8fHx8MTY4NDc0NjUwMA&ixlib=rb-4.0.3&q=80&w=600",
    "https://images.unsplash.com/photo-1626265774643-f1a323ced0ff?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218MHx8aG9zdGVsLHJvb218fHx8fHwxNjg0NzQ2NTc4&ixlib=rb-4.0.3&q=80&w=600"
  ],
  rooms: [
    {
      id: "r1",
      type: "Single Room",
      dailyPrice: 799,
      weeklyPrice: 4999,
      monthlyPrice: 14999,
      availableBeds: 3,
      features: ["Single Bed", "Study Table", "Private Bathroom"]
    },
    {
      id: "r2",
      type: "Double Sharing",
      dailyPrice: 599,
      weeklyPrice: 3599,
      monthlyPrice: 9999,
      availableBeds: 5,
      features: ["Bunk Beds", "Lockers", "Shared Bathroom"]
    },
    {
      id: "r3",
      type: "Triple Sharing",
      dailyPrice: 499,
      weeklyPrice: 2999,
      monthlyPrice: 7999,
      availableBeds: 8,
      features: ["Bunk Beds", "Lockers", "Shared Bathroom", "Common Area"]
    }
  ]
};

// Amenity icons mapping
const amenityIcons: Record<string, React.ReactNode> = {
  "WiFi": <Wifi className="h-4 w-4" />,
  "Common Area": <Coffee className="h-4 w-4" />,
  "TV Room": <Tv className="h-4 w-4" />,
  "CCTV": <Camera className="h-4 w-4" />
};

const HostelDetail = () => {
  const { hostelId } = useParams<{ hostelId: string }>();
  const navigate = useNavigate();
  
  // In a real app, fetch data based on hostelId
  const hostel = mockHostelDetails;
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % hostel.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + hostel.images.length) % hostel.images.length);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const handleShare = () => {
    // In a real app, implement share functionality
    toast("Share functionality will be implemented");
  };

  const handleBookNow = (roomId: string) => {
    navigate(`/hosteller/booking/${hostelId}/${roomId}`);
  };

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
              <span>{hostel.location}</span>
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
            {hostel.gender === 'boys' ? 'Boys Only' : hostel.gender === 'girls' ? 'Girls Only' : 'Co-ed'}
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
              {hostel.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center text-sm">
                  <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                    {amenityIcons[amenity] || <Coffee className="h-4 w-4" />}
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
              {hostel.landmarks.map((landmark, index) => (
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
          {hostel.rooms.map((room) => (
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
                    {room.features.map((feature, idx) => (
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
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
        <Button onClick={() => handleBookNow(hostel.rooms[0].id)}>Book Now</Button>
      </div>
    </div>
  );
};

export default HostelDetail;
