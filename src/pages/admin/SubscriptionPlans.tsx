
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";

const SubscriptionPlans = () => {
  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: 999,
      features: [
        "Add up to 1 hostel",
        "Basic booking management",
        "QR code for hostel entry",
        "Email support",
      ],
      color: "bg-gray-100 border-gray-200",
      buttonClass: "bg-gray-700 hover:bg-gray-800",
    },
    {
      id: "professional",
      name: "Professional",
      price: 2499,
      isPopular: true,
      features: [
        "Add up to 3 hostels",
        "Advanced booking management",
        "QR code for hostel entry",
        "Analytics dashboard",
        "Priority email & chat support",
        "Booking reports export",
      ],
      color: "bg-blue-50 border-blue-200",
      buttonClass: "bg-blue-600 hover:bg-blue-700",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 4999,
      features: [
        "Unlimited hostels",
        "Advanced booking management",
        "QR code for hostel entry",
        "Advanced analytics",
        "24/7 dedicated support",
        "Custom reports",
        "API access",
        "Dedicated account manager",
      ],
      color: "bg-purple-50 border-purple-200",
      buttonClass: "bg-purple-600 hover:bg-purple-700",
    },
  ];

  const handleEditPlan = (planId: string) => {
    toast.info(`Edit functionality for ${planId} plan will be implemented soon`);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Subscription Plans Management</h1>
          <Button onClick={() => toast.info("Add plan functionality will be implemented soon")}>
            Add New Plan
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className={`overflow-hidden border-2 ${plan.color}`}>
              {plan.isPopular && (
                <div className="bg-blue-600 text-white text-center py-1 text-xs font-medium">
                  MOST POPULAR
                </div>
              )}
              
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  <div className="flex items-baseline mt-2">
                    <span className="text-3xl font-bold">₹{plan.price}</span>
                    <span className="ml-1 text-sm text-muted-foreground">/month</span>
                  </div>
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2 min-h-[200px]">
                  {plan.features.map((feature, index) => (
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
                  className={`w-full ${plan.buttonClass}`}
                  onClick={() => handleEditPlan(plan.id)}
                >
                  Edit Plan
                </Button>
              </CardFooter>
            </Card>
          ))}
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
    </AdminLayout>
  );
};

export default SubscriptionPlans;
