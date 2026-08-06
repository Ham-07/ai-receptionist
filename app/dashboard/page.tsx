import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getDashboardAccount } from "@/lib/dashboard";
import { DashboardLeads } from "@/components/dashboard-leads";
import { ThemeToggle } from "@/components/theme-toggle";
import { Bot, AlertCircle, ArrowLeft } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Unauthenticated visits must never see any data — redirect to login.
  if (!user) {
    redirect("/auth/login");
  }

  // business_id is resolved server-side from dashboard_users, never from a URL
  // param or request body.
  const account = await getDashboardAccount(user.id);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors shrink-0"
              title="Return to Platform Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-base sm:text-lg tracking-tight truncate">
                  Business Dashboard
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {account ? account.businessName : "Account not linked"}
                </p>
              </div>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-6 pt-10 pb-24 w-full">
        {!account ? (
          /* Authenticated but not linked to any business yet */
          <div className="max-w-xl mx-auto mt-16 p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4 ring-8 ring-amber-500/5">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight mb-2">
              Account Not Linked to a Business
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Your login is valid, but this account has not been associated with
              any business yet. Contact your platform administrator to link this
              account to a business in the <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">dashboard_users</code> table.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Switch Account
            </Link>
          </div>
        ) : (
          <DashboardLeads businessName={account.businessName || "Your Business"} />
        )}
      </main>
    </div>
  );
}
