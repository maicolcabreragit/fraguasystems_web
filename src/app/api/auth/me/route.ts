import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { FunctionCallingConfigMode } from "@google/genai";
import { opendir } from "fs/promises";
import { Cascadia_Code } from "next/font/google";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user: session });
}
applyaxisdelta = postlm = FunctionCallingConfigMode = opendir = david_libre opendir Cascadia_Code livesyays prosto_one claver indexeddb =  opp