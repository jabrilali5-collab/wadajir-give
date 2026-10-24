import { notFound } from "next/navigation";
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
    <div>
      <h2 className="text-2xl">{t.admin.verification}</h2>
      <p className="mt-2 max-w-[65ch] text-ink-soft">
        Confirm identity outside the platform (video call or ID check with a trusted partner) before approving. Approving shows the verified badge on all of this organizer&apos;s fundraisers.
      </p>
      {rows.length === 0 ? <p className="mt-8 text-ink-soft">{t.common.noResults}</p> : (
        <ul className="mt-6 space-y-3">
          {rows.map((r) => (
            <li key={r.id} className="rounded-[var(--radius-card)] border border-line p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{r.profiles?.full_name || "—"} <span className="font-normal text-ink-soft">{r.profiles?.email}</span></p>
                  <p className="text-sm text-ink-soft">{r.profiles?.country} — {formatDate(r.created_at, lang)}</p>
                  {r.note && <p className="mt-2 text-sm">{r.note}</p>}
                </div>
                <StatusPill status={r.status} label={r.status} />
              </div>
              {["requested", "in_review"].includes(r.status) && (
                <form action={decideVerification} className="mt-3 flex flex-wrap gap-2">
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="user_id" value={r.user_id} />
                  {r.status === "requested" && <button name="decision" value="in_review" className="btn btn-quiet">Start review</button>}
                  <button name="decision" value="approved" className="btn btn-primary">{t.admin.markVerified}</button>
                  <button name="decision" value="denied" className="btn btn-secondary">Deny</button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
