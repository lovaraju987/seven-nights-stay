
import React from "react";
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Hostel Information */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="hostelName" className="block text-sm font-medium mb-1">Hostel Name *</label>
                    <Input 
                      id="hostelName"
                      placeholder="E.g., Royal Boys Hostel" 
                      {...form.register("hostelName")}
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
                          {...form.register("ownerName")} 
                        />
                      </div>
                      <div>
                        <label htmlFor="ownerPhone" className="block text-sm font-medium mb-1">Owner Phone *</label>
                        <Input 
                          id="ownerPhone"
                          placeholder="10-digit mobile number" 
                          {...form.register("ownerPhone")} 
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
                        {...form.register("address")}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium mb-1">City *</label>
                        <Input 
                          id="city"
                          placeholder="E.g., Mumbai" 
                          {...form.register("city")} 
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium mb-1">State *</label>
                        <Input 
                          id="state"
                          placeholder="E.g., Maharashtra" 
                          {...form.register("state")} 
                        />
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
            </Form>
          </CardContent>
        </Card>
      </div>
    </AgentLayout>
  );
};

export default AgentAddHostel;
