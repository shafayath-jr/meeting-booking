"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "@/components/ui/sonner";

type Props = {
  children: ReactNode;
};

function Providers({ children }: Props) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div>{children}</div>
        <Toaster richColors />
      </ThemeProvider>
    </>
  );
}

export default Providers;
