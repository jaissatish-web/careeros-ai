import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cover Letter Generator | CareerOS AI",
  description:
    "Generate AI-powered cover letters tailored to any job description. Customize tone, length, and export in seconds.",
};

export default function CoverLetterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-space-black-950 text-white font-body">
      {children}
    </div>
  );
}
