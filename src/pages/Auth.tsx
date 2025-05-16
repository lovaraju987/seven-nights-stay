
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { authHelpers } from "@/integrations/supabase/client";

const Auth = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  
  // Form data state
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    role: "hosteller", // Default role
  });
  
  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await authHelpers.getSession();
      if (data.session) {
        // User is already logged in, redirect based on role
        const { data: { user } } = await authHelpers.getUser();
        redirectBasedOnRole(user);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const redirectBasedOnRole = async (user: any) => {
    if (!user) return;
    
    try {
      // Get user profile to check role
      const { data, error } = await authHelpers.supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
        
      if (error) throw error;
      
      const role = data?.role || "hosteller";
      
      // Redirect based on role
      switch (role) {
        case "hosteller":
          navigate("/hosteller/home");
          break;
        case "owner":
          navigate("/owner/dashboard");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "agent":
          navigate("/agent/dashboard");
          break;
        default:
          navigate("/hosteller/home");
      }
    } catch (error) {
      console.error("Error checking user role:", error);
      // Default to hosteller if there's an error
      navigate("/hosteller/home");
    }
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await authHelpers.signIn(loginData.email, loginData.password);
      
      if (error) throw error;
      
      toast.success("Login successful");
      redirectBasedOnRole(data.user);
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to log in");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    // Validate password length
    if (registerData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Register user with Supabase
      const { data, error } = await authHelpers.signUp(
        registerData.email, 
        registerData.password,
        {
          name: registerData.name,
          phone: registerData.phone,
          role: registerData.role
        }
      );
      
      if (error) throw error;
      
      if (data.session) {
        // Automatically signed in
        toast.success("Registration successful");
        redirectBasedOnRole(data.user);
      } else {
        // Email confirmation required
        toast.success("Registration successful. Please check your email for verification.");
        setTab("login");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to register");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700">OneTo7</h1>
          <p className="text-gray-600">Find your perfect hostel</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "register")}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email" 
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Enter your password" 
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      variant="link" 
                      type="button" 
                      className="px-0 font-normal text-xs"
                      onClick={() => alert("Reset password functionality will be implemented")}
                    >
                      Forgot Password?
                    </Button>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        Please wait
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input 
                      id="register-email" 
                      type="email" 
                      placeholder="Enter your email" 
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Enter your name" 
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      placeholder="Enter your phone number" 
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">I am a</Label>
                    <select 
                      id="role" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={registerData.role}
                      onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                    >
                      <option value="hosteller">Student/Hosteller</option>
                      <option value="owner">Hostel Owner</option>
                      <option value="agent">Property Agent</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input 
                      id="register-password" 
                      type="password" 
                      placeholder="Enter your password" 
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      placeholder="Confirm your password" 
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        Please wait
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter>
            <div className="text-center text-sm text-gray-500 w-full">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </div>
          </CardFooter>
        </Card>
        
        <div className="text-center mt-4">
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
