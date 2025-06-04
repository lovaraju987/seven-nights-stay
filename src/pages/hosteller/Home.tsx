import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Star, Filter, User, Calendar, Heart, Navigation, Wifi, Coffee, Wind, Shirt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useHostels } from "@/hooks/useHostels";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [wishlistedHostelIds, setWishlistedHostelIds] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<{
    priceRange?: number[];
    amenities?: Record<string, boolean>;
    gender?: string | null;
  } | null>(null);
  
  const navigate = useNavigate();
  const { hostels, loading, error } = useHostels();

  const filters = [
    { id: "all", label: "All" },
    { id: "boys", label: "Boys", icon: <User className="h-3.5 w-3.5" /> },
    { id: "girls", label: "Girls", icon: <User className="h-3.5 w-3.5" /> },
    { id: "co-ed", label: "Co-ed", icon: <User className="h-3.5 w-3.5" /> }
  ];

  // Load wishlisted hostel IDs and filters from localStorage on component mount
  useEffect(() => {
    // Load wishlist
    const storedWishlist = localStorage.getItem("hostelWishlist");
    if (storedWishlist) {
      try {
        const parsedWishlist = JSON.parse(storedWishlist);
        setWishlistedHostelIds(parsedWishlist.map((hostel: any) => hostel.id));
      } catch (error) {
        console.error("Error parsing wishlist from localStorage:", error);
      }
    }
    
    // Load filters
    const storedFilters = localStorage.getItem("hostelFilters");
    if (storedFilters) {
      try {
        const parsedFilters = JSON.parse(storedFilters);
        setAppliedFilters(parsedFilters);
        
        // Set the selected filter based on stored gender preference
        if (parsedFilters.gender) {
          setSelectedFilter(parsedFilters.gender);
        }
      } catch (error) {
        console.error("Error parsing filters from localStorage:", error);
      }
    }
  }, []);

  const handleFilterSelect = (filterId: string) => {
    setSelectedFilter(selectedFilter === filterId ? null : filterId);
  };

  // Transform hostel data to match the expected format
  const transformedHostels = hostels.map(hostel => {
    // Get the cheapest room's daily price
    const cheapestRoom = hostel.rooms?.reduce((min, room) => {
      const roomDaily = room.pricing_daily || 0;
      const minDaily = min.pricing_daily || 0;
      return roomDaily < minDaily ? room : min;
    });

    // Use room pricing or fallback values
    const dailyPrice = cheapestRoom?.pricing_daily || 599;
    
    // Calculate total available beds from rooms or use fallback
    const totalAvailableBeds = hostel.rooms?.reduce((total, room) => total + (room.beds_available || 0), 0) || 5;

    // Parse amenities from JSON or use default
    let amenities = { wifi: false, ac: false, food: false, laundry: false, cleaning: false };
    try {
      if (typeof hostel.address === 'object' && hostel.address && 'amenities' in hostel.address) {
        amenities = { ...amenities, ...(hostel.address as any).amenities };
      }
    } catch (e) {
      console.log('Could not parse amenities for hostel:', hostel.id);
    }

    // Get address string
    let locationString = "Location not specified";
    if (hostel.address && typeof hostel.address === 'object') {
      const addr = hostel.address as any;
      if (addr.city) {
        locationString = addr.area ? `${addr.area}, ${addr.city}` : addr.city;
      } else if (addr.area) {
        locationString = addr.area;
      }
    }

    // Use first image or default
    const image = hostel.images && hostel.images.length > 0 
      ? hostel.images[0] 
      : "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=250&ixid=MnwxfDB8MXxyYW5kb218MHx8aG9zdGVsfHx8fHx8MTY4NDc0NjQ5OQ&ixlib=rb-4.0.3&q=80&w=400";

    // Determine gender from type field
    let gender = 'co-ed';
    if (hostel.type === 'boys') gender = 'boys';
    else if (hostel.type === 'girls') gender = 'girls';
    else if (hostel.type === 'coed') gender = 'co-ed';

    return {
      id: hostel.id,
      name: hostel.name,
      gender: gender,
      location: locationString,
      rating: 4.5, // Default rating since it's not in the current schema
      price: dailyPrice,
      availableBeds: totalAvailableBeds,
      image: image,
      amenities: amenities,
      mapUrl: `https://www.google.com/maps?q=${encodeURIComponent(locationString)}`
    };
  });

  const filteredHostels = transformedHostels.filter(hostel => {
    // Text search filter
    const matchesSearch = hostel.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         hostel.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Gender filter (either from quick filter or from applied filters)
    let matchesGender = true;
    if (selectedFilter && selectedFilter !== 'all') {
      matchesGender = hostel.gender === selectedFilter;
    } else if (appliedFilters?.gender) {
      matchesGender = hostel.gender === appliedFilters.gender;
    }
    
    // Price range filter
    let matchesPrice = true;
    if (appliedFilters?.priceRange) {
      matchesPrice = hostel.price >= appliedFilters.priceRange[0] && 
                     hostel.price <= appliedFilters.priceRange[1];
    }
    
    // Amenities filter
    let matchesAmenities = true;
    if (appliedFilters?.amenities) {
      // Only check amenities that are set to true in filters
      const requestedAmenities = Object.entries(appliedFilters.amenities)
        .filter(([_, isSelected]) => isSelected)
        .map(([name]) => name);
      
      if (requestedAmenities.length > 0) {
        matchesAmenities = requestedAmenities.every(amenity => 
          hostel.amenities[amenity as keyof typeof hostel.amenities]
        );
      }
    }
    
    return matchesSearch && matchesGender && matchesPrice && matchesAmenities;
  });

  const handleHostelClick = (hostelId: string) => {
    navigate(`/hosteller/hostel/${hostelId}`);
  };

  const navigateToMap = (mapUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(mapUrl, '_blank');
  };

  const toggleWishlist = (hostel: any, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Get current wishlist
    const storedWishlist = localStorage.getItem("hostelWishlist");
    let currentWishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
    
    // Check if hostel is already in wishlist
    const isWishlisted = currentWishlist.some((item: any) => item.id === hostel.id);
    
    if (isWishlisted) {
      // Remove from wishlist
      currentWishlist = currentWishlist.filter((item: any) => item.id !== hostel.id);
      toast({
        description: "Removed from wishlist"
      });
    } else {
      // Add to wishlist
      currentWishlist.push(hostel);
      toast({
        description: "Added to wishlist"
      });
    }
    
    // Update localStorage
    localStorage.setItem("hostelWishlist", JSON.stringify(currentWishlist));
    
    // Update state
    setWishlistedHostelIds(currentWishlist.map((item: any) => item.id));
  };
  
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedFilter(null);
    setAppliedFilters(null);
    localStorage.removeItem("hostelFilters");
  };

  // Function to render amenity icons
  const renderAmenityIcons = (amenities: any) => {
    return (
      <div className="flex space-x-2 mb-2">
        {amenities.wifi && <Wifi className="h-4 w-4 text-blue-500" />}
        {amenities.food && <Coffee className="h-4 w-4 text-orange-500" />}
        {amenities.ac && <Wind className="h-4 w-4 text-cyan-500" />}
        {amenities.laundry && <Shirt className="h-4 w-4 text-purple-500" />}
      </div>
    );
  };

  // Calculate prices with discounts
  const calculateWeeklyPrice = (dailyPrice: number) => {
    return (dailyPrice * 7 * 0.9).toFixed(0); // 10% discount for weekly
  };

  const calculateMonthlyPrice = (dailyPrice: number) => {
    return (dailyPrice * 30 * 0.8).toFixed(0); // 20% discount for monthly
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
          <div className="max-w-md mx-auto">
            <h1 className="text-xl font-bold text-blue-800 mb-3">OneTo7 <span className="text-blue-600">Hostels</span></h1>
          </div>
        </header>
        <main className="flex-1 p-4 max-w-md mx-auto w-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading hostels...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
          <div className="max-w-md mx-auto">
            <h1 className="text-xl font-bold text-blue-800 mb-3">OneTo7 <span className="text-blue-600">Hostels</span></h1>
          </div>
        </header>
        <main className="flex-1 p-4 max-w-md mx-auto w-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error loading hostels: {error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold text-blue-800 mb-3">OneTo7 <span className="text-blue-600">Hostels</span></h1>
          
          <div className="relative">
            <Input
              placeholder="Search by city, area or hostel name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 py-2 bg-gray-50"
            />
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
              onClick={() => navigate("/hosteller/filters")}
            >
              <Filter className={`h-4 w-4 ${appliedFilters ? "text-blue-600" : "text-gray-500"}`} />
            </Button>
          </div>
          
          {/* Filter chips */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => handleFilterSelect(filter.id)}
                className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                  selectedFilter === filter.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {filter.icon && <span className="mr-1">{filter.icon}</span>}
                {filter.label}
              </button>
            ))}
          </div>
          
          {/* Applied Filters Indicator */}
          {appliedFilters && (Object.values(appliedFilters).some(value => 
            value !== null && 
            (typeof value === 'object' ? 
              (Array.isArray(value) ? value.length > 0 : Object.values(value).some(v => v)) : 
              true)
          )) && (
            <div className="mt-2 flex items-center justify-between">
              <div className="text-xs text-blue-600 font-medium">
                Filters applied
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-500 p-0 h-auto"
                onClick={handleClearFilters}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Hostel Listing */}
      <main className="flex-1 p-4 max-w-md mx-auto w-full">
        <h2 className="text-lg font-medium mb-4">
          {filteredHostels.length} {filteredHostels.length === 1 ? 'hostel' : 'hostels'} found
        </h2>
        
        <div className="grid gap-4">
          {filteredHostels.map(hostel => (
            <Card 
              key={hostel.id} 
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleHostelClick(hostel.id)}
            >
              <div className="relative h-40">
                <img 
                  src={hostel.image} 
                  alt={hostel.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white px-2 py-0.5 rounded-full text-xs font-medium text-blue-700 shadow">
                  {hostel.gender === 'boys' ? 'Boys Only' : hostel.gender === 'girls' ? 'Girls Only' : 'Co-ed'}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 left-2 bg-white/80 rounded-full h-8 w-8"
                  onClick={(e) => toggleWishlist(hostel, e)}
                >
                  <Heart 
                    className={`h-4 w-4 ${wishlistedHostelIds.includes(hostel.id) ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-2 right-2 bg-white rounded-full h-8 w-8"
                  onClick={(e) => navigateToMap(hostel.mapUrl, e)}
                >
                  <Navigation className="h-4 w-4 text-blue-600" />
                </Button>
              </div>
              <CardContent className="p-4">
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
                
                {/* Display amenities icons */}
                {renderAmenityIcons(hostel.amenities)}
                
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div>
                      <span className="text-blue-600 font-medium">₹{hostel.price}</span>
                      <span className="text-gray-500 text-sm">/day</span>
                    </div>
                    <div>
                      <span className="text-blue-600 font-medium">₹{calculateWeeklyPrice(hostel.price)}</span>
                      <span className="text-gray-500 text-sm">/week</span>
                    </div>
                    <div>
                      <span className="text-blue-600 font-medium">₹{calculateMonthlyPrice(hostel.price)}</span>
                      <span className="text-gray-500 text-sm">/month</span>
                    </div>
                  </div>
                  <div className="text-green-600 text-sm font-medium">
                    {hostel.availableBeds} beds available
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredHostels.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No hostels found matching your criteria</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={handleClearFilters}
            >
              Clear filters
            </Button>
          </div>
        )}
      </main>
      
      {/* Navigation */}
      <nav className="bg-white border-t border-gray-200 flex justify-around items-center py-3 sticky bottom-0">
        <Button 
          variant="ghost" 
          className="flex flex-col items-center text-blue-600"
          onClick={() => navigate("/hosteller/home")}
        >
          <Search className="h-5 w-5" />
          <span className="text-xs mt-1">Explore</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className="flex flex-col items-center text-gray-500"
          onClick={() => navigate("/hosteller/wishlist")}
        >
          <Heart className="h-5 w-5" />
          <span className="text-xs mt-1">Wishlist</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className="flex flex-col items-center text-gray-500"
          onClick={() => navigate("/hosteller/bookings")}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-xs mt-1">Bookings</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className="flex flex-col items-center text-gray-500"
          onClick={() => navigate("/hosteller/profile")}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </Button>
      </nav>
    </div>
  );
};

export default Home;
