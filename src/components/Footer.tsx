"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Send, Mail, Globe, Play, MessageCircle, MessageSquare, ArrowRight, type LucideIcon } from "lucide-react";

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
    <footer className="bg-white border-t border-gray-100">
      {/* Newsletter / CTA strip */}
      <div className="bg-gradient-to-r from-[#ecfdf5] via-[#f0f9ff] to-[#ecfdf5]">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Ready to deploy your chat server?</h3>
            <p className="text-sm text-gray-500 mt-1">Get started in minutes with our fully managed hosting platform.</p>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-[#0ea5e9] to-[#10b981] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[#0ea5e9]/20 transition-all hover:-translate-y-0.5 shrink-0"
          >
            View Plans <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#10b981] text-white shadow-md shadow-[#0ea5e9]/15">
                <MessageSquare className="h-4 w-4" />
              </span>
              <span className="text-lg font-bold text-gray-800 tracking-tight">
                Chat<span className="text-[#0ea5e9]">Server</span><span className="text-gray-400">.tr</span>
              </span>
            </div>
            <p className="text-[13px] leading-relaxed text-gray-400 max-w-xs">
              Professional chat hosting infrastructure. Deploy, manage, and scale your chat servers with enterprise-grade reliability.
            </p>

            {/* Social icons */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2.5 mt-6">
                {socialLinks.map((link) => {
                  const Icon = PLATFORM_ICONS[link.platform] || Send;
                  const label = PLATFORM_LABELS[link.platform] || link.platform;
                  const isExternal = !link.url.startsWith("mailto:");
                  return (
                    <a
                      key={link.platform}
                      href={link.url}
                      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 border border-gray-100 text-gray-400 hover:text-[#0ea5e9] hover:border-[#0ea5e9]/20 hover:bg-[#0ea5e9]/5 transition-all"
                      aria-label={label}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Platform */}
          <div className="md:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-800 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5">
              <li><Link href="/" className="text-[13px] text-gray-400 hover:text-[#0ea5e9] transition-colors">Home</Link></li>
              <li><Link href="/#features" className="text-[13px] text-gray-400 hover:text-[#0ea5e9] transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-[13px] text-gray-400 hover:text-[#0ea5e9] transition-colors">Pricing</Link></li>
              <li><Link href="/contact" className="text-[13px] text-gray-400 hover:text-[#0ea5e9] transition-colors">Contact</Link></li>
              <li><Link href="/order-lookup" className="text-[13px] text-gray-400 hover:text-[#0ea5e9] transition-colors">Order Lookup</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div className="md:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-800 mb-4">
              Account
            </h4>
            <ul className="space-y-2.5">
              <li><Link href="/login" className="text-[13px] text-gray-400 hover:text-[#0ea5e9] transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="text-[13px] text-gray-400 hover:text-[#0ea5e9] transition-colors">Register</Link></li>
              <li><Link href="/account" className="text-[13px] text-gray-400 hover:text-[#0ea5e9] transition-colors">Dashboard</Link></li>
            </ul>
            {cmsPages.length > 0 && (
              <>
                <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-800 mb-4 mt-6">
                  Legal
                </h4>
                <ul className="space-y-2.5">
                  {cmsPages.map((page) => (
                    <li key={page.slug}>
                      <Link href={`/page/${page.slug}`} className="text-[13px] text-gray-400 hover:text-[#0ea5e9] transition-colors">
                        {page.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Payment Methods */}
          <div className="md:col-span-4">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-800 mb-4">
              Payment Methods
            </h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-3.5 py-2 rounded-lg bg-gray-50 border border-gray-100 text-[11px] font-semibold text-gray-500">Stripe</span>
              <span className="px-3.5 py-2 rounded-lg bg-gray-50 border border-gray-100 text-[11px] font-semibold text-gray-500">MultiSafepay</span>
              <span className="px-3.5 py-2 rounded-lg bg-[#fff7ed] border border-[#f7931a]/15 text-[11px] font-bold text-[#f7931a]">Bitcoin</span>
              <span className="px-3.5 py-2 rounded-lg bg-[#ecfdf5] border border-[#26a17b]/15 text-[11px] font-bold text-[#26a17b]">USDT</span>
              <span className="px-3.5 py-2 rounded-lg bg-[#eff6ff] border border-[#2775ca]/15 text-[11px] font-bold text-[#2775ca]">USDC</span>
              <span className="px-3.5 py-2 rounded-lg bg-[#eef2ff] border border-[#627eea]/15 text-[11px] font-bold text-[#627eea]">Ethereum</span>
            </div>

            <div className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-[#f0fdf4] to-[#f0f9ff] border border-[#10b981]/10">
              <p className="text-[13px] font-semibold text-gray-700">Need help?</p>
              <p className="text-[12px] text-gray-400 mt-1 leading-relaxed">Our support team is available 24/7 to help you get started.</p>
              <Link href="/contact" className="inline-flex items-center gap-1.5 mt-3 text-[12px] font-bold text-[#0ea5e9] hover:text-[#0284c7] transition-colors">
                Contact Support <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-gray-300 tracking-wide">
            &copy; {new Date().getFullYear()} ChatServer.tr &mdash; All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-[11px] text-gray-300">
            {cmsPages.slice(0, 3).map((page) => (
              <Link key={page.slug} href={`/page/${page.slug}`} className="hover:text-gray-500 transition-colors">
                {page.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
