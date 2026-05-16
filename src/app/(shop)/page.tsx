"use client";

import { useState, useEffect, useCallback } from "react";
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

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(sliderImages.length, 1));
  }, [sliderImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % Math.max(sliderImages.length, 1));
  }, [sliderImages.length]);

  useEffect(() => {
    if (sliderImages.length <= 1) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [sliderImages.length, nextSlide]);

  return (
    <div>
      {/* ── Full-Screen Hero Slider ──────────────── */}
      <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden bg-white">
        {sliderImages.length > 0 ? (
          <>
            {sliderImages.map((img, idx) => (
              <div
                key={img.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${img.imageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                <div className="relative z-20 h-full flex items-center">
                  <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 w-full">
                    <div className="max-w-2xl">
                      {img.title && (
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight drop-shadow-2xl">
                          {img.title}
                        </h2>
                      )}
                      {img.linkUrl && (
                        <div className="mt-8 flex flex-wrap gap-4">
                          <a
                            href={img.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#0ea5e9] text-white text-sm font-bold rounded-lg uppercase tracking-wider hover:bg-[#38bdf8] transition-all hover:-translate-y-0.5 shadow-lg shadow-[#0ea5e9]/25"
                          >
                            View Details <ArrowRight className="h-4 w-4" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {sliderImages.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-all border border-white/10 text-white/70 hover:text-white"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-all border border-white/10 text-white/70 hover:text-white"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
                  {sliderImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentSlide ? "bg-[#0ea5e9] w-8" : "bg-white/40 w-4 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          /* Fallback hero when no slider images */
          <div className="relative h-full flex items-center bg-gradient-to-br from-[#ecfdf5] via-[#f0f9ff] to-[#ecfeff]">
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, #0ea5e9 0%, transparent 50%), radial-gradient(circle at 75% 75%, #10b981 0%, transparent 50%)" }} />
            <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 w-full">
              <div className="max-w-2xl">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-800 leading-[1.1] tracking-tight">
                  {settings?.heroTitle || "Professional Chat Hosting Platform"}
                </h1>
                <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-lg">
                  {settings?.heroSubtitle || "Deploy fully managed chat servers with custom bots, real-time messaging, and enterprise-grade security."}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#0ea5e9] to-[#10b981] text-white text-sm font-bold rounded-lg uppercase tracking-wider hover:shadow-lg hover:shadow-[#0ea5e9]/25 transition-all hover:-translate-y-0.5"
                  >
                    {settings?.heroButtonText || "View Plans"} <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/#features"
                    className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-[#0ea5e9]/30 text-[#0ea5e9] text-sm font-bold rounded-lg uppercase tracking-wider hover:bg-[#0ea5e9]/5 transition-all"
                  >
                    Explore Features
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
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

      {/* ── Capabilities Section ────────────────── */}
      {settings?.showProtocolsSection !== false && (
      <section className="py-20 sm:py-28 bg-[#f8fafc]">
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

      {/* ── Products Section ──── */}
      {settings?.showProductsOnHome !== false && products.length > 0 && (
        <section className="py-16 sm:py-20">
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
                          <div className="text-3xl font-bold text-[#0ea5e9]">
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
                      className={`block text-center w-full py-3 rounded-lg font-semibold text-sm transition-all ${
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
    </div>
  );
}
