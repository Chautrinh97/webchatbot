import type { Metadata } from "next";
import {
  Inter,
} from "next/font/google";
import "./global.css";
import ToastProvider from "./providers/ToastProvider";
import { NextUI } from "./providers/NextUIProvider";
import { ThemeProvider } from "./providers/ThemeProvider";

const inter = Inter({
  subsets: ["vietnamese"],
  weight: "500",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Chatbot",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <meta
          name="viewport"
          content="height=device-height, width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="/icon.jpg"
          sizes='any'>
        </link>
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <ToastProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <NextUI>
              {children}
            </NextUI>
          </ThemeProvider>  
        </ToastProvider>
      </body>
    </html>
  );
}
