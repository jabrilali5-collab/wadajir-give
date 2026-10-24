import Image from "next/image";
import { Emphasis } from "./ui/Emphasis";
import type { Dictionary } from "@/lib/i18n";
import { photos } from "@/lib/photos";

export function AuthShell({ t, title, body, children }: { t: Dictionary; title: string; body: string; children: React.ReactNode }) {
  return (
    <div className="wrap grid min-h-[calc(100vh-72px)] gap-10 py-8 lg:grid-cols-2 lg:gap-16 lg:py-10">
      <div className="flex flex-col justify-center py-6 lg:px-8">
        <div className="mx-auto w-full max-w-[420px]">
          <h1 className="t-h1 rise">{title}</h1>
          <p className="t-lead rise rise-1 mt-4">{body}</p>
          <div className="rise rise-2 mt-10">{children}</div>
        </div>
      </div>
      <div className="relative hidden overflow-hidden rounded-[var(--radius-ui)] lg:block">
        <Image src={photos.cta.src} alt={photos.cta.alt} fill placeholder="blur" sizes="50vw" className="settle object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-pine/85 via-pine/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-10 text-ivory">
          <p className="font-serif text-[2.75rem] leading-[1.02] [&_em]:!text-gold-soft">
            <Emphasis text={t.authSide.title} />
          </p>
          <p className="mt-4 max-w-[40ch] text-ivory/80">{t.authSide.body}</p>
          <p className="mt-8 text-[0.75rem] text-ivory/55">
            {photos.cta.place} — {photos.cta.credit}
          </p>
        </div>
      </div>
    </div>
  );
}
