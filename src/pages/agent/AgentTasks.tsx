
import React from "react";
import AgentLayout from "@/components/agent/AgentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";

// Mock data
const tasks = [
  {
    id: 1,
    title: "Revisit hostel for better photos",
    hostelName: "Royal Boys Hostel",
    priority: "high",
    status: "pending",
    dueDate: "2025-05-20",
  },
  {
    id: 2,
    title: "Collect payment confirmation from owner",
    hostelName: "Sunshine Girls PG",
    priority: "medium",
    status: "pending",
    dueDate: "2025-05-21",
  },
  {
    id: 3,
    title: "Explain new features to owner",
    hostelName: "Elite Co-Living Space",
    priority: "low",
    status: "pending",
    dueDate: "2025-05-25",
  },
  {
    id: 4,
    title: "Check room availability",
    hostelName: "Comfort Zone PG",
    priority: "high",
    status: "completed",
    completedDate: "2025-05-15",
  },
];

const AgentTasks = () => {
  const markTaskComplete = (taskId: number) => {
    toast.success("Task marked as complete!");
  };

  return (
    <AgentLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Tasks & Follow-ups</h1>

        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {tasks
              .filter((task) => task.status === "pending")
              .map((task) => (
                <Card key={task.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        className="mt-1"
                        onCheckedChange={() => markTaskComplete(task.id)}
                      />
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <div>
                            <h3 className="font-medium">{task.title}</h3>
                            <p className="text-gray-500 text-sm">
                              {task.hostelName}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                task.priority === "high"
                                  ? "destructive"
                                  : task.priority === "medium"
                                  ? "outline"
                                  : "secondary"
                              }
                            >
                              {task.priority} priority
                            </Badge>
                            <span className="text-sm text-gray-500">
                              Due: {task.dueDate}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            View Hostel
                          </Button>
                          <Button size="sm">Mark Complete</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {tasks
              .filter((task) => task.status === "completed")
              .map((task) => (
                <Card key={task.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox checked disabled className="mt-1" />
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <div>
                            <h3 className="font-medium line-through text-gray-500">
                              {task.title}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {task.hostelName}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">Completed</Badge>
                            <span className="text-sm text-gray-400">
                              Done on: {task.completedDate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </AgentLayout>
  );
};

export default AgentTasks;
