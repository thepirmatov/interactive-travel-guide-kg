import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import "maplibre-gl/dist/maplibre-gl.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Discover Kyrgyzstan — Interactive Travel Guide",
  description:
    "Explore the breathtaking landscapes of Kyrgyzstan. From the crystal waters of Issyk-Kul to the ancient Silk Road caravanserais. Plan your dream journey through Central Asia's hidden gem.",
  keywords: ["Kyrgyzstan", "travel", "tourism", "Issyk-Kul", "Tian Shan", "Silk Road", "Central Asia", "adventure"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} antialiased`} style={{ fontFamily: "var(--font-outfit)" }} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
