"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { FiMail, FiCheckCircle, FiClock, FiList } from "react-icons/fi";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalContacts: 0,
    pendingContacts: 0,
    resolvedContacts: 0,
    recentContacts: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const response = await fetch("/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load statistics.");
        }

        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
        } else {
          throw new Error(data.message || "Failed to load statistics.");
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-[#16f2b3] border-[#353a52]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-950/30 border border-red-500/50 p-6 text-center text-red-200">
        <p className="font-semibold">Error Loading Stats</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  const statCards = [
    {
      name: "Total Queries",
      value: stats.totalContacts,
      icon: <FiMail className="text-pink-500 text-3xl" />,
      color: "border-pink-500/30 bg-pink-500/5",
    },
    {
      name: "Pending Queries",
      value: stats.pendingContacts,
      icon: <FiClock className="text-amber-500 text-3xl" />,
      color: "border-amber-500/30 bg-amber-500/5",
    },
    {
      name: "Resolved Queries",
      value: stats.resolvedContacts,
      icon: <FiCheckCircle className="text-emerald-500 text-3xl" />,
      color: "border-emerald-500/30 bg-emerald-500/5",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
        <p className="text-sm text-[#d3d8e8] mt-1">
          Real-time metrics and summary of visitor submissions.
        </p>
      </div>

      {/* Grid of Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <div
            key={card.name}
            className={`flex items-center justify-between border rounded-lg p-6 shadow-md transition-all duration-300 hover:scale-[1.02] ${card.color}`}
          >
            <div>
              <p className="text-sm font-medium text-[#d3d8e8]">{card.name}</p>
              <h4 className="text-3xl font-extrabold text-white mt-2">{card.value}</h4>
            </div>
            {card.icon}
          </div>
        ))}
      </div>

      {/* Recent Activity Table */}
      <div className="border border-[#353a52] rounded-lg bg-[#101426] overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#353a52] px-6 py-4 bg-[#0a0d1a]">
          <div className="flex items-center gap-2">
            <FiList className="text-[#16f2b3]" />
            <h3 className="font-bold text-white text-base">Recent Enquiries</h3>
          </div>
          <Link
            href="/admin/queries"
            className="text-xs text-[#16f2b3] hover:underline font-semibold"
          >
            View All Enquiries
          </Link>
        </div>

        {stats.recentContacts.length === 0 ? (
          <div className="p-8 text-center text-[#d3d8e8] text-sm">
            No submissions found yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#d3d8e8] border-collapse">
              <thead className="bg-[#0f1224] text-[#16f2b3] font-semibold border-b border-[#353a52]">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Subject</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e233a]">
                {stats.recentContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-[#141a35] transition-colors duration-150">
                    <td className="px-6 py-4 font-medium text-white">{contact.name}</td>
                    <td className="px-6 py-4">{contact.email}</td>
                    <td className="px-6 py-4 truncate max-w-[200px]">{contact.subject}</td>
                    <td className="px-6 py-4">
                      {new Date(contact.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          contact.status === "Pending"
                            ? "bg-amber-950/40 text-amber-300 border border-amber-500/30"
                            : "bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {contact.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
