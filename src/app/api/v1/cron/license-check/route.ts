import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendLicenseReminderEmail, sendLicenseExpiredEmail } from "@/lib/cmsEmail";

export async function POST(req: NextRequest) {
  const cronSecret = req.headers.get("x-cron-secret");
  if (cronSecret !== (process.env.CRON_SECRET || "chatserver-cron-secret")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const results = { reminders: 0, suspended: 0, errors: [] as string[] };

  const activeInstances = await prisma.chatInstance.findMany({
    where: {
      status: "active",
      licenseExpiresAt: { not: null },
    },
    select: {
      id: true,
      instanceId: true,
      name: true,
      domain: true,
      ownerEmail: true,
      licenseExpiresAt: true,
      reminderSchedule: true,
      lastReminderSentAt: true,
    },
  });

  for (const cms of activeInstances) {
    if (!cms.licenseExpiresAt) continue;

    const daysRemaining = Math.ceil(
      (cms.licenseExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysRemaining <= 0) {
      try {
        await prisma.chatInstance.update({
          where: { id: cms.id },
          data: { status: "expired" },
        });
        await sendLicenseExpiredEmail({
          email: cms.ownerEmail,
          name: cms.name,
          cmsId: cms.instanceId,
          domain: cms.domain,
        });
        results.suspended++;
      } catch (e) {
        results.errors.push(`Failed to suspend ${cms.instanceId}: ${(e as Error).message}`);
      }
      continue;
    }

    const schedule = Array.isArray(cms.reminderSchedule)
      ? (cms.reminderSchedule as number[])
      : [7, 3, 1];

    const shouldRemind = schedule.some((d) => daysRemaining <= d);
    if (!shouldRemind) continue;

    const lastSent = cms.lastReminderSentAt;
    if (lastSent) {
      const hoursSinceLastReminder = (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60);
      if (hoursSinceLastReminder < 20) continue;
    }

    try {
      await sendLicenseReminderEmail({
        email: cms.ownerEmail,
        name: cms.name,
        cmsId: cms.instanceId,
        domain: cms.domain,
        daysRemaining,
        licenseExpiresAt: cms.licenseExpiresAt,
      });
      await prisma.chatInstance.update({
        where: { id: cms.id },
        data: { lastReminderSentAt: now },
      });
      results.reminders++;
    } catch (e) {
      results.errors.push(`Failed to remind ${cms.instanceId}: ${(e as Error).message}`);
    }
  }

  return NextResponse.json({
    ok: true,
    timestamp: now.toISOString(),
    processed: activeInstances.length,
    ...results,
  });
}
