import config from "@/config/config.json";
import TwSizeIndicator from "@/helpers/TwSizeIndicator";
import { auth } from "@/lib/auth";
import Footer from "@/partials/Footer";
import Header from "@/partials/Header";
import Providers from "@/partials/Providers";
import "@/styles/main.css";
import { Heebo, Signika } from "next/font/google";
import { Toaster } from "sonner";

const fontPrimary = Heebo({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-primary",
});

const fontSecondary = Signika({
  weight: ["500", "700"],
  subsets: ["latin"],
  variable: "--font-secondary",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html suppressHydrationWarning={true} lang="en">
      <head>
        {/* responsive meta */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />

        {/* favicon */}
        <link rel="shortcut icon" href={config.site.favicon} />
        {/* theme meta */}
        <meta name="theme-name" content="authplate" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#fff"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#000"
        />
      </head>

      <body
        suppressHydrationWarning={true}
        className={`${fontPrimary.variable} ${fontSecondary.variable}`}
      >
        <TwSizeIndicator />
        <Providers session={session}>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
