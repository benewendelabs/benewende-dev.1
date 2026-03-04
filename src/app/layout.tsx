import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CurrencyProvider } from "@/components/currency-provider";
import SessionProvider from "@/components/session-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://benewende.dev"),
  title: {
    default: "Benewende.dev | Développeur Full Stack & Créateur de SaaS",
    template: "%s | Benewende.dev",
  },
  description:
    "Développeur Full Stack expert en React, Next.js et architectures SaaS. Création d'applications web performantes et solutions IA. Basé à Ouagadougou, Burkina Faso.",
  keywords: [
    "développeur full stack",
    "SaaS",
    "Next.js",
    "React",
    "TypeScript",
    "Burkina Faso",
    "Ouagadougou",
    "freelance",
    "web developer",
    "IA",
  ],
  authors: [{ name: "Benewende" }],
  creator: "Benewende",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://benewende.dev",
    siteName: "Benewende.dev",
    title: "Benewende.dev | Développeur Full Stack & Créateur de SaaS",
    description:
      "Je transforme vos idées en produits digitaux performants. Expert React/Next.js, Node.js et architectures cloud.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Benewende.dev | Développeur Full Stack & Créateur de SaaS",
    description:
      "Je transforme vos idées en produits digitaux performants.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-[family-name:var(--font-geist-sans)]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <CurrencyProvider>{children}</CurrencyProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
