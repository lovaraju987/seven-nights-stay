import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  HomeIcon,
  BedDoubleIcon,
  CalendarIcon,
  CreditCardIcon,
  BarChartIcon,
  QrCodeIcon,
  PlusIcon
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const OwnerDashboard = () => {
  const navigate = useNavigate();

  const [hostelData, setHostelData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hostels, setHostels] = useState<any[]>([]);

  useEffect(() => {
    const fetchHostels = async () => {
      const { data: userData, error: authError } = await supabase.auth.getUser();
      if (authError || !userData?.user?.id) {
        console.error("Auth error or no user:", authError);
        setIsLoading(false);
        return;
      }
  
      const ownerId = userData.user.id;
  
      const { data: hostelsData, error } = await supabase
        .from("hostels")
        .select("*")
        .eq("created_by", "owner")
        .eq("owner_id", ownerId); // Ensure this column exists and is populated on insert
  
      if (error) {
        console.error("Failed to fetch hostels:", error.message);
      } else {
        setHostels(hostelsData || []);
      }
  
      setIsLoading(false);
    };
  
    fetchHostels();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Owner Dashboard</h1>
        <p className="text-gray-500">Manage your hostel listings and bookings</p>
      </header>

      {hostelData ? (
        <div className="space-y-6">
          {/* Hostel Status Card */}
          <Card className="overflow-hidden border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-bold">{hostelData.name}</h2>
                  <div className="flex items-center mt-1">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                      {hostelData.status || "Verified"}
                    </span>
                  </div>
                </div>
                <Button onClick={() => navigate(`/owner/manage-hostel/${hostelData.id}`)}>
                  Manage Hostel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm mb-1">Occupancy Rate</span>
                  <span className="text-2xl font-bold">{hostelData.occupancyRate}%</span>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${hostelData.occupancyRate}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm mb-1">Monthly Earnings</span>
                  <span className="text-2xl font-bold">₹{hostelData.monthlyEarnings}</span>
                  <span className="text-green-600 text-xs mt-2">+15% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm mb-1">Active Bookings</span>
                  <span className="text-2xl font-bold">{hostelData.activeBookings}</span>
                  <span className="text-blue-600 text-xs mt-2">
                    <button onClick={() => navigate('/owner/bookings')} className="underline">View all</button>
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate(`/owner/manage-rooms/${hostelData.id}`)}
              >
                <BedDoubleIcon className="h-5 w-5 mb-1" />
                <span>Manage Rooms</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/owner/bookings')}
              >
                <CalendarIcon className="h-5 w-5 mb-1" />
                <span>View Bookings</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/owner/subscription')}
              >
                <CreditCardIcon className="h-5 w-5 mb-1" />
                <span>Subscription</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate(`/owner/qr-storefront/${hostelData.id}`)}
              >
                <QrCodeIcon className="h-5 w-5 mb-1" />
                <span>QR Storefront</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/owner/analytics')}
              >
                <BarChartIcon className="h-5 w-5 mb-1" />
                <span>Analytics</span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // No Hostel Added yet
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-6 inline-flex mb-6">
            <HomeIcon className="h-12 w-12 text-blue-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">No Hostels Added Yet</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Add your first hostel to start accepting bookings and managing your business through OneTo7.
          </p>
          <Button onClick={() => navigate('/owner/add-hostel')} className="gap-2">
            <PlusIcon className="h-4 w-4" />
            Add Your First Hostel
          </Button>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
