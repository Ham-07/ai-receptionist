import Link from "next/link";
import { Bot, Home, AlertCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Header */}
      <header className="w-full border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl bg-white/70 dark:bg-slate-950/70">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              AI Receptionist Platform
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main 404 Card */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="p-4 rounded-3xl bg-amber-500/10 text-amber-500 mb-6 ring-8 ring-amber-500/5">
          <AlertCircle className="w-12 h-12" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Route Not Found or Reserved
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mb-8">
          The requested URL path is either a reserved system segment or does not belong to a valid business tenant.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        AI Receptionist Platform — Reserved Route Safety System
      </footer>
    </div>
  );
}
