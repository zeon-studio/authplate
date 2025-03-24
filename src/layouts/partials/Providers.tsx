"use client";

import config from "@/config/config.json";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

const Providers = ({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) => {
  const { default_theme } = config.settings;

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={default_theme}
      enableColorScheme={false}
    >
      <SessionProvider key={JSON.stringify(session, null, 2)} session={session}>
        {children}
      </SessionProvider>
    </ThemeProvider>
  );
};

export default Providers;
