"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare, ShieldCheck, Activity,
  Server, Bot, ArrowRight, CheckCircle2, Users, Shield, Cpu, Zap,
  ChevronLeft, ChevronRight,
} from "lucide-react";

interface HomeSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  showProductsOnHome: boolean;
  showFeaturesSection: boolean;
  showProtocolsSection: boolean;
  showCtaSection: boolean;
  featuresSectionTitle: string;
  protocolsSectionTitle: string;
  protocolsSectionSubtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  badge: string;
  badgeColor: string;
  featured: boolean;
  features: string[];
  tiers: { id: number; name: string; price: number; period: string }[];
}

interface SliderImg {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl: string;
}

const features = [
  {
    icon: MessageSquare, title: "Real-Time Messaging",
    desc: "Blazing-fast message delivery with WebSocket infrastructure built for 99.9% uptime.",
    items: ["Multi-server deployment", "Load balancing support", "Unlimited channels & users", "Instant message delivery"],
    color: "text-[#0ea5e9]", bg: "bg-[#0ea5e9]/10",
  },
  {
    icon: ShieldCheck, title: "Total Security",
    desc: "End-to-end encryption, role-based access control, and advanced threat protection.",
    items: ["End-to-end encryption", "Role-based access control", "IP & device lock protection", "Audit logs & compliance"],
    color: "text-[#10b981]", bg: "bg-[#10b981]/10",
  },
  {
    icon: Activity, title: "User Management",
    desc: "Live analytics, user monitoring, and instant insight into every conversation.",
    items: ["Real-time user monitoring", "Admin moderation tools", "Reseller management panel", "Custom permission system"],
    color: "text-[#06b6d4]", bg: "bg-[#06b6d4]/10",
  },
];

const capabilities = [
  { icon: Bot, label: "Custom Bots & Automation" },
  { icon: Users, label: "Multi-Server Management" },
  { icon: Cpu, label: "API & Webhook Integrations" },
  { icon: Shield, label: "Anti-Spam & Moderation" },
  { icon: Server, label: "Scalable Cloud Infrastructure" },
  { icon: Zap, label: "Real-Time Notifications" },
];

export default function HomePage() {
  const [settings, setSettings] = useState<HomeSettings | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sliderImages, setSliderImages] = useState<SliderImg[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d))
      .catch(() => {});
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setProducts(d || []))
      .catch(() => {});
    fetch("/api/slider")
      .then((r) => r.json())
      .then((d) => setSliderImages(d || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (sliderImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [sliderImages.length]);

  return (
    <div>
      {/* ── Hero Section ──────────────────────── */}
      <section className="hero-section">
        <div className="floating-shape shape-1" />
        <div className="floating-shape shape-2" />
        <div className="floating-shape shape-3" />

        <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center animate-fade-up">
            <h1 className="hero-title">
              {settings?.heroTitle?.split(" ").slice(0, -2).join(" ") || "ChatServer"}{" "}
              <span className="hero-title-gradient">
                {settings?.heroTitle?.split(" ").slice(-2).join(" ") || "Communication Platform"}
              </span>
            </h1>
            <p className="hero-subtitle mt-5 animate-fade-up anim-d1">
              {settings?.heroSubtitle || "High-performance chat infrastructure for global platforms. Renew your license and keep your server running at full power."}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 animate-fade-up anim-d2">
              <Link href="/pricing" className="btn-glow">
                {settings?.heroButtonText || "View Plans"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/#features" className="btn-outline">
                Explore Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ─────────────────── */}
      {settings?.showFeaturesSection !== false && (
      <section id="features" className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <h2 className="section-title mb-14">{settings?.featuresSectionTitle || "Powerful Capabilities"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat) => (
              <div key={feat.title} className="feature-card">
                <div className={`feature-icon ${feat.bg}`}>
                  <feat.icon className={`h-7 w-7 ${feat.color}`} />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-2">{feat.title}</h3>
                <p className="text-[#6b7280] leading-relaxed mb-5 text-sm">{feat.desc}</p>
                <ul className="space-y-2.5">
                  {feat.items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-[#111827]">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#10b981]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── Image Slider ────────────────────── */}
      {sliderImages.length > 0 && (
        <section className="py-10 sm:py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#e5e7eb]">
              {sliderImages.map((img, idx) => (
                <div
                  key={img.id}
                  className={idx === currentSlide ? "block" : "hidden"}
                >
                  {img.linkUrl ? (
                    <a href={img.linkUrl} target="_blank" rel="noopener noreferrer" className="block">
                      <img src={img.imageUrl} alt={img.title} className="w-full h-auto block" />
                    </a>
                  ) : (
                    <img src={img.imageUrl} alt={img.title} className="w-full h-auto block" />
                  )}
                  {img.title && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-16 pb-8 px-8">
                      <p className="text-white font-bold text-xl sm:text-2xl drop-shadow-lg tracking-wide">{img.title}</p>
                    </div>
                  )}
                </div>
              ))}

              {sliderImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors shadow-md z-10"
                  >
                    <ChevronLeft className="h-5 w-5 text-[#111827]" />
                  </button>
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % sliderImages.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors shadow-md z-10"
                  >
                    <ChevronRight className="h-5 w-5 text-[#111827]" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {sliderImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentSlide ? "bg-white w-6" : "bg-white/50"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Capabilities Section ────────────────── */}
      {settings?.showProtocolsSection !== false && (
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <h2 className="section-title mb-6">{settings?.protocolsSectionTitle || "Complete Platform Capabilities"}</h2>
          <p className="text-center text-[#6b7280] mb-14 max-w-lg mx-auto">
            {settings?.protocolsSectionSubtitle || "From messaging to moderation — every feature and workflow fully supported."}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {capabilities.map((p) => (
              <div key={p.label} className="feature-card flex items-center gap-4 !p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0ea5e9]/10">
                  <p.icon className="h-5 w-5 text-[#0ea5e9]" />
                </div>
                <span className="text-sm font-medium text-[#111827]">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── Products Section (conditional) ──── */}
      {settings?.showProductsOnHome !== false && products.length > 0 && (
        <section className="py-16 sm:py-20 bg-white/60">
          <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
            <h2 className="section-title mb-6">Our Products</h2>
            <p className="text-center text-[#6b7280] mb-14 max-w-lg mx-auto">
              Choose the perfect plan for your needs. All plans include access to our complete platform.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const lowestTier = product.tiers?.sort((a, b) => a.price - b.price)[0];
                return (
                  <div key={product.id} className={`pricing-card ${product.featured ? "popular" : ""}`}>
                    {product.badge && (
                      <span className="absolute top-4 right-4 bg-[#0ea5e9] text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {product.badge}
                      </span>
                    )}
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-[#111827] mb-2">{product.name}</h3>
                      {lowestTier && (
                        <>
                          <div className="text-3xl font-bold text-[#0ea5e9]" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                            ${lowestTier.price}
                          </div>
                          <div className="text-sm text-[#6b7280]">/ {lowestTier.period}</div>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-[#6b7280] leading-relaxed mb-5 line-clamp-3">{product.description}</p>
                    {product.features && (
                      <ul className="space-y-2.5 mb-6">
                        {(typeof product.features === "string" ? JSON.parse(product.features) : product.features).slice(0, 5).map((f: string) => (
                          <li key={f} className="flex items-center gap-2.5 text-sm text-[#111827] border-b border-[#e5e7eb] pb-2.5">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#10b981]" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                    <Link
                      href="/pricing"
                      className={`block text-center w-full py-3 rounded-full font-semibold text-sm transition-all ${
                        product.featured
                          ? "bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] text-white shadow-md hover:shadow-lg"
                          : "border-2 border-[#0ea5e9] text-[#0ea5e9] hover:bg-[#0ea5e9] hover:text-white"
                      }`}
                    >
                      View Plans
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Section ──────────────────────── */}
      {settings?.showCtaSection !== false && (
      <section className="cta-section">
        <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            {settings?.ctaTitle || "Ready to Power Your Chat Server?"}
          </h2>
          <p className="text-lg opacity-90 max-w-xl mx-auto mb-10">
            {settings?.ctaSubtitle || "Keep your server running at peak performance. Flexible durations, multiple payment methods."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/pricing" className="inline-flex items-center gap-2 bg-white text-[#0ea5e9] font-semibold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
              {settings?.ctaButtonText || "View Pricing"} <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://t.me/chatserver"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-white/80 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition-all"
            >
              Contact on Telegram
            </a>
          </div>
        </div>
      </section>
      )}
    </div>
  );
}
