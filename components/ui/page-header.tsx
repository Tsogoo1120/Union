import * as React from "react";

import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="min-w-0">
        <h1 className="font-display text-3xl font-medium tracking-tight text-foreground md:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground md:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex w-full shrink-0 flex-wrap items-center gap-3 sm:w-auto">{actions}</div> : null}
    </header>
  );
}

