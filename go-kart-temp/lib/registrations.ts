import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  offerStatus,
  planRegistration,
  type Registration,
  type RegistrationInput,
} from "@/lib/offer";

const filePath = path.join(process.cwd(), "data", "registrations.json");

let chain: Promise<void> = Promise.resolve();

function withLock<T>(task: () => Promise<T>): Promise<T> {
  const run = chain.then(task, task);
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readAll(): Promise<Registration[]> {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Registration[]) : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function writeAll(rows: Registration[]) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.${process.pid}.tmp`;
  await writeFile(temporary, JSON.stringify(rows, null, 2), "utf8");
  await rename(temporary, filePath);
}

export async function getOfferStatus() {
  return offerStatus(await readAll());
}

export async function addRegistration(input: RegistrationInput) {
  return withLock(async () => {
    const rows = await readAll();
    const planned = planRegistration(rows, input, new Date().toISOString());

    if (planned.status === "duplicate") return planned;

    await writeAll([...rows, planned.registration]);
    return planned;
  });
}

export async function deleteRegistration(email: string) {
  const normalised = email.toLowerCase();

  return withLock(async () => {
    const rows = await readAll();
    await writeAll(rows.filter((row) => row.email !== normalised));
  });
}
