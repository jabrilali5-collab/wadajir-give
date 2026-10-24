"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, signup } from "@/lib/actions/auth";
import { Honeypot } from "./honeypot";
import type { Dictionary } from "@/lib/i18n";
import { href, type Locale } from "@/lib/i18n/config";

function errorText(t: Dictionary, e?: string) {
  if (!e) return null;
  if (e === "invalid") return t.auth.invalid;
  if (e === "not_configured") return t.auth.notConfigured;
  return e;
}

export function AuthForm({ mode, t, locale, next }: { mode: "login" | "signup"; t: Dictionary; locale: Locale; next?: string }) {
  const [state, action, pending] = useActionState(mode === "login" ? login : signup, undefined);
  const qs = next ? `?next=${encodeURIComponent(next)}` : "";

  if (state?.ok && state.message === "check_email") {
    return <p role="status" className="alert alert-ok">{t.auth.checkEmail}</p>;
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />
      {next && <input type="hidden" name="next" value={next} />}
      <Honeypot />
      {mode === "signup" && (
        <div>
          <label htmlFor="full_name" className="field-label">{t.auth.fullName}</label>
          <input id="full_name" name="full_name" autoComplete="name" required minLength={2} maxLength={120} className="field" />
        </div>
      )}
      <div>
        <label htmlFor="email" className="field-label">{t.auth.email}</label>
        <input id="email" name="email" type="email" autoComplete="email" required className="field" />
      </div>
      <div>
        <label htmlFor="password" className="field-label">{t.auth.password}</label>
        <input id="password" name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={8} className="field" aria-describedby="pw-hint" />
        {mode === "signup" && <p id="pw-hint" className="field-hint">{t.auth.passwordHint}</p>}
      </div>
      {state?.error && <p role="alert" className="alert alert-danger">{errorText(t, state.error)}</p>}
      <button disabled={pending} className="btn btn-primary btn-lg w-full">{pending ? t.common.loading : mode === "login" ? t.auth.login : t.auth.signup}</button>
      <p className="border-t border-line pt-6 text-center text-[0.9375rem] text-muted">
        {mode === "login" ? t.auth.noAccount : t.auth.haveAccount}{" "}
        <Link href={`${href(locale, mode === "login" ? "/signup" : "/login")}${qs}`} className="link">
          {mode === "login" ? t.nav.signUp : t.nav.signIn}
        </Link>
      </p>
    </form>
  );
}
