import React, { useState } from "react";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import AgentLayout from "@/components/agent/AgentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Search, Edit, Eye, Phone, Camera } from "lucide-react";


const HostelCard = ({ hostel, navigate }: { hostel: any; navigate: any }) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "pending":
        return "outline";
      case "draft":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "pending":
        return "Pending";
      case "draft":
        return "Draft";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };
  // Improved image fallback logic and styling
  const imageUrl =
    hostel.images?.length > 0 && hostel.images[0]
      ? hostel.images[0]
      : "/no-image.png";
  return (
    <Card key={hostel.id} className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 bg-gray-100 h-40 md:h-auto flex items-center justify-center">
            <img
              src={imageUrl}
              alt={hostel.name}
              className="object-cover w-full h-full rounded-lg border"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/no-image.png";
              }}
            />
          </div>
          <div className="p-6 flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-medium text-lg">{hostel.name}</h3>
                <p className="text-gray-500 text-sm">{hostel.city || hostel.address?.city}</p>
                <p className="text-gray-500 text-sm capitalize">{hostel.type} hostel</p>
              </div>
              <Badge variant={getStatusBadgeVariant(hostel.status)}>
                {getStatusLabel(hostel.status)}
              </Badge>
            </div>
            {hostel.status === "rejected" && hostel.rejection_reason && (
              <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md text-sm">
                <strong>Feedback:</strong> {hostel.rejection_reason}
              </div>
            )}
            <div className="flex flex-col md:flex-row justify-between">
              <div className="text-sm">
                <div className="mb-1">
                  <span className="text-gray-500">Owner: </span>
                  {hostel.owner_name}
                </div>
                <div className="mb-1">
                  <span className="text-gray-500">Contact: </span>
                  {hostel.owner_phone}
                </div>
                <div>
                  <span className="text-gray-500">Last Updated: </span>
                  {hostel.updated_at
                    ? format(new Date(hostel.updated_at), "MMM dd, yyyy")
                    : ""}
                </div>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/agent/view-hostel/${hostel.id}`)}
                >
                  <Eye className="h-4 w-4 mr-1" /> View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/agent/edit-hostel/${hostel.id}`)}
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/agent/hostel-images/${hostel.id}`)}
                >
                  <Camera className="h-4 w-4 mr-1" /> Images
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/agent/contact-hostel/${hostel.id}`)}
                >
                  <Phone className="h-4 w-4 mr-1" /> Contact
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AgentMyHostels = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [hostels, setHostels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHostels = async () => {
      setIsLoading(true);
      // 1. Fetch the authenticated user
      try {
        const { data: userData, error: authError } = await supabase.auth.getUser();
        if (authError || !userData?.user) {
          if (typeof toast !== "undefined") toast.error("Could not fetch user.");
          if (authError) console.error("Supabase auth error:", authError.message);
          navigate("/agent/login");
          return;
        }
        const userId = userData.user.id;
        console.log("Agent ID from auth:", userId);

        let { data, error } = await supabase
          .from("hostels")
          .select("*")
          .eq("agent_id", userId)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching hostels:", error.message);
        } else if (!data || data.length === 0) {
          console.warn("No hostels found for agent. Trying full fetch...");
          const fallback = await supabase.from("hostels").select("*").order("created_at", { ascending: false });
          console.log("Fallback hostels fetch:", fallback.data);
          data = fallback.data || [];
        }
        setHostels(data || []);
      } catch (err) {
        console.error("Unexpected error in fetchHostels:", err);
      }
      setIsLoading(false);
    };
    fetchHostels();
  }, []);

  const filteredHostels = hostels.filter(
    (hostel) => {
      const name = hostel.name || "";
      const city = hostel.city || hostel.address?.city || "";
      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  );

  // These are used by the empty state in "all" only:
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "pending":
        return "outline";
      case "draft":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "pending":
        return "Pending";
      case "draft":
        return "Draft";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  return (
    <AgentLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">My Hostels</h1>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search hostels..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => navigate("/agent/add-hostel")}>Add Hostel</Button>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              <Card>
                <CardContent className="p-10 text-center text-gray-500">
                  Loading hostels...
                </CardContent>
              </Card>
            ) : (
              filteredHostels.length > 0 ? (
                filteredHostels.map((hostel) => (
                  <HostelCard key={hostel.id} hostel={hostel} navigate={navigate} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-10 text-center text-gray-500">
                    No hostels found. Try adjusting your search or{" "}
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={() => navigate("/agent/add-hostel")}
                    >
                      add a new hostel
                    </Button>
                    .
                  </CardContent>
                </Card>
              )
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            {filteredHostels.filter(h => h.status === "approved").length > 0 ? (
              filteredHostels
                .filter((hostel) => hostel.status === "approved")
                .map((hostel) => (
                  <HostelCard key={hostel.id} hostel={hostel} navigate={navigate} />
                ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  No approved hostels found.
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {filteredHostels.filter(h => h.status === "pending").length > 0 ? (
              filteredHostels
                .filter((hostel) => hostel.status === "pending")
                .map((hostel) => (
                  <HostelCard key={hostel.id} hostel={hostel} navigate={navigate} />
                ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  No pending hostels found.
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            {filteredHostels.filter(h => h.status === "draft").length > 0 ? (
              filteredHostels
                .filter((hostel) => hostel.status === "draft")
                .map((hostel) => (
                  <HostelCard key={hostel.id} hostel={hostel} navigate={navigate} />
                ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  No draft hostels found.
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {filteredHostels.filter(h => h.status === "rejected").length > 0 ? (
              filteredHostels
                .filter((hostel) => hostel.status === "rejected")
                .map((hostel) => (
                  <HostelCard key={hostel.id} hostel={hostel} navigate={navigate} />
                ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  No rejected hostels found.
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AgentLayout>
  );
};

export default AgentMyHostels;
