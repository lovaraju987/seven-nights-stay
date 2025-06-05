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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { QRCodeCanvas } from 'qrcode.react';

const AddHostel = () => {
  const navigate = useNavigate();
  const [referenceCode] = useState(() => `HTL-${Math.floor(100000 + Math.random() * 900000)}`);
  const [showQrDialog, setShowQrDialog] = useState(false);
  const [createdHostelUrl, setCreatedHostelUrl] = useState("");
  const form = useForm({
    defaultValues: {
      hostelType: "",
      hostelName: "",
      tagline: "",
      referenceCode: referenceCode,
      address: "",
      city: "",
      state: "",
      agentNotes: "",
      videoUrls: [""],
      hostelImages: undefined as FileList | undefined,
      lat: '',
      lng: '',
      onSiteManager: '',
      primaryPhone: '',
      primaryEmail: '',
      website: '',
    },
  });

  const [mapCenter, setMapCenter] = useState({ lat: 17.385044, lng: 78.486671 });
  const [markerPosition, setMarkerPosition] = useState(mapCenter);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onSubmit = async (data: any) => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) {
      toast.error("You must be logged in to submit a hostel.");
      return;
    }
    // Fetch the owner's record from the owners table
    const { data: ownerRecord, error: ownerFetchError } = await supabase
      .from("owners")
      .select("id")
      .eq("user_id", userId)
      .single();
    if (ownerFetchError || !ownerRecord) {
      toast.error("Owner profile not found. Please contact support.");
      return;
    }
    const uploadedImageUrls: string[] = [];
    if (data.hostelImages && data.hostelImages.length > 0) {
      for (const file of Array.from(data.hostelImages as FileList)) {
        if (!(file instanceof File)) continue;
        const sanitizedFileName = file.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w.-]+/g, "");
        const filePath = `${userId}/${Date.now()}-${sanitizedFileName}`;
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
        status: "pending",
        images: uploadedImageUrls,
        video_urls: data.videoUrls?.filter(Boolean) || [],
        updated_at: new Date().toISOString(),
        created_by: "owner",
        owner_id: ownerRecord.id,
        on_site_manager: data.onSiteManager,
        primary_phone: data.primaryPhone,
        primary_email: data.primaryEmail,
        website: data.website,
      }
    ]).select().single();
    if (error) {
      toast.error("Failed to submit hostel");
      return;
    }
    const hostelId = insertResult?.id;
    const publicUrl = `${window.location.origin}/hostel/${hostelId}`;
    setCreatedHostelUrl(publicUrl);
    setShowQrDialog(true);
    toast.success("Hostel submitted successfully!");
  };

  return (
    <div className="px-2 sm:px-0">
      <Button 
        variant="ghost" 
        className="mb-4 sm:mb-6"
        onClick={() => navigate("/owner/dashboard")}
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Add Hostel</h1>
      <div className="w-full max-w-4xl mx-auto">
        <Card className="p-2 sm:p-6 rounded-lg shadow-md">
          <CardHeader className="px-0 pt-0 pb-2 sm:pb-4">
            <h2 className="text-lg sm:text-xl font-medium">Hostel Information</h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Add details to list your hostel
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

                  {/* Location Section */}
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
                    {/* Google Maps Location Picker */}
                    <div className="mt-4">
                      <label htmlFor="location" className="block text-sm font-medium mb-1">
                        Hostel Location on Map *
                      </label>
                      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={['places']}>
                        <Autocomplete
                          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                          onPlaceChanged={() => {
                            const place = autocompleteRef.current?.getPlace();
                            if (place?.geometry?.location) {
                              const lat = place.geometry.location.lat();
                              const lng = place.geometry.location.lng();
                              setMapCenter({ lat, lng });
                              setMarkerPosition({ lat, lng });
                              form.setValue('lat', String(lat));
                              form.setValue('lng', String(lng));

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
                            className="mb-2 w-full text-sm"
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
                            form.setValue('lat', String(lat));
                            form.setValue('lng', String(lng));
                          }}
                        >
                          <Marker position={markerPosition} />
                        </GoogleMap>
                      </LoadScript>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <label htmlFor="lat" className="block text-sm font-medium mb-1">Latitude *</label>
                          <Input
                            type="number"
                            step="any"
                            placeholder="Latitude"
                            {...form.register("lat", { required: true })}
                            className="w-full text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="lng" className="block text-sm font-medium mb-1">Longitude *</label>
                          <Input
                            type="number"
                            step="any"
                            placeholder="Longitude"
                            {...form.register("lng", { required: true })}
                            className="w-full text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Agent Notes */}
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

                  {/* Hostel Media */}
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
                        {...form.register("hostelImages")}
                      />
                      <p className="mt-1 text-xs text-gray-500">You can upload multiple images (JPG, PNG).</p>
                      {form.watch("hostelImages") && Array.from(form.watch("hostelImages")).map((file: File, index: number) => (
                        <img key={index} src={URL.createObjectURL(file)} alt="Preview" className="w-24 h-24 object-cover inline-block mr-2 mt-2 rounded" />
                      ))}
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Video Links (Optional)</label>
                      {form.watch("videoUrls")?.map((_: string, index: number) => (
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
                              form.setValue("videoUrls", current.filter((_, i) => i !== index));
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

                  {/* New Fields: Tagline, Reference Code, On-Site Manager, Contacts, Website */}
                  <div>
                    <label htmlFor="tagline" className="block text-sm font-medium mb-1">Short Tagline / Slogan</label>
                    <Input id="tagline" placeholder="E.g., Clean Dorms in Andheri West" {...form.register("tagline")} className="w-full text-sm" />
                  </div>
                  <div>
                    <label htmlFor="referenceCode" className="block text-sm font-medium mb-1">Reference Code</label>
                    <Input id="referenceCode" value={referenceCode} readOnly className="bg-gray-100 cursor-not-allowed w-full text-sm" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="onSiteManager" className="block text-sm font-medium mb-1">On-Site Manager</label>
                    <Input id="onSiteManager" placeholder="Name of on-site manager (if different from owner)" {...form.register("onSiteManager")} className="w-full text-sm" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="primaryPhone" className="block text-sm font-medium mb-1">Primary Phone *</label>
                    <Input id="primaryPhone" placeholder="Owner or manager's phone number" {...form.register("primaryPhone", { required: true })} className="w-full text-sm" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="primaryEmail" className="block text-sm font-medium mb-1">Primary Email *</label>
                    <Input id="primaryEmail" type="email" placeholder="Owner or manager's email address" {...form.register("primaryEmail", { required: true })} className="w-full text-sm" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="website" className="block text-sm font-medium mb-1">Website / Social Media URL</label>
                    <Input id="website" placeholder="https://instagram.com/yourhostel or website URL" {...form.register("website")} className="w-full text-sm" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate("/owner/dashboard")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Submit for Review
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

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
              <Button onClick={() => { setShowQrDialog(false); navigate("/owner/dashboard"); }}>
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddHostel;
