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
        .eq("owner_id", ownerId)
        .order("created_at", { ascending: false });

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

      {hostels.length > 0 ? (
        <>
          <div className="flex justify-end mb-6">
            <Button onClick={() => navigate('/owner/add-hostel')}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add New Hostel
            </Button>
          </div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {hostels.map((hostel) => (
              <Card key={hostel.id} className="border-l-4 border-l-green-500">
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold">{hostel.name}</h2>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                      {hostel.status || "draft"}
                    </span>
                  </div>
                  <Button onClick={() => navigate(`/owner/manage-hostel/${hostel.id}`)}>
                    Manage
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
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
