
import React, { useState } from "react";
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
  ShieldCheck, 
  ShieldX,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// Mock hostel data
const pendingHostels = [
  {
    id: "h1",
    name: "Royal Boys Hostel",
    owner: "Rajesh Kumar",
    type: "Boys",
    location: "Koramangala, Bangalore",
    submittedOn: "2025-05-10",
    status: "pending",
  },
  {
    id: "h2",
    name: "Sunshine Girls PG",
    owner: "Priya Sharma",
    type: "Girls",
    location: "HSR Layout, Bangalore",
    submittedOn: "2025-05-12",
    status: "pending",
  },
  {
    id: "h3",
    name: "Elite Co-Living Space",
    owner: "Amit Verma",
    type: "Co-ed",
    location: "Indiranagar, Bangalore",
    submittedOn: "2025-05-14",
    status: "pending",
  },
];

const verifiedHostels = [
  {
    id: "h4",
    name: "Student Haven Hostel",
    owner: "Suresh Patel",
    type: "Boys",
    location: "BTM Layout, Bangalore",
    verifiedOn: "2025-04-20",
    status: "active",
  },
  {
    id: "h5",
    name: "Ladies Paradise PG",
    owner: "Meena Reddy",
    type: "Girls",
    location: "JP Nagar, Bangalore",
    verifiedOn: "2025-04-25",
    status: "active",
  },
  {
    id: "h6",
    name: "Comfort Zone PG",
    owner: "Vikram Singh",
    type: "Boys",
    location: "Whitefield, Bangalore",
    verifiedOn: "2025-05-01",
    status: "inactive",
  },
];

const HostelManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHostel, setSelectedHostel] = useState<any>(null);
  const [showHostelDialog, setShowHostelDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState<"view" | "verify" | "reject">("view");

  const handleVerify = (hostel: any) => {
    toast.success(`${hostel.name} has been verified successfully`);
    setShowHostelDialog(false);
  };

  const handleReject = (hostel: any) => {
    toast.success(`${hostel.name} has been rejected`);
    setShowHostelDialog(false);
  };

  const handleStatusToggle = (hostel: any) => {
    const newStatus = hostel.status === "active" ? "inactive" : "active";
    toast.success(`${hostel.name} is now ${newStatus}`);
  };

  const filteredPendingHostels = pendingHostels.filter((hostel) =>
    hostel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hostel.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hostel.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVerifiedHostels = verifiedHostels.filter((hostel) =>
    hostel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hostel.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hostel.location.toLowerCase().includes(searchQuery.toLowerCase())
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
                        <TableCell>{hostel.owner}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{hostel.type}</Badge>
                        </TableCell>
                        <TableCell>{hostel.location}</TableCell>
                        <TableCell>{hostel.submittedOn}</TableCell>
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
                        <TableCell>{hostel.owner}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{hostel.type}</Badge>
                        </TableCell>
                        <TableCell>{hostel.location}</TableCell>
                        <TableCell>
                          <Badge
                            variant={hostel.status === "active" ? "success" : "destructive"}
                          >
                            {hostel.status === "active" ? "Active" : "Inactive"}
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
                            <Button
                              variant="ghost"
                              size="icon"
                              className={hostel.status === "active" ? "text-red-600" : "text-green-600"}
                              onClick={() => handleStatusToggle(hostel)}
                            >
                              {hostel.status === "active" ? (
                                <ShieldX className="h-4 w-4" />
                              ) : (
                                <ShieldCheck className="h-4 w-4" />
                              )}
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
                      <Badge variant={selectedHostel.status === "active" ? "success" : selectedHostel.status === "pending" ? "outline" : "destructive"}>
                        {selectedHostel.status === "active" ? "Active" : selectedHostel.status === "pending" ? "Pending" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-1">Owner Information</h3>
                  <div className="rounded-md border p-4 space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Name:</span>
                      <p className="font-medium">{selectedHostel.owner}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Contact:</span>
                      <p className="font-medium">+91 98765 43210</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Email:</span>
                      <p className="font-medium">{selectedHostel.owner.split(' ')[0].toLowerCase()}@example.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {dialogAction !== "view" && (
                <div>
                  <h3 className="text-sm font-medium mb-1">
                    {dialogAction === "verify" ? "Verification Notes" : "Rejection Reason"}
                  </h3>
                  <Input
                    placeholder={
                      dialogAction === "verify"
                        ? "Add any notes for verification (optional)"
                        : "Please specify reason for rejection"
                    }
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowHostelDialog(false)}>
                Cancel
              </Button>
              {dialogAction === "verify" && (
                <Button 
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleVerify(selectedHostel)}
                >
                  Verify Hostel
                </Button>
              )}
              {dialogAction === "reject" && (
                <Button 
                  variant="destructive"
                  onClick={() => handleReject(selectedHostel)}
                >
                  Reject Hostel
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
};

export default HostelManagement;
