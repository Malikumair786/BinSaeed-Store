"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import BinSaeedLogo from "../../../icons/Bin_Saeed_logo.png";
import { useChangePasswordMutation } from "@/services/userApi";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Loader from "@/components/loader";
import { useToast } from "@/hooks/use-toast";
import { PasswordInput } from "@/components/PasswordInput";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDataLoading, setIsDataLoading] = useState(false);
  const { toast } = useToast();
  const [changePassword] = useChangePasswordMutation();
  const router = useRouter();

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (!validatePassword(newPassword)) {
      setErrorMessage(
        "Password must be at least 8 characters long, with one uppercase letter, one number, and one special character."
      );
      return;
    }
    setIsDataLoading(true);
    try {
      const response = await changePassword({
        oldPassword: oldPassword,
        newPassword,
        newPasswordConfirmation: confirmPassword,
      }).unwrap();
      toast({
        title: "Success",
        description: response.message,
        variant: "default",
      });
      router.replace("/dashboard");
    } catch (err: any) {
      console.log("Change password failed:", err);
      toast({
        title: "Error",
        description: err.data.message,
        variant: "destructive",
      });
    } finally {
      setIsDataLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-2">
      <Card className="w-full mx-5 sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <CardHeader className="flex flex-col items-center justify-center text-center">
          <Image
            priority
            src={BinSaeedLogo}
            alt="App logo"
            className="w-28 h-full object-cover"
          />
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="px-3">
          <form onSubmit={handleChangePassword} className="grid gap-4">
            <PasswordInput
              id="oldPassword"
              text="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <PasswordInput
              id="newPassword"
              text="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <PasswordInput
              id="confirmPassword"
              text="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}

            <Button
              type="submit"
              disabled={isDataLoading}
              className="mt-3 py-5"
            >
              {isDataLoading ? <Loader /> : "Change Password"}
            </Button>
          </form>
          <div className="mt-4 text-center text-md">
            <Link href="/dashboard" className="underline">
              Go back to home screen
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePassword;
