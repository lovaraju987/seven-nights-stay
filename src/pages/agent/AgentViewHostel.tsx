import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AgentViewHostel() {
  const { id } = useParams();
  const [hostel, setHostel] = useState<any>(null);

  useEffect(() => {
    // Simulated data load for now until Supabase is integrated
    const storedHostels = JSON.parse(localStorage.getItem("agentHostels") || "[]");
    const found = storedHostels.find((h: any) => h.id === id);
    setHostel(found);
  }, [id]);

  if (!hostel) return <div className="p-4">Hostel not found or loading...</div>;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">{hostel.name}</h2>
      <p className="text-gray-600 capitalize">{hostel.type} hostel</p>
      <p className="text-sm">{hostel.description}</p>
      <div className="text-sm text-gray-500">
        <p><strong>Address:</strong> {hostel.address?.line1}, {hostel.address?.city}, {hostel.address?.state}</p>
        <p><strong>Status:</strong> {hostel.status}</p>
        <p><strong>Created by:</strong> {hostel.created_by}</p>
      </div>
    </div>
  );
}