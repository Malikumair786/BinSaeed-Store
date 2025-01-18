"use client";

import AvatarMenu from "@/components/AvatarMenu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full h-screen">
      <div className="flex-grow w-auto">
        <header className="flex justify-between h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6">
          <div></div>
          <AvatarMenu />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-2 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
