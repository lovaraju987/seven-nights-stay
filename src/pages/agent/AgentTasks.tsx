
import React, { useEffect, useState } from "react";
import AgentLayout from "@/components/agent/AgentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const AgentTasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    hostel_id: "",
    priority: "medium",
    due_date: new Date(),
    description: "",
  });
  // For add task dialog loading state
  const [addTaskLoading, setAddTaskLoading] = useState(false);
  const [hostelOptions, setHostelOptions] = useState<any[]>([]);
  const handleAddTask = async () => {
    // Prevent double submission
    if (addTaskLoading) return;
    // Validation
    if (!newTask.title || !newTask.hostel_id || !newTask.priority || !newTask.due_date) {
      toast.error("Please fill all required fields");
      return;
    }

    setAddTaskLoading(true);
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;
    if (!userId) {
      toast.error("You must be logged in");
      setAddTaskLoading(false);
      return;
    }

    try {
      const insertData = {
        agent_id: userId,
        hostel_id: newTask.hostel_id,
        title: newTask.title,
        priority: newTask.priority,
        status: "pending",
        due_date: newTask.due_date
          ? newTask.due_date.toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      };

      const { error } = await supabase.from("agent_tasks").insert(insertData);
      if (error) {
        console.error("Insert error:", error);
        toast.error("Failed to add task");
      } else {
        toast.success("Task added");
        setShowAddDialog(false);
        setTasks((prev) => [
          ...prev,
          {
            ...newTask,
            agent_id: userId,
            status: "pending",
            id: Date.now().toString(),
            due_date: newTask.due_date
              ? newTask.due_date.toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
            completed_date: null,
          },
        ]);
        setNewTask({
          title: "",
          hostel_id: "",
          priority: "medium",
          due_date: new Date(),
          description: "",
        });
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong");
    }
    setAddTaskLoading(false);
  };

  useEffect(() => {
    const fetchTasksAndHostels = async () => {
      setLoading(true);
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) {
        toast.error("Please login again");
        setLoading(false);
        return;
      }
      const userId = authData.user.id;
      // Fetch agent_tasks
      const { data, error } = await supabase
        .from("agent_tasks")
        .select("*")
        .eq("agent_id", userId)
        .order("due_date", { ascending: true });
      if (error) {
        toast.error("Failed to fetch tasks");
        console.error(error);
      } else {
        setTasks(data || []);
      }
      // Fetch hostels for this agent
      const { data: hostels, error: hostelError } = await supabase
        .from("hostels")
        .select("id, name")
        .eq("agent_id", userId);
      if (!hostelError && hostels) {
        setHostelOptions(hostels);
      }
      setLoading(false);
    };

    fetchTasksAndHostels();
  }, []);

  const markTaskComplete = async (taskId: string) => {
    const { error } = await supabase
      .from("agent_tasks")
      .update({ status: "completed", completed_date: new Date().toISOString() })
      .eq("id", taskId);
    if (error) {
      toast.error("Failed to mark task complete");
    } else {
      toast.success("Task marked as complete!");
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: "completed", completed_date: new Date().toISOString() } : task
        )
      );
    }
  };

  return (
    <AgentLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Tasks & Follow-ups</h1>
        <div className="flex justify-end">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>Add Task</Button>
            </DialogTrigger>
            <DialogContent className="space-y-4 max-h-[80vh] overflow-y-auto">
              <DialogTitle>Create New Task</DialogTitle>
              <div className="space-y-2">
                <Label>Task Type</Label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                >
                  <option value="">Select Task Type</option>
                  <option value="Visit hostel for photo update">Visit hostel for photo update</option>
                  <option value="Collect payment confirmation">Collect payment confirmation</option>
                  <option value="Explain app benefits to owner">Explain app benefits to owner</option>
                  <option value="Follow up on registration">Follow up on registration</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Task Description</Label>
                <textarea
                  className="w-full border rounded px-2 py-1"
                  rows={3}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Mention detailed instructions for the task"
                />
              </div>
              <div className="space-y-2">
                <Label>Hostel</Label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={newTask.hostel_id}
                  onChange={(e) => setNewTask({ ...newTask, hostel_id: e.target.value })}
                >
                  <option value="">Select Hostel</option>
                  {hostelOptions.map((h) => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Calendar
                  mode="single"
                  selected={newTask.due_date}
                  onSelect={(date) =>
                    setNewTask({ ...newTask, due_date: date || new Date() })
                  }
                />
              </div>
              <Button onClick={handleAddTask} disabled={addTaskLoading}>
                {addTaskLoading ? "Saving..." : "Save Task"}
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {loading ? (
              <p>Loading...</p>
            ) : tasks.filter((t) => t.status === "pending").length === 0 ? (
              <p className="text-gray-500">No pending tasks.</p>
            ) : (
              tasks
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
                                {task.hostel_id
                                  ? (
                                      hostelOptions.find((h) => h.id === task.hostel_id)?.name ||
                                      task.hostel_id
                                    )
                                  : ""}
                              </p>
                              {task.description && (
                                <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                              )}
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
                                Due: {task.due_date ? format(new Date(task.due_date), "yyyy-MM-dd") : ""}
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
                            <Button size="sm" onClick={() => markTaskComplete(task.id)}>
                              Mark Complete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {loading ? (
              <p>Loading...</p>
            ) : tasks.filter((t) => t.status === "completed").length === 0 ? (
              <p className="text-gray-500">No completed tasks.</p>
            ) : (
              tasks
                .filter((task) => task.status === "completed")
                .map((task) => (
                  <Card key={task.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Checkbox checked disabled className="mt-1" />
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div>
                              <h3 className="font-medium line-through text-gray-500">{task.title}</h3>
                              <p className="text-gray-400 text-sm">
                                {task.hostel_id
                                  ? (
                                      hostelOptions.find((h) => h.id === task.hostel_id)?.name ||
                                      task.hostel_id
                                    )
                                  : ""}
                              </p>
                              {task.description && (
                                <p className="text-sm text-gray-400 mt-2">{task.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">Completed</Badge>
                              <span className="text-sm text-gray-400">
                                Done on: {task.completed_date ? format(new Date(task.completed_date), "yyyy-MM-dd") : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AgentLayout>
  );
};

export default AgentTasks;
