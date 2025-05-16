import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Calendar, Loader2 } from "lucide-react";
import { supabase, authHelpers } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { BookingWithDetails, parseHostelAddress } from "@/types/database";
import BookingCard, { BookingType } from "@/components/BookingCard";

const BookingsPage = () => {
  const navigate = useNavigate();
  
  const [upcomingBookings, setUpcomingBookings] = useState<BookingType[]>([]);
  const [pastBookings, setPastBookings] = useState<BookingType[]>([]);
  const [cancelledBookings, setCancelledBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if user is authenticated and get their ID
    const checkAuth = async () => {
      const { data: { user } } = await authHelpers.getUser();
      if (user) {
        setUserId(user.id);
        fetchBookings(user.id);
      } else {
        // Redirect to login if not authenticated
        navigate('/login');
        toast.error("Please login to view your bookings");
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const fetchBookings = async (userId: string) => {
    setLoading(true);
    
    try {
      // Direct call to supabase with proper typing
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          hostels:hostel_id (*),
          rooms:room_id (*)
        `)
        .eq('hosteller_id', userId);
      
      if (error) throw error;
      
      if (data) {
        // Format the data for the UI and separate into categories
        const formattedData: BookingType[] = data.map(booking => {
          // Parse the address safely
          const hotelAddress = booking.hostels?.address 
            ? parseHostelAddress(booking.hostels.address)
            : {};
          
          const locationString = hotelAddress.city && hotelAddress.state 
            ? `${hotelAddress.city}, ${hotelAddress.state}` 
            : 'Unknown Location';
            
          return {
            id: booking.id,
            hostelId: booking.hostel_id,
            hostelName: booking.hostels ? booking.hostels.name : 'Unknown Hostel',
            roomType: booking.rooms ? booking.rooms.type : 'Unknown Room',
            location: locationString,
            checkIn: booking.start_date,
            checkOut: booking.end_date,
            paymentStatus: booking.payment_status,
            amount: booking.amount,
            bookingId: booking.id.substring(0, 8).toUpperCase(),
            beds: booking.rooms ? booking.rooms.beds_total : 1,
            status: booking.status,
            cancelReason: booking.status === 'cancelled' ? 'Cancelled by user' : undefined
          };
        });
        
        // Filter bookings by status
        const upcoming = formattedData.filter(booking => 
          booking.checkOut >= new Date().toISOString().split('T')[0] && 
          booking.status !== 'cancelled'
        );
        
        const past = formattedData.filter(booking => 
          booking.checkOut < new Date().toISOString().split('T')[0] && 
          booking.status !== 'cancelled'
        );
        
        const cancelled = formattedData.filter(booking => 
          booking.status === 'cancelled'
        );
        
        setUpcomingBookings(upcoming);
        setPastBookings(past);
        setCancelledBookings(cancelled);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
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

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .eq('hosteller_id', userId);
        
      if (error) throw error;
      
      toast.success("Booking cancelled successfully");
      
      // Refresh bookings list
      if (userId) fetchBookings(userId);
      
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    }
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
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
            <p className="text-gray-500">Loading your bookings...</p>
          </div>
        ) : (
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
                      onCancel={() => handleCancelBooking(booking.id)}
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
