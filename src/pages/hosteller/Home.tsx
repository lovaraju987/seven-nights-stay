
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Star, Filter, Users, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data for hostels
const mockHostels = [
  {
    id: "1",
    name: "Backpackers Haven",
    gender: "co-ed",
    location: "Koramangala, Bangalore",
    rating: 4.7,
    price: 599,
    availableBeds: 8,
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=250&ixid=MnwxfDB8MXxyYW5kb218MHx8aG9zdGVsfHx8fHx8MTY4NDc0NjQ5OQ&ixlib=rb-4.0.3&q=80&w=400"
  },
  {
    id: "2",
    name: "Horizon Boys Hostel",
    gender: "boys",
    location: "HSR Layout, Bangalore",
    rating: 4.3,
    price: 649,
    availableBeds: 5,
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=250&ixid=MnwxfDB8MXxyYW5kb218MHx8aG9zdGVsfHx8fHx8MTY4NDc0NjUwMA&ixlib=rb-4.0.3&q=80&w=400"
  },
  {
    id: "3",
    name: "Sunrise Girls PG",
    gender: "girls",
    location: "Indiranagar, Bangalore",
    rating: 4.8,
    price: 679,
    availableBeds: 3,
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=250&ixid=MnwxfDB8MXxyYW5kb218MHx8aG9zdGVsfHx8fHx8MTY4NDc0NjQ5OQ&ixlib=rb-4.0.3&q=80&w=400"
  },
  {
    id: "4",
    name: "Urban Nest Co-Living",
    gender: "co-ed",
    location: "Whitefield, Bangalore",
    rating: 4.5,
    price: 699,
    availableBeds: 12,
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=250&ixid=MnwxfDB8MXxyYW5kb218MHx8aG9zdGVsfHx8fHx8MTY4NDc0NjUwMA&ixlib=rb-4.0.3&q=80&w=400"
  }
];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const navigate = useNavigate();

  const filters = [
    { id: "all", label: "All" },
    { id: "boys", label: "Boys", icon: <User className="h-3.5 w-3.5" /> },
    { id: "girls", label: "Girls", icon: <User className="h-3.5 w-3.5" /> },
    { id: "co-ed", label: "Co-ed", icon: <Users className="h-3.5 w-3.5" /> }
  ];

  const handleFilterSelect = (filterId: string) => {
    setSelectedFilter(selectedFilter === filterId ? null : filterId);
  };

  const filteredHostels = mockHostels.filter(hostel => {
    let matchesGender = true;
    if (selectedFilter && selectedFilter !== 'all') {
      matchesGender = hostel.gender === selectedFilter;
    }
    
    const matchesSearch = hostel.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         hostel.location.toLowerCase().includes(searchQuery.toLowerCase());
                         
    return matchesGender && matchesSearch;
  });

  const handleHostelClick = (hostelId: string) => {
    navigate(`/hosteller/hostel/${hostelId}`);
  };

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
              <Filter className="h-4 w-4 text-gray-500" />
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
        
        {filteredHostels.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No hostels found matching your criteria</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter(null);
              }}
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
          onClick={() => navigate("/hosteller/bookings")}
        >
          <MapPin className="h-5 w-5" />
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
