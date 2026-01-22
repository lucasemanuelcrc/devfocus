import type { Metadata } from "next";
import { Manrope } from "next/font/google"; // Importação nativa e otimizada
import "./globals.css";
import DesktopTitlebar from "@/components/DesktopTitlebar";

// Configuração da fonte Manrope
const fontSans = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800"], // Pesos para números finos e títulos fortes
  variable: "--font-sans", // Variável CSS para o Tailwind usar
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
  const isElectron = process.env.NEXT_PUBLIC_RUNTIME === "electron";

  return (
    <html
      lang="pt-BR"
      className={isElectron ? "electron" : ""}
      suppressHydrationWarning
    >
      <body
        // Injetamos a variável da fonte e aplicamos as classes base
        className={`${fontSans.variable} font-sans antialiased bg-focus-base text-slate-200`}
        suppressHydrationWarning
      >
        <DesktopTitlebar enabled={isElectron} />
        {children}
      </body>
    </html>
  );
}