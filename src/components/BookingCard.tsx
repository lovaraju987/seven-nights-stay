
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, AlertCircle } from "lucide-react";

// Define a BookingType interface to match the data structure
export type BookingType = {
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
  status: string;
  cancelReason?: string;
};

type BookingCardProps = {
  booking: BookingType;
  type: 'upcoming' | 'past' | 'cancelled';
  formatDate: (date: string) => string;
  calculateNights: (checkIn: string, checkOut: string) => number;
  navigate: (path: string) => void;
  onCancel?: () => void;
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
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </div>
            )}
            
            {(type === 'past' || type === 'cancelled') && (
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

export default BookingCard;
