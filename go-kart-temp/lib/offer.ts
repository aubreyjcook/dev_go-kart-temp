import { OFFER_LIMIT } from "./site";

export type Registration = {
  number: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  eligible: boolean;
};

export type RegistrationInput = {
  name: string;
  email: string;
  phone: string;
};

export function planRegistration(
  rows: Registration[],
  input: RegistrationInput,
  createdAt: string,
):
  | { status: "duplicate" }
  | { status: "created"; registration: Registration } {
  const email = input.email.toLowerCase();

  if (rows.some((row) => row.email === email)) {
    return { status: "duplicate" };
  }

  const claimed = rows.filter((row) => row.eligible).length;
  const number = rows.reduce((max, row) => Math.max(max, row.number), 0) + 1;

  return {
    status: "created",
    registration: {
      number,
      name: input.name,
      email,
      phone: input.phone,
      createdAt,
      eligible: claimed < OFFER_LIMIT,
    },
  };
}

export function offerStatus(rows: Registration[]) {
  const claimed = rows.filter((row) => row.eligible).length;

  return {
    claimed,
    remaining: Math.max(0, OFFER_LIMIT - claimed),
    limit: OFFER_LIMIT,
  };
}
