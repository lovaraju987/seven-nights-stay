import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Calendar as CalendarIcon, AlertCircle } from "lucide-react";

const BookingsPage = () => {
  const navigate = useNavigate();
  // Use Supabase user fetch
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get current user from Supabase
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    getUser();
  }, []);

  // Fetch bookings for current user
  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`*, hostels(*), rooms(*)`)
        .eq('hosteller_id', user.id);
      if (error) {
        console.error(error);
      } else if (data) {
        setBookings(data as any);
      }
      setLoading(false);
    };
    fetchBookings();
  }, [user]);

  const today = new Date();
  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' && new Date(b.start_date) >= today);
  const pastBookings = bookings.filter(b => 
    (b.status === 'completed') || (b.status === 'confirmed' && new Date(b.end_date) < today)
  );
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

  // Cancel booking
  const handleCancel = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', id);
    if (error) {
      console.error(error);
      return;
    }
    // Refresh
    setBookings(b => b.map(x => x.id === id ? { ...x, status: 'cancelled' } : x));
  };

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
                    booking={{
                      id: booking.id,
                      hostelName: booking.hostels.name,
                      roomType: booking.rooms.room_name,
                      location: Array.isArray(booking.hostels.address) ? JSON.stringify(booking.hostels.address) : booking.hostels.address || '',
                      checkIn: booking.start_date,
                      checkOut: booking.end_date,
                      paymentStatus: booking.payment_status,
                      amount: Number(booking.amount),
                      bookingId: booking.id,
                      beds: booking.rooms.beds_total || 1,
                    }}
                    type="upcoming"
                    formatDate={formatDate}
                    calculateNights={calculateNights}
                    navigate={navigate}
                    onCancel={handleCancel}
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
                    booking={{
                      id: booking.id,
                      hostelName: booking.hostels.name,
                      roomType: booking.rooms.room_name,
                      location: Array.isArray(booking.hostels.address) ? JSON.stringify(booking.hostels.address) : booking.hostels.address || '',
                      checkIn: booking.start_date,
                      checkOut: booking.end_date,
                      paymentStatus: booking.payment_status,
                      amount: Number(booking.amount),
                      bookingId: booking.id,
                      beds: booking.rooms.beds_total || 1,
                    }}
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
                    booking={{
                      id: booking.id,
                      hostelName: booking.hostels.name,
                      roomType: booking.rooms.room_name,
                      location: Array.isArray(booking.hostels.address) ? JSON.stringify(booking.hostels.address) : booking.hostels.address || '',
                      checkIn: booking.start_date,
                      checkOut: booking.end_date,
                      paymentStatus: booking.payment_status,
                      amount: Number(booking.amount),
                      bookingId: booking.id,
                      beds: booking.rooms.beds_total || 1,
                      cancelReason: booking.status === 'cancelled' ? 'Cancelled by user' : undefined,
                    }}
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
          <CalendarIcon className="h-5 w-5" />
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
  onCancel?: (id: string) => void;
};

const BookingCard = ({ booking, type, formatDate, calculateNights, navigate, onCancel }: BookingCardProps) => {
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
                  onClick={() => onCancel?.(booking.id)}
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

export default BookingsPage;
