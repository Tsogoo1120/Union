import * as React from "react";

import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      id="main-content"
      className={cn(
        "mx-auto w-full max-w-6xl overflow-x-clip px-4 py-16 sm:px-6 md:py-24 lg:px-8 lg:py-32",
        className
      )}
    >
      {children}
    </main>
  );
}

