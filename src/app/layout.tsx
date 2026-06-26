import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "CareerOS AI — The Most Powerful AI Career Platform",
  description:
    "Create stunning resumes, optimize your LinkedIn, generate cover letters, and land your dream job with the power of AI. Trusted by 500K+ professionals worldwide.",
  keywords: [
    "AI resume builder",
    "LinkedIn optimizer",
    "cover letter generator",
    "AI interview coach",
    "job tracker",
    "career platform",
    "ATS resume",
    "job search",
  ],
  authors: [{ name: "CareerOS AI" }],
  creator: "CareerOS AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://careeros.ai",
    siteName: "CareerOS AI",
    title: "CareerOS AI — The Most Powerful AI Career Platform",
    description:
      "Create stunning resumes, optimize your LinkedIn, generate cover letters, and land your dream job with the power of AI.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CareerOS AI Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerOS AI — The Most Powerful AI Career Platform",
    description:
      "Create stunning resumes, optimize your LinkedIn, generate cover letters, and land your dream job with the power of AI.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-body bg-[#030712] text-[#f9fafb]">
        {children}
      </body>
    </html>
  );
}
