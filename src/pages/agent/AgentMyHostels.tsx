
import React, { useEffect, useState } from "react";
import AgentLayout from "@/components/agent/AgentLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Edit, Image, Phone, PlusIcon } from "lucide-react";

interface Hostel {
  id: string;
  name: string;
  type: string;
  status: string;
  created_at: string;
  address: any;
  owner_name?: string;
  owner_phone?: string;
  images?: string[];
}

const AgentMyHostels = () => {
  const navigate = useNavigate();
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHostels = async () => {
      const { data: userData, error: authError } = await supabase.auth.getUser();
      if (authError || !userData?.user?.id) {
        console.error("Auth error or no user:", authError);
        setIsLoading(false);
        return;
      }

      const agentId = userData.user.id;

      const { data: hostelsData, error } = await supabase
        .from("hostels")
        .select("*")
        .eq("agent_id", agentId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch hostels:", error.message);
        toast.error("Failed to fetch hostels");
      } else {
        setHostels(hostelsData || []);
      }

      setIsLoading(false);
    };

    fetchHostels();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <AgentLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </AgentLayout>
    );
  }

  return (
    <AgentLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">My Hostels</h1>
            <p className="text-gray-600">Manage hostels you've added</p>
          </div>
          <Button onClick={() => navigate("/agent/add-hostel")}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add New Hostel
          </Button>
        </div>

        {hostels.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">No hostels added yet</h3>
                <p className="text-gray-500 mb-4">
                  Start by adding your first hostel to get started.
                </p>
                <Button onClick={() => navigate("/agent/add-hostel")}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add First Hostel
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {hostels.map((hostel) => (
              <Card key={hostel.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{hostel.name}</h3>
                      <p className="text-gray-600 capitalize">{hostel.type} Hostel</p>
                      {hostel.address && (
                        <p className="text-sm text-gray-500 mt-1">
                          {hostel.address.city}, {hostel.address.state}
                        </p>
                      )}
                    </div>
                    <Badge className={getStatusColor(hostel.status)}>
                      {hostel.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 justify-between items-center">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/agent/view-hostel/${hostel.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/agent/edit-hostel/${hostel.id}`)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/agent/hostel-images/${hostel.id}`)}
                      >
                        <Image className="h-4 w-4 mr-1" />
                        Images
                      </Button>
                      {(hostel.owner_phone || hostel.owner_name) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/agent/contact-hostel/${hostel.id}`)}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      Added: {new Date(hostel.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AgentLayout>
  );
};

export default AgentMyHostels;
