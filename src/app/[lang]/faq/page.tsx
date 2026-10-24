import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageIntro } from "@/components/PreviewBanner";
import { getFaq } from "@/lib/faq";
import { getDictionary, isLocale } from "@/lib/i18n";

export const metadata: Metadata = { title: "FAQ" };

export default async function FaqPage({ params }: PageProps<"/[lang]/faq">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const faq = getFaq(lang);
  return (
    <>
      <PageIntro title={t.home.faqTitle} />
      <div className="container-page py-10">
        <div className="max-w-3xl divide-y divide-line border-y border-line">
          {faq.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden="true" className="text-2xl text-teal transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-[65ch] text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </>
  );
}
