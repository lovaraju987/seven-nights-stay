
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  BedDoubleIcon
} from "lucide-react";

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter, 
  DialogClose 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const mockRooms = [
  {
    id: "1",
    name: "Deluxe Twin Room",
    type: "Twin Sharing",
    capacity: 2,
    price: 1500,
    availability: 8,
    amenities: ["Air Conditioning", "Attached Bathroom", "Wi-Fi", "Study Table"],
    images: ["https://placehold.co/600x400/png", "https://placehold.co/600x400/png"],
  },
  {
    id: "2",
    name: "Standard Single Room",
    type: "Single",
    capacity: 1,
    price: 2000,
    availability: 5,
    amenities: ["Air Conditioning", "Attached Bathroom", "Wi-Fi"],
    images: ["https://placehold.co/600x400/png"],
  },
  {
    id: "3",
    name: "Economy Quad Room",
    type: "Quad Sharing",
    capacity: 4,
    price: 1000,
    availability: 12,
    amenities: ["Ceiling Fan", "Common Bathroom", "Wi-Fi"],
    images: ["https://placehold.co/600x400/png"],
  }
];

const ManageRooms = () => {
  const { hostelId } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState(mockRooms);
  const [activeTab, setActiveTab] = useState("all");
  const [isAddRoomDialogOpen, setIsAddRoomDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<null | typeof mockRooms[0]>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<null | string>(null);
  
  // New room form state
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    capacity: 1,
    price: 0,
    availability: 0,
    amenities: [""]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "capacity" || name === "price" || name === "availability") {
      setFormData({ ...formData, [name]: parseInt(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAmenitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amenities = e.target.value.split(",").map(item => item.trim());
    setFormData({ ...formData, amenities });
  };

  const handleAddRoom = () => {
    const newRoom = {
      id: Math.random().toString(36).substring(7),
      ...formData,
      images: ["https://placehold.co/600x400/png"]
    };
    
    setRooms([...rooms, newRoom]);
    setFormData({
      name: "",
      type: "",
      capacity: 1,
      price: 0,
      availability: 0,
      amenities: [""]
    });
    setIsAddRoomDialogOpen(false);
    
    toast({
      title: "Room added successfully!",
      description: `${newRoom.name} has been added to your hostel.`,
    });
  };

  const handleEditRoom = () => {
    if (!editingRoom) return;
    
    const updatedRooms = rooms.map(room => 
      room.id === editingRoom.id ? editingRoom : room
    );
    
    setRooms(updatedRooms);
    setEditingRoom(null);
    
    toast({
      title: "Room updated successfully!",
      description: `Changes to ${editingRoom.name} have been saved.`,
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingRoom) return;
    
    const { name, value } = e.target;
    if (name === "capacity" || name === "price" || name === "availability") {
      setEditingRoom({ ...editingRoom, [name]: parseInt(value) || 0 });
    } else {
      setEditingRoom({ ...editingRoom, [name]: value });
    }
  };

  const handleEditAmenitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingRoom) return;
    
    const amenities = e.target.value.split(",").map(item => item.trim());
    setEditingRoom({ ...editingRoom, amenities });
  };

  const handleDeleteRoom = () => {
    if (!roomToDelete) return;
    
    const updatedRooms = rooms.filter(room => room.id !== roomToDelete);
    const deletedRoom = rooms.find(room => room.id === roomToDelete);
    
    setRooms(updatedRooms);
    setRoomToDelete(null);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Room deleted",
      description: `${deletedRoom?.name} has been removed from your hostel.`,
    });
  };

  const filteredRooms = activeTab === "all" 
    ? rooms 
    : rooms.filter(room => room.type.toLowerCase().includes(activeTab));

  return (
    <div className="container px-4 py-4 md:py-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold mb-1">Manage Rooms for Hostel</h1>
          <p className="text-gray-500 text-sm">Add, edit or remove rooms and manage their details</p>
        </div>
        <Button 
          className="mt-3 md:mt-0"
          onClick={() => setIsAddRoomDialogOpen(true)}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add New Room
        </Button>
      </div>
      
      <div className="mb-4 md:mb-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 w-full overflow-auto flex whitespace-nowrap">
            <TabsTrigger value="all">All Rooms</TabsTrigger>
            <TabsTrigger value="single">Single</TabsTrigger>
            <TabsTrigger value="twin">Twin</TabsTrigger>
            <TabsTrigger value="quad">Quad</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {filteredRooms.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-10">
                  <BedDoubleIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">No rooms found</h3>
                  <p className="text-gray-500 mb-4">
                    {activeTab === "all" 
                      ? "You haven't added any rooms to this hostel yet."
                      : `No ${activeTab} rooms found in this hostel.`}
                  </p>
                  {activeTab !== "all" && (
                    <Button variant="outline" onClick={() => setActiveTab("all")}>
                      View All Rooms
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRooms.map(room => (
                  <Card key={room.id} className="overflow-hidden">
                    <div className="aspect-video relative bg-muted">
                      {room.images && room.images.length > 0 ? (
                        <img 
                          src={room.images[0]} 
                          alt={room.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          No image available
                        </div>
                      )}
                      <Badge className="absolute top-2 right-2">
                        {room.availability} Available
                      </Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base md:text-lg">{room.name}</CardTitle>
                          <CardDescription>{room.type} • {room.capacity} Person</CardDescription>
                        </div>
                        <p className="font-bold text-base md:text-lg">₹{room.price}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-0">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {room.amenities.slice(0, 3).map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {room.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{room.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 pt-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setRoomToDelete(room.id);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingRoom(room)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Add Room Dialog */}
      <Dialog open={isAddRoomDialogOpen} onOpenChange={setIsAddRoomDialogOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
            <DialogDescription>
              Enter the details for the new room. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Room Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Deluxe Twin Room"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Room Type</Label>
                <Input
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  placeholder="e.g. Twin Sharing, Single, etc."
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availability">Available Rooms</Label>
                <Input
                  id="availability"
                  name="availability"
                  type="number"
                  min="0"
                  value={formData.availability}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amenities">Amenities (comma separated)</Label>
              <Input
                id="amenities"
                name="amenities"
                value={formData.amenities.join(", ")}
                onChange={handleAmenitiesChange}
                placeholder="e.g. Wi-Fi, Air Conditioning, Attached Bathroom"
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddRoom} className="w-full sm:w-auto">Add Room</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Room Dialog */}
      <Dialog open={!!editingRoom} onOpenChange={(open) => !open && setEditingRoom(null)}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>
              Update the details for this room. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingRoom && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Room Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={editingRoom.name}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Room Type</Label>
                  <Input
                    id="edit-type"
                    name="type"
                    value={editingRoom.type}
                    onChange={handleEditInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-capacity">Capacity</Label>
                  <Input
                    id="edit-capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    value={editingRoom.capacity}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price (₹)</Label>
                  <Input
                    id="edit-price"
                    name="price"
                    type="number"
                    min="0"
                    value={editingRoom.price}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-availability">Available Rooms</Label>
                  <Input
                    id="edit-availability"
                    name="availability"
                    type="number"
                    min="0"
                    value={editingRoom.availability}
                    onChange={handleEditInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-amenities">Amenities (comma separated)</Label>
                <Input
                  id="edit-amenities"
                  name="amenities"
                  value={editingRoom.amenities.join(", ")}
                  onChange={handleEditAmenitiesChange}
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEditRoom} className="w-full sm:w-auto">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this room? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteRoom} className="w-full sm:w-auto">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageRooms;
