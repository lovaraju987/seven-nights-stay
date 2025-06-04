import React, { useState, useEffect } from "react";
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

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold">Hostel Management</h1>
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

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="pending" className="flex-1 sm:flex-initial">
              Pending Verification
              <Badge variant="secondary" className="ml-2">
                {filteredPendingHostels.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="verified" className="flex-1 sm:flex-initial">
              Verified Hostels
              <Badge variant="secondary" className="ml-2">
                {filteredVerifiedHostels.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
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
          </TabsContent>

          <TabsContent value="verified">
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