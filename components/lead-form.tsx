"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LeadSchema, LeadFormData } from "@/lib/validations/lead";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface LeadFormProps {
  businessId: string;
  businessName: string;
  primaryColor?: string;
}

export function LeadForm({
  businessId,
  businessName,
  primaryColor = "#6366f1",
}: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(LeadSchema),
    defaultValues: {
      business_id: businessId,
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to submit message");
      }

      setIsSuccess(true);
      reset({
        business_id: businessId,
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setServerError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-6 text-center space-y-4 animate-fade-in">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
          Message Sent!
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
          Thank you for reaching out to <strong>{businessName}</strong>. Our team will review your inquiry and contact you shortly.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
      <input type="hidden" {...register("business_id")} />

      {serverError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Jane Doe"
          {...register("name")}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          placeholder="jane@example.com"
          {...register("email")}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <input
          type="tel"
          placeholder="+1 (555) 019-2834"
          {...register("phone")}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
        />
        {errors.phone && (
          <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          How can we help? <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="Describe your inquiry or scheduling request..."
          {...register("message")}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400 resize-none"
        />
        {errors.message && (
          <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 rounded-xl font-semibold text-sm text-white shadow-md flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-50"
        style={{ backgroundColor: primaryColor }}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Submit Inquiry</span>
          </>
        )}
      </button>
    </form>
  );
}
