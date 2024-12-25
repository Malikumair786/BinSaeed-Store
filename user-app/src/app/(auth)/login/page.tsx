"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import BinSaeedLogo from "../../../icons/Bin_Saeed_logo.png";
import { useLoginMutation } from "@/services/authApi";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import SocialAuthButtons from "@/components/socialAuth";
import { PasswordInput } from "@/components/PasswordInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "@/components/loader";

import Cookies from "js-cookie";

const Login = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [login, { isLoading, error }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({ email, password }).unwrap();

      if (response.status === "0103") {
        const emailEncoded = encodeURIComponent(email);
        const textEncoded = encodeURIComponent(
          "Please check your inbox to verify your email first"
        );
        router.push(`/verify-email?email=${emailEncoded}&text=${textEncoded}`);
        return;
      }

      Cookies.set("access_token", response.data.access_token, {
        expires: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000),
      });
      router.replace("/dashboard");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.data?.message || "Unable to login",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen py-2">
      <Card className="w-full mx-5 sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <CardHeader className="flex flex-col items-center justify-center text-center">
          <Image
            priority
            src={BinSaeedLogo}
            alt="Google"
            className="w-28 h-full object-cover"
          />
          <CardTitle>Welcome to Bin Saeed</CardTitle>
        </CardHeader>
        <CardContent className="px-3">
          <form onSubmit={handleLogin} className="grid gap-4">
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
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-center item-center">
              <Link
                href="/forgot-password"
                className="inline-block text-md underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader /> : "Login"}
            </Button>
            <SocialAuthButtons />
            <div className="text-center text-md">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
