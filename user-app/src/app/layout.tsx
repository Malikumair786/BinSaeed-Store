import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";

export const metadata: Metadata = {
  manifest: `${process.env.NEXT_PUBLIC_ASSET_URL}/manifest.json`,
  title: "BinSaeed Store",
  description: "Ecommerce Store application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"antialiased bg-background"}>
        <Providers>
          {children}
          <ToastProvider />
        </Providers>
      </body>
    </html>
  );
}
