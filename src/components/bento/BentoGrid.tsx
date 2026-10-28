import type { ReactNode } from "react";

export function BentoGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-4 md:grid-cols-6 lg:auto-rows-[minmax(14rem,auto)] lg:grid-cols-12">
      {children}
    </div>
  );
}
