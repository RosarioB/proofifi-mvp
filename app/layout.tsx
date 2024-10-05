import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const raleway = Raleway({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Proofifi",
  description: "Create NFT labels for your second hand items.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${raleway.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
