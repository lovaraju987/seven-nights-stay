import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/sonner";
import { ArrowLeftIcon } from "lucide-react";
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { supabase } from "@/lib/supabase";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { QRCodeCanvas } from 'qrcode.react';

import type { Libraries } from '@react-google-maps/api';
const GOOGLE_MAP_LIBRARIES: Libraries = ['places'];

const AdminAddHostel = () => {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      hostelType: "",
      hostelName: "",
      tagline: "",
      referenceCode: "",
      address: "",
      city: "",
      state: "",
      agentNotes: "",
      videoUrls: [""],
      hostelImages: undefined,
      lat: '',
      lng: '',
      onSiteManager: '',
      primaryPhone: '',
      primaryEmail: '',
      website: '',
      pricePerNight: '',
      securityDeposit: '',
      minimumStay: '',
      checkInTime: '',
      checkOutTime: '',
      cancellationPolicy: '',
      totalBeds: '',
    },
  });

  const [mapCenter, setMapCenter] = useState({ lat: 17.385044, lng: 78.486671 });
  const [markerPosition, setMarkerPosition] = useState(mapCenter);
  const autocompleteRef = useRef(null);
  const [owners, setOwners] = useState<any[]>([]);
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>("");
  const [showAddOwnerDialog, setShowAddOwnerDialog] = useState(false);
  const [newOwner, setNewOwner] = useState({ name: "", email: "", phone: "", password: "" });
  const [creatingOwner, setCreatingOwner] = useState(false);
  const [referenceCode, setReferenceCode] = useState(() => {
    // Example: generate a code like HTL-000123 (could be improved to fetch from backend)
    return `HTL-${Math.floor(100000 + Math.random() * 900000)}`;
  });
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const [showQrDialog, setShowQrDialog] = useState(false);
  const [createdHostelUrl, setCreatedHostelUrl] = useState("");

  // Fetch owners and agents on mount
  React.useEffect(() => {
    const fetchOwners = async () => {
      const { data, error } = await supabase
        .from("owners")
        .select("id, user_id, name, email, phone, status");
      if (!error && data) setOwners(data);
      else setOwners([]); // Ensure owners is always an array
    };
    const fetchAgents = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, phone, role")
        .eq("role", "agent");
      if (!error && data) setAgents(data);
      else setAgents([]);
    };
    fetchOwners();
    fetchAgents();
  }, [showAddOwnerDialog]); // Refetch when dialog closes in case a new owner was added

  const handleCreateOwner = async () => {
    setCreatingOwner(true);
    // 1. Create user in Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: newOwner.email,
      password: newOwner.password,
      options: { data: { name: newOwner.name, phone: newOwner.phone, role: "owner" } }
    });
    if (signUpError || !data.user) {
      toast.error(signUpError?.message || "Failed to create owner");
      setCreatingOwner(false);
      return;
    }
    // 2. Insert into owners table
    const { data: ownerInsert, error: ownerInsertError } = await supabase.from("owners").insert({
      user_id: data.user.id,
      name: newOwner.name,
      email: newOwner.email,
      phone: newOwner.phone,
      status: "active"
    }).select().single();
    if (ownerInsertError || !ownerInsert) {
      toast.error(ownerInsertError?.message || "Failed to insert owner details");
      setCreatingOwner(false);
      return;
    }
    // 3. Refresh owners list and select new owner
    const { data: ownersList } = await supabase
      .from("owners")
      .select("id, user_id, name, email, phone, status");
    setOwners(ownersList || []);
    setSelectedOwnerId(ownerInsert.id);
    setShowAddOwnerDialog(false);
    setNewOwner({ name: "", email: "", phone: "", password: "" });
    setCreatingOwner(false);
    toast.success("Owner created successfully");
  };

  const onSubmit = async (data) => {
    // Admin can add hostels as owner, but set created_by: 'admin'
    // Use selectedOwnerId from owners table
    const uploadedImageUrls = [];
    if (data.hostelImages && data.hostelImages.length > 0) {
      for (const file of Array.from(data.hostelImages as FileList)) {
        if (!(file instanceof File)) continue;
        const sanitizedFileName = file.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w.-]+/g, "");
        const filePath = `admin/${Date.now()}-${sanitizedFileName}`;
        const { error: uploadError } = await supabase.storage
          .from("hostel-images")
          .upload(filePath, file);
        if (uploadError) {
          toast.error("Image upload failed.");
          return;
        }
        const { data: publicUrlData } = supabase.storage
          .from("hostel-images")
          .getPublicUrl(filePath);
        const publicUrl = publicUrlData?.publicUrl;
        uploadedImageUrls.push(publicUrl);
      }
    }
    const { data: insertResult, error } = await supabase.from("hostels").insert([
      {
        name: data.hostelName,
        type: data.hostelType,
        tagline: data.tagline,
        reference_code: referenceCode,
        description: data.agentNotes || "",
        address: {
          address: data.address,
          city: data.city,
          state: data.state
        },
        lat: data.lat,
        lng: data.lng,
        status: "verified",
        images: uploadedImageUrls,
        video_urls: data.videoUrls?.filter(Boolean) || [],
        updated_at: new Date().toISOString(),
        created_by: "admin",
        owner_id: selectedOwnerId,
        agent_id: selectedAgentId || null,
        on_site_manager: data.onSiteManager,
        primary_phone: data.primaryPhone,
        primary_email: data.primaryEmail,
        website: data.website,
        // Remove pricing/availability fields from here if not needed
      }
    ]).select().single();
    if (error) {
      toast.error("Failed to submit hostel");
      return;
    }
    // Generate public URL for QR code
    const hostelId = insertResult?.id;
    const publicUrl = `${window.location.origin}/hostel/${hostelId}`;
    setCreatedHostelUrl(publicUrl);
    setShowQrDialog(true);
    toast.success("Hostel added successfully!");
    // Optionally, navigate after closing QR dialog
    // navigate("/admin/hostels");
  };

  return (
    <div className="px-2 sm:px-0">
      <Button 
        variant="ghost" 
        className="mb-4 sm:mb-6"
        onClick={() => navigate("/admin/hostels")}
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Hostels
      </Button>
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Add Hostel (Admin)</h1>
      <div className="w-full max-w-4xl mx-auto">
        <Card className="p-2 sm:p-6 rounded-lg shadow-md">
          <CardHeader className="px-0 pt-0 pb-2 sm:pb-4">
            <h2 className="text-lg sm:text-xl font-medium">Hostel Information</h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Add details to list a hostel
            </p>
          </CardHeader>
          <CardContent className="px-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                {/* Hostel Information */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="mb-4">
                    <label htmlFor="hostelType" className="block text-sm font-medium mb-1">Hostel Type *</label>
                    <select 
                      id="hostelType" 
                      className="w-full p-2 border rounded"
                      {...form.register("hostelType", { required: true })}
                    >
                      <option value="">Select Hostel Type</option>
                      <option value="boys">Boys</option>
                      <option value="girls">Girls</option>
                      <option value="coed">Co-ed</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="hostelName" className="block text-sm font-medium mb-1">Hostel Name *</label>
                    <Input 
                      id="hostelName"
                      placeholder="E.g., Royal Boys Hostel" 
                      {...form.register("hostelName", { required: true })}
                      className="w-full text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="tagline" className="block text-sm font-medium mb-1">Short Tagline / Slogan</label>
                    <Input
                      id="tagline"
                      placeholder="E.g., Clean Dorms in Andheri West"
                      {...form.register("tagline")}
                      className="w-full text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="referenceCode" className="block text-sm font-medium mb-1">Reference Code</label>
                    <Input
                      id="referenceCode"
                      value={referenceCode}
                      readOnly
                      className="bg-gray-100 cursor-not-allowed w-full text-sm"
                    />
                  </div>
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Hostel Location</h3>
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium mb-1">Address *</label>
                      <Textarea
                        id="address"
                        placeholder="Complete address with building name, street, etc."
                        rows={3}
                        {...form.register("address", { required: true })}
                        className="w-full text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium mb-1">City *</label>
                        <Input 
                          id="city"
                          placeholder="E.g., Mumbai" 
                          {...form.register("city", { required: true })} 
                          className="w-full text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium mb-1">State *</label>
                        <Input 
                          id="state"
                          placeholder="E.g., Maharashtra" 
                          {...form.register("state", { required: true })} 
                          className="w-full text-sm"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label htmlFor="location" className="block text-sm font-medium mb-1">
                        Hostel Location on Map *
                      </label>
                      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={GOOGLE_MAP_LIBRARIES}>
                        <Autocomplete
                          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                          onPlaceChanged={() => {
                            const place = autocompleteRef.current?.getPlace();
                            if (place?.geometry?.location) {
                              const lat = place.geometry.location.lat();
                              const lng = place.geometry.location.lng();
                              setMapCenter({ lat, lng });
                              setMarkerPosition({ lat, lng });
                              form.setValue('lat' as const, String(lat));
                              form.setValue('lng' as const, String(lng));
                              const components = place.address_components || [];
                              const address = place.formatted_address || "";
                              const city = components.find(c => c.types.includes("locality"))?.long_name || "";
                              const state = components.find(c => c.types.includes("administrative_area_level_1"))?.long_name || "";
                              form.setValue("address", address);
                              form.setValue("city", city);
                              form.setValue("state", state);
                            }
                          }}
                        >
                          <Input
                            placeholder="Search for hostel location..."
                            className="mb-2"
                          />
                        </Autocomplete>
                        <GoogleMap
                          center={mapCenter}
                          zoom={15}
                          mapContainerStyle={{ width: '100%', height: '256px' }}
                          onClick={(e) => {
                            const lat = e.latLng?.lat() || 0;
                            const lng = e.latLng?.lng() || 0;
                            setMarkerPosition({ lat, lng });
                            form.setValue('lat' as const, String(lat));
                            form.setValue('lng' as const, String(lng));
                          }}
                        >
                          <Marker position={markerPosition} />
                        </GoogleMap>
                      </LoadScript>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <label htmlFor="lat" className="block text-sm font-medium mb-1">Latitude *</label>
                          <Input 
                            id="lat"
                            placeholder="17.385044"
                            {...form.register("lat" as const, { required: true })}
                            className="w-full text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="lng" className="block text-sm font-medium mb-1">Longitude *</label>
                          <Input 
                            id="lng"
                            placeholder="78.486671"
                            {...form.register("lng" as const, { required: true })}
                            className="w-full text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Additional Notes</h3>
                    <div>
                      <label htmlFor="agentNotes" className="block text-sm font-medium mb-1">Additional Notes</label>
                      <Textarea
                        id="agentNotes"
                        placeholder="Any additional information or observations about this hostel"
                        rows={4}
                        {...form.register("agentNotes")}
                        className="w-full text-sm"
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Hostel Media</h3>
                    <div className="mb-4">
                      <label htmlFor="hostelImages" className="block text-sm font-medium mb-1">Upload Hostel Images *</label>
                      <input
                        type="file"
                        id="hostelImages"
                        accept="image/png, image/jpeg"
                        multiple
                        className="w-full p-2 border rounded"
                        {...form.register("hostelImages" as const, {
                          validate: (files: FileList) => {
                            for (let i = 0; i < files.length; i++) {
                              const file = files[i];
                              if (file.size > 5 * 1024 * 1024) return "Image too large (max 5MB)";
                            }
                            return true;
                          }
                        })}
                      />
                      <p className="mt-1 text-xs text-gray-500">You can upload multiple images (JPG, PNG).</p>
                      {form.watch("hostelImages") && Array.from(form.watch("hostelImages") as FileList || []).map((file: File, index: number) => (
                        <img key={index} src={URL.createObjectURL(file)} alt="Preview" className="w-24 h-24 object-cover inline-block mr-2 mt-2 rounded" />
                      ))}
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Video Links (Optional)</label>
                      {form.watch("videoUrls") && Array.isArray(form.watch("videoUrls")) && form.watch("videoUrls").map((_: string, index: number) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Input
                            placeholder={`https://youtu.be/video${index + 1}`}
                            {...form.register(`videoUrls.${index}` as const)}
                            className="w-full text-sm"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              const current = form.getValues("videoUrls") || [];
                              form.setValue("videoUrls", current.filter((_: string, i: number) => i !== index));
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const current = form.getValues("videoUrls") || [];
                          form.setValue("videoUrls", [...current, ""]);
                        }}
                      >
                        Add Video Link
                      </Button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Hostel Owner *</label>
                    <div className="flex gap-2">
                      <Select value={selectedOwnerId} onValueChange={setSelectedOwnerId}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={owners.length === 0 ? "No owners found. Add one." : "Select owner"} />
                        </SelectTrigger>
                        <SelectContent>
                          {owners.length === 0 ? (
                            <div className="px-4 py-2 text-gray-500">No owners found</div>
                          ) : (
                            owners.map((owner) => (
                              <SelectItem key={owner.id} value={owner.id}>
                                {owner.name} ({owner.email})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <Button type="button" variant="outline" onClick={() => setShowAddOwnerDialog(true)}>
                        + Add Owner
                      </Button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Agent (Optional)</label>
                    <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={agents.length === 0 ? "No agents found" : "Select agent (if any)"} />
                      </SelectTrigger>
                      <SelectContent>
                        {agents.length === 0 ? (
                          <div className="px-4 py-2 text-gray-500">No agents found</div>
                        ) : (
                          agents.map((agent) => (
                            <SelectItem key={agent.id} value={agent.id}>
                              {agent.name} ({agent.email})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="onSiteManager" className="block text-sm font-medium mb-1">On-Site Manager</label>
                    <Input
                      id="onSiteManager"
                      placeholder="Name of on-site manager (if different from owner)"
                      {...form.register("onSiteManager")}
                      className="w-full text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="primaryPhone" className="block text-sm font-medium mb-1">Primary Phone *</label>
                    <Input
                      id="primaryPhone"
                      placeholder="Owner or manager's phone number"
                      {...form.register("primaryPhone", { required: true })}
                      className="w-full text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="primaryEmail" className="block text-sm font-medium mb-1">Primary Email *</label>
                    <Input
                      id="primaryEmail"
                      type="email"
                      placeholder="Owner or manager's email address"
                      {...form.register("primaryEmail", { required: true })}
                      className="w-full text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="website" className="block text-sm font-medium mb-1">Website / Social Media URL</label>
                    <Input
                      id="website"
                      placeholder="https://instagram.com/yourhostel or website URL"
                      {...form.register("website")}
                      className="w-full text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate("/admin/hostels")}
                    className="w-full md:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto"
                  >
                    Add Hostel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      {/* Add Owner Dialog */}
      <Dialog open={showAddOwnerDialog} onOpenChange={setShowAddOwnerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Owner</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="ownerName" className="block text-sm font-medium mb-1">Name *</label>
              <Input
                id="ownerName"
                placeholder="Owner's full name"
                value={newOwner.name}
                onChange={e => setNewOwner({ ...newOwner, name: e.target.value })}
                className="w-full text-sm"
              />
            </div>
            <div>
              <label htmlFor="ownerEmail" className="block text-sm font-medium mb-1">Email *</label>
              <Input
                id="ownerEmail"
                type="email"
                placeholder="Owner's email address"
                value={newOwner.email}
                onChange={e => setNewOwner({ ...newOwner, email: e.target.value })}
                className="w-full text-sm"
              />
            </div>
            <div>
              <label htmlFor="ownerPhone" className="block text-sm font-medium mb-1">Phone *</label>
              <Input
                id="ownerPhone"
                placeholder="Owner's phone number"
                value={newOwner.phone}
                onChange={e => setNewOwner({ ...newOwner, phone: e.target.value })}
                className="w-full text-sm"
              />
            </div>
            <div>
              <label htmlFor="ownerPassword" className="block text-sm font-medium mb-1">Password *</label>
              <Input
                id="ownerPassword"
                type="password"
                placeholder="Set a password for the owner"
                value={newOwner.password}
                onChange={e => setNewOwner({ ...newOwner, password: e.target.value })}
                className="w-full text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAddOwnerDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateOwner} 
              disabled={creatingOwner}
            >
              {creatingOwner ? 'Creating...' : 'Create Owner'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* QR Code Dialog */}
      <Dialog open={showQrDialog} onOpenChange={setShowQrDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Hostel Created Successfully</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500 mb-4">
              The hostel has been added successfully. You can share the QR code below for quick access.
            </p>
            <div className="flex justify-center mb-4">
              {createdHostelUrl && <QRCodeCanvas value={createdHostelUrl} size={128} />}
            </div>
            <p className="text-center text-sm text-gray-500">
              {createdHostelUrl}
            </p>
            <div className="flex justify-center mt-4 gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  const canvas = document.querySelector('canvas');
                  if (canvas) {
                    const url = canvas.toDataURL('image/png');
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'hostel-qr.png';
                    a.click();
                  }
                }}
              >
                Download QR Code
              </Button>
              <Button onClick={() => { setShowQrDialog(false); navigate("/admin/hostels"); }}>
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAddHostel;
