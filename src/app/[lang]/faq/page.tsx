import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/FaqList";
import { PageIntro } from "@/components/PreviewBanner";
import { getFaq } from "@/lib/faq";
import { getDictionary, href, isLocale } from "@/lib/i18n";

export const metadata: Metadata = { title: "FAQ" };

export default async function FaqPage({ params }: PageProps<"/[lang]/faq">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <>
      <PageIntro kicker={t.footer.faq} title={t.home.faqTitle} />
      <div className="wrap grid gap-12 border-t border-line pb-28 pt-12 lg:grid-cols-[1fr_2fr]">
        <div className="text-[0.9375rem] text-muted">
          <p className="max-w-[30ch]">{t.pages.contactBody}</p>
          <Link href={href(lang, "/contact")} className="link mt-4 inline-block">{t.pages.contactTitle}</Link>
        </div>
        <FaqList items={getFaq(lang)} />
      </div>
    </>
  );
}
