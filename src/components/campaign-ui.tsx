import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin } from "lucide-react";
import { categoryLabel } from "@/lib/categories";
import { formatMoney, progressPercent } from "@/lib/format";
import { href, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";
import { fallbackCover } from "@/lib/photos";
import type { Campaign } from "@/lib/types";

export function Progress({ raised, goal, label, tone = "forest" }: { raised: number; goal: number; label: string; tone?: "forest" | "ivory" }) {
  const pct = progressPercent(raised, goal);
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label={label}
      className={`h-1.5 w-full overflow-hidden rounded-full ${tone === "forest" ? "bg-sage-soft" : "bg-ivory/20"}`}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-700 ${tone === "forest" ? "bg-forest" : "bg-gold"}`}
        style={{ width: `${Math.max(pct, raised > 0 ? 2 : 0)}%` }}
      />
    </div>
  );
}

export function SampleBadge({ t }: { t: Dictionary }) {
  return (
    <span className="badge badge-warn" title={t.common.sampleCampaignNote}>
      {t.common.sample}
    </span>
  );
}

export function VerifiedBadge({ t }: { t: Dictionary }) {
  return (
    <span className="badge badge-gold">
      <BadgeCheck aria-hidden /> {t.common.verifiedOrganizer}
    </span>
  );
}

/** Organizer photo, or a landscape fallback (never a person) when none was uploaded. */
export function CampaignCover({
  campaign,
  className = "",
  sizes = "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 85vw",
  priority = false,
}: {
  campaign: Campaign;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (campaign.cover_image_url) {
    return (
      <div className={`relative overflow-hidden bg-sage-soft ${className}`}>
        <Image src={campaign.cover_image_url} alt="" fill sizes={sizes} className="object-cover" priority={priority} />
      </div>
    );
  }
  const p = fallbackCover(campaign.category);
  return (
    <div className={`relative overflow-hidden bg-sage-soft ${className}`}>
      <Image src={p.src} alt="" fill sizes={sizes} placeholder="blur" className="object-cover" priority={priority} />
    </div>
  );
}

export function MoneyLine({ campaign, locale, t }: { campaign: Campaign; locale: Locale; t: Dictionary }) {
  const pct = progressPercent(campaign.raised_cents, campaign.goal_cents);
  return (
    <div className="space-y-2.5">
      <div className="flex items-baseline justify-between text-[0.8125rem] text-muted">
        <span>
          <strong className="text-[0.9375rem] font-semibold text-pine">{formatMoney(campaign.raised_cents, locale)}</strong> {t.common.raised}
        </span>
        <span>{pct}%</span>
      </div>
      <Progress raised={campaign.raised_cents} goal={campaign.goal_cents} label={campaign.title} />
      <p className="text-[0.8125rem] text-muted">
        {t.common.goal} {formatMoney(campaign.goal_cents, locale)}
      </p>
    </div>
  );
}

export function CampaignCard({ campaign, locale, t, priority = false }: { campaign: Campaign; locale: Locale; t: Dictionary; priority?: boolean }) {
  const url = href(locale, `/fundraisers/${campaign.slug}`);
  const place = [campaign.city, campaign.country].filter(Boolean).join(", ");
  return (
    <article className="group card img-zoom relative flex h-full flex-col overflow-hidden transition-colors hover:border-line-strong">
      <div className="relative">
        <CampaignCover campaign={campaign} className="aspect-[4/3]" priority={priority} />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="badge badge-ivory">{categoryLabel(campaign.category, locale)}</span>
          {campaign.is_sample && <SampleBadge t={t} />}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2">
          {campaign.organizer_verified && <VerifiedBadge t={t} />}
          <h3 className="font-sans text-[1.0625rem] font-semibold leading-snug text-pine">
            <Link href={url} className="after:absolute after:inset-0 focus-visible:outline-none">
              {campaign.title}
            </Link>
          </h3>
          {place && (
            <p className="flex items-center gap-1.5 text-[0.8125rem] text-muted">
              <MapPin className="h-3.5 w-3.5" aria-hidden /> {place}
            </p>
          )}
        </div>
        <div className="mt-auto space-y-4">
          <MoneyLine campaign={campaign} locale={locale} t={t} />
          <span className="btn btn-primary btn-sm relative z-10 w-full pointer-events-none">
            {t.common.donate} <ArrowRight className="arrow" aria-hidden />
          </span>
        </div>
      </div>
    </article>
  );
}

export function CampaignGrid({ campaigns, locale, t }: { campaigns: Campaign[]; locale: Locale; t: Dictionary }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((c, i) => (
        <CampaignCard key={c.id} campaign={c} locale={locale} t={t} priority={i < 3} />
      ))}
    </div>
  );
}
