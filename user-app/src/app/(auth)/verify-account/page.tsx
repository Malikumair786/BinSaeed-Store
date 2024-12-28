"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyAccountEmailMutation } from "@/services/authApi";
import Cookies from "js-cookie";

const VerifyAccount = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const key = searchParams.get("key");

  const [verifyAccountEmail, { data, error, isLoading }] =
    useVerifyAccountEmailMutation();

  useEffect(() => {
    if (code && key) {
      verifyAccountEmail({ token: code as string, key: key as string })
        .unwrap()
        .then((response) => {
          if (response.success) {
            Cookies.set("access_token", response.data.access_token);
            router.replace("/dashboard");
          } else {
            console.error("Link is invalid");
          }
        })
        .catch((err: any) => {
          console.error("Error verifying account", err);
        });
    }
  }, [code, key, verifyAccountEmail, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl">
        Loading...
      </div>
    );
  }

  if (error || (data && !data.success)) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl">
        Link is Invalid
      </div>
    );
  }

  return (
    <div>
      {data && data.success && (
        <div className="flex justify-center items-center h-screen text-2xl">
          Account verified! Redirecting...
        </div>
      )}
    </div>
  );
};

export default VerifyAccount;
