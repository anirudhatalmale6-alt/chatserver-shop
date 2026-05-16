"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Send, Mail, Globe, Play, MessageCircle, MessageSquare, type LucideIcon } from "lucide-react";

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

const PLATFORM_LABELS: Record<string, string> = {
  telegram: "Telegram",
  email: "Email",
  twitter: "Twitter / X",
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  discord: "Discord",
  whatsapp: "WhatsApp",
};

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [cmsPages, setCmsPages] = useState<NavPage[]>([]);

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

  useEffect(() => {
    fetch("/api/pages/nav")
      .then((res) => res.json())
      .then((data) => setCmsPages(data || []))
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-[#0a0a1a] text-gray-400">
      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#10b981] text-white">
                <MessageSquare className="h-4 w-4" />
              </span>
              <span className="text-lg font-bold text-white tracking-tight">
                Chat<span className="text-[#0ea5e9]">Server</span><span className="text-gray-500">.tr</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
              Professional chat hosting infrastructure. Deploy, manage, and scale your chat servers with enterprise-grade reliability.
            </p>
          </div>

          {/* Platform */}
          <div className="md:col-span-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-5">
              Platform
            </h4>
            <ul className="space-y-3">
              <li><Link href="/#features" className="text-[13px] text-gray-400 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-[13px] text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/contact" className="text-[13px] text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/order-lookup" className="text-[13px] text-gray-400 hover:text-white transition-colors">Order Lookup</Link></li>
            </ul>
          </div>

          {/* Legal / CMS pages */}
          {cmsPages.length > 0 && (
            <div className="md:col-span-2">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-5">
                Legal
              </h4>
              <ul className="space-y-3">
                {cmsPages.map((page) => (
                  <li key={page.slug}>
                    <Link href={`/page/${page.slug}`} className="text-[13px] text-gray-400 hover:text-white transition-colors">
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Payment + Social */}
          <div className={`${cmsPages.length > 0 ? "md:col-span-4" : "md:col-span-6"}`}>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-5">
              Payment Methods
            </h4>
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-[11px] font-semibold text-gray-400">Stripe</span>
              <span className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-[11px] font-semibold text-gray-400">MultiSafepay</span>
              <span className="px-3 py-1.5 rounded bg-[#f7931a]/10 border border-[#f7931a]/20 text-[11px] font-bold text-[#f7931a]">BTC</span>
              <span className="px-3 py-1.5 rounded bg-[#26a17b]/10 border border-[#26a17b]/20 text-[11px] font-bold text-[#26a17b]">USDT</span>
              <span className="px-3 py-1.5 rounded bg-[#2775ca]/10 border border-[#2775ca]/20 text-[11px] font-bold text-[#2775ca]">USDC</span>
              <span className="px-3 py-1.5 rounded bg-[#627eea]/10 border border-[#627eea]/20 text-[11px] font-bold text-[#627eea]">ETH</span>
            </div>

            {socialLinks.length > 0 && (
              <>
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-4">
                  Connect
                </h4>
                <div className="flex items-center gap-3">
                  {socialLinks.map((link) => {
                    const Icon = PLATFORM_ICONS[link.platform] || Send;
                    const label = PLATFORM_LABELS[link.platform] || link.platform;
                    const isExternal = !link.url.startsWith("mailto:");
                    return (
                      <a
                        key={link.platform}
                        href={link.url}
                        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:text-[#0ea5e9] hover:border-[#0ea5e9]/30 hover:bg-[#0ea5e9]/10 transition-all"
                        aria-label={label}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-gray-600 tracking-wide">
            &copy; {new Date().getFullYear()} ChatServer.tr &mdash; All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-[11px] text-gray-600">
            {cmsPages.slice(0, 3).map((page) => (
              <Link key={page.slug} href={`/page/${page.slug}`} className="hover:text-gray-400 transition-colors">
                {page.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
