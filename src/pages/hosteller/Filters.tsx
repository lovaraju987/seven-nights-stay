
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sliders, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Filters = () => {
  const navigate = useNavigate();
  const [priceRange, setPriceRange] = useState([500, 1500]);
  const [amenities, setAmenities] = useState({
    wifi: false,
    ac: false,
    food: false,
    laundry: false,
    cleaning: false,
  });
  
  const [gender, setGender] = useState<string | null>(null);
  
  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };
  
  const handleAmenityToggle = (amenity: keyof typeof amenities) => {
    setAmenities(prev => ({
      ...prev,
      [amenity]: !prev[amenity]
    }));
  };
  
  const handleGenderSelect = (value: string) => {
    setGender(value === gender ? null : value);
  };
  
  const handleApplyFilters = () => {
    // Store filters in localStorage
    const filters = {
      priceRange,
      amenities,
      gender
    };
    
    localStorage.setItem("hostelFilters", JSON.stringify(filters));
    navigate("/hosteller/home");
  };
  
  const handleResetFilters = () => {
    setPriceRange([500, 1500]);
    setAmenities({
      wifi: false,
      ac: false,
      food: false,
      laundry: false,
      cleaning: false,
    });
    setGender(null);
    localStorage.removeItem("hostelFilters");
  };
  
  return (
    <div className="bg-white min-h-screen">
      <header className="border-b border-gray-200 p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/hosteller/home")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-medium ml-2">Filters</h1>
      </header>
      
      <div className="p-4 max-w-md mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Price Range</h2>
            <div className="text-sm text-gray-500">
              ₹{priceRange[0]} - ₹{priceRange[1]}
            </div>
          </div>
          
          <Slider
            defaultValue={priceRange}
            min={300}
            max={3000}
            step={50}
            value={priceRange}
            onValueChange={handlePriceChange}
            className="my-6"
          />
          
          <div className="flex justify-between text-sm text-gray-500">
            <span>₹300</span>
            <span>₹3000</span>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Hostel Type</h2>
          
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={gender === "boys" ? "default" : "outline"}
              className={`flex items-center justify-center ${gender === "boys" ? "bg-blue-600" : ""}`}
              onClick={() => handleGenderSelect("boys")}
            >
              Boys
            </Button>
            <Button
              variant={gender === "girls" ? "default" : "outline"}
              className={`flex items-center justify-center ${gender === "girls" ? "bg-blue-600" : ""}`}
              onClick={() => handleGenderSelect("girls")}
            >
              Girls
            </Button>
            <Button
              variant={gender === "co-ed" ? "default" : "outline"}
              className={`flex items-center justify-center ${gender === "co-ed" ? "bg-blue-600" : ""}`}
              onClick={() => handleGenderSelect("co-ed")}
            >
              Co-ed
            </Button>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Amenities</h2>
          
          <div className="space-y-4">
            {Object.entries(amenities).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={key} className="capitalize">{key}</Label>
                <Switch 
                  id={key} 
                  checked={value}
                  onCheckedChange={() => handleAmenityToggle(key as keyof typeof amenities)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 p-4 fixed bottom-0 left-0 right-0 bg-white">
        <div className="flex gap-3 max-w-md mx-auto">
          <Button 
            variant="outline" 
            onClick={handleResetFilters}
            className="flex-1"
          >
            Reset
          </Button>
          <Button 
            onClick={handleApplyFilters}
            className="flex-1 bg-blue-600"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
