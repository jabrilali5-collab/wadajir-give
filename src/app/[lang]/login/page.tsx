import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForms";
import { getDictionary, isLocale } from "@/lib/i18n";
import { safeNextClient } from "@/lib/safe-next";

export const metadata: Metadata = { title: "Log in", robots: { index: false } };

export default async function LoginPage({ params, searchParams }: PageProps<"/[lang]/login">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const sp = await searchParams;
  return (
    <div className="container-page flex justify-center py-14">
      <div className="w-full max-w-md">
        <h1 className="text-3xl">{t.auth.loginTitle}</h1>
        {sp.error === "link" && <p role="alert" className="mt-4 text-sm text-danger">That link has expired. Log in or request a new one.</p>}
        <div className="mt-8"><AuthForm mode="login" t={t} locale={lang} next={safeNextClient(sp.next)} /></div>
      </div>
    </div>
  );
}
