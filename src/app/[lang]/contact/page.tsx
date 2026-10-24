import { notFound } from "next/navigation";
import type { Metadata } from "next";
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
      <PageIntro title={t.pages.contactTitle} body={t.pages.contactBody} />
      <div className="container-page py-10"><ContactForm t={t} /></div>
    </>
  );
}
