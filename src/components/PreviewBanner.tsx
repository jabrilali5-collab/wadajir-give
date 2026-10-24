import { isSupabaseConfigured } from "@/lib/env";
import type { Dictionary } from "@/lib/i18n";

export function PreviewBanner({ t }: { t: Dictionary }) {
  if (isSupabaseConfigured) return null;
  return (
    <div role="status" className="border-b border-[#f0d9a8] bg-warn-bg">
      <p className="container-page py-2.5 text-sm text-warn">{t.demo.banner}</p>
    </div>
  );
}

export function PageIntro({ title, body, children }: { title: string; body?: string; children?: React.ReactNode }) {
  return (
    <section className="weave-light border-b border-line">
      <div className="container-page py-12 md:py-16">
        <h1 className="max-w-3xl text-[2.1rem] md:text-[2.8rem]">{title}</h1>
        {body && <p className="mt-4 max-w-2xl text-lg text-ink-soft">{body}</p>}
        {children}
      </div>
    </section>
  );
}
