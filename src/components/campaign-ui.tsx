import Image from "next/image";
import Link from "next/link";
import { categoryLabel } from "@/lib/categories";
import { formatMoney, progressPercent } from "@/lib/format";
import { href, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";
import type { Campaign } from "@/lib/types";

/** Progress bar drawn as a woven strip: the filled part carries the mat pattern. */
export function Progress({ raised, goal, label }: { raised: number; goal: number; label: string }) {
  const pct = progressPercent(raised, goal);
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label={label}
      className="h-2.5 w-full overflow-hidden rounded-full bg-line"
    >
      <div
        className="h-full rounded-full bg-emerald"
        style={{
          width: `${Math.max(pct, raised > 0 ? 3 : 0)}%`,
          backgroundImage:
            "repeating-linear-gradient(135deg, rgb(255 255 255 / 0.18) 0 6px, transparent 6px 12px)",
        }}
      />
    </div>
  );
}

export function SampleBadge({ t }: { t: Dictionary }) {
  return (
    <span className="pill bg-warn-bg text-warn" title={t.common.sampleCampaignNote}>
      {t.common.sample}
    </span>
  );
}

export function VerifiedBadge({ t }: { t: Dictionary }) {
  return (
    <span className="pill bg-mist text-teal-deep">
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
        <path d="M8 1 10 3h3v3l2 2-2 2v3h-3l-2 2-2-2H3v-3L1 8l2-2V3h3z" fill="var(--color-sky)" />
        <path d="m5.2 8.2 1.9 1.9 3.8-4" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
      {t.common.verifiedOrganizer}
    </span>
  );
}

/** Cover image, or a patterned placeholder labelled with the cause when no photo was uploaded. */
export function CampaignCover({
  campaign,
  locale,
  className = "",
  priority = false,
}: {
  campaign: Campaign;
  locale: Locale;
  className?: string;
  priority?: boolean;
}) {
  if (campaign.cover_image_url) {
    return (
      <div className={`relative overflow-hidden bg-mist ${className}`}>
        <Image
          src={campaign.cover_image_url}
          alt=""
          fill
          sizes="(min-width: 1024px) 400px, 100vw"
          className="object-cover"
          priority={priority}
        />
      </div>
    );
  }
  return (
    <div className={`weave relative flex items-end overflow-hidden ${className}`} aria-hidden="true">
      <span className="m-4 rounded-md bg-white/92 px-2.5 py-1 text-sm font-semibold text-teal-deep">
        {categoryLabel(campaign.category, locale)}
      </span>
    </div>
  );
}

export function CampaignCard({ campaign, locale, t }: { campaign: Campaign; locale: Locale; t: Dictionary }) {
  const url = href(locale, `/fundraisers/${campaign.slug}`);
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white">
      <CampaignCover campaign={campaign} locale={locale} className="aspect-[16/10]" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          {campaign.is_sample && <SampleBadge t={t} />}
          {campaign.organizer_verified && <VerifiedBadge t={t} />}
        </div>
        <h3 className="text-lg leading-snug">
          <Link href={url} className="after:absolute after:inset-0 hover:text-teal focus-visible:outline-none">
            <span className="relative">{campaign.title}</span>
          </Link>
        </h3>
        <p className="text-sm text-ink-soft">
          {[campaign.city, campaign.country].filter(Boolean).join(", ")}
        </p>
        <div className="mt-auto space-y-2 pt-2">
          <Progress raised={campaign.raised_cents} goal={campaign.goal_cents} label={campaign.title} />
          <p className="flex items-baseline justify-between gap-2 text-sm">
            <span>
              <strong className="text-base text-ink">{formatMoney(campaign.raised_cents, locale)}</strong>{" "}
              <span className="text-ink-soft">{t.common.raised}</span>
            </span>
            <span className="text-ink-soft">
              {t.common.goal} {formatMoney(campaign.goal_cents, locale)}
            </span>
          </p>
        </div>
      </div>
    </article>
  );
}

export function CampaignGrid({ campaigns, locale, t }: { campaigns: Campaign[]; locale: Locale; t: Dictionary }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((c) => (
        <div key={c.id} className="relative">
          <CampaignCard campaign={c} locale={locale} t={t} />
        </div>
      ))}
    </div>
  );
}
