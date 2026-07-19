"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { toast } from "react-toastify";
import { FiChevronDown, FiChevronUp, FiCalendar, FiPhone, FiMail, FiInbox } from "react-icons/fi";

function StatusDropdown({ currentStatus, queryId, isUpdating, onStatusChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const statuses = ["Pending", "Done", "Completed", "Resolved"];

  const statusStyles = {
    Pending: "bg-amber-950/40 text-amber-300 border-amber-500/30 hover:border-amber-500/60",
    Done: "bg-blue-950/40 text-blue-300 border-blue-500/30 hover:border-blue-500/60",
    Completed: "bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:border-emerald-500/60",
    Resolved: "bg-purple-950/40 text-purple-300 border-purple-500/30 hover:border-purple-500/60",
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = () => setIsOpen(false);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (!isUpdating) setIsOpen(!isOpen);
        }}
        disabled={isUpdating}
        className={`flex items-center gap-1.5 text-xs font-semibold rounded-full border px-3 py-1 bg-[#0f1429] outline-none transition-all duration-200 ${
          statusStyles[currentStatus]
        } disabled:opacity-50`}
      >
        <span>{currentStatus}</span>
        <FiChevronDown className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-32 rounded-md border border-[#353a52] bg-[#0f1429] shadow-2xl z-50 py-1 overflow-hidden">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => {
                onStatusChange(queryId, status);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors duration-150 ${
                status === currentStatus
                  ? "bg-[#16f2b3]/10 text-[#16f2b3]"
                  : "text-[#d3d8e8] hover:bg-[#1a223f] hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminQueries() {
  const [queries, setQueries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchQueries = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch("/api/admin/queries", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setQueries(data.queries);
      } else {
        toast.error(data.message || "Failed to load queries.");
      }
    } catch (err) {
      console.error("Queries error:", err);
      toast.error("Failed to load contact queries.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch("/api/admin/queries", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Status updated to ${newStatus}`);
        // Update status in local state
        setQueries((prev) =>
          prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
        );
      } else {
        toast.error(data.message || "Failed to update status.");
      }
    } catch (err) {
      console.error("Status update error:", err);
      toast.error("An error occurred while updating status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-[#16f2b3] border-[#353a52]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-white">Contact Enquiries</h2>
        <p className="text-sm text-[#d3d8e8] mt-1">
          Review and update the status of your website contact submissions.
        </p>
      </div>

      {queries.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-[#353a52] rounded-lg bg-[#101426]">
          <FiInbox className="text-5xl text-[#353a52] mb-3" />
          <p className="text-sm text-[#d3d8e8]">No contact submissions found in the database.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {queries.map((query) => {
            const isExpanded = expandedId === query.id;
            const isUpdating = updatingId === query.id;

            return (
              <div
                key={query.id}
                className={`border rounded-lg bg-[#101426] transition-all duration-300 ${
                  isExpanded ? "border-[#16f2b3]/60 shadow-lg" : "border-[#353a52] hover:border-[#464c6a]"
                }`}
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleExpand(query.id)}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 cursor-pointer gap-4"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-white text-base">{query.name}</h4>
                      <span className="text-xs text-[#d3d8e8]">({query.email})</span>
                    </div>
                    <p className="text-sm text-gray-300 font-medium truncate max-w-[300px] md:max-w-[450px]">
                      {query.subject}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 justify-between md:justify-end">
                    <span className="text-xs text-[#d3d8e8] flex items-center gap-1.5 whitespace-nowrap">
                      <FiCalendar />
                      {new Date(query.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    {/* Status Pill / Custom Dropdown */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <StatusDropdown
                        currentStatus={query.status}
                        queryId={query.id}
                        isUpdating={isUpdating}
                        onStatusChange={handleStatusChange}
                      />
                    </div>

                    <button className="text-[#16f2b3] p-1">
                      {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {/* Accordion Content */}
                {isExpanded && (
                  <div className="border-t border-[#353a52] p-5 bg-[#0b0e1c] space-y-4 rounded-b-lg">
                    {/* Meta info */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#d3d8e8]">
                      <span className="flex items-center gap-1.5">
                        <FiMail className="text-[#16f2b3]" />
                        Email: <a href={`mailto:${query.email}`} className="text-white hover:underline">{query.email}</a>
                      </span>
                      {query.phone && (
                        <span className="flex items-center gap-1.5">
                          <FiPhone className="text-[#16f2b3]" />
                          Phone: <a href={`tel:${query.phone}`} className="text-white hover:underline">{query.phone}</a>
                        </span>
                      )}
                    </div>

                    {/* Subject */}
                    <div>
                      <h5 className="text-xs font-semibold text-[#16f2b3] uppercase tracking-wider">Subject</h5>
                      <p className="text-sm font-medium text-white mt-1">{query.subject}</p>
                    </div>

                    {/* Message Body */}
                    <div>
                      <h5 className="text-xs font-semibold text-[#16f2b3] uppercase tracking-wider">Message</h5>
                      <div className="bg-[#101426] p-4 rounded border border-[#353a52] text-sm text-[#d3d8e8] leading-relaxed whitespace-pre-wrap mt-1">
                        {query.message}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
