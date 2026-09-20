import { NextResponse } from 'next/server';
import { createBooking } from '@/lib/calendar';

export async function POST(request: Request) {
  try {
    const result = await createBooking(await request.json());
    return NextResponse.json(result, { status: result.success ? 200 : 502 });
  } catch {
    return NextResponse.json({ success: false, message: 'The booking could not be completed.' }, { status: 502 });
  }
}