
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeftIcon,
  SearchIcon
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

// Mock booking data
const bookingsData = [
  {
    id: "BK00123",
    studentName: "Rahul Sharma",
    roomType: "Double Sharing",
    roomNumber: "202-B",
    checkIn: "2023-07-01",
    checkOut: "2024-06-30",
    amount: 6000,
    status: "active",
    phone: "+91 98765 43210",
  },
  {
    id: "BK00122",
    studentName: "Priya Patel",
    roomType: "Single",
    roomNumber: "105-A",
    checkIn: "2023-07-02",
    checkOut: "2024-06-30",
    amount: 8000,
    status: "active",
    phone: "+91 98765 43211",
  },
  {
    id: "BK00121",
    studentName: "Arjun Singh",
    roomType: "Triple Sharing",
    roomNumber: "304-C",
    checkIn: "2023-07-01",
    checkOut: "2024-06-30",
    amount: 5000,
    status: "active",
    phone: "+91 98765 43212",
  },
  {
    id: "BK00120",
    studentName: "Neha Kumar",
    roomType: "Double Sharing",
    roomNumber: "201-A",
    checkIn: "2023-06-15",
    checkOut: "2023-12-15",
    amount: 6000,
    status: "completed",
    phone: "+91 98765 43213",
  },
  {
    id: "BK00119",
    studentName: "Vikram Thapar",
    roomType: "Single",
    roomNumber: "107-B",
    checkIn: "2023-07-05",
    checkOut: "2024-01-05",
    amount: 8000,
    status: "upcoming",
    phone: "+91 98765 43214",
  },
  {
    id: "BK00118",
    studentName: "Ananya Desai",
    roomType: "Double Sharing",
    roomNumber: "204-C",
    checkIn: "2023-06-01",
    checkOut: "2023-11-30",
    amount: 6000,
    status: "completed",
    phone: "+91 98765 43215",
  },
];

const BookingList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter bookings based on search term and status
  const filteredBookings = bookingsData.filter((booking) => {
    const matchesSearch =
      booking.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      toast({
        title: "Booking Cancelled",
        description: `Booking ${bookingId} has been cancelled.`,
      });
      await supabase.functions.invoke('send-booking-notification', {
        body: { booking_id: bookingId },
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <Button
        variant="ghost"
        className="mb-6 p-0"
        onClick={() => navigate("/owner/dashboard")}
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Booking Management</h1>
        <p className="text-gray-500">View and manage all your bookings</p>
      </header>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, booking ID or room number"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bookings</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
          <CardDescription>
            {filteredBookings.length} bookings found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Room Type</TableHead>
                  <TableHead className="hidden md:table-cell">Room No.</TableHead>
                  <TableHead className="hidden md:table-cell">Check-in</TableHead>
                  <TableHead className="hidden lg:table-cell">Check-out</TableHead>
                  <TableHead className="hidden lg:table-cell">Monthly Rent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      No bookings found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.studentName}</div>
                          <div className="text-sm text-gray-500 hidden sm:block">{booking.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>{booking.roomType}</TableCell>
                      <TableCell className="hidden md:table-cell">{booking.roomNumber}</TableCell>
                      <TableCell className="hidden md:table-cell">{new Date(booking.checkIn).toLocaleDateString()}</TableCell>
                      <TableCell className="hidden lg:table-cell">{new Date(booking.checkOut).toLocaleDateString()}</TableCell>
                      <TableCell className="hidden lg:table-cell">₹{booking.amount}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            booking.status === "active"
                              ? "default"
                              : booking.status === "upcoming"
                              ? "secondary"
                              : booking.status === "completed"
                              ? "outline"
                              : "destructive"
                          }
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => alert(`View details for ${booking.id}`)}
                          >
                            View
                          </Button>
                          {(booking.status === "active" || booking.status === "upcoming") && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 border-red-200 hover:bg-red-50"
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingList;
