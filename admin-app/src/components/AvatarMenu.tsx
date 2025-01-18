"use client";
import { useRouter } from "next/navigation";

import Loader from "./loader";
import { useMeQuery } from "@/services/userApi";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import Cookies from "js-cookie";
import { LogOut, KeyRound } from "lucide-react";

const AvatarMenu = () => {
  const { data, error, isLoading } = useMeQuery();
  const router = useRouter();

  if (isLoading) {
    return <Loader />;
  }

  const username = data?.data?.username || "Your Name";
  const email = data?.data?.email || "email@gmail.com";
  const nameParts = username.split(" ");
  const firstInitial = nameParts[0] ? nameParts[0].charAt(0) : "";
  const lastInitial = nameParts[1] ? nameParts[1].charAt(0) : "";

  const handleSignOut = () => {
    Cookies.remove("access_token");
    router.push("/login");
  };

  if (error) {
    return <>Error loading data</>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center rounded-full focus:ring-4 focus:ring-gray-300">
          <Avatar className="cursor-pointer bg-primary">
            <AvatarFallback className="text-button bg-primary">
              {(firstInitial + lastInitial).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto">
        <div className="px-3 py-3 text-md font-bold text-gray text-center">
          <div>{username}</div>
          <div className="font-medium">{email}</div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-md"
          onClick={() => router.push("/change-password")}
        >
          <KeyRound className="mr-2 h-4 w-4" />
          Change Password
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-md" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarMenu;
