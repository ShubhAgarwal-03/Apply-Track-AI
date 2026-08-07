import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { createSession } from "@/lib/session";

function safeCompare(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!password || typeof password !== "string") {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  const expected = process.env.APP_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  if (!safeCompare(password, expected)) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  await createSession();
  return NextResponse.json({ success: true });
}