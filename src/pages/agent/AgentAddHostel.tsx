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
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  hostelType: "boys" | "girls" | "coed";
  hostelName: string;
  ownerName: string;
  ownerPhone: string;
  ownerWhatsapp: string;
  address: string;
  city: string;
  state: string;
  isOwnerAware: string;
  agentNotes: string;
  videoUrls: string[];
  lat: number;
  lng: number;
  hostelImages: FileList;
  idProofFile: FileList;
  registrationProof: FileList;
}

const AgentAddHostel = () => {
  const navigate = useNavigate();
  const form = useForm<FormData>({
    defaultValues: {
      hostelType: "boys",
      hostelName: "",
      ownerName: "",
      ownerPhone: "",
      ownerWhatsapp: "",
      address: "",
      city: "",
      state: "",
      isOwnerAware: "yes",
      agentNotes: "",
      videoUrls: [""],
      lat: 17.385044,
      lng: 78.486671,
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

  const onSubmit = async (data: FormData) => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) {
      toast.error("You must be logged in to submit a hostel.");
      return;
    }

    // Upload images to Supabase Storage before inserting hostel
    const uploadedImageUrls: string[] = [];

    if (data.hostelImages && data.hostelImages.length > 0) {
      for (const file of Array.from(data.hostelImages)) {
        const sanitizedFileName = (file as File).name
          .toLowerCase()
          .replace(/\s+/g, "-")             // Replace spaces with dashes
          .replace(/[^\w.-]+/g, "");        // Remove special characters

        const filePath = `${userId}/${Date.now()}-${sanitizedFileName}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("hostel-images")
          .upload(filePath, file as File);

        if (uploadError) {
          console.error("Upload error:", uploadError.message);
          toast.error("Image upload failed.");
          return;
        }

        // Use the correct way to get public URL as per new logic
        const { data: publicUrlData } = supabase.storage
          .from("hostel-images")
          .getPublicUrl(filePath);
        const publicUrl = publicUrlData?.publicUrl;

        uploadedImageUrls.push(publicUrl);
      }
    }

    const { error } = await supabase.from("hostels").insert({
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
      agent_id: userId,
      status: "draft" as const,
      images: uploadedImageUrls,
      video_url: data.videoUrls?.[0] || null,
      created_by: "agent" as const,
      owner_name: data.ownerName,
      owner_phone: data.ownerPhone,
      updated_at: new Date().toISOString()
    });

    if (error) {
      console.error(error);
      toast.error("Failed to submit hostel");
      return;
    }

    toast.success("Hostel submitted successfully!");
    navigate("/agent/my-hostels");
  };

  return (
    <AgentLayout>
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate("/agent/dashboard")}
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      <h1 className="text-2xl font-bold mb-6">Add Hostel</h1>

      <div className="max-w-4xl">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium">Hostel Information</h2>
            <p className="text-sm text-gray-500">
              Add details on behalf of the hostel owner
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Hostel Information */}
                <div className="space-y-4">
                  {/* Enhancement 1: Hostel Type Field */}
                  <div className="mb-4">
                    <label htmlFor="hostelType" className="block text-sm font-medium mb-1">Hostel Type *</label>
                    <select 
                      id="hostelType" 
                      className="w-full p-2 border rounded"
                      {...form.register("hostelType", { required: true })}
                    >
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

                  {/* Owner Information Section */}
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Owner Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="ownerName" className="block text-sm font-medium mb-1">Owner Name *</label>
                        <Input 
                          id="ownerName"
                          placeholder="Full name of owner" 
                          {...form.register("ownerName", { required: true })} 
                        />
                      </div>
                      <div>
                        <label htmlFor="ownerPhone" className="block text-sm font-medium mb-1">Owner Phone *</label>
                        <Input 
                          id="ownerPhone"
                          placeholder="10-digit mobile number" 
                          {...form.register("ownerPhone", { required: true })} 
                        />
                      </div>
                      <div>
                        <label htmlFor="ownerWhatsapp" className="block text-sm font-medium mb-1">Owner WhatsApp (if different)</label>
                        <Input 
                          id="ownerWhatsapp"
                          placeholder="WhatsApp number" 
                          {...form.register("ownerWhatsapp")} 
                        />
                      </div>
                      <div>
                        <label htmlFor="isOwnerAware" className="block text-sm font-medium mb-1">Is Owner Aware of App? *</label>
                        <select 
                          id="isOwnerAware" 
                          className="w-full p-2 border rounded"
                          {...form.register("isOwnerAware")}
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    </div>
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
                              form.setValue('lat', lat);
                              form.setValue('lng', lng);

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
                            form.setValue('lat', lat);
                            form.setValue('lng', lng);
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
                            {...form.register("lat", { required: true, valueAsNumber: true })}
                          />
                        </div>
                        <div>
                          <label htmlFor="lng" className="block text-sm font-medium mb-1">Longitude *</label>
                          <Input 
                            id="lng"
                            placeholder="78.486671"
                            {...form.register("lng", { required: true, valueAsNumber: true })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Agent Notes */}
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Agent Notes</h3>
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

                  {/* Upload ID Proof */}
                  {/* Enhancement 2: ID Proof Upload Field */}
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Owner ID Proof</h3>
                    <div className="mb-4">
                      <label htmlFor="idProofFile" className="block text-sm font-medium mb-1">Upload ID Proof *</label>
                      <input 
                        type="file"
                        id="idProofFile"
                        accept="image/*,.pdf"
                        className="w-full p-2 border rounded"
                        {...form.register("idProofFile", { required: true })}
                      />
                      <p className="mt-1 text-xs text-gray-500">Upload Aadhaar, Pan Card, or Voter ID (Max: 5MB)</p>
                    </div>
                  </div>

                  {/* Enhancement 5: Hostel Registration Proof Upload */}
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Hostel Registration Proof (Optional)</h3>
                    <input
                      type="file"
                      id="registrationProof"
                      accept=".pdf,image/*"
                      className="w-full p-2 border rounded"
                      {...form.register("registrationProof")}
                    />
                    <p className="mt-1 text-xs text-gray-500">PDF or image of hostel registration certificate</p>
                  </div>

                  {/* Hostel Media */}
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Hostel Media</h3>
                    <div className="mb-4">
                      <label htmlFor="hostelImages" className="block text-sm font-medium mb-1">Upload Hostel Images *</label>
                      {/* Enhancement 4: Hostel Images Validation */}
                      <input
                        type="file"
                        id="hostelImages"
                        accept="image/png, image/jpeg"
                        multiple
                        className="w-full p-2 border rounded"
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
                      {/* Enhancement 6: Image Preview of Uploaded Images */}
                      {form.watch("hostelImages") && form.watch("hostelImages").length > 0 && Array.from(form.watch("hostelImages")).map((file: File, index: number) => (
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

                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate("/agent/dashboard")}
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
    </AgentLayout>
  );
};

export default AgentAddHostel;
