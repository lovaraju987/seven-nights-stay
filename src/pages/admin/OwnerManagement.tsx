import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";

const OwnerManagement = () => {
  const [owners, setOwners] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOwners = async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, name, phone, role, created_at, is_verified");
      if (error) {
        toast.error("Failed to load owners");
        return;
      }

      const { data: hostels } = await supabase.from("hostels").select("owner_id");
      const ownerHostelCounts =
        hostels?.reduce((acc: any, h: any) => {
          acc[h.owner_id] = (acc[h.owner_id] || 0) + 1;
          return acc;
        }, {}) || {};

      const owners = (profiles || [])
        .filter((u: any) => u.role === "owner")
        .map((u: any) => ({
          ...u,
          joined: u.created_at,
          hostels: ownerHostelCounts[u.id] || 0,
          status: u.is_verified ? "active" : "blocked",
        }));

      setOwners(owners);
    };

    fetchOwners();
  }, []);

  const filteredOwners = owners.filter(
    (owner) =>
      owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.phone.includes(searchQuery)
  );

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold">Owner Management</h1>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search owners..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Hostels</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOwners.length > 0 ? (
                filteredOwners.map((owner) => (
                  <TableRow key={owner.id}>
                    <TableCell className="font-medium">{owner.name}</TableCell>
                    <TableCell>{owner.phone}</TableCell>
                    <TableCell>{owner.hostels}</TableCell>
                    <TableCell>{new Date(owner.joined).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={owner.status === "active" ? "success" : "destructive"}>
                        {owner.status === "active" ? "Active" : "Blocked"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No owners found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OwnerManagement;
