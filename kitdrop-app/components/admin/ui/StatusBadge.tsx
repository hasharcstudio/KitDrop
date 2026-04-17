interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const statusConfig: Record<string, { bg: string; text: string }> = {
  Pending: { bg: "bg-yellow-500/15", text: "text-yellow-400" },
  Processing: { bg: "bg-blue-500/15", text: "text-blue-400" },
  Shipped: { bg: "bg-purple-500/15", text: "text-purple-400" },
  Delivered: { bg: "bg-success/15", text: "text-success" },
  Refunded: { bg: "bg-error/15", text: "text-error" },
  Active: { bg: "bg-success/15", text: "text-success" },
  Inactive: { bg: "bg-error/15", text: "text-error" },
  Draft: { bg: "bg-orange-500/15", text: "text-orange-400" },
  Published: { bg: "bg-success/15", text: "text-success" },
  "Low Stock": { bg: "bg-orange-500/15", text: "text-orange-400" },
  "In Stock": { bg: "bg-success/15", text: "text-success" },
  "Out of Stock": { bg: "bg-error/15", text: "text-error" },
};

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    bg: "bg-surface-high",
    text: "text-on-surface-variant",
  };

  return (
    <span
      className={`inline-flex items-center font-headline font-bold uppercase tracking-widest rounded-sm ${config.bg} ${config.text} ${
        size === "sm"
          ? "text-[10px] px-2 py-0.5"
          : "text-xs px-2.5 py-1"
      }`}
    >
      {status}
    </span>
  );
}
