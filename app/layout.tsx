import type { Metadata, Viewport } from "next";
import "./globals.css";
import metadataJson from "../metadata.json";

export const metadata: Metadata = {
  title: metadataJson.name,
  description: metadataJson.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
