import React, { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/lib/supabase";

const checklistDefinitions = [
  { key: "idUploaded", label: "ID uploaded" },
  { key: "bedSelected", label: "Bed selected" },
  { key: "depositPaid", label: "Security deposit paid" },
  { key: "orientationCompleted", label: "Orientation completed" },
] as const;

type ChecklistState = Record<(typeof checklistDefinitions)[number]["key"], boolean>;

const MoveInChecklist = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<ChecklistState>(() =>
    checklistDefinitions.reduce((acc, cur) => ({ ...acc, [cur.key]: false }), {} as ChecklistState)
  );
  const sigCanvasRef = useRef<SignatureCanvas | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const toggleItem = (key: keyof ChecklistState) => {
    setItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClear = () => {
    sigCanvasRef.current?.clear();
  };

  const handleSubmit = async () => {
    if (!bookingId) return;
    if (sigCanvasRef.current?.isEmpty()) {
      toast.error("Please provide your signature.");
      return;
    }
    setSubmitting(true);
    const dataUrl = sigCanvasRef.current!.getTrimmedCanvas().toDataURL("image/png");
    const blob = await (await fetch(dataUrl)).blob();
    const filePath = `${bookingId}/${Date.now()}.png`;
    const { error: uploadError } = await supabase.storage
      .from("checklist-signatures")
      .upload(filePath, blob);
    if (uploadError) {
      toast.error("Failed to upload signature");
      setSubmitting(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("checklist-signatures").getPublicUrl(filePath);
    const { error } = await supabase.from("checklists").insert([
      {
        booking_id: bookingId,
        items,
        signature_url: urlData?.publicUrl,
        completed_at: new Date().toISOString(),
      },
    ]);
    if (error) {
      toast.error("Failed to save checklist");
      setSubmitting(false);
      return;
    }
    toast.success("Checklist submitted");
    navigate("/hosteller/bookings");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <h1 className="text-lg font-bold text-blue-800">Move-In Checklist</h1>
      </header>
      <main className="flex-1 p-4 max-w-md mx-auto w-full space-y-4">
        <Card>
          <CardHeader>
            <h2 className="font-medium">Complete the following</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {checklistDefinitions.map(def => (
              <div key={def.key} className="flex items-center space-x-2">
                <Checkbox id={def.key} checked={items[def.key]} onCheckedChange={() => toggleItem(def.key)} />
                <Label htmlFor={def.key} className="text-sm">
                  {def.label}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="font-medium">Signature</h2>
          </CardHeader>
          <CardContent>
            <SignatureCanvas ref={sigCanvasRef} canvasProps={{ className: "w-full h-40 border" }} />
            <div className="flex justify-end mt-2">
              <Button variant="outline" size="sm" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
        <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Checklist"}
        </Button>
      </main>
    </div>
  );
};

export default MoveInChecklist;
