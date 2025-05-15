
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Calendar, AlertCircle } from "lucide-react";

const BookingsPage = () => {
  const navigate = useNavigate();
  
  // Mock data for bookings
  const upcomingBookings = [
    {
      id: "b1",
      hostelId: "1",
      hostelName: "Backpackers Haven",
      roomType: "Mixed Dormitory",
      location: "Koramangala, Bangalore",
      checkIn: "2025-05-18",
      checkOut: "2025-05-25",
      paymentStatus: "Paid",
      amount: 4999,
      bookingId: "BK-7836",
      beds: 1
    }
  ];
  
  const pastBookings = [
    {
      id: "b2",
      hostelId: "2",
      hostelName: "Urban Nest Co-Living",
      roomType: "Single Room",
      location: "Whitefield, Bangalore",
      checkIn: "2025-04-12",
      checkOut: "2025-04-19",
      paymentStatus: "Paid",
      amount: 6793,
      bookingId: "BK-6453",
      beds: 1
    },
    {
      id: "b3",
      hostelId: "3",
      hostelName: "Sunrise Girls PG",
      roomType: "Double Room",
      location: "Indiranagar, Bangalore",
      checkIn: "2025-03-05",
      checkOut: "2025-03-12",
      paymentStatus: "Paid",
      amount: 5432,
      bookingId: "BK-5321",
      beds: 1
    }
  ];
  
  const cancelledBookings = [
    {
      id: "b4",
      hostelId: "4",
      hostelName: "Mountain View Hostel",
      roomType: "Private Room",
      location: "HSR Layout, Bangalore",
      checkIn: "2025-02-20",
      checkOut: "2025-02-27",
      paymentStatus: "Refunded",
      amount: 5999,
      bookingId: "BK-4219",
      beds: 2,
      cancelReason: "Travel plans changed"
    }
  ];
  
  // Function to format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  
  // Calculate nights between two dates
  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold text-blue-800">My Bookings</h1>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 p-4 max-w-md mx-auto w-full">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.map(booking => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    type="upcoming"
                    formatDate={formatDate}
                    calculateNights={calculateNights}
                    navigate={navigate}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="No upcoming bookings yet" />
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {pastBookings.length > 0 ? (
              <div className="space-y-4">
                {pastBookings.map(booking => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    type="past"
                    formatDate={formatDate}
                    calculateNights={calculateNights}
                    navigate={navigate}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="No past bookings found" />
            )}
          </TabsContent>
          
          <TabsContent value="cancelled">
            {cancelledBookings.length > 0 ? (
              <div className="space-y-4">
                {cancelledBookings.map(booking => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    type="cancelled"
                    formatDate={formatDate}
                    calculateNights={calculateNights}
                    navigate={navigate}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="No cancelled bookings" />
            )}
          </TabsContent>
        </Tabs>
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
          <Phone className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </Button>
      </nav>
    </div>
  );
};

// Booking Card Component
type BookingType = {
  id: string;
  hostelId: string;
  hostelName: string;
  roomType: string;
  location: string;
  checkIn: string;
  checkOut: string;
  paymentStatus: string;
  amount: number;
  bookingId: string;
  beds: number;
  cancelReason?: string;
};

type BookingCardProps = {
  booking: BookingType;
  type: 'upcoming' | 'past' | 'cancelled';
  formatDate: (date: string) => string;
  calculateNights: (checkIn: string, checkOut: string) => number;
  navigate: (path: string) => void;
};

const BookingCard = ({ booking, type, formatDate, calculateNights, navigate }: BookingCardProps) => {
  const nights = calculateNights(booking.checkIn, booking.checkOut);
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">{booking.hostelName}</h3>
            {type === 'upcoming' && (
              <Badge className="bg-green-500">Upcoming</Badge>
            )}
            {type === 'past' && (
              <Badge variant="outline" className="text-gray-600 border-gray-400">Completed</Badge>
            )}
            {type === 'cancelled' && (
              <Badge variant="outline" className="text-red-600 border-red-300">Cancelled</Badge>
            )}
          </div>
          
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            {booking.location}
          </div>
          
          <div className="bg-gray-50 rounded-md p-3 mb-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Check-in</p>
                <p className="font-medium">{formatDate(booking.checkIn)}</p>
              </div>
              <div>
                <p className="text-gray-500">Check-out</p>
                <p className="font-medium">{formatDate(booking.checkOut)}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between text-sm mb-1">
            <div className="text-gray-500">Booking ID</div>
            <div className="font-medium">{booking.bookingId}</div>
          </div>
          
          <div className="flex justify-between text-sm mb-1">
            <div className="text-gray-500">Room Type</div>
            <div className="font-medium">{booking.roomType}</div>
          </div>
          
          <div className="flex justify-between text-sm mb-1">
            <div className="text-gray-500">No. of Beds</div>
            <div className="font-medium">{booking.beds} {booking.beds > 1 ? 'beds' : 'bed'}</div>
          </div>
          
          <div className="flex justify-between text-sm mb-1">
            <div className="text-gray-500">Duration</div>
            <div className="font-medium">{nights} {nights > 1 ? 'nights' : 'night'}</div>
          </div>
          
          <div className="flex justify-between text-sm">
            <div className="text-gray-500">Payment Status</div>
            <div className="font-medium text-green-600">{booking.paymentStatus}</div>
          </div>
          
          {booking.cancelReason && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-start gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Cancellation Reason:</p>
                  <p className="text-gray-600">{booking.cancelReason}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
            <div>
              <div className="text-gray-500 text-xs">Total Amount</div>
              <div className="font-bold text-lg">₹{booking.amount}</div>
            </div>
            
            {type === 'upcoming' && (
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/hosteller/booking-details/${booking.id}`)}
                >
                  View Details
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            )}
            
            {type === 'past' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/hosteller/booking-details/${booking.id}`)}
              >
                View Details
              </Button>
            )}
            
            {type === 'cancelled' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/hosteller/booking-details/${booking.id}`)}
              >
                View Details
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Empty State Component
const EmptyState = ({ message }: { message: string }) => {
  return (
    <div className="text-center py-16">
      <CalendarIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">{message}</h3>
      <p className="text-gray-500 mb-4">Your booking history will appear here</p>
    </div>
  );
};

const CalendarIcon = (props: any) => (
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
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

export default BookingsPage;
