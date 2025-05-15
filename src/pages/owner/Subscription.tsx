
import React from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";

const Subscription = () => {
  // Mock data for subscription plans
  const subscriptionPlans = [
    {
      id: "basic",
      name: "Basic",
      price: 499,
      period: "month",
      features: [
        "List up to 1 hostel",
        "Basic booking management",
        "Email support",
        "Standard listing visibility"
      ],
      notIncluded: [
        "Priority listing",
        "Analytics dashboard",
        "Promotional tools",
        "API access"
      ],
      popular: false,
      buttonText: "Start Free Trial",
      color: "border-gray-200"
    },
    {
      id: "professional",
      name: "Professional",
      price: 999,
      period: "month",
      features: [
        "List up to 3 hostels",
        "Advanced booking management",
        "Priority email & phone support",
        "Featured listings",
        "Basic analytics",
        "Promotional tools"
      ],
      notIncluded: [
        "API access"
      ],
      popular: true,
      buttonText: "Go Professional",
      color: "border-blue-500"
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 2499,
      period: "month",
      features: [
        "Unlimited hostels",
        "Full booking system",
        "24/7 priority support",
        "Premium listing placement",
        "Advanced analytics dashboard",
        "Marketing & promotional tools",
        "API access for integration"
      ],
      notIncluded: [],
      popular: false,
      buttonText: "Contact Sales",
      color: "border-gray-200"
    }
  ];

  // Currently active subscription (for demo purposes)
  const activeSubscription = "basic";

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Subscription Plans</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose the right plan to grow your hostel business and reach more customers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {subscriptionPlans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${plan.popular ? 'border-2 border-blue-500 shadow-lg' : ''}`}
          >
            {plan.popular && (
              <Badge className="absolute top-4 right-4 bg-blue-500">
                Most Popular
              </Badge>
            )}
            
            <CardHeader>
              <h2 className="text-2xl font-bold">{plan.name}</h2>
              <div className="mt-2">
                <span className="text-3xl font-bold">₹{plan.price}</span>
                <span className="text-gray-600">/{plan.period}</span>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-gray-500 mb-2">INCLUDES:</h3>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {plan.notIncluded.length > 0 && (
                  <div>
                    <h3 className="font-medium text-sm text-gray-500 mb-2">NOT INCLUDED:</h3>
                    <ul className="space-y-2">
                      {plan.notIncluded.map((feature, index) => (
                        <li key={index} className="flex items-start text-gray-500">
                          <X className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full"
                variant={plan.id === activeSubscription ? "outline" : "default"}
              >
                {plan.id === activeSubscription ? "Current Plan" : plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-10">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Subscription History</h2>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Basic</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Mar 15, 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apr 15, 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹499</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="outline" className="border-green-500 text-green-600">Active</Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Free Trial</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Feb 15, 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Mar 15, 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹0</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="outline" className="border-gray-500 text-gray-600">Expired</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subscription;
