import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQueryList = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);

    mediaQueryList.addEventListener("change", listener);
    setMatches(mediaQueryList.matches);

    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}

const HostelManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHostel, setSelectedHostel] = useState<any>(null);
  const [showHostelDialog, setShowHostelDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState<"view" | "verify" | "reject">("view");
  const [pendingHostels, setPendingHostels] = useState<any[]>([]);
  const [verifiedHostels, setVerifiedHostels] = useState<any[]>([]);

  useEffect(() => {
    const fetchHostels = async () => {
      const { data, error } = await supabase
        .from("hostels")
        .select("*, profiles:owner_id(name)")
        .order("created_at", { ascending: false });
      if (error) {
        toast.error("Failed to fetch hostels");
        return;
      }

      const pending = data.filter((h) => h.status === "pending");
      const verified = data.filter((h) => h.status !== "pending");

      setPendingHostels(pending);
      setVerifiedHostels(verified);
    };

    fetchHostels();
  }, []);

  const handleVerify = async (hostel: any) => {
    const { error } = await supabase
      .from("hostels")
      .update({ status: "verified", verified_on: new Date().toISOString() })
      .eq("id", hostel.id);
    if (error) {
      toast.error("Failed to verify hostel");
      return;
    }
    toast.success(`${hostel.name} has been verified successfully`);
    setPendingHostels((prev) => prev.filter((h) => h.id !== hostel.id));
    setVerifiedHostels((prev) => [{ ...hostel, status: "verified" }, ...prev]);
    setShowHostelDialog(false);
  };

  const handleReject = async (hostel: any) => {
    const { error } = await supabase
      .from("hostels")
      .update({ status: "rejected", rejected_on: new Date().toISOString() })
      .eq("id", hostel.id);
    if (error) {
      toast.error("Failed to reject hostel");
      return;
    }
    toast.success(`${hostel.name} has been rejected`);
    setPendingHostels((prev) => prev.filter((h) => h.id !== hostel.id));
    setVerifiedHostels((prev) => [{ ...hostel, status: "rejected" }, ...prev]);
    setShowHostelDialog(false);
  };


  const filteredPendingHostels = pendingHostels.filter((hostel) =>
    hostel.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (hostel.profiles?.name || "Unknown").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (hostel.location || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVerifiedHostels = verifiedHostels.filter((hostel) =>
    hostel.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (hostel.profiles?.name || "Unknown").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (hostel.location || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openHostelDialog = (hostel: any, action: "view" | "verify" | "reject") => {
    setSelectedHostel(hostel);
    setDialogAction(action);
    setShowHostelDialog(true);
  };

  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <AdminLayout>
      <div className="p-4 space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold">Hostel Management</h1>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              className="mb-2 sm:mb-0"
              onClick={() => navigate("/admin/add-hostel")}
            >
              + Add Hostel
            </Button>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search hostels..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="flex flex-col sm:flex-row gap-2">
            <TabsTrigger value="pending">
              Pending
              <Badge variant="secondary" className="ml-2">{filteredPendingHostels.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="verified">
              Verified
              <Badge variant="secondary" className="ml-2">{filteredVerifiedHostels.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Pending Hostels */}
          <TabsContent value="pending">
            {isMobile ? (
              <div className="space-y-4">
                {filteredPendingHostels.length > 0 ? filteredPendingHostels.map((hostel) => (
                  <div
                    key={hostel.id}
                    className="rounded-xl border bg-white shadow-md p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-base truncate text-gray-900">{hostel.name}</div>
                        <div className="text-xs text-gray-500 truncate">{hostel.location}</div>
                      </div>
                      <Badge variant="outline" className="ml-2 whitespace-nowrap">{hostel.type}</Badge>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      <span className="font-medium">Owner:</span> {hostel.profiles?.name || "Unknown"}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button size="sm" variant="outline" className="flex-1 min-w-[90px]" onClick={() => openHostelDialog(hostel, "view")}>View</Button>
                      <Button size="sm" variant="outline" className="flex-1 min-w-[90px] text-green-700 border-green-200" onClick={() => openHostelDialog(hostel, "verify")}>Approve</Button>
                      <Button size="sm" variant="outline" className="flex-1 min-w-[90px] text-red-700 border-red-200" onClick={() => openHostelDialog(hostel, "reject")}>Reject</Button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-gray-500 py-8">No pending hostels found</div>
                )}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hostel Name</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Submitted On</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPendingHostels.length > 0 ? (
                      filteredPendingHostels.map((hostel) => (
                        <TableRow key={hostel.id}>
                          <TableCell className="font-medium">{hostel.name}</TableCell>
                          <TableCell>{hostel.profiles?.name || "Unknown"}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{hostel.type}</Badge>
                          </TableCell>
                          <TableCell>{hostel.location}</TableCell>
                          <TableCell>
                            {/* Show submittedOn as created_at */}
                            {hostel.created_at ? new Date(hostel.created_at).toLocaleDateString() : "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openHostelDialog(hostel, "view")}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-green-600"
                                onClick={() => openHostelDialog(hostel, "verify")}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600"
                                onClick={() => openHostelDialog(hostel, "reject")}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          No pending hostels found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Verified Hostels */}
          <TabsContent value="verified">
            {isMobile ? (
              <div className="space-y-4">
                {filteredVerifiedHostels.length > 0 ? filteredVerifiedHostels.map((hostel) => (
                  <div
                    key={hostel.id}
                    className="rounded-xl border bg-white shadow-md p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-base truncate text-gray-900">{hostel.name}</div>
                        <div className="text-xs text-gray-500 truncate">{hostel.location}</div>
                      </div>
                      <Badge variant="outline" className="ml-2 whitespace-nowrap">{hostel.type}</Badge>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      <span className="font-medium">Owner:</span> {hostel.profiles?.name || "Unknown"}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button size="sm" variant="outline" className="flex-1 min-w-[90px]" onClick={() => openHostelDialog(hostel, "view")}>View</Button>
                      <Button size="sm" variant="outline" className="flex-1 min-w-[90px] text-blue-700 border-blue-200" onClick={() => navigate(`/admin/hostel/${hostel.id}`)}>Edit</Button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-gray-500 py-8">No verified hostels found</div>
                )}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hostel Name</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVerifiedHostels.length > 0 ? (
                      filteredVerifiedHostels.map((hostel) => (
                        <TableRow key={hostel.id}>
                          <TableCell className="font-medium">{hostel.name}</TableCell>
                          <TableCell>{hostel.profiles?.name || "Unknown"}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{hostel.type}</Badge>
                          </TableCell>
                          <TableCell>{hostel.location}</TableCell>
                          <TableCell>
                            <Badge
                              variant={hostel.status === "verified" ? "success" : "destructive"}
                            >
                              {hostel.status === "verified" ? "Verified" : "Rejected"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openHostelDialog(hostel, "view")}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-blue-600"
                                onClick={() => navigate(`/admin/hostel/${hostel.id}`)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          No verified hostels found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      {/* Hostel Detail Dialog */}
      {selectedHostel && (
        <Dialog open={showHostelDialog} onOpenChange={setShowHostelDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {dialogAction === "view"
                  ? `${selectedHostel.name} Details`
                  : dialogAction === "verify"
                  ? `Verify ${selectedHostel.name}`
                  : `Reject ${selectedHostel.name}`}
              </DialogTitle>
              <DialogDescription>
                Review the hostel information and take appropriate action.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Hostel Information</h3>
                  <div className="rounded-md border p-4 space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Name:</span>
                      <p className="font-medium">{selectedHostel.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Type:</span>
                      <p className="font-medium">{selectedHostel.type}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Location:</span>
                      <p className="font-medium">{selectedHostel.location}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Status:</span>
                      <Badge
                        variant={
                          selectedHostel.status === "verified"
                            ? "success"
                            : selectedHostel.status === "pending"
                              ? "outline"
                              : "destructive"
                        }
                      >
                        {selectedHostel.status === "verified" ? "Verified" : selectedHostel.status === "pending" ? "Pending" : "Rejected"}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Submitted On:</span>
                      <p className="font-medium">
                        {selectedHostel.created_at ? new Date(selectedHostel.created_at).toLocaleDateString() : "-"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Verified On:</span>
                        <p className="font-medium">
                          {selectedHostel.verified_on
                            ? new Date(selectedHostel.verified_on).toLocaleDateString()
                            : selectedHostel.status !== "pending" && selectedHostel.updated_at}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* ...rest of dialog... */}
                </div>
              </div>
            {dialogAction !== "view" && (
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() =>
                    dialogAction === "verify"
                      ? handleVerify(selectedHostel)
                      : handleReject(selectedHostel)
                  }
                >
                  {dialogAction === "verify" ? "Approve" : "Reject"}
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
        )}
      </AdminLayout>
    );
};

export default HostelManagement;