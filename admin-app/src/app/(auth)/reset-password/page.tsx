"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

import BinSaeedLogo from "../../../icons/Bin_Saeed_logo.png";
import {
  useValidateResetPasswordLinkMutation,
  useResetPasswordMutation,
} from "@/services/authApi";
import { PasswordInput } from "@/components/PasswordInput";
import Loader from "@/components/loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [
    validateResetPasswordLink,
    { isLoading: validating, error: validationError },
  ] = useValidateResetPasswordLinkMutation();
  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();

  const code = searchParams.get("code");
  const key = searchParams.get("key");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLinkValid, setIsLinkValid] = useState<boolean | null>(null);

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  useEffect(() => {
    if (code && key) {
      const validateLink = async () => {
        try {
          const response = await validateResetPasswordLink({
            token: code,
            key,
          });
          setIsLinkValid(response.data?.success ?? false);
        } catch (err) {
          setIsLinkValid(false);
        }
      };
      validateLink();
    }
  }, [code, key]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (!validatePassword(password)) {
      setErrorMessage(
        "Password must be at least 8 characters long, with one uppercase letter, one number, and one special character."
      );
      return;
    }
    if (password && code && key) {
      try {
        await resetPassword({
          password,
          token: code,
          key,
        }).unwrap();
        toast({
          title: "Success",
          description: "Password changed successfully",
          variant: "default",
        });
        router.replace("/");
      } catch (error) {
        setErrorMessage("Failed to reset password. Please try again.");
      }
    } else {
      setErrorMessage("Password reset failed due to missing information.");
    }
  };

  if (validating) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl">
        <p>Validating link...</p>
      </div>
    );
  }

  if (!isLinkValid) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl">
        <p>Link is Invalid</p>
      </div>
    );
  }

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
          <CardTitle>Reset Password</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="grid gap-4">
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader /> : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
