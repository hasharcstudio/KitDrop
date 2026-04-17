import { LucideIcon } from "lucide-react";

interface AdminCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  accent?: boolean;
}

export default function AdminCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accent,
}: AdminCardProps) {
  return (
    <div className="bg-surface border border-border p-5 rounded-lg hover:border-border-hover transition-colors group">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            accent
              ? "bg-accent/15 text-accent"
              : "bg-surface-high text-on-surface-variant"
          }`}
        >
          <Icon size={20} />
        </div>
        {trend && (
          <span
            className={`text-xs font-headline font-bold uppercase tracking-tight px-2 py-0.5 rounded ${
              trend.positive
                ? "bg-success/15 text-success"
                : "bg-error/15 text-error"
            }`}
          >
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
      <p className="text-2xl sm:text-3xl font-black font-headline tracking-tight">
        {value}
      </p>
      <p className="text-xs text-on-surface-variant uppercase tracking-widest font-headline mt-1">
        {title}
      </p>
      {subtitle && (
        <p className="text-[10px] text-on-surface-variant/60 mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}
