"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: any;
  }[];
  className?: string;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      <div>
        <div
          className={cn(
            "flex max-w-full static inset-x-0 mx-auto bg-background z-[10] px-2 items-center justify-between",
            className
          )}
        >
          <div className="pl-2">
            <button onClick={toggleSidebar}>
              <Menu size={32} color="brown" />
            </button>
          </div>
          {navItems.map((navItem: any, idx: number) => (
            <Link
              key={`link=${idx}`}
              href={navItem.link}
              className={cn("relative  items-center flex space-x-1")}
            >
              <span className="block">{navItem.icon}</span>
              {/* <span className="hidden sm:block text-sm">{navItem.name}</span> */}
            </Link>
          ))}
        </div>
      </div>
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
    </>
  );
};

export default FloatingNav;
