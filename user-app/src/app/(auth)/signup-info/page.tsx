"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MapPinHouse } from "lucide-react";

import { useSignupInfoMutation } from "@/services/userApi";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/loader";
import BinSaeedLogo from "../../../icons/Bin_Saeed_logo.png";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Cookies from "js-cookie";

const SignupInfo = () => {
  const userId = Cookies.get("userId") as string;
  const router = useRouter();
  const { toast } = useToast();
  const [signupInfo, { isLoading, error }] = useSignupInfoMutation();
  const [userData, setUserData] = useState({
    phoneNo: "",
    address: "",
  });

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

  const handleSignUpInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...userData,
      userId,
    };
    try {
      const response = await signupInfo(payload).unwrap();
      Cookies.remove("userId");
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
            alt="BinSaeed Logo"
            className="w-28 h-full object-cover"
          />
          <CardDescription>
            Fill this information to complete your registration
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3">
          <form onSubmit={handleSignUpInfo} className="grid gap-4">
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader /> : "Sign Up"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupInfo;
