import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Tracker — CareerOS AI",
  description:
    "Track every job application, manage your pipeline, schedule interviews, and land your dream job with CareerOS AI's powerful job tracker.",
};

export default function JobTrackerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#030712] text-[#f9fafb]">
      {children}
    </div>
  );
}
