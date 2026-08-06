"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lead, LeadStatus } from "@/lib/supabase/types";
import {
  Search,
  Inbox,
  CheckCircle2,
  LogOut,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface DashboardLeadsProps {
  businessName: string;
}

const STATUS_OPTIONS: Array<{ value: "all" | LeadStatus; label: string }> = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  contacted: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  closed: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
};

function formatDate(date: string) {
  return new Date(date).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DashboardLeads({ businessName }: DashboardLeadsProps) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<"all" | LeadStatus>("all");
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const fetchLeads = React.useCallback(async (query: string, filter: "all" | LeadStatus) => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    if (filter !== "all") params.set("status", filter);

    try {
      const res = await fetch(`/api/dashboard/leads?${params.toString()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load leads");
      setLeads((json.leads as Lead[]) ?? []);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load leads";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => fetchLeads(search, status), 250);
    return () => clearTimeout(timer);
  }, [search, status, fetchLeads]);

  const handleMarkContacted = async (leadId: string) => {
    setUpdatingId(leadId);
    setError(null);
    try {
      const res = await fetch(`/api/dashboard/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "contacted" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update lead");
      setLeads((prev) =>
        prev.map((lead) => (lead.id === leadId ? { ...lead, status: "contacted" } : lead))
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update lead";
      setError(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  const counts = React.useMemo(() => {
    const newCount = leads.filter((l) => l.status === "new").length;
    const contactedCount = leads.filter((l) => l.status === "contacted").length;
    return { newCount, contactedCount };
  }, [leads]);

  return (
    <div className="space-y-6">
      {/* Dashboard Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Leads for {businessName}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Every query below is filtered server-side to this business only.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Leads
          </p>
          <p className="text-3xl font-extrabold mt-1">{leads.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            New
          </p>
          <p className="text-3xl font-extrabold mt-1 text-emerald-600 dark:text-emerald-400">
            {counts.newCount}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Contacted
          </p>
          <p className="text-3xl font-extrabold mt-1 text-indigo-600 dark:text-indigo-400">
            {counts.contactedCount}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 w-fit">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setStatus(option.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                status === option.value
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Leads list */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-20 text-slate-500 dark:text-slate-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading leads...
        </div>
      ) : leads.length === 0 ? (
        <div className="p-10 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-500/10 text-slate-500 flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-6 h-6" />
          </div>
          <p className="font-bold text-slate-900 dark:text-slate-100">
            No leads found
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {search || status !== "all"
              ? "Try adjusting your search or status filter."
              : "Leads submitted through the chat widget will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-slate-900 dark:text-slate-100">
                      {lead.name}
                    </p>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize border ${STATUS_STYLES[lead.status]}`}
                    >
                      {lead.status}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-col gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{lead.email}</span>
                    </div>
                    {lead.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span>{lead.phone}</span>
                      </div>
                    )}
                    {lead.message && (
                      <div className="flex items-start gap-2 mt-1">
                        <MessageSquare className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          {lead.message}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(lead.created_at)}
                    </div>
                  </div>
                </div>

                {lead.status === "new" && (
                  <button
                    onClick={() => handleMarkContacted(lead.id)}
                    disabled={updatingId === lead.id}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors disabled:opacity-50 shrink-0"
                  >
                    {updatingId === lead.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    Mark Contacted
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
