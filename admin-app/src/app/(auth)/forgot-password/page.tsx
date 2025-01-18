"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

import BinSaeedLogo from "../../../icons/Bin_Saeed_logo.png";
import { useToast } from "@/hooks/use-toast";
import { useForgotPasswordMutation } from "@/services/authApi";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ForgotPassword = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();

  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(email).unwrap();
      const encodedEmail = encodeURIComponent(email);
      const text = encodeURIComponent(
        "Just click on the link in that email to reset your password."
      );
      router.push(`/verification?email=${encodedEmail}&text=${text}`);
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err?.data?.message || err.message || "Unable to send reset link",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full mx-5 sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <CardHeader className="flex flex-col items-center justify-center text-center">
          <Image
            priority
            src={BinSaeedLogo}
            alt="Google"
            className="w-28 h-full object-cover"
          />
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email below to receive a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader /> : "Send Reset Link"}
            </Button>
          </form>
          <div className="mt-4 text-center text-md">
            Remember your password?{" "}
            <Link href="/" className="underline">
              Go back to login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
