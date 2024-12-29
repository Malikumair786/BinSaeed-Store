"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPinHouse } from "lucide-react";

import { useSignupMutation } from "@/services/userApi";
import { useToast } from "@/hooks/use-toast";
import { PasswordInput } from "@/components/PasswordInput";
import Loader from "@/components/loader";
import SocialAuthButtons from "@/components/socialAuth";
import BinSaeedLogo from "../../../icons/Bin_Saeed_logo.png";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const passwordRequirements = [
  {
    regex: /.{8,}/,
    message:
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
  },
  { regex: /[A-Z]/, message: "" },
  { regex: /[a-z]/, message: "" },
  { regex: /[0-9]/, message: "" },
];

const Signup = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [signup, { isLoading, error }] = useSignupMutation();
  const [userData, setUserData] = useState({
    username: "",
    phoneNo: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handlePickAddress = () => {
    console.log("Opening map to pick location...");
  };

  const validatePassword = (
    password: string,
    confirmPassword: string
  ): string[] => {
    const errors: string[] = [];
    const failedRequirements = passwordRequirements.filter(
      (req) => !req.regex.test(password)
    );
    if (failedRequirements.length > 0) {
      errors.push(failedRequirements[0].message);
    }
    if (password !== confirmPassword) {
      errors.push("Passwords do not match.");
    }
    return errors;
  };

  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessages([]);
    const newErrors = validatePassword(
      userData.password,
      userData.confirmPassword
    );
    if (newErrors.length > 0) {
      setErrorMessages(newErrors);
      return;
    }
    try {
      const response = await signup(userData).unwrap();
      const email = encodeURIComponent(response?.data?.email || "");
      const text = encodeURIComponent(
        "Please check your inbox to verify your email address."
      );
      router.replace(`/verification?email=${email}&text=${text}`);
    } catch (err: any) {
      console.log("Registration failed:", err);
      toast({
        title: "Error",
        description: err?.data?.message || "Unable to Signup",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full mx-5 sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <CardHeader className="flex flex-col items-center justify-center text-center">
          <Image
            priority
            src={BinSaeedLogo}
            alt="Google"
            className="w-28 h-full object-cover"
          />
          <CardTitle>Welcome to BinSaeed</CardTitle>
        </CardHeader>
        <CardContent className="px-3">
          <form onSubmit={handleRegisterUser} className="grid gap-4">
            <div className="grid gap-2">
              <Label id="username" htmlFor="username">
                Full Name
              </Label>
              <Input
                id="username"
                name="name"
                type="name"
                value={userData.username}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label
                id="phoneNo"
                htmlFor="phoneNo"
                className="text-sm font-medium text-gray-700"
              >
                Phone Number
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground text-sm">
                  +92
                </span>
                <Input
                  id="phoneNo"
                  name="phoneNo"
                  type="tel"
                  value={userData.phoneNo}
                  onChange={handleInputChange}
                  placeholder="300-0000000"
                  required
                  className="pl-12"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label id="address" htmlFor="address">
                Address
              </Label>
              <div className="relative">
                <Input
                  id="address"
                  name="address"
                  type="address"
                  value={userData.address}
                  onChange={handleInputChange}
                  placeholder="House # 1, satellite town, Islamabad"
                  required
                />
                <button
                  type="button"
                  onClick={handlePickAddress}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground text-lg"
                >
                  <MapPinHouse className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={userData.email}
                onChange={handleInputChange}
                placeholder="m@example.com"
                required
              />
            </div>
            <PasswordInput
              id="password"
              value={userData.password}
              onChange={handleInputChange}
            />
            <PasswordInput
              id="confirmPassword"
              text="Confirm Password"
              value={userData.confirmPassword}
              onChange={handleInputChange}
            />
            {errorMessages.length > 0 && (
              <div className="text-red-500 text-sm">
                {errorMessages.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader /> : "Register"}
            </Button>
            <SocialAuthButtons />
          </form>
          <div className="text-center text-md mt-4">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
