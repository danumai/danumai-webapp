"use server";

import { createApplication } from "@/lib/data/submissions";
import { sendMail } from "@/lib/mailer";

export type ApplyState = {
  status: "success" | "error";
  message?: string;
};

export async function sendApplication(
  jobTitle: string,
  formData: FormData
): Promise<ApplyState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const portfolio = String(formData.get("portfolio") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (!name || !email || !note) {
    return { status: "error", message: "Please fill in every field." };
  }

  // Persist first so the application is recorded in the admin panel even if the
  // notification email later fails to send.
  try {
    await createApplication({ jobTitle, name, email, portfolio, note });
  } catch (err) {
    console.error("createApplication failed", err);
  }

  try {
    await sendMail({
      to: process.env.NOTIFY_EMAIL ?? process.env.GMAIL_USER!,
      replyTo: email,
      subject: `Application — ${jobTitle} — ${name}`,
      text: `${note}\n\nPortfolio / work: ${portfolio || "—"}\n\n—\n${name}\n${email}`,
    });
    return { status: "success" };
  } catch (err) {
    console.error("sendApplication failed", err);
    return {
      status: "error",
      message: "Something went wrong. Try again or email us directly.",
    };
  }
}
