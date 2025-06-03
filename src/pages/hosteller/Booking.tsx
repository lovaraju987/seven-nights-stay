import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Calendar, Upload, CreditCard, User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/lib/supabase";

const Booking = () => {
  const { hostelId, roomId } = useParams<{ hostelId: string; roomId: string }>();
  const navigate = useNavigate();
  // Use Supabase user fetch
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  
  // Room and hostel data from Supabase
  const [room, setRoom] = useState<any>(null);
  const [hostel, setHostel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  
  const [stayType, setStayType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [startDate, setStartDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [bookingFor, setBookingFor] = useState<'self' | 'other'>('self');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash'>('online');
  const [specialRequests, setSpecialRequests] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  // Fetch user data from Supabase
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
      // Optionally fetch profile if needed
      if (data?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        setProfile(profileData || null);
      }
    };
    getUser();
  }, []);

  // Fetch room and hostel data
  useEffect(() => {
    const fetchData = async () => {
      if (!hostelId || !roomId) {
        toast.error("Invalid booking parameters");
        navigate(-1);
        return;
      }
      setLoading(true);
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single();
      if (roomError || !roomData) {
        toast.error("Room not found");
        navigate(-1);
        return;
      }
      setRoom(roomData);
      const { data: hostelData, error: hostelError } = await supabase
        .from('hostels')
        .select('*')
        .eq('id', hostelId)
        .single();
      if (hostelError || !hostelData) {
        toast.error("Hostel not found");
        navigate(-1);
        return;
      }
      setHostel(hostelData);
      setLoading(false);
    };
    fetchData();
  }, [hostelId, roomId, navigate]);

  // Calculate end date based on stay type
  const getEndDate = () => {
    const date = new Date(startDate);
    
    if (stayType === 'daily') {
      date.setDate(date.getDate() + 1);
    } else if (stayType === 'weekly') {
      date.setDate(date.getDate() + 7);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    
    return date.toISOString().split('T')[0];
  };
  
  // Calculate price based on stay type
  const getPrice = () => {
    if (!room) return 0;
    if (stayType === 'daily') return room.pricing_daily || 0;
    if (stayType === 'weekly') return room.pricing_weekly || 0;
    return room.pricing_monthly || 0;
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    
    // Ensure date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (new Date(selectedDate) < today) {
      toast.error("Cannot select a date in the past");
      return;
    }
    
    setStartDate(selectedDate);
  };
  
  const handleContinue = async () => {
    if (!user) {
      toast.error("You must be logged in to book");
      return;
    }
    if (!room || !hostel) {
      toast.error("Room or hostel not loaded");
      return;
    }
    if (bookingFor === 'other' && (!guestName || !guestPhone)) {
      toast.error("Please enter guest details");
      return;
    }
    if (!acceptedTerms) {
      toast.error("Please accept the terms and conditions");
      return;
    }
    setCreating(true);
    // Prepare booking data
    const bookingPayload: any = {
      hosteller_id: user.id,
      hostel_id: hostelId!,
      room_id: roomId!,
      plan: stayType,
      start_date: startDate,
      end_date: getEndDate(),
      guest_name: bookingFor === 'other' ? guestName : profile?.name || '',
      guest_id_url: null, // TODO: handle upload
      amount: getPrice(),
      payment_status: paymentMethod === 'online' ? 'paid' : 'cash',
      status: 'confirmed',
      created_at: new Date().toISOString(),
    };
    // Insert booking
    const { data, error } = await supabase.from('bookings').insert([bookingPayload]).select().single();
    if (error || !data) {
      toast.error("Booking failed");
      setCreating(false);
      return;
    }
    // If online payment, create payment record
    if (paymentMethod === 'online') {
      await supabase.from('payments').insert([
        {
          user_id: user.id,
          hostel_id: hostelId!,
          type: 'booking',
          amount: getPrice(),
          status: 'success',
          timestamp: new Date().toISOString(),
        },
      ]);
      navigate(`/hosteller/payment/${hostelId}/${roomId}`);
    } else {
      navigate('/hosteller/bookings');
    }
    setCreating(false);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-medium">Book Your Stay</h1>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 p-4 max-w-md mx-auto w-full">
        {/* Hostel & Room Info */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h2 className="font-medium mb-1">{hostel.hostel_name}</h2>
            <p className="text-gray-600 text-sm">{room.room_type}</p>
          </CardContent>
        </Card>
        
        {/* Booking Details */}
        <Card className="mb-4">
          <CardHeader className="pb-0">
            <h2 className="font-medium">Stay Details</h2>
          </CardHeader>
          <CardContent className="p-4">
            {/* Stay Type */}
            <div className="mb-4">
              <Label className="block mb-2">Select Stay Type</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant={stayType === 'daily' ? 'default' : 'outline'}
                  className={`text-sm h-9 ${stayType === 'daily' ? '' : 'border-gray-300'}`}
                  onClick={() => setStayType('daily')}
                >
                  Daily
                </Button>
                <Button 
                  variant={stayType === 'weekly' ? 'default' : 'outline'}
                  className={`text-sm h-9 ${stayType === 'weekly' ? '' : 'border-gray-300'}`}
                  onClick={() => setStayType('weekly')}
                >
                  Weekly
                </Button>
                <Button 
                  variant={stayType === 'monthly' ? 'default' : 'outline'}
                  className={`text-sm h-9 ${stayType === 'monthly' ? '' : 'border-gray-300'}`}
                  onClick={() => setStayType('monthly')}
                >
                  Monthly
                </Button>
              </div>
            </div>
            
            {/* Check-in Date */}
            <div className="mb-4">
              <Label htmlFor="checkin-date">Check-in Date</Label>
              <div className="relative">
                <Input 
                  id="checkin-date" 
                  type="date" 
                  value={startDate}
                  onChange={handleDateChange}
                  className="pl-10"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            {/* Check-out Date (read-only) */}
            <div className="mb-4">
              <Label htmlFor="checkout-date">Check-out Date</Label>
              <div className="relative">
                <Input 
                  id="checkout-date" 
                  type="date" 
                  value={getEndDate()}
                  disabled
                  className="pl-10 bg-gray-50"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stayType === 'daily' ? '1 day stay' : stayType === 'weekly' ? '7 days stay' : '30 days stay'}
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Guest Details */}
        <Card className="mb-4">
          <CardHeader className="pb-0">
            <h2 className="font-medium">Guest Details</h2>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Label htmlFor="booking-for">Booking for someone else?</Label>
              <Switch
                id="booking-for"
                checked={bookingFor === 'other'}
                onCheckedChange={(checked) => setBookingFor(checked ? 'other' : 'self')}
              />
            </div>
            
            {bookingFor === 'other' && (
              <div className="space-y-4 pt-2">
                <div>
                  <Label htmlFor="guest-name">Guest Name</Label>
                  <div className="relative">
                    <Input 
                      id="guest-name" 
                      placeholder="Enter guest's full name" 
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="pl-10"
                    />
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="guest-phone">Guest Phone</Label>
                  <div className="flex">
                    <div className="bg-gray-100 px-3 py-2 border border-r-0 rounded-l-md text-gray-500">+91</div>
                    <Input 
                      id="guest-phone" 
                      placeholder="Enter guest's 10-digit mobile" 
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      type="tel"
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="id-upload" className="block mb-2">Upload Guest ID Proof</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Drag & drop or click to upload</p>
                    <p className="text-xs text-gray-400 mt-1">Supported formats: JPG, PNG, PDF</p>
                    <Input 
                      id="id-upload" 
                      type="file" 
                      className="hidden"
                      accept="image/*,.pdf"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3"
                      onClick={() => document.getElementById('id-upload')?.click()}
                    >
                      Select File
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {bookingFor === 'self' && (
              <div className="flex items-center p-3 bg-blue-50 rounded-md text-sm">
                <UserIcon className="h-4 w-4 mr-2 text-blue-500" />
                Your verified details will be used for this booking
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Payment Method */}
        <Card className="mb-4">
          <CardHeader className="pb-0">
            <h2 className="font-medium">Payment Method</h2>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant={paymentMethod === 'online' ? 'default' : 'outline'}
                className={`flex items-center justify-center gap-2 ${
                  paymentMethod === 'online' ? '' : 'border-gray-300'
                }`}
                onClick={() => setPaymentMethod('online')}
              >
                <CreditCard className="h-4 w-4" />
                Pay Online
              </Button>
              <Button 
                variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                className={`flex items-center justify-center gap-2 ${
                  paymentMethod === 'cash' ? '' : 'border-gray-300'
                }`}
                onClick={() => setPaymentMethod('cash')}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Pay at Hostel
              </Button>
            </div>
            {paymentMethod === 'cash' && (
              <p className="text-xs text-gray-500 mt-3">
                Note: Pay cash at the hostel reception during check-in. Your booking will be confirmed immediately but payment will be collected on arrival.
              </p>
            )}
          </CardContent>
        </Card>
        
        {/* Special Requests */}
        <Card className="mb-4">
          <CardHeader className="pb-0">
            <h2 className="font-medium">Special Requests (Optional)</h2>
          </CardHeader>
          <CardContent className="p-4">
            <Textarea 
              placeholder="Any special requests or requirements?"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll try our best to accommodate your requests (subject to availability)
            </p>
          </CardContent>
        </Card>
        
        {/* Terms */}
        <div className="flex items-start space-x-2 mb-6">
          <Checkbox 
            id="terms" 
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(!!checked)}
          />
          <label 
            htmlFor="terms" 
            className="text-sm text-gray-600 leading-tight cursor-pointer"
          >
            I agree to the <a href="#" className="text-blue-600">Terms & Conditions</a> and <a href="#" className="text-blue-600">Hostel Rules</a>
          </label>
        </div>
      </div>
      
      {/* Payment Summary & Action */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="text-gray-600">Total Amount</div>
            <div className="text-xl font-bold">₹{getPrice()}</div>
          </div>
          <Button 
            className="w-full"
            onClick={handleContinue}
            disabled={!acceptedTerms || (bookingFor === 'other' && (!guestName || !guestPhone))}
          >
            {paymentMethod === 'online' ? 'Proceed to Payment' : 'Confirm Booking'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Booking;
