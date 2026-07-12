"use server";

import { createContactMessage } from "@/lib/data/submissions";
import { sendMail } from "@/lib/mailer";

export type ContactState = {
  status: "success" | "error";
  message?: string;
};

export async function sendContactMessage(
  formData: FormData
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const topic = String(formData.get("topic") ?? "General").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { status: "error", message: "Please fill in every field." };
  }

  // Persist first so the message is recorded in the admin panel even if the
  // notification email later fails to send.
  try {
    await createContactMessage({ name, email, topic, message });
  } catch (err) {
    console.error("createContactMessage failed", err);
  }

  try {
    await sendMail({
      to: process.env.NOTIFY_EMAIL ?? process.env.GMAIL_USER!,
      replyTo: email,
      subject: `[${topic}] Message from ${name}`,
      text: `${message}\n\n—\n${name}\n${email}`,
    });
    return { status: "success" };
  } catch (err) {
    console.error("sendContactMessage failed", err);
    return {
      status: "error",
      message: "Something went wrong. Try again or email us directly.",
    };
  }
}
