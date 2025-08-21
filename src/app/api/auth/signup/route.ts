import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { SignUpSchema } from "@/lib/validations";
import { createAndSendVerificationEmail } from "@/lib/verification";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = SignUpSchema.safeParse(json);
    if (!parsed.success) {
      const errors = parsed.error.flatten();
      return NextResponse.json({ errors }, { status: 400 });
    }

    const { name, email, password } = parsed.data;
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.user.create({ data: { name, email, hashedPassword } });

    await createAndSendVerificationEmail(email);

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
