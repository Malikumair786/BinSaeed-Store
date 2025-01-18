"use client";
import React from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useEffect, useState } from "react";
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}
const Dashbooard = () => {
  const router = useRouter();

  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [promptDismissed, setPromptDismissed] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleUserClick = () => {
      if (deferredPrompt && !promptDismissed) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
          if (choiceResult.outcome === "accepted") {
            console.log("App installed");
          } else {
            console.log("App not installed");
            setPromptDismissed(true);
          }
          setDeferredPrompt(null);
        });
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    window.addEventListener("click", handleUserClick);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("click", handleUserClick);
    };
  }, [deferredPrompt, promptDismissed]);

  const handleLogout = () => {
    Cookies.remove("access_token");
    router.replace("/");
  };
  return (
    <>
      <div>Dashbooard</div>
      <Link href="/login" className="underline" onClick={handleLogout}>
        Logout
      </Link>
    </>
  );
};

export default Dashbooard;
