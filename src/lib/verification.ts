import crypto from "crypto";
import { addMinutes } from "date-fns";
import { db } from "@/lib/db";
import { sendMail } from "./mail";

/**
 * Creates a short-lived, one-time verification token (hashed in DB)
 * and emails the raw token link to the user.
 */
export async function createAndSendVerificationEmail(email: string) {
  // ensure user exists
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return;

  // remove existing tokens for this email
  await db.verificationToken.deleteMany({ where: { identifier: email } });

  // raw token sent to user, hashed persisted in DB
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
  const expires = addMinutes(new Date(), 30);

  await db.verificationToken.create({
    data: {
      identifier: email,
      token: hashedToken,
      expires,
    },
  });

  const baseUrl = process.env.NEXTAUTH_URL;
  const verifyUrl = `${baseUrl}/auth/verify?token=${encodeURIComponent(
    rawToken,
  )}&email=${encodeURIComponent(email)}`;

  await sendMail({
    to: email,
    subject: "Verify your Quantiri account",
    html: `
      <div style="font-family:ui-sans-serif,system-ui">
        <h2 style="margin:0 0 12px">Welcome to Quantiri</h2>
        <p>Verify your email by clicking the link below:</p>
        <p><a href="${verifyUrl}">Verify Email</a></p>
        <p>This link expires in 30 minutes.</p>
      </div>
    `,
  });
}
