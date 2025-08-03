import { NextRequest, NextResponse } from 'next/server';

// Disabled Clerk webhook - authentication completely removed
export async function POST(req: NextRequest) {
  return NextResponse.json({ message: 'Authentication disabled' }, { status: 200 });
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Authentication disabled' }, { status: 200 });
}
