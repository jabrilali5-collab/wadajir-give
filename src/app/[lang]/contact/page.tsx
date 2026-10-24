import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Mail, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { PageIntro } from "@/components/PreviewBanner";
import { getDictionary, isLocale } from "@/lib/i18n";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <>
      <PageIntro kicker={t.footer.contact} title={t.pages.contactTitle} body={t.pages.contactBody} />
      <div className="wrap grid gap-12 border-t border-line pb-28 pt-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
        <div className="card card-pad"><ContactForm t={t} /></div>
        <aside className="space-y-8 text-[0.9375rem]">
          <div className="flex gap-4">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-forest" strokeWidth={1.6} aria-hidden />
            <p className="text-muted">{t.pages.contactThanks}</p>
          </div>
          <div className="flex gap-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-forest" strokeWidth={1.6} aria-hidden />
            <p className="text-muted">{t.home.trustPoints[2].body}</p>
          </div>
        </aside>
      </div>
    </>
  );
}
