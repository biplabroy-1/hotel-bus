import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function GET(req: NextRequest) {
  // Check if UID is already present in cookies
  const existingUid = req.cookies.get("uid")?.value;

  if (existingUid) {
    return NextResponse.json({ uid: existingUid });
  }

  // If not present, generate new one
  const newUid = randomUUID();

  const res = NextResponse.json({ uid: newUid });
  // set uid in cookie (frontend accessible, not httpOnly)
  res.cookies.set("uid", newUid, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return res;
}
