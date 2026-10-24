"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { sendContact } from "@/lib/actions/campaigns";
import { Honeypot } from "./honeypot";
import type { Dictionary } from "@/lib/i18n";

export function ContactForm({ t }: { t: Dictionary }) {
  const [state, action, pending] = useActionState(sendContact, undefined);
  const p = t.pages;
  if (state?.ok) return <p role="status" className="alert alert-ok">{p.contactThanks}</p>;
  return (
    <form action={action} className="space-y-5">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="field-label">{p.contactName}</label>
          <input id="name" name="name" required maxLength={120} autoComplete="name" className="field" />
        </div>
        <div>
          <label htmlFor="email" className="field-label">{p.contactEmail}</label>
          <input id="email" name="email" type="email" required autoComplete="email" className="field" />
        </div>
      </div>
      <div>
        <label htmlFor="topic" className="field-label">{p.contactTopic}</label>
        <select id="topic" name="topic" className="field" defaultValue="general">
          {Object.entries(p.contactTopics).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="message" className="field-label">{p.contactMessage}</label>
        <textarea id="message" name="message" required minLength={10} maxLength={4000} className="field" />
      </div>
      {state?.error && <p role="alert" className="alert alert-danger">{state.error}</p>}
      <button disabled={pending} className="btn btn-primary">
        <Send aria-hidden /> {pending ? t.common.loading : p.contactSend}
      </button>
    </form>
  );
}
