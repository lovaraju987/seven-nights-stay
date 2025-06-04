import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star, ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const RateStay = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [alreadyRated, setAlreadyRated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData?.user?.id || null;
      setUserId(uid);
      if (!uid) return;

      const { data, error } = await supabase
        .from("bookings")
        .select("*, hostels(name)")
        .eq("id", bookingId)
        .single();
      if (error || !data) {
        toast("Booking not found");
        return;
      }
      setBooking(data);

      const { data: reviewData } = await supabase
        .from("reviews")
        .select("id")
        .eq("hostel_id", data.hostel_id)
        .eq("user_id", uid)
        .maybeSingle();
      if (reviewData) setAlreadyRated(true);
    };
    fetchData();
  }, [bookingId]);

  const handleSubmit = async () => {
    if (!userId || !booking) return;
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      rating,
      comment,
      hostel_id: booking.hostel_id,
      user_id: userId,
    });
    setSubmitting(false);
    if (error) {
      toast("Failed to submit review");
    } else {
      toast("Review submitted");
      navigate("/hosteller/bookings");
    }
  };

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500" />
      </div>
    );
  }

  if (alreadyRated) {
    return (
      <div className="p-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <p className="mt-6">You have already rated this stay.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="p-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-bold ml-2">Rate your stay at {booking.hostels?.name}</h1>
      </div>
      <Card className="mx-4">
        <CardContent className="p-4 space-y-4">
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={`h-6 w-6 cursor-pointer ${n <= rating ? "fill-yellow-500" : "text-gray-300"}`}
                onClick={() => setRating(n)}
              />
            ))}
          </div>
          <Textarea
            placeholder="Leave a comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RateStay;
