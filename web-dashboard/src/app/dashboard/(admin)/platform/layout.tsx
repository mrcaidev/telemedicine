import Navbar from "@/components/nav/navbar";
import type { Metadata } from "next";
import ProtectedRoute from "@/components/auth/protected-route";
import Sidebar from "@/components/nav/platform-sidebar";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar />
        </div>

        <div className="flex flex-1 pt-16">
          <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-56 border-r bg-white z-40">
            <Sidebar />
          </div>

          <main className="ml-56 flex-1 p-6 bg-gray-50 overflow-y-auto h-[calc(100vh-4rem)]">
            {children}
          </main>
        </div>
      </div>
      </ProtectedRoute>
    </>
  );
}