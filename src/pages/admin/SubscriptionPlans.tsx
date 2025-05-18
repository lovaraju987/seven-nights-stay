import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState<any[]>([]);
  // Add plan dialog states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newPlanName, setNewPlanName] = useState("");
  const [newPlanPrice, setNewPlanPrice] = useState("");
  const [newPlanFeatures, setNewPlanFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [hostelId, setHostelId] = useState("");
  const [planType, setPlanType] = useState("");
  const [status, setStatus] = useState("active");
  const [expiresOn, setExpiresOn] = useState("");
  const [graceEndsOn, setGraceEndsOn] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      // Use correct column names: select all and order by amount
      const { data, error } = await supabase.from("subscriptions").select("*, amount").order("amount", { ascending: true });
      if (error) {
        toast.error("Failed to load plans");
        return;
      }
      setPlans(data);
    };
    fetchPlans();
  }, []);

  const handleEditPlan = (planId: string) => {
    toast.info(`Edit functionality for ${planId} plan will be implemented soon`);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Subscription Plans Management</h1>
          <Button onClick={() => setShowAddDialog(true)}>
            Add New Plan
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.length > 0 ? plans.map((plan) => (
            <Card key={plan.id} className="overflow-hidden border">
              <CardHeader>
                <CardTitle>{plan.plan_name}</CardTitle>
                <CardDescription>
                  <div className="flex items-baseline mt-2">
                    <span className="text-3xl font-bold">₹{plan.amount}</span>
                    <span className="ml-1 text-sm text-muted-foreground">/month</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 min-h-[200px]">
                  {plan.features?.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button 
                  className="w-full"
                  onClick={() => handleEditPlan(plan.id)}
                >
                  Edit Plan
                </Button>
              </CardFooter>
            </Card>
          )) : (
            <div className="col-span-3 text-center text-gray-500 py-8">No plans found.</div>
          )}
        </div>
        
        <Card className="p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">Commission-Based Alternative</h2>
          <p className="mb-4">
            For hostel owners who prefer not to pay a fixed monthly subscription, we offer a commission-based model.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-md border p-4">
              <h3 className="font-semibold mb-2">Commission Rate</h3>
              <p className="text-3xl font-bold mb-1">15%</p>
              <p className="text-sm text-muted-foreground">
                per successful booking made through the platform
              </p>
            </div>
            
            <div className="rounded-md border p-4">
              <h3 className="font-semibold mb-2">Features</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Access to all Professional plan features
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  No monthly fees
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Pay only when you earn
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => toast.info("Edit commission rate functionality will be implemented soon")}
            >
              Edit Commission Rate
            </Button>
          </div>
        </Card>
      </div>
      {/* Add Plan Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Subscription Plan</DialogTitle>
            <DialogDescription>Fill in the subscription plan details below.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Plan Name"
              value={newPlanName}
              onChange={(e) => setNewPlanName(e.target.value)}
            />
            <Input
              placeholder="Amount (INR)"
              type="number"
              value={newPlanPrice}
              onChange={(e) => setNewPlanPrice(e.target.value)}
            />
            <select
              className="w-full border rounded px-3 py-2"
              value={planType}
              onChange={(e) => setPlanType(e.target.value)}
            >
              <option value="">Select Plan Type</option>
              <option value="fixed">Fixed</option>
              <option value="commission">Commission</option>
            </select>
            <select
              className="w-full border rounded px-3 py-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Input
              placeholder="Expires On"
              type="date"
              value={expiresOn}
              onChange={(e) => setExpiresOn(e.target.value)}
            />
            <Input
              placeholder="Grace Ends On"
              type="date"
              value={graceEndsOn}
              onChange={(e) => setGraceEndsOn(e.target.value)}
            />
            <div>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add feature"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (featureInput.trim()) {
                      setNewPlanFeatures([...newPlanFeatures, featureInput.trim()]);
                      setFeatureInput("");
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {newPlanFeatures.map((feat, idx) => (
                  <li key={idx} className="flex justify-between items-center">
                    {feat}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setNewPlanFeatures(newPlanFeatures.filter((_, i) => i !== idx))
                      }
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!newPlanName || !newPlanPrice || !planType || !status) {
                  toast.error("Please fill all required fields.");
                  return;
                }
                // Defensive check for planType
                if (planType !== "fixed" && planType !== "commission") {
                  toast.error("Please select a valid plan type (fixed or commission).");
                  return;
                }

                // Prepare payload with correct types and only include UUIDs if present
                const insertPayload: any = {
                  plan_name: newPlanName,
                  amount: parseFloat(newPlanPrice),
                  plan_type: planType,
                  status: status,
                  expires_on: expiresOn && expiresOn !== "" ? expiresOn : null,
                  grace_ends_on: graceEndsOn && graceEndsOn !== "" ? graceEndsOn : null,
                  created_at: new Date().toISOString(),
                  features: newPlanFeatures.length ? newPlanFeatures : [],
                };
                if (ownerId) insertPayload.owner_id = ownerId;
                if (hostelId) insertPayload.hostel_id = hostelId;

                // console.log("Insert payload:", insertPayload);
                const { error } = await supabase
                  .from("subscriptions")
                  .insert([insertPayload]);

                if (error) {
                  console.error("Supabase error:", error);
                  toast.error("Failed to add plan");
                } else {
                  toast.success("Plan added successfully");
                  setShowAddDialog(false);
                  setNewPlanName("");
                  setNewPlanPrice("");
                  setOwnerId("");
                  setHostelId("");
                  setPlanType("");
                  setStatus("active");
                  setExpiresOn("");
                  setGraceEndsOn("");
                  setNewPlanFeatures([]);
                  setFeatureInput("");

                  const { data: updatedPlans, error: fetchError } = await supabase
                    .from("subscriptions")
                    .select("*")
                    .order("amount", { ascending: true });

                  if (fetchError) {
                    toast.error("Failed to refresh plans");
                  } else {
                    setPlans(updatedPlans || []);
                  }
                }
              }}
            >
              Add Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default SubscriptionPlans;
