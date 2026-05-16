import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tierId = searchParams.get("tierId");

    const settings = await prisma.siteSettings.findUnique({
      where: { id: 1 },
    });

    const publicSettings = {
      siteName: settings?.siteName || "ChatServer",
      siteDescription: settings?.siteDescription || "",
      stripeEnabled: settings?.stripeEnabled ?? false,
      multisafepayEnabled: settings?.multisafepayEnabled ?? false,
      cryptoEnabled: settings?.cryptoEnabled ?? false,
      btcAddress: settings?.btcAddress || "",
      usdtAddress: settings?.usdtAddress || "",
      usdcAddress: settings?.usdcAddress || "",
      ethAddress: settings?.ethAddress || "",
      cookieBarEnabled: settings?.cookieBarEnabled ?? true,
      cookieBarText: settings?.cookieBarText || "We use cookies to improve your experience.",
      cookieBarButtonText: settings?.cookieBarButtonText || "Accept",
      heroTitle: settings?.heroTitle || "Professional Chat Hosting Platform",
      heroSubtitle: settings?.heroSubtitle || "Deploy fully managed chat servers with custom bots, real-time messaging, and enterprise-grade security.",
      heroButtonText: settings?.heroButtonText || "View Plans",
      showProductsOnHome: settings?.showProductsOnHome ?? true,
      showFeaturesSection: settings?.showFeaturesSection ?? true,
      showProtocolsSection: settings?.showProtocolsSection ?? true,
      showCtaSection: settings?.showCtaSection ?? true,
      featuresSectionTitle: settings?.featuresSectionTitle || "Powerful Capabilities",
      protocolsSectionTitle: settings?.protocolsSectionTitle || "Complete Platform Capabilities",
      protocolsSectionSubtitle: settings?.protocolsSectionSubtitle || "From messaging to moderation — every feature and workflow fully supported.",
      ctaTitle: settings?.ctaTitle || "Ready to Power Your Chat Server?",
      ctaSubtitle: settings?.ctaSubtitle || "Deploy your server in minutes. Flexible plans, multiple payment methods.",
      ctaButtonText: settings?.ctaButtonText || "View Pricing",
      pricingPageTitle: settings?.pricingPageTitle || "Choose Your Plan",
      pricingPageSubtitle: settings?.pricingPageSubtitle || "Select the chat server plan that fits your needs. All plans include full platform access.",
      contactPageTitle: settings?.contactPageTitle || "Contact Us",
      contactPageSubtitle: settings?.contactPageSubtitle || "Have a question or need help? Select a department and send us a message.",
      hidePricingForGuests: settings?.hidePricingForGuests ?? false,
      gtagId: settings?.gtagId || "",
      socialLinks: settings?.socialLinks || [],
    };

    if (tierId) {
      const tier = await prisma.pricingTier.findUnique({
        where: { id: Number(tierId) },
      });

      if (tier) {
        let features: string[] = [];
        try {
          const raw = tier.features;
          if (typeof raw === "string") features = JSON.parse(raw);
          else if (Array.isArray(raw)) features = raw as string[];
        } catch { features = []; }

        return NextResponse.json({
          ...publicSettings,
          tier: {
            id: tier.id,
            name: tier.name,
            price: Number(tier.price),
            period: tier.period,
            features,
          },
        });
      }
    }

    return NextResponse.json(publicSettings);
  } catch (err) {
    console.error("Settings fetch error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
