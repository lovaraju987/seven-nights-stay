import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const SOS = () => {
  const [sending, setSending] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (user?.user) {
        setProfileId(user.user.id);
      }
    };
    loadUser();
  }, []);

  const handleSOS = async () => {
    if (!profileId) return;
    setSending(true);
    const { error } = await supabase.functions.invoke("send-sos", {
      body: { userId: profileId },
    });
    if (error) {
      toast.error("Failed to send SOS: " + error.message);
    } else {
      toast.success("SOS alert sent to support team");
    }
    setSending(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4">
      <Card className="max-w-md w-full mx-auto mt-10">
        <CardHeader>
          <h1 className="text-xl font-bold">Emergency SOS</h1>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>If you are in an emergency situation, press the button below. Our support team will be alerted immediately.</p>
          <Button className="w-full" onClick={handleSOS} disabled={sending}>
            {sending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Send SOS
          </Button>
          <Button variant="outline" className="w-full" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SOS;
