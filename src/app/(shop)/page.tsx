"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  MessageSquare, ShieldCheck, Activity, CheckCircle2,
  Server, Bot, ArrowRight, Users, Shield, Cpu, Zap,
  ChevronLeft, ChevronRight, Wifi, Award, Globe, Headphones,
  HardDrive, Smartphone, RefreshCw, Lock, type LucideIcon,
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
  badge: string;
  caption: string;
  tags: string;
  imageUrl: string;
  linkUrl: string;
}

const featureBoxes: { icon: LucideIcon; title: string; desc: string; color: string }[] = [
  {
    icon: Wifi, title: "OPTIMISED NETWORK",
    desc: "Multiple high-speed fibres and optimised routing across every region for the lowest possible latency with full redundancy.",
    color: "text-[#f59e0b]",
  },
  {
    icon: Award, title: "YEARS OF HOSTING EXPERTISE",
    desc: "A decade of chat server hosting know-how. Our team is senior, seasoned and obsessive about uptime — you can trust us to do it right.",
    color: "text-[#ec4899]",
  },
  {
    icon: Bot, title: "CUSTOM BOTS & AUTOMATION",
    desc: "Deploy custom bots for weather, radio, earthquake alerts, YouTube integration and more. Full automation out of the box.",
    color: "text-[#10b981]",
  },
  {
    icon: Globe, title: "WORLDWIDE LOCATIONS",
    desc: "Servers in Europe, North America, and Asia. Choose the location closest to your users for the best performance.",
    color: "text-[#0ea5e9]",
  },
  {
    icon: Headphones, title: "24/7 HUMAN SUPPORT",
    desc: "Real humans, around the clock. Open a ticket or reach us on Telegram — you'll get a fast, knowledgeable answer every time.",
    color: "text-[#8b5cf6]",
  },
  {
    icon: Shield, title: "ENTERPRISE DDOS PROTECTION",
    desc: "Cutting-edge DDoS filtering at the network edge. Attacks are mitigated in real time before they ever reach your server.",
    color: "text-[#06b6d4]",
  },
  {
    icon: HardDrive, title: "DAILY OFFSITE BACKUPS",
    desc: "Full server backups every single day, automatically pushed to offsite storage. Your data, configs and settings are always safe.",
    color: "text-[#f97316]",
  },
  {
    icon: Smartphone, title: "MOBILE CONTROL PANEL",
    desc: "Beautifully responsive control panel — admin your chat server from anywhere, on any phone or tablet. Full power, full control.",
    color: "text-[#3b82f6]",
  },
  {
    icon: RefreshCw, title: "INSTANT PROVISIONING",
    desc: "Your chat server is deployed automatically within minutes of payment. No waiting, no manual setup — just instant access.",
    color: "text-[#14b8a6]",
  },
  {
    icon: Lock, title: "END-TO-END ENCRYPTION",
    desc: "All communications are encrypted with industry-standard protocols. Role-based access control and IP locking for maximum security.",
    color: "text-[#ef4444]",
  },
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

                <div className="relative z-20 h-full flex items-end pb-20 sm:pb-24">
                  <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 w-full">
                    <div className="max-w-2xl">
                      {img.badge && (
                        <span className="inline-block px-3.5 py-1 mb-4 rounded-md bg-[#0ea5e9] text-white text-xs font-bold uppercase tracking-wider">
                          {img.badge}
                        </span>
                      )}
                      {img.title && (
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight drop-shadow-2xl">
                          {img.title}
                        </h2>
                      )}
                      {img.caption && (
                        <p className="mt-4 text-base sm:text-lg text-white/90 leading-relaxed max-w-xl drop-shadow-lg">
                          {img.caption}
                        </p>
                      )}
                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        {img.tags && img.tags.split(",").map((tag) => tag.trim()).filter(Boolean).map((tag) => (
                          <span key={tag} className="px-3.5 py-1.5 rounded-md border border-white/30 bg-white/10 backdrop-blur-sm text-white text-xs font-semibold tracking-wider">
                            {tag}
                          </span>
                        ))}
                        {img.linkUrl && (
                          <a
                            href={img.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-1.5 bg-gradient-to-r from-[#0ea5e9] to-[#10b981] text-white text-xs font-bold rounded-md uppercase tracking-wider hover:shadow-lg transition-all hover:-translate-y-0.5"
                          >
                            View Details <ArrowRight className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
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

      {/* ── Features Section — Boxed Grid ─────── */}
      {settings?.showFeaturesSection !== false && (
      <section id="features" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-[#10b981]">// Why Choose Us</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-800 tracking-tight">
              {settings?.featuresSectionTitle || "Why Choose"} <span className="text-[#0ea5e9]">ChatServer</span>
            </h2>
            <p className="mt-3 text-sm uppercase tracking-[0.15em] text-gray-400 font-medium">
              {settings?.protocolsSectionSubtitle || "All features included"}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {featureBoxes.map((feat) => (
              <div
                key={feat.title}
                className="group flex items-start gap-5 rounded-2xl border border-gray-100 bg-white p-6 sm:p-7 transition-all duration-300 hover:border-[#0ea5e9]/30 hover:shadow-lg hover:shadow-[#0ea5e9]/5"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 group-hover:bg-[#0ea5e9]/5 group-hover:border-[#0ea5e9]/20 transition-colors">
                  <feat.icon className={`h-6 w-6 ${feat.color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-gray-800 mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-gray-400">
                    {feat.desc}
                  </p>
                </div>
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
