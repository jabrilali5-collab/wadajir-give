import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForms";
import { AuthShell } from "@/components/AuthShell";
import { getDictionary, isLocale } from "@/lib/i18n";
import { safeNextClient } from "@/lib/safe-next";

export const metadata: Metadata = { title: "Sign up", robots: { index: false } };

export default async function SignupPage({ params, searchParams }: PageProps<"/[lang]/signup">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const sp = await searchParams;
  return (
    <AuthShell t={t} title={t.auth.signupTitle} body={t.authSide.signupBody}>
      {sp.error === "link" && <p role="alert" className="alert alert-danger mb-6">That link has expired. Log in or request a new one.</p>}
      <AuthForm mode="signup" t={t} locale={lang} next={safeNextClient(sp.next)} />
    </AuthShell>
  );
}
