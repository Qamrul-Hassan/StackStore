import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Deprecated endpoint. Use /api/auth/[...nextauth]." },
    { status: 410 }
  );
}
