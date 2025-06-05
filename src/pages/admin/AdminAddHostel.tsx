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

const AdminAddHostel = () => {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      hostelType: "",
      hostelName: "",
      address: "",
      city: "",
      state: "",
      agentNotes: "",
      videoUrls: [""],
      // Add these fields for file and lat/lng
      hostelImages: undefined,
      lat: '',
      lng: '',
    },
  });

  const [mapCenter, setMapCenter] = useState({ lat: 17.385044, lng: 78.486671 });
  const [markerPosition, setMarkerPosition] = useState(mapCenter);
  const autocompleteRef = useRef(null);

  const onSubmit = async (data) => {
    // Admin can add hostels as owner, but set created_by: 'admin'
    // Optionally, allow admin to select owner_id or leave null
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
    const { error } = await supabase.from("hostels").insert([
      {
        name: data.hostelName,
        type: data.hostelType,
        description: data.agentNotes || "",
        address: {
          address: data.address,
          city: data.city,
          state: data.state
        },
        lat: data.lat,
        lng: data.lng,
        status: "verified", // Admin can directly verify
        images: uploadedImageUrls,
        video_url: data.videoUrls?.[0] || null,
        updated_at: new Date().toISOString(),
        created_by: "admin",
        // Optionally: owner_id: null or select owner
      }
    ]);
    if (error) {
      toast.error("Failed to submit hostel");
      return;
    }
    toast.success("Hostel added successfully!");
    navigate("/admin/hostels");
  };

  return (
    <div>
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate("/admin/hostels")}
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Hostels
      </Button>
      <h1 className="text-2xl font-bold mb-6">Add Hostel (Admin)</h1>
      <div className="max-w-4xl">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium">Hostel Information</h2>
            <p className="text-sm text-gray-500">
              Add details to list a hostel
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
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
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium mb-1">City *</label>
                        <Input 
                          id="city"
                          placeholder="E.g., Mumbai" 
                          {...form.register("city", { required: true })} 
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium mb-1">State *</label>
                        <Input 
                          id="state"
                          placeholder="E.g., Maharashtra" 
                          {...form.register("state", { required: true })} 
                        />
                      </div>
                    </div>
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
                          />
                        </div>
                        <div>
                          <label htmlFor="lng" className="block text-sm font-medium mb-1">Longitude *</label>
                          <Input 
                            id="lng"
                            placeholder="78.486671"
                            {...form.register("lng" as const, { required: true })}
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
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate("/admin/hostels")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Add Hostel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAddHostel;
