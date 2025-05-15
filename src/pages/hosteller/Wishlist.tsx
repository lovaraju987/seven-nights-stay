
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Heart, ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface WishlistedHostel {
  id: string;
  name: string;
  gender: string;
  location: string;
  rating: number;
  price: number;
  availableBeds: number;
  image: string;
}

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlistedHostels, setWishlistedHostels] = useState<WishlistedHostel[]>([]);

  useEffect(() => {
    // Load wishlisted hostels from localStorage
    const loadWishlist = () => {
      const storedWishlist = localStorage.getItem("hostelWishlist");
      if (storedWishlist) {
        try {
          const parsedWishlist = JSON.parse(storedWishlist);
          setWishlistedHostels(parsedWishlist);
        } catch (error) {
          console.error("Error parsing wishlist from localStorage:", error);
          setWishlistedHostels([]);
        }
      }
    };

    loadWishlist();
  }, []);

  const handleRemoveFromWishlist = (hostelId: string) => {
    // Remove hostel from wishlist
    const updatedWishlist = wishlistedHostels.filter(hostel => hostel.id !== hostelId);
    
    // Update localStorage
    localStorage.setItem("hostelWishlist", JSON.stringify(updatedWishlist));
    
    // Update state
    setWishlistedHostels(updatedWishlist);
    
    // Show toast
    toast("Removed from wishlist");
  };

  const handleHostelClick = (hostelId: string) => {
    navigate(`/hosteller/hostel/${hostelId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">My Wishlist</h1>
          </div>
        </div>
      </header>

      {/* Wishlist Content */}
      <main className="flex-1 p-4 max-w-md mx-auto w-full">
        {wishlistedHostels.length > 0 ? (
          <div className="grid gap-4">
            {wishlistedHostels.map(hostel => (
              <Card 
                key={hostel.id} 
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="relative h-40">
                  <img 
                    src={hostel.image} 
                    alt={hostel.name}
                    className="w-full h-full object-cover"
                    onClick={() => handleHostelClick(hostel.id)}
                  />
                  <div className="absolute top-2 right-2 bg-white px-2 py-0.5 rounded-full text-xs font-medium text-blue-700 shadow">
                    {hostel.gender === 'boys' ? 'Boys Only' : hostel.gender === 'girls' ? 'Girls Only' : 'Co-ed'}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 left-2 bg-white/80 rounded-full h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromWishlist(hostel.id);
                    }}
                  >
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  </Button>
                </div>
                <CardContent className="p-4" onClick={() => handleHostelClick(hostel.id)}>
                  <div className="flex justify-between mb-1">
                    <h3 className="font-medium">{hostel.name}</h3>
                    <div className="flex items-center text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded">
                      <Star className="h-3 w-3 mr-0.5 fill-current" />
                      {hostel.rating}
                    </div>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {hostel.location}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <span className="text-blue-600 font-medium">₹{hostel.price}</span>
                      <span className="text-gray-500 text-sm">/day</span>
                    </div>
                    <div className="text-green-600 text-sm font-medium">
                      {hostel.availableBeds} beds available
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Start adding hostels to your wishlist to save them for later.</p>
            <Button onClick={() => navigate("/hosteller/home")}>
              Explore Hostels
            </Button>
          </div>
        )}
      </main>

      {/* Navigation */}
      <nav className="bg-white border-t border-gray-200 flex justify-around items-center py-3 sticky bottom-0">
        <Button 
          variant="ghost" 
          className="flex flex-col items-center text-gray-500"
          onClick={() => navigate("/hosteller/home")}
        >
          <MapPin className="h-5 w-5" />
          <span className="text-xs mt-1">Explore</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className="flex flex-col items-center text-blue-600"
          onClick={() => navigate("/hosteller/wishlist")}
        >
          <Heart className="h-5 w-5 fill-blue-100" />
          <span className="text-xs mt-1">Wishlist</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className="flex flex-col items-center text-gray-500"
          onClick={() => navigate("/hosteller/bookings")}
        >
          <Star className="h-5 w-5" />
          <span className="text-xs mt-1">Bookings</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className="flex flex-col items-center text-gray-500"
          onClick={() => navigate("/hosteller/profile")}
        >
          <MapPin className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </Button>
      </nav>
    </div>
  );
};

export default Wishlist;
