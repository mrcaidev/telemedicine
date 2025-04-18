import Navbar from "@/components/nav/Navbar";
import DoctorSidebar from "@/components/nav/DoctorSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1">
          <DoctorSidebar />
          <main className="flex-1 p-6 bg-gray-50">{children}</main>
        </div>
      </div>
    </>
  );
}
