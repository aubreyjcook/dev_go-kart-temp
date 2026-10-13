"use server";

import { refresh } from "next/cache";
import { sendRegistrationEmail } from "@/lib/email";
import { addRegistration, deleteRegistration } from "@/lib/registrations";
import type { FieldName, RegisterState } from "@/lib/register-state";
import { VENUE } from "@/lib/site";

function clean(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

function validate(input: { name: string; email: string; phone: string }) {
  const fields: Partial<Record<FieldName, string>> = {};

  if (input.name.length < 2 || input.name.length > 80) {
    fields.name = "Enter your name.";
  }

  if (
    input.email.length > 120 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)
  ) {
    fields.email = "Enter a valid email address.";
  }

  const digits = input.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) {
    fields.phone = "Enter a phone number we can call.";
  }

  return fields;
}

export async function registerInterest(
  _previous: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  if (clean(formData.get("hp_website"))) {
    return {
      status: "success",
      message: "Thanks. You're on the list.",
      fields: {},
      number: 0,
      eligible: false,
      name: "",
      emailed: false,
    };
  }

  const input = {
    name: clean(formData.get("name")),
    email: clean(formData.get("email")).toLowerCase(),
    phone: clean(formData.get("phone")),
  };
  const fields = validate(input);

  if (Object.keys(fields).length > 0) {
    return {
      status: "error",
      message: "Check the details below.",
      fields,
      number: 0,
      eligible: false,
      name: input.name,
      emailed: false,
    };
  }

  const created = await addRegistration(input);

  if (created.status === "duplicate") {
    return {
      status: "error",
      message: `That email is already pre-registered. Email ${VENUE.email} if you need to change it.`,
      fields: { email: "This email is already on the list." },
      number: 0,
      eligible: false,
      name: input.name,
      emailed: false,
    };
  }

  try {
    const delivery = await sendRegistrationEmail(created.registration);
    refresh();

    const offer = created.registration.eligible
      ? "A free balaclava is yours when you book your first double session."
      : "The first 100 free balaclavas have already been claimed.";
    const deliveryNote =
      delivery === "sent"
        ? "We've emailed your registration to the track."
        : "Your place is saved here, but email is not configured yet, so the track has not been emailed.";

    return {
      status: "success",
      message: `You're number ${created.registration.number}. ${offer} ${deliveryNote}`,
      fields: {},
      number: created.registration.number,
      eligible: created.registration.eligible,
      name: input.name,
      emailed: delivery === "sent",
    };
  } catch (error) {
    console.error(
      "Pre-registration email failed",
      created.registration.number,
      error,
    );

    try {
      await deleteRegistration(input.email);
    } catch (rollbackError) {
      console.error("Pre-registration rollback failed", rollbackError);
    }

    return {
      status: "error",
      message: `We couldn't send your registration. Try again, or email ${VENUE.email}.`,
      fields: {},
      number: 0,
      eligible: false,
      name: input.name,
      emailed: false,
    };
  }
}
