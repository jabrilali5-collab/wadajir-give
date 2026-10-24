import Image, { type StaticImageData } from "next/image";
import { Emphasis } from "./ui/Emphasis";
import { isSupabaseConfigured } from "@/lib/env";
import type { Dictionary } from "@/lib/i18n";

export function PreviewBanner({ t }: { t: Dictionary }) {
  if (isSupabaseConfigured) return null;
  return (
    <div role="status" className="relative z-[60] bg-warn-soft">
      <p className="wrap py-2 text-center text-[0.8125rem] text-warn">{t.demo.banner}</p>
    </div>
  );
}

/** Editorial page header used by every public inner page. */
export function PageIntro({
  kicker,
  title,
  body,
  image,
  imageAlt = "",
  children,
}: {
  kicker?: string;
  title: string;
  body?: string;
  image?: StaticImageData;
  imageAlt?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="wrap pb-12 pt-10 md:pb-16 md:pt-16">
      <div className={image ? "grid items-end gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16" : ""}>
        <div>
          {kicker && <p className="t-kicker rise">{kicker}</p>}
          <h1 className="t-h1 rise rise-1 mt-5 max-w-[16ch]">
            <Emphasis text={title} />
          </h1>
          {body && <p className="t-lead rise rise-2 mt-6 max-w-[56ch]">{body}</p>}
          {children && <div className="rise rise-3 mt-8">{children}</div>}
        </div>
        {image && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-ui)] lg:aspect-[5/4]">
            <Image src={image} alt={imageAlt} fill sizes="(min-width: 1024px) 45vw, 100vw" placeholder="blur" className="settle object-cover" priority />
          </div>
        )}
      </div>
    </section>
  );
}
