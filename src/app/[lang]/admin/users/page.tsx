import { notFound } from "next/navigation";
import { TablePanel } from "@/components/app-ui";
import { adminUsers } from "@/lib/admin-data";
import { setUserFlags } from "@/lib/actions/admin";
import { formatDate } from "@/lib/format";
import { isLocale } from "@/lib/i18n";

export default async function AdminUsers({ params }: PageProps<"/[lang]/admin/users">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const users = await adminUsers();
  return (
    <TablePanel>
      <table className="table">
        <thead><tr><th>Name</th><th>Joined</th><th>Role</th><th>Verified</th><th>Account</th></tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="min-w-[220px]">
                <span className="font-medium text-pine">{u.full_name || "—"}</span>
                <span className="block text-[0.75rem] text-muted">{u.email}</span>
              </td>
              <td className="whitespace-nowrap">{formatDate(u.created_at, lang)}</td>
              <td>{u.role === "admin" ? <span className="badge badge-gold">admin</span> : <span className="text-muted">user</span>}</td>
              <td>
                <form action={setUserFlags}>
                  <input type="hidden" name="id" value={u.id} />
                  <input type="hidden" name="field" value="is_verified_organizer" />
                  <input type="hidden" name="value" value={String(!u.is_verified_organizer)} />
                  <button className={`badge ${u.is_verified_organizer ? "" : "badge-line"} cursor-pointer`}>{u.is_verified_organizer ? "Verified — revoke" : "Verify"}</button>
                </form>
              </td>
              <td>
                {u.role !== "admin" && (
                  <form action={setUserFlags}>
                    <input type="hidden" name="id" value={u.id} />
                    <input type="hidden" name="field" value="is_suspended" />
                    <input type="hidden" name="value" value={String(!u.is_suspended)} />
                    <button className={`badge cursor-pointer ${u.is_suspended ? "badge-danger" : "badge-line"}`}>{u.is_suspended ? "Suspended — restore" : "Suspend"}</button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TablePanel>
  );
}
