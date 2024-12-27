"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import { Card } from "@/components/ui/card";

const Verification = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const text = searchParams.get("text");

  useEffect(() => {
    if (!email) {
      router.replace("/");
    }
  }, [email]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="p-6 text-center">
        <div className="flex justify-center mb-4">
          <Mail className="mb-4 h-1/6 w-1/6" />
        </div>
        <h2 className="text-2xl font-semibold mb-4">You're almost there!</h2>
        <p className="text-foreground mb-2">We sent an email to</p>
        <p className="font-semibold text-primary mb-4">{email}</p>
        <p className="text-sm text-foreground">
          {text || "Please check your inbox to verify your email address."}
        </p>
      </Card>
    </div>
  );
};

export default Verification;
