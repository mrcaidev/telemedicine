import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/auth/providers";
export const metadata: Metadata = {
  title: "Telemedicine",
  description: "Telemedicine platform for doctors and patients",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
