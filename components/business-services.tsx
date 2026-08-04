import { Service } from "@/lib/supabase/types";
import { Briefcase, Sparkles } from "lucide-react";

interface BusinessServicesProps {
  services: Service[];
  primaryColor: string;
}

export function BusinessServices({ services, primaryColor }: BusinessServicesProps) {
  if (!services || services.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm text-center">
        <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-sm text-slate-500">No services configured yet.</p>
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
          <Briefcase className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Our Services</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Dynamically queried from Supabase relational context
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/50 dark:bg-slate-800/30 transition-colors hover:bg-slate-100/60 dark:hover:bg-slate-800/50"
          >
            <div className="flex items-start gap-2 mb-2">
              <Sparkles
                className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-70"
                style={{ color: primaryColor }}
              />
              <h4 className="font-semibold text-sm">{service.name}</h4>
            </div>
            {service.description && (
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                {service.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
