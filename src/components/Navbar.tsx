"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Send, Mail, Globe, Play, MessageCircle, User, LogIn, MessageSquare, HelpCircle, CreditCard, LifeBuoy, type LucideIcon } from "lucide-react";

interface NavPage {
  title: string;
  slug: string;
}

interface SocialLink {
  platform: string;
  url: string;
  enabled: boolean;
}

const PLATFORM_ICONS: Record<string, LucideIcon> = {
  telegram: Send,
  email: Mail,
  twitter: Globe,
  facebook: Globe,
  instagram: Globe,
  youtube: Play,
  discord: MessageCircle,
  whatsapp: MessageCircle,
};

const staticLinks = [
  { label: "HOME", href: "/" },
  { label: "CHAT SERVERS", href: "/pricing" },
  { label: "FEATURES", href: "/#features" },
  { label: "CONTACT", href: "/contact" },
];

const topBarLinks = [
  { label: "Help Center", href: "/contact", icon: HelpCircle },
  { label: "Order Lookup", href: "/order-lookup", icon: LifeBuoy },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmsPages, setCmsPages] = useState<NavPage[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [customerName, setCustomerName] = useState<string | null>(null);

  useEffect(() => {
    const check = () => setCustomerName(localStorage.getItem("customer_name"));
    check();
    window.addEventListener("customer-auth-change", check);
    window.addEventListener("storage", check);
    return () => {
      window.removeEventListener("customer-auth-change", check);
      window.removeEventListener("storage", check);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("/api/pages/nav")
      .then((res) => res.json())
      .then((data) => setCmsPages(data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.socialLinks)) {
          setSocialLinks(data.socialLinks.filter((sl: SocialLink) => sl.enabled && sl.url));
        }
      })
      .catch(() => {});
  }, []);

  const allLinks = [
    ...staticLinks,
    ...cmsPages.map((p) => ({ label: p.title.toUpperCase(), href: `/page/${p.slug}` })),
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "shadow-lg" : ""}`}>
      {/* ── Top Utility Bar ── */}
      <div className="bg-gradient-to-r from-[#0ea5e9] to-[#10b981]">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex h-8 items-center justify-between text-[11px]">
            <div className="flex items-center gap-4">
              {topBarLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors uppercase tracking-wider font-medium"
                >
                  <link.icon className="h-3 w-3" />
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-3">
              {socialLinks.slice(0, 4).map((link) => {
                const Icon = PLATFORM_ICONS[link.platform] || Send;
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    {...(!link.url.startsWith("mailto:") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="text-white/70 hover:text-white transition-colors"
                    aria-label={link.platform}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                );
              })}
              {customerName ? (
                <Link href="/account" className="flex items-center gap-1.5 text-white font-semibold ml-2">
                  <User className="h-3 w-3" />
                  {customerName.split(" ")[0]}
                </Link>
              ) : (
                <Link href="/login" className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors ml-2">
                  <LogIn className="h-3 w-3" />
                  SIGN IN
                </Link>
              )}
              {customerName ? (
                <Link href="/account" className="ml-1 px-3 py-0.5 bg-white text-[#0ea5e9] rounded text-[10px] font-bold uppercase tracking-wider hover:bg-white/90 transition-colors">
                  Dashboard
                </Link>
              ) : (
                <Link href="/register" className="ml-1 px-3 py-0.5 bg-white text-[#0ea5e9] rounded text-[10px] font-bold uppercase tracking-wider hover:bg-white/90 transition-colors">
                  Register
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Navigation ── */}
      <div className={`bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300 ${scrolled ? "shadow-sm" : ""}`}>
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#10b981] text-white shadow-md shadow-[#0ea5e9]/20">
                <MessageSquare className="h-4.5 w-4.5" />
              </span>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-bold text-gray-800 tracking-tight">
                  Chat<span className="text-[#0ea5e9]">Server</span>
                </span>
                <span className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-medium">.tr</span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-0.5">
              {allLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-[13px] font-semibold text-gray-500 hover:text-[#0ea5e9] tracking-wider transition-colors group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#0ea5e9] to-[#10b981] group-hover:w-3/4 transition-all duration-300 rounded-full" />
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/pricing"
                className="px-6 py-2.5 bg-gradient-to-r from-[#0ea5e9] to-[#10b981] text-white text-xs font-bold rounded-xl uppercase tracking-wider hover:shadow-lg hover:shadow-[#0ea5e9]/20 transition-all hover:-translate-y-0.5"
              >
                Order Now
              </Link>
            </div>

            <button
              className="lg:hidden text-gray-500 hover:text-[#0ea5e9] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 shadow-lg">
          <div className="px-5 py-4 space-y-1">
            {allLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-gray-600 font-semibold hover:text-[#0ea5e9] py-2.5 px-3 rounded-lg hover:bg-[#0ea5e9]/5 tracking-wider transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 mt-3 flex flex-col gap-2">
              {customerName ? (
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-sm text-[#0ea5e9] font-semibold py-2 px-3"
                >
                  <User className="h-4 w-4" />
                  My Account
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-sm text-gray-500 font-semibold py-2 px-3"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Link>
              )}
              <Link
                href="/pricing"
                onClick={() => setMobileOpen(false)}
                className="text-center py-2.5 px-5 bg-gradient-to-r from-[#0ea5e9] to-[#10b981] text-white text-xs font-bold rounded-xl uppercase tracking-wider"
              >
                Order Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
