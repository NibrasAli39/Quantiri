import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email")?.toLowerCase();
    if (!token || !email) {
      return NextResponse.json(
        { error: "Invalid verification link" },
        { status: 400 },
      );
    }

    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    const vt = await db.verificationToken.findFirst({
      where: { token: hashed, identifier: email },
    });

    if (!vt) {
      return NextResponse.json(
        { error: "Invalid or already used verification link" },
        { status: 400 },
      );
    }

    if (vt.expires < new Date()) {
      await db.verificationToken.deleteMany({ where: { identifier: email } });
      return NextResponse.json(
        { error: "Verification link expired" },
        { status: 400 },
      );
    }

    await db.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    await db.verificationToken.deleteMany({ where: { identifier: email } });

    return NextResponse.json({ success: true, message: "Email verified" });
  } catch (err) {
    console.error("[verify]", err);
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 },
    );
  }
}
