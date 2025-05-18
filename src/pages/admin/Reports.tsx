import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";

const Reports = () => {
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>

        <Tabs defaultValue="subscription" className="w-full">
          <TabsList>
            <TabsTrigger value="subscription">Subscription Reports</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Reports</TabsTrigger>
            <TabsTrigger value="user-growth">User Growth</TabsTrigger>
          </TabsList>

          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Coming soon: Monthly active subscriptions, plan distribution, etc.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Coming soon: Monthly revenue trends, top plans, etc.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="user-growth">
            <Card>
              <CardHeader>
                <CardTitle>User Growth Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Coming soon: Daily/Monthly user signups, retention, etc.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Reports;