"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
import { FiLogOut, FiInbox, FiActivity } from "react-icons/fi";

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/login");
          return;
        }

        // Verify session validity and user's Admin role in the database
        const response = await fetch("/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (response.status === 401) {
          // Token invalid or role is not Admin
          await supabase.auth.signOut();
          router.push("/login");
          return;
        }

        setIsAuthenticated(true);
      } catch (err) {
        console.error("Auth check error:", err);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-[#16f2b3] border-[#10172d]"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <FiActivity className="text-lg" /> },
    { name: "Queries / Inbox", path: "/admin/queries", icon: <FiInbox className="text-lg" /> },
  ];

  return (
    <div className="flex flex-col min-h-[85vh] lg:flex-row gap-6 py-6">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 flex-shrink-0 bg-[#0f1429] border border-[#464c6a] rounded-lg p-5 flex flex-col justify-between">
        <div className="flex flex-col gap-6">
          <div className="border-b border-[#353a52] pb-4">
            <h3 className="text-xl font-bold text-white tracking-wider">
              ADMIN <span className="text-[#16f2b3]">PANEL</span>
            </h3>
          </div>
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-pink-500 to-violet-600 text-white shadow-lg"
                      : "text-[#d3d8e8] hover:bg-[#151c38] hover:text-white"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-[#353a52] pt-4 mt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-red-400 hover:bg-[#1a1224] hover:text-red-300 transition-all duration-200"
          >
            <FiLogOut className="text-lg" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-[#0f1429] border border-[#464c6a] rounded-lg p-6 shadow-xl overflow-hidden">
        {children}
      </main>
    </div>
  );
}
