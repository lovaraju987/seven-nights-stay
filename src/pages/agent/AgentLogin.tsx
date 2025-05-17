
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/components/ui/sonner";
import { ArrowLeftIcon } from "lucide-react";

const AgentLogin = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [useEmail, setUseEmail] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const handleSendOtp = () => {
    if (useEmail) {
      if (!email.includes("@")) {
        toast.error("Enter a valid email address");
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setShowOtpInput(true);
        setIsLoading(false);
        toast.success("OTP sent to your email");
        let countDown = 30;
        const interval = setInterval(() => {
          countDown -= 1;
          setTimer(countDown);
          if (countDown <= 0) clearInterval(interval);
        }, 1000);
      }, 1000);
      return;
    }
    // Validate phone number
    if (phoneNumber.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    setIsLoading(true);
    // Mock OTP sending
    setTimeout(() => {
      setShowOtpInput(true);
      setIsLoading(false);
      toast.success("OTP sent to your mobile number");
      // Start countdown timer
      let countDown = 30;
      const interval = setInterval(() => {
        countDown -= 1;
        setTimer(countDown);
        if (countDown <= 0) {
          clearInterval(interval);
        }
      }, 1000);
    }, 1500);
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Login successful!");
      navigate("/agent/dashboard");
    }, 1000);
  };

  const handleResendOtp = () => {
    if (timer > 0) return;
    
    setTimer(30);
    toast.success("OTP resent to your mobile number");
    
    // Reset countdown timer
    let countDown = 30;
    const interval = setInterval(() => {
      countDown -= 1;
      setTimer(countDown);
      
      if (countDown <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4"
              onClick={() => navigate("/role-selection")}
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold w-full">
              {showOtpInput ? "Verify OTP" : "Agent Login"}
            </h2>
          </div>
          <p className="text-gray-500 text-sm">
            {showOtpInput
              ? `Enter the 6-digit code sent to ${useEmail ? email : `+91 ${phoneNumber}`}`
              : useEmail
                ? "Enter your email address to continue"
                : "Enter your mobile number to continue"
            }
          </p>
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

              {/* Always show phone number input at the top */}
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

              {/* Show email/password input below if toggled */}
              {useEmail && (
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
              )}
              <p className="text-xs text-gray-500 text-center">
                By continuing you agree to our <a href="#" className="text-blue-600">Terms & Conditions</a> and <a href="#" className="text-blue-600">Privacy Policy</a>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
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

              <p className="text-center">
                <button
                  onClick={handleResendOtp}
                  disabled={timer > 0}
                  className={`text-sm ${timer > 0 ? 'text-gray-400' : 'text-blue-600'}`}
                >
                  {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
                </button>
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button
            className="w-full"
            onClick={showOtpInput ? handleVerifyOtp : handleSendOtp}
            disabled={isLoading || (showOtpInput ? otp.length !== 6 : (useEmail ? !email : phoneNumber.length !== 10))}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {showOtpInput ? "Verifying..." : "Sending OTP..."}
              </span>
            ) : (
              <span>{showOtpInput ? "Verify & Continue" : "Send OTP"}</span>
            )}
          </Button>
          <div className="text-center w-full mt-3 text-sm">
            Don't have an account? <a href="/register" className="text-blue-600 underline">Register here</a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AgentLogin;
