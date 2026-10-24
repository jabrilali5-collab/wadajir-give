import { Fragment } from "react";

/** Renders copy with *asterisk* segments as serif italics, e.g. "Build stronger *communities.*" */
export function Emphasis({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("*") && p.endsWith("*") ? (
          <em key={i} className="text-forest">{p.slice(1, -1)}</em>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

/** Plain-text version for <title> and aria labels. */
export function plain(text: string) {
  return text.replace(/\*/g, "");
}
