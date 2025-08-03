// app/api/test-db/route.ts
import connectDB from "@/config/db";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  return NextResponse.json({ message: "MongoDB connected and working" });
}
