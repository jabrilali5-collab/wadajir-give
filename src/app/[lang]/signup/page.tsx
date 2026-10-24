import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForms";
import { getDictionary, isLocale } from "@/lib/i18n";
import { safeNextClient } from "@/lib/safe-next";

export const metadata: Metadata = { title: "Sign up", robots: { index: false } };

export default async function SignupPage({ params, searchParams }: PageProps<"/[lang]/signup">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const sp = await searchParams;
  return (
    <div className="container-page flex justify-center py-14">
      <div className="w-full max-w-md">
        <h1 className="text-3xl">{t.auth.signupTitle}</h1>
        <div className="mt-8"><AuthForm mode="signup" t={t} locale={lang} next={safeNextClient(sp.next)} /></div>
      </div>
    </div>
  );
}
