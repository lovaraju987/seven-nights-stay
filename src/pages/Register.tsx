import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/lib/supabase";

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("hosteller");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email.includes("@") || password.length < 6) {
      toast.error("Please fill all fields correctly");
      return;
    }

    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: fullName, role }
      }
    });

    if (signUpError) {
      toast.error(signUpError.message);
      setLoading(false);
      return;
    }

    // Fallback: Get session to retrieve user ID
    let userId = data.user?.id;
    if (!userId) {
      const session = (await supabase.auth.getSession()).data.session;
      userId = session?.user?.id;
    }

    if (userId) {
      await supabase.from("profiles").upsert({
        id: userId,
        name: fullName,
        role,
      });
    }

    toast.success("Registration successful! Check your email for confirmation.");

    // Redirect based on role
    if (role === "owner") {
      navigate("/owner/login");
    } else if (role === "agent") {
      navigate("/agent/login");
    } else if (role === "admin") {
      navigate("/admin/login");
    } else {
      navigate("/login");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="text-center">
          <h2 className="text-xl font-bold">Create Your Account</h2>
          <p className="text-sm text-gray-500">Signup to OneTo7 Hostels Platform</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <Input placeholder="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <select
            className="w-full border px-3 py-2 rounded text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="hosteller">Hosteller</option>
            <option value="owner">Owner</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option> {/* ✅ Add this line */}

          </select>
        </CardContent>

        <CardFooter>
          <Button className="w-full" onClick={handleRegister} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;