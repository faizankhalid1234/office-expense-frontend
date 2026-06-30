import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, description, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        <h2 className="text-base font-bold text-foreground sm:text-lg md:text-xl">{title}</h2>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground sm:mt-1 sm:text-sm md:text-base">{description}</p>
        )}
      </div>
      {action && <div className="w-full shrink-0 sm:w-auto">{action}</div>}
    </div>
  );
}
