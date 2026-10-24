import { PageIntro } from "./PreviewBanner";
import type { ContentPage } from "@/lib/content";

export function ContentView({ page, children }: { page: ContentPage; children?: React.ReactNode }) {
  return (
    <>
      <PageIntro title={page.title} body={page.intro} />
      <div className="container-page py-10">
        <div className="prose-page">
          {page.note && <p className="!text-warn rounded-[var(--radius-control)] bg-warn-bg p-3 text-sm">{page.note}</p>}
          {page.sections.map((s) => (
            <section key={s.h}>
              <h2>{s.h}</h2>
              {s.p?.map((para) => <p key={para}>{para}</p>)}
              {s.list && (
                <ul>
                  {s.list.map((li) => <li key={li}>{li}</li>)}
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
