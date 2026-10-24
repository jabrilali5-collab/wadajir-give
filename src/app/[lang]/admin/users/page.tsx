import { notFound } from "next/navigation";
import { adminUsers } from "@/lib/admin-data";
import { setUserFlags } from "@/lib/actions/admin";
import { formatDate } from "@/lib/format";
import { getDictionary, isLocale } from "@/lib/i18n";

export default async function AdminUsers({ params }: PageProps<"/[lang]/admin/users">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const users = await adminUsers();
  return (
    <div>
      <h2 className="text-2xl">{t.admin.users}</h2>
      <div className="mt-6 overflow-x-auto rounded-[var(--radius-card)] border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-mist"><tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Joined</th><th className="p-3">Role</th><th className="p-3">Verified</th><th className="p-3">Suspended</th></tr></thead>
          <tbody className="divide-y divide-line">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="p-3">{u.full_name || "—"}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 whitespace-nowrap">{formatDate(u.created_at, lang)}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">
                  <form action={setUserFlags}>
                    <input type="hidden" name="id" value={u.id} />
                    <input type="hidden" name="field" value="is_verified_organizer" />
                    <input type="hidden" name="value" value={String(!u.is_verified_organizer)} />
                    <button className="font-semibold text-teal underline-offset-4 hover:underline">{u.is_verified_organizer ? "Yes — revoke" : "No — verify"}</button>
                  </form>
                </td>
                <td className="p-3">
                  {u.role !== "admin" && (
                    <form action={setUserFlags}>
                      <input type="hidden" name="id" value={u.id} />
                      <input type="hidden" name="field" value="is_suspended" />
                      <input type="hidden" name="value" value={String(!u.is_suspended)} />
                      <button className={`font-semibold underline-offset-4 hover:underline ${u.is_suspended ? "text-danger" : "text-ink-soft"}`}>{u.is_suspended ? "Suspended — restore" : "Active — suspend"}</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
