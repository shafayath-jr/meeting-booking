import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full rounded-lg border px-3 py-2 text-base transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        // Glass-friendly styling
        "border-black/10 bg-white/50 dark:border-white/10 dark:bg-white/5",
        "backdrop-blur-sm",
        "shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]",
        "hover:bg-white/70 dark:hover:bg-white/10",
        "focus-visible:border-primary/50 focus-visible:ring-primary/20 focus-visible:bg-white/80 focus-visible:ring-2 dark:focus-visible:bg-white/10",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
