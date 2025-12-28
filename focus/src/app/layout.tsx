import type { Metadata } from "next";
import { Manrope } from "next/font/google"; // Importação nativa e otimizada
import "./globals.css";

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
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        // Injetamos a variável da fonte e aplicamos as classes base
        className={`${fontSans.variable} font-sans antialiased bg-focus-base text-slate-200`}
      >
        {children}
      </body>
    </html>
  );
}