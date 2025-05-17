import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/lib/supabase";

const OwnerLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Demo OTP login state
  const [useEmail, setUseEmail] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [timer, setTimer] = useState(30);

  const handleLogin = async () => {
    if (!email.includes("@") || password.length < 6) {
      toast.error("Enter a valid email and password");
      return;
    }
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Login successful!");
      navigate("/owner/dashboard");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <h2 className="text-2xl font-bold">Owner Login</h2>
          <p className="text-gray-500 text-sm">Enter your login credentials</p>
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
                    placeholder="Email address"
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

              <p className="text-xs text-gray-500 text-center">
                By continuing you agree to our <a href="#" className="text-blue-600">Terms & Conditions</a> and <a href="#" className="text-blue-600">Privacy Policy</a>
              </p>
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
                    navigate("/owner/dashboard");
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

          <div className="text-center text-sm">
            Don't have an account? <a href="/register" className="text-blue-600 underline">Register here</a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OwnerLogin;
