import React, { useState, useRef } from "react";
import AgentLayout from "@/components/agent/AgentLayout";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { ArrowLeftIcon } from "lucide-react";
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { QRCodeCanvas } from 'qrcode.react';

const AgentAddHostel = () => {
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

  // Enhancement 7: Unsaved Data Warning on Navigation
  window.onbeforeunload = (e) => {
    if (form.formState.isDirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

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
          console.error("Supabase image upload error:", uploadError);
          console.error("Upload error details:", JSON.stringify(uploadError, null, 2));
          console.error("File info:", file);
          console.error("File path:", filePath);
          toast.error("Image upload failed. Check console for details.");
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
        created_by: "agent",
        agent_id: userId,
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
    <AgentLayout>
      <div className="px-2 sm:px-0">
        <Button 
          variant="ghost" 
          className="mb-4 sm:mb-6"
          onClick={() => navigate("/agent/dashboard")}
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
                Add details on behalf of the hostel owner
              </p>
            </CardHeader>
            <CardContent className="px-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                  {/* Hostel Information */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="mb-2 sm:mb-4">
                      <label htmlFor="hostelType" className="block text-xs sm:text-sm font-medium mb-1">Hostel Type *</label>
                      <select 
                        id="hostelType" 
                        className="w-full p-2 border rounded text-sm"
                        {...form.register("hostelType", { required: true })}
                      >
                        <option value="">Select Hostel Type</option>
                        <option value="boys">Boys</option>
                        <option value="girls">Girls</option>
                        <option value="coed">Co-ed</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="hostelName" className="block text-xs sm:text-sm font-medium mb-1">Hostel Name *</label>
                      <Input 
                        id="hostelName"
                        placeholder="E.g., Royal Boys Hostel" 
                        className="w-full text-sm"
                        {...form.register("hostelName", { required: true })}
                      />
                    </div>
                    <div>
                      <label htmlFor="tagline" className="block text-xs sm:text-sm font-medium mb-1">Short Tagline / Slogan</label>
                      <Input id="tagline" placeholder="E.g., Clean Dorms in Andheri West" className="w-full text-sm" {...form.register("tagline")} />
                    </div>
                    <div>
                      <label htmlFor="referenceCode" className="block text-xs sm:text-sm font-medium mb-1">Reference Code</label>
                      <Input id="referenceCode" value={referenceCode} readOnly className="w-full bg-gray-100 cursor-not-allowed text-sm" />
                    </div>
                  </div>

                  {/* Location Section */}
                  <div className="pt-3 sm:pt-4 border-t">
                    <h3 className="font-medium text-base sm:text-lg mb-2 sm:mb-3">Hostel Location</h3>
                    <div>
                      <label htmlFor="address" className="block text-xs sm:text-sm font-medium mb-1">Address *</label>
                      <Textarea
                        id="address"
                        placeholder="Complete address with building name, street, etc."
                        rows={3}
                        className="w-full text-sm"
                        {...form.register("address", { required: true })}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-2">
                      <div>
                        <label htmlFor="city" className="block text-xs sm:text-sm font-medium mb-1">City *</label>
                        <Input 
                          id="city"
                          placeholder="E.g., Mumbai" 
                          className="w-full text-sm"
                          {...form.register("city", { required: true })} 
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-xs sm:text-sm font-medium mb-1">State *</label>
                        <Input 
                          id="state"
                          placeholder="E.g., Maharashtra" 
                          className="w-full text-sm"
                          {...form.register("state", { required: true })} 
                        />
                      </div>
                    </div>
                    {/* Google Maps Location Picker */}
                    <div className="mt-3 sm:mt-4">
                      <label htmlFor="location" className="block text-xs sm:text-sm font-medium mb-1">
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
                          mapContainerStyle={{ width: '100%', height: '200px', borderRadius: '8px' }}
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
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <div>
                          <label htmlFor="lat" className="block text-xs sm:text-sm font-medium mb-1">Latitude *</label>
                          <Input 
                            id="lat"
                            placeholder="17.385044"
                            className="w-full text-sm"
                            {...form.register("lat", { required: true })}
                          />
                        </div>
                        <div>
                          <label htmlFor="lng" className="block text-xs sm:text-sm font-medium mb-1">Longitude *</label>
                          <Input 
                            id="lng"
                            placeholder="78.486671"
                            className="w-full text-sm"
                            {...form.register("lng", { required: true })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Agent Notes */}
                  <div className="pt-3 sm:pt-4 border-t">
                    <h3 className="font-medium text-base sm:text-lg mb-2 sm:mb-3">Agent Notes</h3>
                    <div>
                      <label htmlFor="agentNotes" className="block text-xs sm:text-sm font-medium mb-1">Additional Notes</label>
                      <Textarea
                        id="agentNotes"
                        placeholder="Any additional information or observations about this hostel"
                        rows={4}
                        className="w-full text-sm"
                        {...form.register("agentNotes")}
                      />
                    </div>
                  </div>

                  {/* Hostel Media */}
                  <div className="pt-3 sm:pt-4 border-t">
                    <h3 className="font-medium text-base sm:text-lg mb-2 sm:mb-3">Hostel Media</h3>
                    <div className="mb-2 sm:mb-4">
                      <label htmlFor="hostelImages" className="block text-xs sm:text-sm font-medium mb-1">Upload Hostel Images *</label>
                      <input
                        type="file"
                        id="hostelImages"
                        accept="image/png, image/jpeg"
                        multiple
                        className="w-full p-2 border rounded text-sm"
                        {...form.register("hostelImages", {
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
                      {form.watch("hostelImages") && Array.from(form.watch("hostelImages")).map((file: File, index: number) => (
                        <img key={index} src={URL.createObjectURL(file)} alt="Preview" className="w-20 h-20 object-cover inline-block mr-2 mt-2 rounded" />
                      ))}
                    </div>
                    <div className="mb-2 sm:mb-4">
                      <label className="block text-xs sm:text-sm font-medium mb-1">Video Links (Optional)</label>
                      {form.watch("videoUrls")?.map((_: string, index: number) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Input
                            placeholder={`https://youtu.be/video${index + 1}`}
                            className="w-full text-sm"
                            {...form.register(`videoUrls.${index}` as const)}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            className="text-xs"
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
                        className="text-xs"
                        onClick={() => {
                          const current = form.getValues("videoUrls") || [];
                          form.setValue("videoUrls", [...current, ""]);
                        }}
                      >
                        Add Video Link
                      </Button>
                    </div>
                  </div>

                  {/* New Fields: On-Site Manager, Contacts, Website */}
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <label htmlFor="onSiteManager" className="block text-xs sm:text-sm font-medium mb-1">On-Site Manager</label>
                      <Input id="onSiteManager" placeholder="Name of on-site manager (if different from owner)" className="w-full text-sm" {...form.register("onSiteManager")} />
                    </div>
                    <div>
                      <label htmlFor="primaryPhone" className="block text-xs sm:text-sm font-medium mb-1">Primary Phone *</label>
                      <Input id="primaryPhone" placeholder="Owner or manager's phone number" className="w-full text-sm" {...form.register("primaryPhone", { required: true })} />
                    </div>
                    <div>
                      <label htmlFor="primaryEmail" className="block text-xs sm:text-sm font-medium mb-1">Primary Email *</label>
                      <Input id="primaryEmail" type="email" placeholder="Owner or manager's email address" className="w-full text-sm" {...form.register("primaryEmail", { required: true })} />
                    </div>
                    <div>
                      <label htmlFor="website" className="block text-xs sm:text-sm font-medium mb-1">Website / Social Media URL</label>
                      <Input id="website" placeholder="https://instagram.com/yourhostel or website URL" className="w-full text-sm" {...form.register("website")} />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => navigate("/agent/dashboard")}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="w-full sm:w-auto">
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
                <Button onClick={() => { setShowQrDialog(false); navigate("/agent/my-hostels"); }}>
                  Done
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AgentLayout>
  );
};

export default AgentAddHostel;
