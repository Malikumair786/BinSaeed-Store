"use client";
import React from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Dashbooard = () => {
  const router = useRouter();

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
