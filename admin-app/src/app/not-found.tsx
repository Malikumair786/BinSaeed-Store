"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/");
    }, 10000);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <h1 className="text-4xl font-bold text-primary">Page Not Found</h1>
      <p className="mt-4 text-lg text-foreground">
        Oops! The page you are looking for does not exist.
      </p>
      <button
        onClick={() => router.replace("/")}
        className="mt-6 px-4 py-2 text-white bg-primary rounded hover:bg-primary"
      >
        Go to Home
      </button>
    </div>
  );
}
