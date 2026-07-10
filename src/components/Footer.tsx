"use client";

import { motion } from "framer-motion";
import { Sparkles, Share2, ExternalLink } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Resume Builder", href: "#resume" },
    { label: "LinkedIn Optimizer", href: "#linkedin" },
    { label: "Cover Letter", href: "#cover-letter" },
    { label: "Job Tracker", href: "#job-tracker" },
    { label: "Interview Coach", href: "#interview" },
  ],
  Resources: [
    { label: "Blog", href: "#blog" },
    { label: "Career Guides", href: "#guides" },
    { label: "Resume Templates", href: "#templates" },
    { label: "API Docs", href: "#api" },
    { label: "Community", href: "#community" },
  ],
  Company: [
    { label: "About Us", href: "#about" },
    { label: "Careers", href: "#careers" },
    { label: "Press", href: "#press" },
    { label: "Contact", href: "#contact" },
    { label: "Partners", href: "#partners" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms of Service", href: "#terms" },
    { label: "Cookie Policy", href: "#cookies" },
    { label: "GDPR", href: "#gdpr" },
  ],
};

const socialLinks = [
  { icon: Share2, href: "#", label: "Twitter" },
  { icon: ExternalLink, href: "#", label: "LinkedIn" },
  { icon: ExternalLink, href: "#", label: "GitHub" },
  { icon: ExternalLink, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="relative bg-black border-t border-white/[0.06]">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <motion.a
              href="/"
              className="flex items-center gap-2 mb-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8941E] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Career<span className="text-[#D4AF37]">OS</span>
              </span>
            </motion.a>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-6">
              Your career, supercharged by AI. Build resumes, optimize your LinkedIn, and land your dream job faster.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-200"
                  whileHover={{ y: -2 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-[#F6E27A] transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} CareerOS. All rights reserved.
          </p>
          <p className="text-sm text-gray-600">
            Made with <span className="text-red-400">♥</span> for job seekers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
