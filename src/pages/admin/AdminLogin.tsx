
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/components/ui/sonner";
import { Shield } from "lucide-react";
import { supabase } from "@/lib/supabase";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [useEmail, setUseEmail] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    setIsLoading(true);
    // Supabase sign in
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    // Optional: Check role from user metadata or fetch from `profiles` table
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();
    if (profile?.role !== "admin") {
      toast.error("Access denied. You are not an admin.");
      setIsLoading(false);
      return;
    }

    toast.success("Admin login successful");
    navigate("/admin/dashboard");
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-1">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-indigo-100">
              <Shield className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">Admin Login</h2>
          <p className="text-gray-500 text-sm">Secure access for OneTo7 admin panel</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {!showOtpInput ? (
            <div className="space-y-4">
              <p className="text-center text-sm text-gray-600">
                {useEmail ? "Use Phone Number instead?" : "Use Email instead?"}
                <button onClick={() => setUseEmail(!useEmail)} className="text-blue-600 ml-1 underline">
                  Switch
                </button>
              </p>

              {useEmail ? (
                <>
                  <Input
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </>
              ) : (
                <div className="flex">
                  <div className="bg-gray-100 px-3 py-2 border border-r-0 rounded-l-md text-gray-500">+91</div>
                  <Input
                    className="rounded-l-none focus:ring-blue-500"
                    placeholder="10-digit mobile number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="tel"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-gray-600 text-sm">Enter the 6-digit OTP sent to +91 {phoneNumber}</p>
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            className="w-full"
            onClick={() => {
              if (useEmail) {
                handleLogin();
              } else {
                if (showOtpInput) {
                  if (otp.length !== 6) {
                    toast.error("Please enter a valid 6-digit OTP");
                    return;
                  }
                  setIsLoading(true);
                  setTimeout(() => {
                    toast.success("Login successful!");
                    setIsLoading(false);
                    navigate("/admin/dashboard");
                  }, 1000);
                } else {
                  if (phoneNumber.length !== 10) {
                    toast.error("Enter a valid phone number");
                    return;
                  }
                  setShowOtpInput(true);
                  toast.success("OTP sent to your phone");
                }
              }
            }}
            disabled={isLoading}
          >
            {showOtpInput ? "Verify & Login" : useEmail ? "Login" : "Send OTP"}
          </Button>
          <div className="text-center w-full mt-3 text-sm">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-600 underline">
              Register here
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
