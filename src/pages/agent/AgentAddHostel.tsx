
import React from "react";
import AgentLayout from "@/components/agent/AgentLayout";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { ArrowLeftIcon } from "lucide-react";

const AgentAddHostel = () => {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      hostelName: "",
      ownerName: "",
      ownerPhone: "",
      ownerWhatsapp: "",
      address: "",
      city: "",
      state: "",
      isOwnerAware: "yes",
      agentNotes: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
    toast.success("Hostel submitted for review!");
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Hostel Information */}
              <div className="space-y-4">
                <FormItem>
                  <FormLabel>Hostel Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="E.g., Royal Boys Hostel" 
                      {...form.register("hostelName")}
                    />
                  </FormControl>
                </FormItem>

                {/* Owner Information Section */}
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">Owner Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem>
                      <FormLabel>Owner Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name of owner" {...form.register("ownerName")} />
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormLabel>Owner Phone *</FormLabel>
                      <FormControl>
                        <Input placeholder="10-digit mobile number" {...form.register("ownerPhone")} />
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormLabel>Owner WhatsApp (if different)</FormLabel>
                      <FormControl>
                        <Input placeholder="WhatsApp number" {...form.register("ownerWhatsapp")} />
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormLabel>Is Owner Aware of App? *</FormLabel>
                      <FormControl>
                        <select className="w-full p-2 border rounded" {...form.register("isOwnerAware")}>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </FormControl>
                    </FormItem>
                  </div>
                </div>

                {/* Location Section */}
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">Hostel Location</h3>
                  <FormItem>
                    <FormLabel>Address *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Complete address with building name, street, etc."
                        rows={3}
                        {...form.register("address")}
                      />
                    </FormControl>
                  </FormItem>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Mumbai" {...form.register("city")} />
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormLabel>State *</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Maharashtra" {...form.register("state")} />
                      </FormControl>
                    </FormItem>
                  </div>
                </div>

                {/* Agent Notes */}
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">Agent Notes</h3>
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional information or observations about this hostel"
                        rows={4}
                        {...form.register("agentNotes")}
                      />
                    </FormControl>
                  </FormItem>
                </div>

                {/* Upload ID Proof */}
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">Owner ID Proof</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                      />
                    </svg>
                    <div className="mt-4 flex justify-center">
                      <Button type="button" variant="outline">
                        Upload ID Proof
                      </Button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Upload Aadhaar, Pan Card, or Voter ID
                    </p>
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
          </CardContent>
        </Card>
      </div>
    </AgentLayout>
  );
};

export default AgentAddHostel;
