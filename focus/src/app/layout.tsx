import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
// Importar o Provider
import { TooltipProvider } from "@/components/ui/Tooltip";

const fontSans = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FOCUS",
  description: "Productivity Timer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} font-sans antialiased bg-focus-base text-slate-200`}
      >
        {/* Envolver a aplicação aqui */}
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}