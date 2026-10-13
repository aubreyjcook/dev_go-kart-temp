import { Suspense } from "react";
import Image from "next/image";
import { PlacesLeft, PlacesLeftFallback } from "@/components/places-left";
import { RegisterForm } from "@/components/register-form";
import { VENUE } from "@/lib/site";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(225,6,0,0.22),transparent_42%)]"
        aria-hidden="true"
      />
      <Image
        src="/gokart-bg.jpg"
        alt=""
        width={1920}
        height={1080}
        priority
        aria-hidden
        className="pointer-events-none absolute top-[22rem] -left-[4%] w-[min(880px,128vw)] max-w-none opacity-80 select-none [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_78%)] lg:top-56 lg:left-16 lg:w-[740px] lg:opacity-100"
      />
      <div className="relative flex flex-1 flex-col">
        <div className="finish-line" aria-hidden="true" />
        <div className="bg-accent px-5 py-2 text-center text-sm font-medium text-white">
          Temporary page while the new website is finished.
        </div>

        <header className="border-b border-white/10">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-5 gap-y-3 px-5 py-5">
            <div>
              <p className="font-display text-xl font-semibold tracking-[0.14em] uppercase">
                {VENUE.name}
              </p>
              <p className="text-sm text-muted">{VENUE.town}</p>
            </div>
            <a
              href="#register"
              className="text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              Pre-register
            </a>
          </div>
        </header>

        <main className="mx-auto grid w-full max-w-6xl flex-1 gap-12 px-5 py-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:items-start lg:py-16">
          <section>
            <p className="font-display text-sm font-semibold tracking-[0.22em] text-accent uppercase">
              {VENUE.town}
            </p>
            <h1 className="mt-3 max-w-xl font-display text-5xl leading-[0.92] font-semibold tracking-tight uppercase [text-shadow:0_2px_18px_rgba(0,0,0,0.85)] sm:text-7xl">
              Pre-register
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]">
              Outdoor go-karting in {VENUE.town}. Leave your details and the
              track will be in touch.
            </p>
            <p className="mt-8 max-w-xl border-l-2 border-accent pl-4 text-lg leading-relaxed">
              <span className="mb-1 block font-display text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                On the way
              </span>
              A new electric fleet of go-karts will be available.
            </p>

            <div className="mt-8 max-w-xl rounded-2xl border border-white/10 bg-card p-6">
              <p className="font-display text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                First 100 registrations
              </p>
              <h2 className="mt-3 font-display text-3xl leading-none font-semibold uppercase">
                Free balaclava
              </h2>
              <p className="mt-3 leading-relaxed text-muted">
                The first 100 registrations get a free balaclava when they book
                their first double session.
              </p>
              <Suspense fallback={<PlacesLeftFallback />}>
                <PlacesLeft />
              </Suspense>
            </div>

            <p className="mt-6 max-w-xl text-sm text-muted">
              Bookings stay open on the{" "}
              <a
                href={VENUE.currentSite}
                className="text-foreground underline underline-offset-4"
              >
                current website
              </a>
              .
            </p>
          </section>

          <section id="register" className="scroll-mt-6 lg:sticky lg:top-8">
            <RegisterForm />
          </section>
        </main>

        <footer className="border-t border-white/10">
          <address className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-sm text-muted not-italic sm:flex-row sm:items-center sm:justify-between">
            <p>
              {VENUE.legalName}
              <span className="px-2" aria-hidden="true">
                ·
              </span>
              {VENUE.street}, {VENUE.town}, {VENUE.region} {VENUE.postcode}
            </p>
            <p>
              <a
                href={`mailto:${VENUE.email}`}
                className="text-foreground underline-offset-4 hover:underline"
              >
                {VENUE.email}
              </a>
            </p>
          </address>
        </footer>
      </div>
    </div>
  );
}
