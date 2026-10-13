"use client";

import { useActionState, useState } from "react";
import { registerInterest } from "@/app/actions";
import { initialRegisterState } from "@/lib/register-state";

const inputClassName =
  "h-12 w-full rounded-lg border border-white/15 bg-black/35 px-3 text-base text-foreground outline-none placeholder:text-[#8d887f] focus:border-accent";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerInterest,
    initialRegisterState,
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  if (state.status === "success") {
    return (
      <div
        className="rounded-2xl border border-white/10 bg-card p-6 shadow-[inset_0_3px_0_0_var(--accent)] sm:p-8"
        role="status"
      >
        <p className="font-display text-xs font-semibold tracking-[0.2em] text-accent uppercase">
          {state.number > 0 ? `Number ${state.number}` : "Pre-registered"}
        </p>
        <h2 className="mt-3 font-display text-4xl leading-none font-semibold uppercase">
          {state.name ? `Thanks, ${state.name}` : "Thanks"}
        </h2>
        <p className="mt-4 leading-relaxed text-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="relative rounded-2xl border border-white/10 bg-card p-6 shadow-[inset_0_3px_0_0_var(--accent)] sm:p-8"
    >
      <h2 className="font-display text-3xl leading-none font-semibold uppercase">
        Pre-register
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Name, email, and a phone number. This is sent to the track.
      </p>

      {state.message ? (
        <p className="mt-4 text-sm text-[#ffb4b4]" role="alert">
          {state.message}
        </p>
      ) : null}

      <div className="mt-6 grid gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={80}
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={Boolean(state.fields.name)}
            aria-describedby={state.fields.name ? "name-error" : undefined}
            className={`${inputClassName} mt-2`}
          />
          {state.fields.name ? (
            <p id="name-error" className="mt-2 text-sm text-[#ffb4b4]">
              {state.fields.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={120}
            spellCheck={false}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(state.fields.email)}
            aria-describedby={state.fields.email ? "email-error" : undefined}
            className={`${inputClassName} mt-2`}
          />
          {state.fields.email ? (
            <p id="email-error" className="mt-2 text-sm text-[#ffb4b4]">
              {state.fields.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            required
            maxLength={30}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            aria-invalid={Boolean(state.fields.phone)}
            aria-describedby={state.fields.phone ? "phone-error" : undefined}
            className={`${inputClassName} mt-2`}
          />
          {state.fields.phone ? (
            <p id="phone-error" className="mt-2 text-sm text-[#ffb4b4]">
              {state.fields.phone}
            </p>
          ) : null}
        </div>
      </div>

      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="hp_website">Website</label>
        <input
          id="hp_website"
          name="hp_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-6 h-12 w-full rounded-full bg-accent font-display text-sm font-semibold tracking-[0.14em] text-white uppercase transition-colors hover:bg-[#ff2d2d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:cursor-wait disabled:bg-[#9f1d24]"
      >
        {pending ? "Sending…" : "Pre-register"}
      </button>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        The first 100 registrations get a free balaclava when they book their
        first double session. We&apos;ll use your details only to contact you
        about this.
      </p>
    </form>
  );
}
