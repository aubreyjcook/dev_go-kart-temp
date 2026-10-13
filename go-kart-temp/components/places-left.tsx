import { io } from "next/cache";
import { getOfferStatus } from "@/lib/registrations";

export async function PlacesLeft() {
  await io();
  const { claimed, remaining, limit } = await getOfferStatus();
  const width = Math.min(100, (claimed / limit) * 100);
  const label =
    remaining === 0
      ? "All 100 free balaclavas have been claimed. You can still pre-register."
      : remaining === 1
        ? "1 place left in the first 100."
        : `${remaining} places left in the first 100.`;

  return (
    <div className="mt-5">
      <div
        className="h-1.5 overflow-hidden rounded-full bg-white/10"
        aria-hidden="true"
      >
        <div className="h-full bg-accent" style={{ width: `${width}%` }} />
      </div>
      <p className="mt-3 text-sm text-foreground" aria-live="polite">
        {label}
      </p>
    </div>
  );
}

export function PlacesLeftFallback() {
  return (
    <div className="mt-5">
      <div className="h-1.5 rounded-full bg-white/10" />
      <p className="mt-3 text-sm text-muted">Checking places left…</p>
    </div>
  );
}
