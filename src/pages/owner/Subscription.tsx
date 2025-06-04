
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";

const Subscription = () => {
  const [subscription, setSubscription] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const ownerId = userData?.user?.id;
    if (!ownerId) {
      setLoading(false);
      return;
    }

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('owner_id', ownerId)
      .order('expires_on', { ascending: false })
      .limit(1)
      .maybeSingle();
    setSubscription(sub || null);

    const { data: paymentData } = await supabase
      .from('payments')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });
    setPayments(paymentData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePayment = async () => {
    if (!subscription) return;
    const scriptId = 'razorpay-js';
    if (!document.getElementById(scriptId)) {
      const s = document.createElement('script');
      s.id = scriptId;
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(s);
      await new Promise(res => { s.onload = res; });
    }

    const options: any = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: subscription.amount * 100,
      name: 'OneTo7',
      description: `${subscription.plan_name} Subscription`,
      handler: async (response: any) => {
        const { data: userData } = await supabase.auth.getUser();
        const ownerId = userData?.user?.id;
        if (!ownerId) return;
        const start = new Date();
        const end = new Date(start);
        end.setMonth(end.getMonth() + 1);
        const { data: subInsert } = await supabase
          .from('subscriptions')
          .insert([
            {
              owner_id: ownerId,
              plan_name: subscription.plan_name,
              amount: subscription.amount,
              starts_on: start.toISOString().split('T')[0],
              expires_on: end.toISOString().split('T')[0],
              status: 'active',
            },
          ])
          .select()
          .single();

        await supabase.from('payments').insert([
          {
            owner_id: ownerId,
            subscription_id: subInsert?.id,
            amount: subscription.amount,
            payment_id: response.razorpay_payment_id,
            status: 'success',
          },
        ]);
        toast.success('Payment successful');
        fetchData();
      },
    };
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Subscription</h1>

      {subscription ? (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">{subscription.plan_name}</h2>
            <p className="text-sm text-gray-500">Next due on {subscription.expires_on}</p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-4">₹{subscription.amount} / month</p>
          </CardContent>
          <CardFooter>
            <Button onClick={handlePayment}>Pay Now</Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="mb-6">No active subscription</div>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Payment History</h2>
        </CardHeader>
        <CardContent>
          {payments.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td className="px-4 py-2">{new Date(p.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-2">₹{p.amount}</td>
                      <td className="px-4 py-2">{p.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No payments found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscription;
