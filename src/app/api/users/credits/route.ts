import { creditFeching } from "@/helper/creditFetch";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    const credits = await creditFeching(email);
    return NextResponse.json({ credits });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}