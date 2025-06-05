
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
  Search, 
  MessageSquare, 
  Eye,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// Mock complaint data
const complaints = [
  {
    id: "c1",
    issue: "Water shortage",
    category: "Facility",
    user: "Rahul Sharma",
    hostel: "Royal Boys Hostel",
    createdAt: "2025-05-14",
    status: "open",
    priority: "high",
    description: "There has been no water supply for the past 24 hours. This is causing a lot of inconvenience.",
    bookingId: "B1001",
  },
  {
    id: "c2",
    issue: "Cleanliness issues",
    category: "Hygiene",
    user: "Priya Patel",
    hostel: "Sunshine Girls PG",
    createdAt: "2025-05-13",
    status: "in-progress",
    priority: "medium",
    description: "The common areas are not being cleaned regularly. The bathrooms are dirty and unhygienic.",
    bookingId: "B1002",
  },
  {
    id: "c3",
    issue: "WiFi not working",
    category: "Facility",
    user: "Vikram Singh",
    hostel: "Elite Co-Living Space",
    createdAt: "2025-05-12",
    status: "resolved",
    priority: "low",
    description: "The WiFi has been down for 2 days now. I need internet connection for my online classes.",
    bookingId: "B1003",
  },
  {
    id: "c4",
    issue: "Incorrect billing",
    category: "Billing",
    user: "Meena Reddy",
    hostel: "Ladies Paradise PG",
    createdAt: "2025-05-11",
    status: "open",
    priority: "medium",
    description: "I was charged for AC room but I'm staying in a non-AC room. Please rectify this and refund the difference.",
    bookingId: "B1004",
  },
  {
    id: "c5",
    issue: "Security concerns",
    category: "Safety",
    user: "Ramesh Kumar",
    hostel: "Student Haven Hostel",
    createdAt: "2025-05-10",
    status: "escalated",
    priority: "high",
    description: "The main gate is left open at night and anyone can walk in. This is a serious security concern.",
    bookingId: "B1005",
  },
];

const statusColors = {
  open: "warning",
  "in-progress": "info",
  resolved: "success",
  escalated: "destructive",
};

const priorityColors = {
  high: "destructive",
  medium: "warning",
  low: "default",
};

const ComplaintManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [showComplaintDialog, setShowComplaintDialog] = useState(false);
  const [response, setResponse] = useState("");

  const handleStatusChange = (complaintId: string, newStatus: string) => {
    toast.success(`Complaint #${complaintId} status updated to ${newStatus}`);
  };

  const handleSubmitResponse = () => {
    if (!response.trim()) {
      toast.error("Please enter a response");
      return;
    }
    
    toast.success(`Response sent to ${selectedComplaint.user}`);
    setResponse("");
    setShowComplaintDialog(false);
  };

  const handleResolveComplaint = () => {
    toast.success(`Complaint #${selectedComplaint.id} marked as resolved`);
    setShowComplaintDialog(false);
  };

  // Apply filters
  const filteredComplaints = complaints.filter((complaint) => {
    // Search filter
    const matchesSearch =
      complaint.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.hostel.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter;
    
    // Priority filter
    const matchesPriority = priorityFilter === "all" || complaint.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Complaint Management</h1>
          <div className="mt-4 sm:mt-0">
            <Badge variant="outline" className="mr-2">
              Open: {complaints.filter(c => c.status === "open").length}
            </Badge>
            <Badge variant="outline" className="mr-2">
              In Progress: {complaints.filter(c => c.status === "in-progress").length}
            </Badge>
            <Badge variant="outline" className="mr-2">
              Escalated: {complaints.filter(c => c.status === "escalated").length}
            </Badge>
            <Badge variant="outline">
              Resolved: {complaints.filter(c => c.status === "resolved").length}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search complaints..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Hostel</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell className="font-medium">{complaint.id}</TableCell>
                    <TableCell>{complaint.issue}</TableCell>
                    <TableCell>{complaint.user}</TableCell>
                    <TableCell>{complaint.hostel}</TableCell>
                    <TableCell>{complaint.createdAt}</TableCell>
                    <TableCell>
                      <Badge variant={priorityColors[complaint.priority as keyof typeof priorityColors] as any}>
                        {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[complaint.status as keyof typeof statusColors] as any}>
                        {complaint.status === "in-progress" 
                          ? "In Progress" 
                          : complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setShowComplaintDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={complaint.status === "resolved" ? "text-green-600" : "text-blue-600"}
                          disabled={complaint.status === "resolved"}
                          onClick={() => handleStatusChange(complaint.id, "resolved")}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-24">
                    No complaints found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Complaint Detail Dialog */}
      {selectedComplaint && (
        <Dialog open={showComplaintDialog} onOpenChange={setShowComplaintDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <span className="mr-2">Complaint #{selectedComplaint.id}</span>
                <Badge variant={statusColors[selectedComplaint.status as keyof typeof statusColors] as any}>
                  {selectedComplaint.status === "in-progress" 
                    ? "In Progress" 
                    : selectedComplaint.status.charAt(0).toUpperCase() + selectedComplaint.status.slice(1)}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Issue Details</h3>
                  <div className="rounded-md border p-4 space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Issue:</span>
                      <p className="font-medium">{selectedComplaint.issue}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Category:</span>
                      <p className="font-medium">{selectedComplaint.category}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Description:</span>
                      <p className="text-sm mt-1">{selectedComplaint.description}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Priority:</span>
                      <Badge variant={priorityColors[selectedComplaint.priority as keyof typeof priorityColors] as any} className="ml-2">
                        {selectedComplaint.priority.charAt(0).toUpperCase() + selectedComplaint.priority.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-1">User & Booking Information</h3>
                  <div className="rounded-md border p-4 space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">User:</span>
                      <p className="font-medium">{selectedComplaint.user}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Hostel:</span>
                      <p className="font-medium">{selectedComplaint.hostel}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Booking ID:</span>
                      <p className="font-medium">{selectedComplaint.bookingId}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Reported On:</span>
                      <p className="font-medium">{selectedComplaint.createdAt}</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedComplaint.status !== "resolved" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Respond to User</h3>
                    <Select
                      defaultValue={selectedComplaint.status}
                      onValueChange={(value) => handleStatusChange(selectedComplaint.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="escalated">Escalated</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    placeholder="Type your response to the user..."
                    className="min-h-[100px]"
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowComplaintDialog(false)}>
                Close
              </Button>
              {selectedComplaint.status !== "resolved" && (
                <>
                  <Button 
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleSubmitResponse}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send Response
                  </Button>
                  <Button 
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleResolveComplaint}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark Resolved
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
};

export default ComplaintManagement;
