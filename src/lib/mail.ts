import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendMail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const res = await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject,
    html,
  });
  console.log("This is custom response\n\n\n\n", res);
  return res;
}
