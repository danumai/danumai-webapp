import nodemailer from "nodemailer";

// Gmail SMTP transport. GMAIL_USER is the full Gmail address and
// GMAIL_APP_PASSWORD is a 16-character App Password (requires 2FA enabled on
// the account): https://myaccount.google.com/apppasswords
export const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    // App Passwords are shown with spaces in the Google UI; strip them so the
    // value works whether or not the spaces were copied.
    pass: process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, ""),
  },
});

type SendMailArgs = {
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
};

// Sends a notification email from the configured Gmail account. Gmail ignores
// arbitrary "from" addresses and always sends as the authenticated user, so the
// display name is set here and the sender is GMAIL_USER.
export async function sendMail({ to, replyTo, subject, text }: SendMailArgs) {
  await mailer.sendMail({
    from: `Danumai Site <${process.env.GMAIL_USER}>`,
    to,
    replyTo,
    subject,
    text,
  });
}
