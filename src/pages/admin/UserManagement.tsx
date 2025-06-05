import React, { useState, useEffect } from "react";
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
  Search, 
  Eye, 
  UserMinus, 
  UserPlus, 
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";


const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState<"view" | "block" | "unblock" | "delete">("view");

  useEffect(() => {
    const fetchUsers = async () => {
      // Fetch users and agents from profiles as before
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, name, phone, role, created_at, is_verified");
      if (error) {
        toast.error("Failed to load users");
        return;
      }
      // Fetch owners from new owners table
      const { data: ownersData, error: ownersError } = await supabase
        .from("owners")
        .select("id, user_id, name, phone, email, status, created_at");
      if (ownersError) {
        toast.error("Failed to load owners");
        setOwners([]);
      } else {
        // Fetch hostels to count per owner
        const { data: hostels } = await supabase
          .from("hostels")
          .select("owner_id");
        const ownerHostelCounts = hostels?.reduce((acc: any, h: any) => {
          acc[h.owner_id] = (acc[h.owner_id] || 0) + 1;
          return acc;
        }, {}) || {};
        setOwners(
          (ownersData || []).map((o: any) => ({
            ...o,
            joined: o.created_at,
            hostels: ownerHostelCounts[o.id] || 0,
            subscription: "active", // Placeholder, update if you add subscription logic
            status: o.status === "active" ? "active" : "blocked",
          }))
        );
      }
      // Users and agents logic unchanged
      const users = profiles
        .filter((u: any) => u.role === "hosteller")
        .map((u: any) => ({
          ...u,
          joined: u.created_at,
          bookings: 0, // Replace later if needed
          status: u.is_verified ? "active" : "blocked",
        }));
      const agents = profiles
        .filter((u: any) => u.role === "agent")
        .map((u: any) => ({
          ...u,
          joined: u.created_at,
          status: u.is_verified ? "active" : "blocked",
        }));
      setUsers(users);
      setAgents(agents);
    };

    fetchUsers();
  }, []);

  const handleBlock = (user: any) => {
    toast.success(`${user.name} has been blocked`);
    setShowUserDialog(false);
  };

  const handleUnblock = (user: any) => {
    toast.success(`${user.name} has been unblocked`);
    setShowUserDialog(false);
  };

  const handleDelete = (user: any) => {
    toast.success(`${user.name} has been deleted`);
    setShowUserDialog(false);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
  );

  const filteredOwners = owners.filter((owner) =>
    owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    owner.phone.includes(searchQuery)
  );

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.phone.includes(searchQuery)
  );

  const openUserDialog = (user: any, action: "view" | "block" | "unblock" | "delete") => {
    setSelectedUser(user);
    setDialogAction(action);
    setShowUserDialog(true);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold">User & Owner Management</h1>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs 
          defaultValue="users" 
          className="w-full"
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="users" className="flex-1 sm:flex-initial">
              Hostellers
              <Badge variant="secondary" className="ml-2">
                {filteredUsers.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="owners" className="flex-1 sm:flex-initial">
              Hostel Owners
              <Badge variant="secondary" className="ml-2">
                {filteredOwners.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex-1 sm:flex-initial">
              Agents
              <Badge variant="secondary" className="ml-2">
                {filteredAgents.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="agents">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAgents.length > 0 ? (
                    filteredAgents.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell className="font-medium">{agent.name}</TableCell>
                        <TableCell>{agent.phone}</TableCell>
                        <TableCell>{agent.joined}</TableCell>
                        <TableCell>
                          <Badge
                            variant={agent.status === "active" ? "success" : "destructive"}
                          >
                            {agent.status === "active" ? "Active" : "Blocked"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openUserDialog(agent, "view")}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>

                              {agent.status === "active" ? (
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => openUserDialog(agent, "block")}
                                >
                                  <UserMinus className="mr-2 h-4 w-4" />
                                  Block Agent
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  className="text-green-600"
                                  onClick={() => openUserDialog(agent, "unblock")}
                                >
                                  <UserPlus className="mr-2 h-4 w-4" />
                                  Unblock Agent
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => openUserDialog(agent, "delete")}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Agent
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        No agents found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{user.joined}</TableCell>
                        <TableCell>{user.bookings}</TableCell>
                        <TableCell>
                          <Badge
                            variant={user.status === "active" ? "success" : "destructive"}
                          >
                            {user.status === "active" ? "Active" : "Blocked"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openUserDialog(user, "view")}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              
                              {user.status === "active" ? (
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => openUserDialog(user, "block")}
                                >
                                  <UserMinus className="mr-2 h-4 w-4" />
                                  Block User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem 
                                  className="text-green-600"
                                  onClick={() => openUserDialog(user, "unblock")}
                                >
                                  <UserPlus className="mr-2 h-4 w-4" />
                                  Unblock User
                                </DropdownMenuItem>
                              )}
                              
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => openUserDialog(user, "delete")}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center h-24">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="owners">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Hostels</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOwners.length > 0 ? (
                    filteredOwners.map((owner) => (
                      <TableRow key={owner.id}>
                        <TableCell className="font-medium">{owner.name}</TableCell>
                        <TableCell>{owner.phone}</TableCell>
                        <TableCell>{owner.hostels}</TableCell>
                        <TableCell>
                          <Badge
                            variant={owner.subscription === "active" ? "success" : "destructive"}
                          >
                            {owner.subscription === "active" ? "Active" : "Expired"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={owner.status === "active" ? "success" : "destructive"}
                          >
                            {owner.status === "active" ? "Active" : "Blocked"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openUserDialog(owner, "view")}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              
                              {owner.status === "active" ? (
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => openUserDialog(owner, "block")}
                                >
                                  <UserMinus className="mr-2 h-4 w-4" />
                                  Block Owner
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem 
                                  className="text-green-600"
                                  onClick={() => openUserDialog(owner, "unblock")}
                                >
                                  <UserPlus className="mr-2 h-4 w-4" />
                                  Unblock Owner
                                </DropdownMenuItem>
                              )}
                              
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => openUserDialog(owner, "delete")}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Owner
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center h-24">
                        No owners found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* User Detail Dialog */}
      {selectedUser && (
        <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {dialogAction === "view" 
                  ? `${selectedUser.name}'s Details` 
                  : dialogAction === "block" 
                    ? `Block ${selectedUser.name}` 
                    : dialogAction === "unblock" 
                      ? `Unblock ${selectedUser.name}` 
                      : `Delete ${selectedUser.name}`
                }
              </DialogTitle>
              {dialogAction !== "view" && (
                <DialogDescription>
                  {dialogAction === "block" 
                    ? "This will prevent the user from accessing the platform." 
                    : dialogAction === "unblock" 
                      ? "This will restore the user's access to the platform." 
                      : "This action cannot be undone. This will permanently delete the user's account and all associated data."
                  }
                </DialogDescription>
              )}
            </DialogHeader>
            
            {dialogAction === "view" && (
              <div className="py-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Name:</span>
                    <p className="font-medium">{selectedUser.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Phone:</span>
                    <p className="font-medium">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Joined:</span>
                    <p className="font-medium">{selectedUser.joined}</p>
                  </div>
                  {activeTab === "users" && (
                    <div>
                      <span className="text-sm text-gray-500">Bookings:</span>
                      <p className="font-medium">{selectedUser.bookings}</p>
                    </div>
                  )}
                  {activeTab === "owners" && (
                    <>
                      <div>
                        <span className="text-sm text-gray-500">Hostels:</span>
                        <p className="font-medium">{selectedUser.hostels}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Subscription:</span>
                        <Badge
                          variant={selectedUser.subscription === "active" ? "success" : "destructive"}
                        >
                          {selectedUser.subscription === "active" ? "Active" : "Expired"}
                        </Badge>
                      </div>
                    </>
                  )}
                  <div>
                    <span className="text-sm text-gray-500">Status:</span>
                    <Badge
                      variant={selectedUser.status === "active" ? "success" : "destructive"}
                    >
                      {selectedUser.status === "active" ? "Active" : "Blocked"}
                    </Badge>
                  </div>
                  {activeTab === "agents" && (
                    <div>
                      <span className="text-sm text-gray-500">Role:</span>
                      <p className="font-medium">Agent</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUserDialog(false)}>
                Cancel
              </Button>
              {dialogAction === "block" && (
                <Button 
                  variant="destructive"
                  onClick={() => handleBlock(selectedUser)}
                >
                  Block User
                </Button>
              )}
              {dialogAction === "unblock" && (
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleUnblock(selectedUser)}
                >
                  Unblock User
                </Button>
              )}
              {dialogAction === "delete" && (
                <Button 
                  variant="destructive"
                  onClick={() => handleDelete(selectedUser)}
                >
                  Delete User
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
};

export default UserManagement;
