import type { StaticImageData } from "next/image";
import { PageIntro } from "./PreviewBanner";
import type { ContentPage } from "@/lib/content";

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function ContentView({
  page,
  kicker,
  image,
  imageAlt,
  children,
}: {
  page: ContentPage;
  kicker?: string;
  image?: StaticImageData;
  imageAlt?: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <PageIntro kicker={kicker} title={page.title} body={page.intro} image={image} imageAlt={imageAlt} />
      <div className="wrap grid gap-12 border-t border-line pb-28 pt-12 lg:grid-cols-[240px_1fr] lg:gap-20 lg:pt-16">
        <nav aria-label="On this page" className="hidden lg:block">
          <ul className="sticky top-28 space-y-3 border-l border-line pl-5 text-[0.875rem]">
            {page.sections.map((s) => (
              <li key={s.h}>
                <a href={`#${slug(s.h)}`} className="text-muted transition-colors hover:text-pine">
                  {s.h}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="prose-ed">
          {page.note && <p className="alert alert-warn !mb-10 !text-[0.9375rem] !text-warn">{page.note}</p>}
          {page.sections.map((s, i) => (
            <section key={s.h} id={slug(s.h)} className="scroll-mt-28">
              <h2 className={i === 0 ? "!mt-0" : ""}>{s.h}</h2>
              {s.p?.map((para) => <p key={para}>{para}</p>)}
              {s.list && (
                <ul>
                  {s.list.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          {children}
        </div>
      </div>
    </>
  );
}
