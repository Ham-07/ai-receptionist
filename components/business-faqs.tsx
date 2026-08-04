"use client";

import * as React from "react";
import { FAQ } from "@/lib/supabase/types";
import { HelpCircle, ChevronDown, Sparkles } from "lucide-react";

interface BusinessFaqsProps {
  faqs: FAQ[];
  primaryColor: string;
}

export function BusinessFaqs({ faqs, primaryColor }: BusinessFaqsProps) {
  const [openId, setOpenId] = React.useState<string | null>(
    faqs.length > 0 ? faqs[0].id : null
  );

  if (!faqs || faqs.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm text-center">
        <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-sm text-slate-500">No FAQs configured yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-2.5 rounded-xl text-white shadow-sm"
          style={{ backgroundColor: primaryColor }}
        >
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Frequently Asked Questions</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Dynamically queried from Supabase relational context
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="rounded-xl border border-slate-200/70 dark:border-slate-800/70 overflow-hidden transition-all bg-slate-50/50 dark:bg-slate-800/30"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left font-semibold text-sm hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 opacity-70 flex-shrink-0" style={{ color: primaryColor }} />
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/50 dark:border-slate-800/50">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
