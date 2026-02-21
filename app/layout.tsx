import type { Metadata } from "next";
import { Merriweather, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Import theme provider
import { ThemeProvider } from "next-themes";

// Import components
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

// Import clerk provider
import { ClerkProvider } from '@clerk/nextjs';
import { clerkAppearance } from '@/lib/clerk-theme';
import { esES } from '@clerk/localizations';
import SizeScreenHelper from '@/components/screensizehelper';
import { Toaster } from '@/components/ui/sonner';

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Form Creator",
  description: "Form Creator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={clerkAppearance}
      localization={esES}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${merriweather.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >

            {/* navbar */}
            <Navbar />

            {/* main */}
            <main className="flex-1 w-full flex mx-auto min-h-[calc(100vh-64px)] px-4 xl:px-0 max-w-7xl">
              {children}
            </main>

            {/* footer */}
            <Footer />

            {/* toast */}
            <Toaster
              position="top-center"
              expand={true}
            />

            {/* screen size helper */}
            <SizeScreenHelper />

          </ThemeProvider>
        </body>
      </html >
    </ClerkProvider>
  );
}
