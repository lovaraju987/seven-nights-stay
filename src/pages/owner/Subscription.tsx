
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, CheckIcon } from "lucide-react";

const Subscription = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate("/owner/dashboard")}
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
      
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Subscription Management</h1>
        <p className="text-gray-500">Manage your subscription plan and payments</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="relative border-2 border-blue-300">
          <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs py-1 px-3 rounded-bl-md">
            Current Plan
          </div>
          <CardHeader>
            <h2 className="text-xl font-semibold">Basic Plan</h2>
            <p className="text-3xl font-bold">₹999<span className="text-sm font-normal text-gray-500">/month</span></p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                <span>1 Hostel Listing</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                <span>Basic Analytics</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                <span>Email Support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Renew Subscription</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Professional Plan</h2>
            <p className="text-3xl font-bold">₹1999<span className="text-sm font-normal text-gray-500">/month</span></p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                <span>Up to 3 Hostel Listings</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                <span>Advanced Analytics</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                <span>Priority Support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Upgrade</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Enterprise Plan</h2>
            <p className="text-3xl font-bold">₹4999<span className="text-sm font-normal text-gray-500">/month</span></p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                <span>Unlimited Hostel Listings</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                <span>Premium Analytics & Reports</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                <span>24/7 Dedicated Support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Upgrade</Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Payment History</h2>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">This section is under construction. Soon, you'll be able to view your payment history here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscription;
