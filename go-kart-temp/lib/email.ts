import nodemailer from "nodemailer";
import type { Registration } from "@/lib/offer";
import { VENUE } from "@/lib/site";

export type EmailDelivery = "sent" | "logged";

type Message = {
  subject: string;
  text: string;
  html: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function recipient() {
  const value = (
    process.env.REGISTRATION_TO_EMAIL ?? VENUE.registrationEmail
  ).trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new Error("REGISTRATION_TO_EMAIL is not a valid email address");
  }

  return value;
}

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/London",
  }).format(new Date(iso));
}

function buildMessage(registration: Registration): Message {
  const offer = registration.eligible
    ? "Yes. Give them a free balaclava when they book their first double session."
    : "No. The first 100 places were already taken.";

  const subject = registration.eligible
    ? `Pre-registration #${registration.number} — ${registration.name} (free balaclava)`
    : `Pre-registration #${registration.number} — ${registration.name}`;

  const text = [
    `${VENUE.name} pre-registration`,
    "",
    `Number: ${registration.number}`,
    `Free balaclava: ${offer}`,
    `Name: ${registration.name}`,
    `Email: ${registration.email}`,
    `Phone: ${registration.phone}`,
    `Submitted: ${formatWhen(registration.createdAt)}`,
    "",
    "Sent from the temporary staging page.",
  ].join("\n");

  const html = `
    <h1>${escapeHtml(VENUE.name)} pre-registration</h1>
    <p><strong>Number:</strong> ${registration.number}</p>
    <p><strong>Free balaclava:</strong> ${escapeHtml(offer)}</p>
    <p><strong>Name:</strong> ${escapeHtml(registration.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(registration.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(registration.phone)}</p>
    <p><strong>Submitted:</strong> ${escapeHtml(formatWhen(registration.createdAt))}</p>
    <p>Sent from the temporary staging page.</p>
  `;

  return { subject, text, html };
}

async function sendWithResend(message: Message, to: string, replyTo: string) {
  const from =
    process.env.REGISTRATION_FROM_EMAIL?.trim() ||
    `${VENUE.name} <onboarding@resend.dev>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: replyTo,
      subject: message.subject,
      text: message.text,
      html: message.html,
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`Resend failed (${response.status}): ${await response.text()}`);
  }
}

async function sendWithSmtp(message: Message, to: string, replyTo: string) {
  const port = Number(process.env.SMTP_PORT ?? 587);
  const from =
    process.env.REGISTRATION_FROM_EMAIL?.trim() ||
    `${VENUE.name} <${process.env.SMTP_USER}>`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from,
    to,
    replyTo,
    subject: message.subject,
    text: message.text,
    html: message.html,
  });
}

export async function sendRegistrationEmail(
  registration: Registration,
): Promise<EmailDelivery> {
  const message = buildMessage(registration);
  const to = recipient();

  if (process.env.RESEND_API_KEY) {
    await sendWithResend(message, to, registration.email);
    return "sent";
  }

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    await sendWithSmtp(message, to, registration.email);
    return "sent";
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(
      `\n--- Pre-registration email (not sent; no email provider configured) ---\nTo: ${to}\n${message.text}\n---\n`,
    );
    return "logged";
  }

  throw new Error(
    "Registration email is not configured. Set RESEND_API_KEY or SMTP_HOST, SMTP_USER, and SMTP_PASS.",
  );
}
