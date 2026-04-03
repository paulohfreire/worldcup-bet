import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "World Cup Betting Pool",
  description: "Aposta com seus amigos nos jogos da Copa do Mundo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
