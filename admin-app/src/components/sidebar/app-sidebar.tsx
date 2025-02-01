"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { House, ShoppingBag, Store } from "lucide-react";

import {
  Sidebar,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import BinSaeedLogo from "../../icons/Bin_Saeed_logo.png";
import Image from "next/image";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

const data = {
  icon: {
    name: "BinSaeed",
    logo: BinSaeedLogo,
  },
  sidebarMenus: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: House,
    },
    {
      name: "Categories",
      url: "/categories",
      icon: Store,
    },
    {
      name: "Products",
      url: "/products",
      icon: ShoppingBag,
    },
    {
      name: "Deals",
      url: "/deals",
      icon: ShoppingBag,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();

  const pathname = usePathname();

  const isActive = (url: string) => pathname === url;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground mt-1"
        >
          <div className="flex size-12 items-center justify-center">
            <Image alt="BinSaeed Logo" src={data.icon.logo} />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-primary text-xl">
              {data.icon.name}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarGroup>
        <SidebarMenu>
          {data.sidebarMenus.map((item) => (
            <SidebarMenuItem className="my-1" key={item.name}>
              <Link
                href={item.url}
                passHref
                onClick={() => {
                  if (isMobile) {
                    toggleSidebar();
                  }
                }}
              >
                <SidebarMenuButton
                  tooltip={item.name}
                  className={`${
                    isActive(item.url)
                      ? "bg-primary text-button pointer-events-none"
                      : "hover:bg-hover hover:text-hovered"
                  } flex items-center gap-2 text-lg`}
                >
                  {item.icon && (
                    <item.icon
                      size={20}
                      color={
                        isActive(item.url)
                          ? "hsl(var(--button))"
                          : "hsl(var(--primary))"
                      }
                    />
                  )}
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      <SidebarRail />
    </Sidebar>
  );
}
