import { notFound } from "next/navigation";
import { Check, X } from "lucide-react";
import { EmptyState } from "@/components/app-ui";
import { StatusPill } from "@/components/SideNav";
import { adminVerifications } from "@/lib/admin-data";
import { decideVerification } from "@/lib/actions/admin";
import { formatDate } from "@/lib/format";
import { getDictionary, isLocale } from "@/lib/i18n";

export default async function AdminVerification({ params }: PageProps<"/[lang]/admin/verification">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const rows = await adminVerifications();
  return (
    <div className="space-y-6">
      <p className="alert alert-ok text-[0.875rem]">
        Confirm identity outside the platform (video call or ID check with a trusted partner) before approving. Approving shows the verified badge on all of this organizer&apos;s fundraisers.
      </p>
      {rows.length === 0 ? <EmptyState text={t.common.noResults} /> : (
        <ul className="panel divide-y divide-line">
          {rows.map((r) => (
            <li key={r.id} className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
              <div className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-soft text-[0.875rem] font-medium text-forest">
                  {(r.profiles?.full_name || "?").slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-pine">{r.profiles?.full_name || "—"} <span className="font-normal text-muted">{r.profiles?.email}</span></p>
                  <p className="text-[0.8125rem] text-muted">{[r.profiles?.country, formatDate(r.created_at, lang)].filter(Boolean).join(" — ")}</p>
                  {r.note && <p className="mt-2 text-[0.9375rem]">{r.note}</p>}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill status={r.status} label={r.status} />
                {["requested", "in_review"].includes(r.status) && (
                  <form action={decideVerification} className="flex flex-wrap gap-2">
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="user_id" value={r.user_id} />
                    {r.status === "requested" && <button name="decision" value="in_review" className="btn btn-quiet btn-sm">Start review</button>}
                    <button name="decision" value="approved" className="btn btn-primary btn-sm"><Check aria-hidden /> {t.admin.markVerified}</button>
                    <button name="decision" value="denied" className="btn btn-secondary btn-sm"><X aria-hidden /> Deny</button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
