import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Container } from "@/components/Container";
import { ReceiptProvider } from "@/context/ReceiptContext";

export const metadata: Metadata = {
  title: "Bill Splitter",
  description: "Split bills easily with friends",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReceiptProvider>
          <Container>{children}</Container>
        </ReceiptProvider>
      </body>
    </html>
  );
}
